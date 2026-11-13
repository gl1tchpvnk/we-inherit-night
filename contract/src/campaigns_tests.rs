use super::*;
use near_sdk::{test_utils::VMContextBuilder, testing_env};
fn id(s: &str) -> AccountId {
    s.parse().unwrap()
}
fn context(actor: &str, deposit: u128) {
    testing_env!(
        VMContextBuilder::new()
            .current_account_id(id("castle.near"))
            .predecessor_account_id(id(actor))
            .signer_account_id(id("untrusted.near"))
            .account_balance(NearToken::from_near(1000))
            .attached_deposit(NearToken::from_yoctonear(deposit))
            .prepaid_gas(Gas::from_tgas(300))
            .build()
    );
}
fn reject(f: impl FnOnce()) {
    assert!(std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)).is_err());
}
fn create(c: &mut Authority, name: &str, player: &str, keeper: &str) {
    c.create_campaign(
        name.into(),
        "political".into(),
        [
            "vesper.near",
            player,
            keeper,
            "seraphine.near",
            "marius.near",
            "lucien.near",
            "cassian.near",
        ]
        .into_iter()
        .map(id)
        .collect(),
        id("vesper.near"),
        id(player),
        id(keeper),
        Some(id("seraphine.near")),
        Some(id("marius.near")),
        Some(id("lucien.near")),
    );
}
fn setup() -> Authority {
    context("castle.near", 0);
    let mut c = Authority::new_registry();
    context("castle.near", 0);
    create(&mut c, "a", "player.near", "keeper.near");
    create(&mut c, "b", "other.near", "other-keeper.near");
    c
}
fn grant(c: &mut Authority, campaign: &str) {
    context("vesper.near", 0);
    c.grant_access(
        campaign.into(),
        "crypt".into(),
        "enter".into(),
        id("player.near"),
        None,
        true,
        Some(1),
        0,
    );
}
#[test]
fn creation_is_private_unique_validated_and_storage_backed() {
    let mut c = setup();
    context("castle.near", 0);
    reject(|| create(&mut c, "a", "player.near", "keeper.near"));
    reject(|| create(&mut c, "bad:id", "player.near", "keeper.near"));
    context("stranger.near", 0);
    reject(|| create(&mut c, "c", "player.near", "keeper.near"));
    context("castle.near", 0);
    create(&mut c, "c", "player.near", "keeper.near");
    assert_eq!(c.get_world("a".into(), id("player.near")).night, 0);
    assert!(near_sdk::borsh::to_vec(&c.load("a")).unwrap().len() < 10_000);
}
#[test]
fn shared_actor_rights_nonces_and_independent_inheritance_are_campaign_scoped() {
    let mut c = setup();
    grant(&mut c, "a");
    grant(&mut c, "b");
    context("player.near", 0);
    c.enter_room("a".into(), "crypt".into(), 0);
    assert_eq!(c.get_world("b".into(), id("player.near")).next_nonce, 0);
    reject(|| c.enter_room("a".into(), "crypt".into(), 0));
    c.enter_room("b".into(), "crypt".into(), 0);
    context("vesper.near", 0);
    c.revoke_grant("a".into(), 0, 1);
    assert!(!c.has_access("a".into(), id("player.near"), "crypt".into()));
    assert!(c.has_access("b".into(), id("player.near"), "crypt".into()));
    assert!(c.has_access("a".into(), id("player.near"), "library".into()));
    assert!(!c.has_access("b".into(), id("player.near"), "library".into()));
    context("player.near", 0);
    reject(|| c.enter_room("b".into(), "library".into(), 1));
}
#[test]
fn executor_and_expiry_do_not_cross_campaigns() {
    let mut c = setup();
    grant(&mut c, "a");
    grant(&mut c, "b");
    context("keeper.near", 0);
    reject(|| c.advance_night("b".into(), 0));
    c.advance_night("a".into(), 0);
    assert!(!c.has_access("a".into(), id("player.near"), "crypt".into()));
    assert!(c.has_access("b".into(), id("player.near"), "crypt".into()));
    assert_eq!(c.get_world("b".into(), id("player.near")).night, 0);
}
#[test]
fn escrow_and_private_callbacks_resolve_only_the_named_campaign() {
    let mut c = setup();
    for campaign in ["a", "b"] {
        context("seraphine.near", 0);
        c.offer_lease(
            campaign.into(),
            "sanctuary".into(),
            id("player.near"),
            U128(PASSAGE_PRICE),
            3,
            2,
            0,
        );
    }
    context("player.near", PASSAGE_PRICE);
    c.accept_lease("a".into(), 0, 0);
    context("player.near", 0);
    c.reject_lease("b".into(), 0, 0);
    context("seraphine.near", 0);
    let _ = c.claim_rent("a".into(), 0, 1);
    context("stranger.near", 0);
    reject(|| {
        c.rent_paid("a".into(), 0, Ok(()));
    });
    context("castle.near", 0);
    reject(|| {
        c.rent_paid("b".into(), 0, Ok(()));
    });
    assert!(!c.rent_paid("a".into(), 0, Err(PromiseError::Failed)));
    assert_eq!(c.liabilities, PASSAGE_PRICE);
    context("seraphine.near", 0);
    let _ = c.claim_rent("a".into(), 0, 2);
    context("castle.near", 0);
    assert!(c.rent_paid("a".into(), 0, Ok(())));
    assert_eq!(c.liabilities, 0);
    assert_eq!(
        c.get_world("b".into(), id("player.near")).leases[0].status,
        "rejected"
    );
}
#[test]
fn passage_budgets_refunds_and_failed_callbacks_are_isolated() {
    let mut c = setup();
    for campaign in ["a", "b"] {
        context("cassian.near", PASSAGE_PRICE);
        c.fund_passage(campaign.into(), 0);
    }
    assert_eq!(c.liabilities, PASSAGE_PRICE * 2);
    for n in 0..5 {
        context("keeper.near", 0);
        c.advance_night("a".into(), n);
    }
    context("cassian.near", 0);
    let _ = c.refund_passage_budget("a".into(), 1);
    reject(|| {
        let _ = c.refund_passage_budget("b".into(), 1);
    });
    context("castle.near", 0);
    reject(|| {
        c.passage_refunded("b".into(), id("cassian.near"), Ok(()));
    });
    assert!(!c.passage_refunded("a".into(), id("cassian.near"), Err(PromiseError::Failed)));
    assert_eq!(
        c.passage_budget("a".into(), id("cassian.near"))
            .unwrap()
            .remaining
            .0,
        PASSAGE_PRICE
    );
    context("cassian.near", 0);
    let _ = c.refund_passage_budget("a".into(), 2);
    context("castle.near", 0);
    assert!(c.passage_refunded("a".into(), id("cassian.near"), Ok(())));
    assert_eq!(c.liabilities, PASSAGE_PRICE);
    assert_eq!(
        c.passage_budget("b".into(), id("cassian.near"))
            .unwrap()
            .remaining
            .0,
        PASSAGE_PRICE
    );
}

