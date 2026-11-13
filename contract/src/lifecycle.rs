use super::*;

#[near(serializers=[borsh, json])]
#[derive(Clone)]
pub(super) struct CampaignMeta {
    pub status: String,
    pub player: AccountId,
    pub prepaid: bool,
    pub treasury: u128,
    pub commitment: String,
}
impl CampaignMeta {
    pub fn new(player: AccountId) -> Self {
        Self {
            status: "active".into(),
            player,
            prepaid: false,
            treasury: 0,
            commitment: String::new(),
        }
    }
}
#[near(serializers=[borsh, json])]
#[derive(Clone)]
pub struct Provisioning {
    pub creator: AccountId,
    // Fixed role order: vesper, player, keeper, seraphine, marius, lucien,
    // mirelle, dorian, cassian, sabine. No browser-selected actors.
    pub actors: Vec<AccountId>,
    pub max_active: u32,
    pub interval_blocks: u64,
    pub treasury: U128,
}

#[near]
impl Authority {
    /// Admission policy only: never modifies existing worlds or financial backing.
    #[private]
    pub fn set_campaign_capacity(&mut self, max_active: u32) {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "operator required");
        assert!(max_active > 0, "positive capacity required");
        self.policy.as_mut().expect("provisioning disabled").max_active = max_active;
    }

    pub fn campaign_capacity(&self) -> Option<u32> {
        self.policy.as_ref().map(|p| p.max_active)
    }

    #[private]
    pub fn configure_provisioning(&mut self, policy: Provisioning) {
        assert_eq!(
            env::predecessor_account_id(),
            env::current_account_id(),
            "private configuration"
        );
        assert!(self.policy.is_none(), "configuration immutable");
        assert_eq!(policy.actors.len(), 10, "ten roles required");
        let unique: std::collections::BTreeSet<_> = policy.actors.iter().collect();
        assert_eq!(unique.len(), 10, "distinct roles required");
        assert!(
            !policy.actors.contains(&env::current_account_id()),
            "no contract actor"
        );
        assert!(
            policy.creator != env::current_account_id() && !policy.actors.contains(&policy.creator),
            "separate provisioner required"
        );
        assert!(
            policy.max_active > 0 && policy.max_active <= 100 && policy.interval_blocks >= 10,
            "bounded creation required"
        );
        assert!(
            policy.treasury.0 <= NearToken::from_near(1).as_yoctonear(),
            "treasury cap"
        );
        self.policy = Some(policy);
        self.assert_backed();
    }
    #[payable]
    #[private]
    pub fn fund_pool(&mut self) {
        assert_eq!(
            env::predecessor_account_id(),
            env::current_account_id(),
            "operator required"
        );
        self.pool = self
            .pool
            .checked_add(env::attached_deposit().as_yoctonear())
            .expect("pool overflow");
        self.assert_backed();
    }
    pub fn open_campaign(&mut self, campaign_id: String) {
        let p = self.policy.clone().expect("provisioning disabled");
        assert_eq!(
            env::predecessor_account_id(),
            p.creator,
            "provisioner required"
        );
        assert!(self.active < p.max_active, "active capacity reached");
        assert!(
            env::block_height() >= self.last_creation.checked_add(p.interval_blocks).unwrap(),
            "creation rate limit"
        );
        let cost = p.treasury.0.checked_add(PASSAGE_PRICE).unwrap();
        assert!(self.pool >= cost, "pool depleted");
        let a = &p.actors;
        self.create_campaign(
            campaign_id.clone(),
            "political".into(),
            a.clone(),
            a[0].clone(),
            a[1].clone(),
            a[2].clone(),
            Some(a[3].clone()),
            Some(a[4].clone()),
            Some(a[5].clone()),
        );
        let mut w = self.load(&campaign_id);
        for (property, owner, grantee, delegate, expiry) in [
            ("crypt", 0, 1, true, None),
            ("library", 1, 6, false, Some(3)),
            ("court", 4, 9, true, None),
            ("lounge", 3, 1, false, None),
        ] {
            w.grants.push(Grant {
                id: w.grants.len() as u32,
                property_id: property.into(),
                scope: "enter".into(),
                grantor: a[owner].clone(),
                grantee: a[grantee].clone(),
                parent_grant_id: None,
                can_delegate: delegate,
                expiry_night: expiry,
                revoked: false,
            });
        }
        for (property, duration, expiry) in [("lounge", 3, 2), ("sanctuary", 7, 3)] {
            w.leases.push(Lease {
                id: w.leases.len() as u32,
                property_id: property.into(),
                owner: a[3].clone(),
                buyer: a[1].clone(),
                price_yocto: U128(PASSAGE_PRICE * 2),
                duration_nights: duration,
                offer_expiry_night: expiry,
                status: "offered".into(),
                end_night: None,
                escrow_yocto: U128(0),
                payout_pending: false,
                settled: false,
            });
        }
        for (i, n) in [(0, 1), (1, 1), (3, 3), (4, 1), (8, 1)] {
            w.nonces.insert(a[i].clone(), n);
        }
        w.budgets.insert(
            a[8].clone(),
            PassageBudget {
                seller: a[5].clone(),
                remaining: U128(PASSAGE_PRICE),
                expiry_night: 5,
                lease_id: None,
                refund_pending: false,
            },
        );
        self.pool -= cost;
        self.treasury_total += p.treasury.0;
        self.liabilities += PASSAGE_PRICE;
        let mut m = self.meta(&campaign_id);
        m.prepaid = true;
        m.treasury = p.treasury.0;
        self.write_meta(&campaign_id, &m);
        self.save(&w);
        self.last_creation = env::block_height();
        self.assert_backed();
    }
    #[payable]
    #[private]
    pub fn fund_treasury(&mut self, campaign_id: String) {
        assert_eq!(
            env::predecessor_account_id(),
            env::current_account_id(),
            "operator required"
        );
        let mut m = self.meta(&campaign_id);
        assert_eq!(m.status, "active", "campaign closed");
        let amount = env::attached_deposit().as_yoctonear();
        m.treasury = m.treasury.checked_add(amount).unwrap();
        self.treasury_total = self.treasury_total.checked_add(amount).unwrap();
        m.prepaid = true;
        self.write_meta(&campaign_id, &m);
        self.assert_backed();
    }
    pub fn campaign_resources(&self, campaign_id: String) -> near_sdk::serde_json::Value {
        let m = self.meta(&campaign_id);
        let bytes = env::storage_read(&Self::key(&campaign_id))
            .map(|v| v.len())
            .unwrap_or(0);
        near_sdk::serde_json::json!({"status":m.status,"prepaid":m.prepaid,"treasury":m.treasury.to_string(),"commitment":m.commitment,"world_bytes":bytes,"storage_usage":env::storage_usage(),"storage_price":env::storage_byte_cost().as_yoctonear().to_string(),"pool":self.pool.to_string(),"liabilities":self.liabilities.to_string(),"treasury_total":self.treasury_total.to_string(),"active":self.active})
    }
    pub fn complete_campaign(&mut self, campaign_id: String, commitment: String) {
        let w = self.load(&campaign_id);
        assert_eq!(
            env::predecessor_account_id(),
            w.executor,
            "executor required"
        );
        assert!(w.night >= 7, "seven nights required");
        assert_eq!(w.liabilities(), 0, "unsettled financial obligations");
        assert!(
            !w.leases.iter().any(|l| l.payout_pending)
                && !w.budgets.values().any(|b| b.refund_pending),
            "pending callback"
        );
        assert!(
            commitment.len() == 64 && commitment.bytes().all(|c| c.is_ascii_hexdigit()),
            "SHA256 commitment required"
        );
        let mut m = self.meta(&campaign_id);
        assert_eq!(m.status, "active", "not active");
        // Unspent operator allocation returns to the operator pool, never player income.
        self.treasury_total -= m.treasury;
        self.pool += m.treasury;
        m.treasury = 0;
        m.status = "completed".into();
        m.commitment = commitment;
        self.write_meta(&campaign_id, &m);
        self.assert_backed();
    }
    pub fn settlement_dawn(&mut self, campaign_id: String, expected_night: u32) {
        let m = self.meta(&campaign_id);
        assert_eq!(m.status, "completed", "completion required");
        let mut w = self.load(&campaign_id);
        let end = w
            .leases
            .iter()
            .filter_map(|l| {
                if l.status == "accepted" {
                    l.end_night
                } else {
                    None
                }
            })
            .max()
            .unwrap_or(7);
        assert!(w.night < end, "no outstanding lease term");
        w.advance_night(expected_night);
        self.save(&w);
        self.assert_backed();
    }
    pub fn archive_campaign(&mut self, campaign_id: String, commitment: String) {
        let w = self.load(&campaign_id);
        assert_eq!(
            env::predecessor_account_id(),
            w.executor,
            "executor required"
        );
        let mut m = self.meta(&campaign_id);
        assert_eq!(m.status, "completed", "completion required");
        assert_eq!(m.commitment, commitment, "archive commitment mismatch");
        assert_eq!(w.liabilities(), 0, "unsettled obligations");
        assert!(
            !w.leases
                .iter()
                .any(|l| w.lease_active(l) || l.payout_pending),
            "unexpired lease or callback"
        );
        m.status = "archived".into();
        self.write_meta(&campaign_id, &m);
        self.assert_backed();
    }
    pub fn reclaim_campaign(&mut self, campaign_id: String, commitment: String) {
        let w = self.load(&campaign_id);
        assert_eq!(
            env::predecessor_account_id(),
            w.executor,
            "executor required"
        );
        let mut m = self.meta(&campaign_id);
        assert_eq!(m.status, "archived", "archive required");
        assert_eq!(m.commitment, commitment, "commitment mismatch");
        assert_eq!(w.liabilities(), 0, "unsettled obligations");
        assert!(
            !w.leases
                .iter()
                .any(|l| w.lease_active(l) || l.payout_pending)
                && !w.budgets.values().any(|b| b.refund_pending),
            "pending rights or callback"
        );
        env::storage_remove(&Self::key(&campaign_id));
        m.status = "reclaimed".into();
        self.write_meta(&campaign_id, &m);
        self.active -= 1;
        self.assert_backed();
    }
}
impl Authority {
    pub(super) fn meta_key(id: &str) -> Vec<u8> {
        [b"lifecycle:v2:".as_slice(), Self::key(id).as_slice()].concat()
    }
    pub(super) fn meta(&self, id: &str) -> CampaignMeta {
        near_sdk::borsh::from_slice(
            &env::storage_read(&Self::meta_key(id)).expect("unknown campaign lifecycle"),
        )
        .unwrap()
    }
    pub(super) fn write_meta(&self, id: &str, m: &CampaignMeta) {
        env::storage_write(&Self::meta_key(id), &near_sdk::borsh::to_vec(m).unwrap());
    }
    pub(super) fn assert_backed(&self) {
        self.assert_backed_extra(0)
    }
    pub(super) fn assert_backed_extra(&self, extra: u64) {
        // Root STATE is written after this call. Include its serialized size plus
        // trie record overhead, rather than reserving maximum campaign capacity.
        let bytes = extra
            + env::storage_usage()
            + near_sdk::borsh::to_vec(self).unwrap().len() as u64
            + 128;
        assert!(bytes <= TOTAL_STORAGE_BYTES, "total storage quota");
        let needed = (bytes as u128)
            .checked_mul(env::storage_byte_cost().as_yoctonear())
            .unwrap()
            .checked_add(self.liabilities)
            .unwrap()
            .checked_add(self.treasury_total)
            .unwrap()
            .checked_add(self.pool)
            .unwrap();
        assert!(
            env::account_balance().as_yoctonear() >= needed,
            "insufficient unencumbered storage funding"
        );
    }
}
