use near_sdk::{AccountId, PanicOnDefault, env, near};
use near_sdk::{Gas, NearToken, Promise, PromiseError, json_types::U128};
use std::collections::BTreeMap;

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct Lease {
    pub id: u32,
    pub property_id: String,
    pub owner: AccountId,
    pub buyer: AccountId,
    pub price_yocto: U128,
    pub duration_nights: u32,
    pub offer_expiry_night: u32,
    pub status: String,
    pub end_night: Option<u32>,
    pub escrow_yocto: U128,
    pub payout_pending: bool,
    pub settled: bool,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct Property {
    pub id: String,
    pub owner: AccountId,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct Ancestry {
    pub sire: AccountId,
    pub descendant: AccountId,
}

#[near(serializers = [borsh, json])]
#[derive(Clone, Debug)]
pub struct Grant {
    pub id: u32,
    pub property_id: String,
    pub scope: String,
    pub grantor: AccountId,
    pub grantee: AccountId,
    pub parent_grant_id: Option<u32>,
    pub can_delegate: bool,
    pub expiry_night: Option<u32>,
    pub revoked: bool,
}

#[near(serializers = [json])]
pub struct WorldView {
    pub passage_budget: Option<PassageBudget>,
    pub night: u32,
    pub properties: Vec<Property>,
    pub ancestry: Vec<Ancestry>,
    pub grants: Vec<Grant>,
    pub grant_validity: Vec<bool>,
    pub access: BTreeMap<String, bool>,
    pub next_nonce: u32,
    pub leases: Vec<Lease>,
}

#[near(serializers = [json])]
#[derive(Clone)]
pub struct PassageBudget {
    pub refund_pending: bool,
    pub seller: AccountId,
    pub remaining: U128,
    pub expiry_night: u32,
    pub lease_id: Option<u32>,
}

const PASSAGE_PRICE: u128 = 10_000_000_000_000_000_000_000;
fn budget_key(account: &AccountId) -> Vec<u8> {
    format!("passage-budget:v1:{}", account).into_bytes()
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct World {
    properties: Vec<Property>,
    ancestry: Vec<Ancestry>,
    grants: Vec<Grant>,
    night: u32,
    executor: AccountId,
    nonces: BTreeMap<AccountId, u32>,
    leases: Vec<Lease>,
}

#[near]
impl World {
    /// One exact, self-funded spending mandate. Separate storage preserves old World layout.
    #[payable]
    pub fn fund_passage(&mut self, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        assert_eq!(self.night, 0, "bootstrap funding only");
        assert_eq!(env::attached_deposit().as_yoctonear(), PASSAGE_PRICE, "exact budget required");
        assert!(!env::storage_has_key(&budget_key(&caller)), "budget already funded");
        let budget = PassageBudget { refund_pending: false, seller: self.property("passage").owner.clone(), remaining: U128(PASSAGE_PRICE), expiry_night: 5, lease_id: None };
        env::storage_write(&budget_key(&caller), &near_sdk::serde_json::to_vec(&budget).unwrap());
        self.consume(caller, nonce);
    }

    pub fn passage_budget(&self, account_id: AccountId) -> Option<PassageBudget> {
        env::storage_read(&budget_key(&account_id)).map(|bytes| near_sdk::serde_json::from_slice(&bytes).expect("invalid budget"))
    }

    /// Expired, unused allowances return only to their original funder.
    pub fn refund_passage_budget(&mut self, nonce: u32) -> Promise {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let mut budget = self.passage_budget(caller.clone()).expect("no funded budget");
        assert!(self.night >= budget.expiry_night, "budget not expired");
        assert!(budget.lease_id.is_none() && budget.remaining.0 == PASSAGE_PRICE, "no refundable budget");
        assert!(env::prepaid_gas().as_gas() >= Gas::from_tgas(30).as_gas(), "at least 30 Tgas required");
        budget.remaining = U128(0);
        budget.refund_pending = true;
        env::storage_write(&budget_key(&caller), &near_sdk::serde_json::to_vec(&budget).unwrap());
        self.consume(caller.clone(), nonce);
        Promise::new(caller.clone()).transfer(NearToken::from_yoctonear(PASSAGE_PRICE)).then(
            Self::ext(env::current_account_id()).with_static_gas(Gas::from_tgas(10)).passage_refunded(caller))
    }

    #[private]
    pub fn passage_refunded(&mut self, account_id: AccountId, #[callback_result] result: Result<(), PromiseError>) -> bool {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "private callback");
        let mut budget = self.passage_budget(account_id.clone()).expect("no funded budget");
        assert!(budget.refund_pending && self.night >= budget.expiry_night && budget.lease_id.is_none() && budget.remaining.0 == 0, "no pending refund");
        budget.refund_pending = false;
        if result.is_err() { budget.remaining = U128(PASSAGE_PRICE); }
        env::storage_write(&budget_key(&account_id), &near_sdk::serde_json::to_vec(&budget).unwrap());
        result.is_ok()
    }

    /// No attached deposit or arbitrary recipient: spends only the caller's exact mandate.
    pub fn accept_funded_passage(&mut self, lease_id: u32, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let mut budget = self.passage_budget(caller.clone()).expect("no funded budget");
        assert!(self.night < budget.expiry_night, "budget expired");
        assert!(budget.lease_id.is_none() && budget.remaining.0 == PASSAGE_PRICE, "budget exhausted");
        let lease = self.leases.get(lease_id as usize).expect("unknown lease");
        assert_eq!(lease.buyer, caller, "buyer required");
        assert_eq!(lease.owner, budget.seller, "budget recipient mismatch");
        assert_eq!(lease.property_id, "passage", "budget property mismatch");
        assert_eq!(self.property("passage").owner, budget.seller, "owner changed");
        assert_eq!(lease.price_yocto.0, PASSAGE_PRICE, "budget price mismatch");
        assert_eq!(lease.duration_nights, 3, "budget duration mismatch");
        assert_eq!(lease.offer_expiry_night, budget.expiry_night, "budget deadline mismatch");
        assert_eq!(lease.status, "offered", "offer not open");
        assert!(!self.leases.iter().any(|l| l.property_id == "passage" && self.lease_active(l)), "property already leased");
        let end = self.night.checked_add(3).expect("night overflow");
        let lease = &mut self.leases[lease_id as usize];
        lease.status = "accepted".into();
        lease.end_night = Some(end);
        lease.escrow_yocto = U128(PASSAGE_PRICE);
        budget.remaining = U128(0);
        budget.lease_id = Some(lease_id);
        env::storage_write(&budget_key(&caller), &near_sdk::serde_json::to_vec(&budget).unwrap());
        self.consume(caller.clone(), nonce);
        self.event("funded_passage", near_sdk::serde_json::json!({"buyer":caller,"lease_id":lease_id,"price":U128(PASSAGE_PRICE)}));
    }
    /// Fixed two-room bootstrap. Must be called by contract account, once.
    #[init]
    #[private]
    pub fn new(vesper: AccountId, player: AccountId, executor: AccountId) -> Self {
        assert_eq!(
            env::predecessor_account_id(),
            env::current_account_id(),
            "private initialization"
        );
        assert_ne!(vesper, player, "distinct characters required");
        Self {
            properties: vec![
                Property {
                    id: "crypt".into(),
                    owner: vesper.clone(),
                },
                Property {
                    id: "library".into(),
                    owner: player.clone(),
                },
            ],
            ancestry: vec![Ancestry {
                sire: vesper,
                descendant: player,
            }],
            grants: vec![],
            night: 0,
            executor,
            nonces: BTreeMap::new(),
            leases: vec![],
        }
    }

    /// Alternative one-time bootstrap; no property/admin mutations after init.
    #[init]
    #[private]
    pub fn new_economy(
        vesper: AccountId,
        player: AccountId,
        seraphine: AccountId,
        executor: AccountId,
    ) -> Self {
        assert!(
            seraphine != vesper && seraphine != player,
            "distinct owners required"
        );
        let mut world = Self::new(vesper, player, executor);
        world.properties.push(Property {
            id: "lounge".into(),
            owner: seraphine,
        });
        world
    }

    /// Disposable political campaign bootstrap; same runtime rights semantics.
    #[init]
    #[private]
    pub fn new_political(
        vesper: AccountId,
        player: AccountId,
        seraphine: AccountId,
        marius: AccountId,
        lucien: AccountId,
        executor: AccountId,
    ) -> Self {
        let identities = [&vesper, &player, &seraphine, &marius, &lucien, &executor];
        for (i, account) in identities.iter().enumerate() {
            assert!(
                !identities[..i].contains(account),
                "distinct actors required"
            );
        }
        let mut world = Self::new_economy(vesper, player, seraphine.clone(), executor);
        world.properties.extend([
            Property {
                id: "court".into(),
                owner: marius,
            },
            Property {
                id: "sanctuary".into(),
                owner: seraphine,
            },
            Property {
                id: "passage".into(),
                owner: lucien,
            },
        ]);
        world
    }

    pub fn offer_lease(
        &mut self,
        property_id: String,
        buyer: AccountId,
        price_yocto: U128,
        duration_nights: u32,
        offer_expiry_night: u32,
        nonce: u32,
    ) -> u32 {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        assert_eq!(self.property(&property_id).owner, caller, "owner required");
        assert_ne!(caller, buyer, "self lease");
        assert!(self.leases.len() < 64, "lease capacity reached");
        assert!(
            price_yocto.0 > 0 && price_yocto.0 <= NearToken::from_millinear(100).as_yoctonear(),
            "price outside bounds"
        );
        assert!(
            (1..=7).contains(&duration_nights),
            "duration outside bounds"
        );
        assert!(
            offer_expiry_night > self.night
                && offer_expiry_night <= self.night.checked_add(7).expect("night overflow"),
            "invalid offer expiry"
        );
        let id = self.leases.len() as u32;
        self.leases.push(Lease {
            id,
            property_id,
            owner: caller.clone(),
            buyer,
            price_yocto,
            duration_nights,
            offer_expiry_night,
            status: "offered".into(),
            end_night: None,
            escrow_yocto: U128(0),
            payout_pending: false,
            settled: false,
        });
        self.consume(caller, nonce);
        self.event(
            "offer_lease",
            near_sdk::serde_json::json!({"lease":self.leases[id as usize]}),
        );
        id
    }

    #[payable]
    pub fn accept_lease(&mut self, lease_id: u32, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let lease = self.leases.get(lease_id as usize).expect("unknown lease");
        assert_eq!(lease.buyer, caller, "buyer required");
        assert_eq!(lease.status, "offered", "offer not open");
        assert!(self.night < lease.offer_expiry_night, "offer expired");
        assert_eq!(
            self.property(&lease.property_id).owner,
            lease.owner,
            "owner changed"
        );
        assert!(
            !self
                .leases
                .iter()
                .any(|l| l.property_id == lease.property_id && self.lease_active(l)),
            "property already leased"
        );
        assert_eq!(
            env::attached_deposit().as_yoctonear(),
            lease.price_yocto.0,
            "exact rent required"
        );
        let end = self
            .night
            .checked_add(lease.duration_nights)
            .expect("night overflow");
        let lease = &mut self.leases[lease_id as usize];
        lease.status = "accepted".into();
        lease.end_night = Some(end);
        lease.escrow_yocto = lease.price_yocto;
        self.consume(caller.clone(), nonce);
        self.event(
            "accept_lease",
            near_sdk::serde_json::json!({"lease_id":lease_id,"actor":caller,"end_night":end}),
        );
    }

    /// Only unaccepted offers can be cancelled; acquired rights cannot be revoked.
    pub fn cancel_lease(&mut self, lease_id: u32, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let lease = self
            .leases
            .get_mut(lease_id as usize)
            .expect("unknown lease");
        assert_eq!(lease.owner, caller, "owner required");
        assert_eq!(lease.status, "offered", "offer not open");
        lease.status = "cancelled".into();
        self.consume(caller, nonce);
        self.event(
            "cancel_lease",
            near_sdk::serde_json::json!({"lease_id":lease_id}),
        );
    }

    pub fn reject_lease(&mut self, lease_id: u32, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let lease = self
            .leases
            .get_mut(lease_id as usize)
            .expect("unknown lease");
        assert_eq!(lease.buyer, caller, "buyer required");
        assert_eq!(lease.status, "offered", "offer not open");
        lease.status = "rejected".into();
        self.consume(caller, nonce);
        self.event(
            "reject_lease",
            near_sdk::serde_json::json!({"lease_id":lease_id}),
        );
    }

    /// Prepaid rent vests at acceptance. Only the lessor can claim it, once.
    pub fn claim_rent(&mut self, lease_id: u32, nonce: u32) -> Promise {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let lease = self
            .leases
            .get_mut(lease_id as usize)
            .expect("unknown lease");
        assert_eq!(lease.owner, caller, "owner required");
        assert_eq!(lease.status, "accepted", "lease not accepted");
        assert!(
            !lease.settled && !lease.payout_pending,
            "rent already claimed or pending"
        );
        let amount = lease.escrow_yocto.0;
        assert!(amount > 0, "no rent");
        assert!(
            env::prepaid_gas().as_gas() >= Gas::from_tgas(30).as_gas(),
            "at least 30 Tgas required"
        );
        lease.payout_pending = true;
        self.consume(caller.clone(), nonce);
        Promise::new(caller)
            .transfer(NearToken::from_yoctonear(amount))
            .then(
                Self::ext(env::current_account_id())
                    .with_static_gas(Gas::from_tgas(10))
                    .rent_paid(lease_id),
            )
    }

    #[private]
    pub fn rent_paid(
        &mut self,
        lease_id: u32,
        #[callback_result] result: Result<(), PromiseError>,
    ) -> bool {
        assert_eq!(
            env::predecessor_account_id(),
            env::current_account_id(),
            "private callback"
        );
        let lease = self
            .leases
            .get_mut(lease_id as usize)
            .expect("unknown lease");
        assert!(lease.payout_pending, "no pending payout");
        lease.payout_pending = false;
        if result.is_ok() {
            lease.settled = true;
            lease.escrow_yocto = U128(0);
        }
        self.event(
            "rent_paid",
            near_sdk::serde_json::json!({"lease_id":lease_id,"success":result.is_ok()}),
        );
        result.is_ok()
    }

    pub fn grant_access(
        &mut self,
        property_id: String,
        scope: String,
        grantee: AccountId,
        parent_grant_id: Option<u32>,
        can_delegate: bool,
        expiry_night: Option<u32>,
        nonce: u32,
    ) -> u32 {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        assert!(self.grants.len() < 256, "grant capacity reached");
        assert_eq!(scope, "enter", "unsupported scope");
        assert_ne!(caller, grantee, "self grant");
        assert!(expiry_night.is_none_or(|n| n > self.night), "expired grant");
        let property = self.property(&property_id);
        if let Some(id) = parent_grant_id {
            let parent = self.grants.get(id as usize).expect("unknown parent");
            assert_eq!(parent.grantee, caller, "wrong parent holder");
            assert!(
                parent.can_delegate && self.valid(id),
                "parent not delegable or invalid"
            );
            assert_eq!(parent.property_id, property_id, "scope expansion");
            assert_eq!(parent.scope, scope, "scope expansion");
            if let Some(end) = parent.expiry_night {
                assert!(expiry_night.is_some_and(|n| n <= end), "expiry expansion");
            }
            let mut cursor = Some(id);
            let mut depth = 1;
            while let Some(i) = cursor {
                let ancestor = &self.grants[i as usize];
                assert_ne!(ancestor.grantor, grantee, "authority cycle");
                assert_ne!(ancestor.grantee, grantee, "authority cycle");
                depth += 1;
                assert!(depth <= 4, "depth exceeded");
                cursor = ancestor.parent_grant_id;
            }
        } else {
            assert_eq!(property.owner, caller, "owner required");
        }
        assert_ne!(property.owner, grantee, "owner already authorized");
        let id = self.grants.len() as u32;
        self.grants.push(Grant {
            id,
            property_id,
            scope,
            grantor: caller.clone(),
            grantee,
            parent_grant_id,
            can_delegate,
            expiry_night,
            revoked: false,
        });
        self.consume(caller, nonce);
        self.event(
            "grant",
            near_sdk::serde_json::json!({"grant": self.grants[id as usize]}),
        );
        id
    }

    pub fn revoke_grant(&mut self, grant_id: u32, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        let grant = self
            .grants
            .get_mut(grant_id as usize)
            .expect("unknown grant");
        assert_eq!(grant.grantor, caller, "grantor required");
        assert!(!grant.revoked, "already revoked");
        grant.revoked = true;
        self.consume(caller.clone(), nonce);
        self.event(
            "revoke",
            near_sdk::serde_json::json!({"grant_id": grant_id, "actor": caller}),
        );
    }

    pub fn enter_room(&mut self, property_id: String, nonce: u32) {
        let caller = env::predecessor_account_id();
        self.check_nonce(&caller, nonce);
        assert!(
            self.has_access(caller.clone(), property_id.clone()),
            "access denied"
        );
        self.consume(caller.clone(), nonce);
        self.event(
            "enter",
            near_sdk::serde_json::json!({"property_id": property_id, "actor": caller}),
        );
    }

    pub fn advance_night(&mut self, expected_night: u32) {
        assert_eq!(
            env::predecessor_account_id(),
            self.executor,
            "executor required"
        );
        assert_eq!(expected_night, self.night, "stale night");
        self.night = self.night.checked_add(1).expect("night overflow");
    }

    pub fn has_access(&self, account_id: AccountId, property_id: String) -> bool {
        self.leases
            .iter()
            .any(|l| l.property_id == property_id && l.buyer == account_id && self.lease_active(l))
            || self
                .properties
                .iter()
                .any(|p| p.id == property_id && p.owner == account_id)
            || self.grants.iter().any(|g| {
                g.property_id == property_id && g.grantee == account_id && self.valid(g.id)
            })
    }

    pub fn get_world(&self, account_id: AccountId) -> WorldView {
        WorldView {
            passage_budget: self.passage_budget(account_id.clone()),
            night: self.night,
            properties: self.properties.clone(),
            ancestry: self.ancestry.clone(),
            grants: self.grants.clone(),
            grant_validity: (0..self.grants.len())
                .map(|id| self.valid(id as u32))
                .collect(),
            next_nonce: *self.nonces.get(&account_id).unwrap_or(&0),
            leases: self.leases.clone(),
            access: self
                .properties
                .iter()
                .map(|p| {
                    (
                        p.id.clone(),
                        self.has_access(account_id.clone(), p.id.clone()),
                    )
                })
                .collect(),
        }
    }
}

impl World {
    fn lease_active(&self, lease: &Lease) -> bool {
        lease.status == "accepted" && lease.end_night.is_some_and(|end| self.night < end)
    }
    fn property(&self, id: &str) -> &Property {
        self.properties
            .iter()
            .find(|p| p.id == id)
            .expect("unknown property")
    }
    fn check_nonce(&self, caller: &AccountId, nonce: u32) {
        assert_eq!(nonce, *self.nonces.get(caller).unwrap_or(&0), "stale nonce");
        assert!(nonce < u32::MAX, "nonce exhausted");
    }
    fn consume(&mut self, caller: AccountId, nonce: u32) {
        self.nonces.insert(caller, nonce + 1);
    }
    fn valid(&self, id: u32) -> bool {
        let mut cursor = Some(id);
        for _ in 0..4 {
            let Some(i) = cursor else {
                return true;
            };
            let Some(g) = self.grants.get(i as usize) else {
                return false;
            };
            if g.revoked || g.expiry_night.is_some_and(|n| n <= self.night) {
                return false;
            }
            if g.parent_grant_id.is_none() {
                return self.property(&g.property_id).owner == g.grantor;
            }
            cursor = g.parent_grant_id;
        }
        false
    }
    fn event(&self, event: &str, data: near_sdk::serde_json::Value) {
        env::log_str(&format!(
            "EVENT_JSON:{}",
            near_sdk::serde_json::json!({"standard":"we_inherit_night", "version":"1.0.0", "event":event, "data":[data]})
        ));
    }
}

#[cfg(test)]
mod tests;