#[test]
fn outsider_cannot_fund_a_world_and_escrow_cannot_back_new_storage() {
    let mut c = setup();
    context("outsider.near", PASSAGE_PRICE);
    reject(|| c.fund_passage("a".into(), 0));
    assert!(c.passage_budget("a".into(), id("outsider.near")).is_none());
    context("cassian.near", PASSAGE_PRICE);
    c.fund_passage("a".into(), 0);
    let balance = 0;
    testing_env!(
        VMContextBuilder::new()
            .current_account_id(id("castle.near"))
            .predecessor_account_id(id("castle.near"))
            .account_balance(NearToken::from_yoctonear(balance - 0))
            .attached_deposit(NearToken::from_yoctonear(0))
            .build()
    );
    reject(|| create(&mut c, "c", "player.near", "keeper.near"));
    assert_eq!(c.active, 2);
    assert_eq!(c.liabilities, PASSAGE_PRICE);
    // VM rollback on insufficient backing is asserted by the Sandbox integration.
}

#[test]
fn prepaid_is_exact_isolated_and_replay_safe() {
    let mut c = setup();
    context("castle.near", PASSAGE_PRICE * 4);
    c.fund_treasury("a".into());
    context("seraphine.near", 0);
    c.offer_lease(
        "a".into(),
        "sanctuary".into(),
        id("player.near"),
        U128(PASSAGE_PRICE * 2),
        7,
        3,
        0,
    );
    context("other.near", 0);
    reject(|| c.accept_lease("a".into(), 0, 0));
    assert_eq!(c.meta("a").treasury, PASSAGE_PRICE * 4);
    context("player.near", 0);
    c.accept_lease("a".into(), 0, 0);
    assert_eq!(c.meta("a").treasury, PASSAGE_PRICE * 2);
    assert_eq!(c.liabilities, PASSAGE_PRICE * 2);
    reject(|| c.accept_lease("a".into(), 0, 0));
    assert_eq!(c.meta("a").treasury, PASSAGE_PRICE * 2);
    assert_eq!(c.meta("b").treasury, 0);
    assert!(c.get_world("b".into(), id("other.near")).leases.is_empty());
}
#[test]
fn lifecycle_requires_settlement_preserves_commitment_and_rejects_reuse() {
    let mut c = setup();
    let hash = "a".repeat(64);
    context("keeper.near", 0);
    reject(|| c.complete_campaign("a".into(), hash.clone()));
    for n in 0..7 {
        c.advance_night("a".into(), n);
    }
    context("outsider.near", 0);
    reject(|| c.complete_campaign("a".into(), hash.clone()));
    context("keeper.near", 0);
    c.complete_campaign("a".into(), hash.clone());
    reject(|| c.reclaim_campaign("a".into(), hash.clone()));
    c.archive_campaign("a".into(), hash.clone());
    c.reclaim_campaign("a".into(), hash.clone());
    assert_eq!(c.meta("a").status, "reclaimed");
    assert_eq!(c.meta("a").commitment, hash);
    context("castle.near", 0);
    reject(|| create(&mut c, "a", "player.near", "keeper.near"));
    reject(|| {
        c.rent_paid("a".into(), 0, Ok(()));
    });
    context("vesper.near", 0);
    reject(|| c.revoke_grant("a".into(), 0, 0));
    assert_eq!(c.get_world("b".into(), id("other.near")).night, 0);
}
#[test]
fn unexpired_paid_rights_block_archival_and_failed_settlement_blocks_completion() {
    let mut c = setup();
    let hash = "b".repeat(64);
    context("keeper.near", 0);
    c.advance_night("a".into(), 0);
    context("seraphine.near", 0);
    c.offer_lease(
        "a".into(),
        "sanctuary".into(),
        id("player.near"),
        U128(PASSAGE_PRICE),
        7,
        3,
        0,
    );
    context("player.near", PASSAGE_PRICE);
    c.accept_lease("a".into(), 0, 0);
    context("keeper.near", 0);
    for n in 1..7 {
        c.advance_night("a".into(), n);
    }
    reject(|| c.complete_campaign("a".into(), hash.clone()));
    context("seraphine.near", 0);
    let _ = c.claim_rent("a".into(), 0, 1);
    context("keeper.near", 0);
    reject(|| c.complete_campaign("a".into(), hash.clone()));
    context("castle.near", 0);
    assert!(!c.rent_paid("a".into(), 0, Err(PromiseError::Failed)));
    context("keeper.near", 0);
    reject(|| c.complete_campaign("a".into(), hash.clone()));
    context("seraphine.near", 0);
    let _ = c.claim_rent("a".into(), 0, 2);
    context("castle.near", 0);
    assert!(c.rent_paid("a".into(), 0, Ok(())));
    context("keeper.near", 0);
    c.complete_campaign("a".into(), hash.clone());
    reject(|| c.archive_campaign("a".into(), hash.clone()));
    c.settlement_dawn("a".into(), 7);
    c.archive_campaign("a".into(), hash.clone());
    c.reclaim_campaign("a".into(), hash);
}

#[test]
fn restricted_provisioning_is_funded_rate_limited_and_capacity_bounded() {
    let mut c=setup();
    context("castle.near",0);
    c.configure_provisioning(Provisioning {
        creator:id("creator.near"),
        actors:["vesper.near","player.near","keeper.near","seraphine.near","marius.near","lucien.near","mirelle.near","dorian.near","cassian.near","sabine.near"].into_iter().map(id).collect(),
        max_active:4,interval_blocks:10,treasury:U128(PASSAGE_PRICE*4)
    });
    context("stranger.near",0);reject(||c.open_campaign("c".into()));
    context("creator.near",0);reject(||c.open_campaign("c".into()));
    context("castle.near",PASSAGE_PRICE*10);c.fund_pool();
    let creator_context=|height|testing_env!(VMContextBuilder::new().current_account_id(id("castle.near")).predecessor_account_id(id("creator.near")).account_balance(NearToken::from_near(1000)).prepaid_gas(Gas::from_tgas(300)).block_height(height).build());
    creator_context(100);c.open_campaign("c".into());
    assert_eq!(c.meta("c").treasury,PASSAGE_PRICE*4);
    assert_eq!(c.load("c").grants.len(),4);assert_eq!(c.load("c").leases.len(),2);
    reject(||c.open_campaign("d".into()));
    creator_context(110);c.open_campaign("d".into());
    creator_context(120);reject(||c.open_campaign("e".into()));
    assert_eq!(c.pool,0);assert_eq!(c.active,4);
    context("player.near",0);c.accept_lease("c".into(),1,1);
    assert_eq!(c.meta("d").treasury,PASSAGE_PRICE*4);
}

#[test]
fn operator_capacity_preserves_layout_worlds_and_finances() {
    let mut c = setup();
    context("castle.near", 0);
    c.configure_provisioning(Provisioning {
        creator: id("creator.near"),
        actors: ["vesper.near","player.near","keeper.near","seraphine.near","marius.near","lucien.near","mirelle.near","dorian.near","cassian.near","sabine.near"].into_iter().map(id).collect(),
        max_active: 4, interval_blocks: 10, treasury: U128(PASSAGE_PRICE*4),
    });
    let original = near_sdk::borsh::to_vec(&c).unwrap();
    let world = env::storage_read(&Authority::key("a")).unwrap();
    let financials = (c.pool,c.liabilities,c.treasury_total,c.active,c.last_creation);
    for actor in ["player.near","keeper.near","creator.near"] {
        context(actor,0);reject(||c.set_campaign_capacity(20));
        assert_eq!(near_sdk::borsh::to_vec(&c).unwrap(),original);
    }
    context("castle.near",0);reject(||c.set_campaign_capacity(0));
    c.set_campaign_capacity(20);assert_eq!(c.campaign_capacity(),Some(20));
    assert_eq!((c.pool,c.liabilities,c.treasury_total,c.active,c.last_creation),financials);
    assert_eq!(env::storage_read(&Authority::key("a")).unwrap(),world);
    assert_eq!(near_sdk::borsh::to_vec(&c).unwrap().len(),original.len());
    c.set_campaign_capacity(1); // Lowering capacity never deletes active worlds.
    assert_eq!(c.active,2);assert_eq!(env::storage_read(&Authority::key("a")).unwrap(),world);
    c.set_campaign_capacity(4);assert_eq!(near_sdk::borsh::to_vec(&c).unwrap(),original);
    assert_eq!(TOTAL_STORAGE_BYTES,32*1024*1024);
    context("castle.near",PASSAGE_PRICE*20);c.fund_pool();
    c.set_campaign_capacity(2);
    let creator_context=|height|testing_env!(VMContextBuilder::new().current_account_id(id("castle.near")).predecessor_account_id(id("creator.near")).account_balance(NearToken::from_near(1000)).prepaid_gas(Gas::from_tgas(300)).block_height(height).build());
    creator_context(100);reject(||c.open_campaign("third".into()));
    context("castle.near",0);c.set_campaign_capacity(8);
    for (height,name) in [(100,"third"),(110,"fourth"),(120,"fifth")] {
        creator_context(height);c.open_campaign(name.into());
    }
    assert_eq!(c.active,5);
    assert_eq!(c.pool,PASSAGE_PRICE*5);
}
