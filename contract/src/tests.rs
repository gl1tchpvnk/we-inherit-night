use super::*;
use near_sdk::{
    test_utils::{VMContextBuilder, get_logs},
    testing_env,
};
fn account(s: &str) -> AccountId {
    s.parse().unwrap()
}
fn as_actor(s: &str) {
    testing_env!(
        VMContextBuilder::new()
            .current_account_id(account("world.testnet"))
            .predecessor_account_id(account(s))
            .signer_account_id(account("vesper.testnet"))
            .build()
    );
}
fn world() -> World {
    as_actor("world.testnet");
    World::new(
        account("vesper.testnet"),
        account("player.testnet"),
        account("keeper.testnet"),
    )
}
fn grant(
    w: &mut World,
    actor: &str,
    grantee: &str,
    parent: Option<u32>,
    expiry: Option<u32>,
) -> u32 {
    as_actor(actor);
    let nonce = w.get_world(account(actor)).next_nonce;
    w.grant_access(
        "crypt".into(),
        "enter".into(),
        account(grantee),
        parent,
        true,
        expiry,
        nonce,
    )
}
fn rejects(f: impl FnOnce()) {
    assert!(std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)).is_err());
}

#[test]
fn political_bootstrap_has_independent_roots_and_no_new_genealogy() {
    as_actor("world.testnet");
    let mut w = World::new_political(
        account("vesper.testnet"),
        account("player.testnet"),
        account("seraphine.testnet"),
        account("marius.testnet"),
        account("lucien.testnet"),
        account("keeper.testnet"),
    );
    assert_eq!(w.ancestry.len(), 1);
    assert_eq!(w.properties.len(), 6);
    assert!(w.has_access(account("marius.testnet"), "court".into()));
    assert!(w.has_access(account("lucien.testnet"), "passage".into()));
    assert!(!w.has_access(account("marius.testnet"), "sanctuary".into()));
    as_actor("seraphine.testnet");
    let sanctuary = w.grant_access(
        "sanctuary".into(),
        "enter".into(),
        account("player.testnet"),
        None,
        false,
        None,
        0,
    );
    as_actor("marius.testnet");
    rejects(|| w.revoke_grant(sanctuary, 0));
    assert!(w.has_access(account("player.testnet"), "sanctuary".into()));
}

#[test]
fn political_initializer_is_private_and_requires_distinct_actors() {
    as_actor("attacker.testnet");
    rejects(|| {
        World::new_political(
            account("vesper.testnet"),
            account("player.testnet"),
            account("seraphine.testnet"),
            account("marius.testnet"),
            account("lucien.testnet"),
            account("keeper.testnet"),
        );
    });
    as_actor("world.testnet");
    rejects(|| {
        World::new_political(
            account("vesper.testnet"),
            account("player.testnet"),
            account("seraphine.testnet"),
            account("seraphine.testnet"),
            account("lucien.testnet"),
            account("keeper.testnet"),
        );
    });
}

#[test]
fn grant_enter_revoke_deny_and_independent_ownership() {
    let mut w = world();
    let id = grant(&mut w, "vesper.testnet", "player.testnet", None, None);
    as_actor("player.testnet");
    w.enter_room("crypt".into(), 0);
    assert!(get_logs()[0].contains("enter"));
    as_actor("vesper.testnet");
    w.revoke_grant(id, 1);
    as_actor("player.testnet");
    rejects(|| w.enter_room("crypt".into(), 1));
    assert_eq!(w.get_world(account("player.testnet")).next_nonce, 1);
    w.enter_room("library".into(), 1);
    assert_eq!(w.ancestry.len(), 1);
}

#[test]
fn recursive_revoke_preserves_separate_root() {
    let mut w = world();
    let root = grant(&mut w, "vesper.testnet", "player.testnet", None, None);
    grant(&mut w, "player.testnet", "lucien.testnet", Some(root), None);
    assert!(w.has_access(account("lucien.testnet"), "crypt".into()));
    let independent = grant(&mut w, "vesper.testnet", "lucien.testnet", None, None);
    as_actor("vesper.testnet");
    w.revoke_grant(root, 2);
    assert!(!w.valid(0));
    assert!(!w.valid(1));
    assert!(w.valid(independent));
    assert_eq!(
        w.get_world(account("lucien.testnet")).grant_validity,
        vec![false, false, true]
    );
    as_actor("lucien.testnet");
    w.enter_room("crypt".into(), 0);
}

#[test]
fn genealogy_is_not_authority_and_signer_is_not_predecessor() {
    let mut w = world();
    as_actor("player.testnet");
    rejects(|| w.enter_room("crypt".into(), 0));
    rejects(|| {
        grant(&mut w, "intruder.testnet", "lucien.testnet", None, None);
    });
    let id = grant(&mut w, "vesper.testnet", "player.testnet", None, None);
    as_actor("intruder.testnet");
    rejects(|| w.revoke_grant(id, 0));
    as_actor("player.testnet");
    rejects(|| w.revoke_grant(id, 0));
}

#[test]
fn scope_expiry_and_delegation_limits() {
    let mut w = world();
    let id = grant(&mut w, "vesper.testnet", "player.testnet", None, Some(2));
    rejects(|| {
        grant(&mut w, "player.testnet", "lucien.testnet", Some(id), None);
    });
    rejects(|| {
        grant(
            &mut w,
            "player.testnet",
            "lucien.testnet",
            Some(id),
            Some(3),
        );
    });
    as_actor("player.testnet");
    rejects(|| {
        w.grant_access(
            "library".into(),
            "enter".into(),
            account("lucien.testnet"),
            Some(id),
            true,
            Some(2),
            0,
        );
    });
    rejects(|| {
        w.grant_access(
            "crypt".into(),
            "vote".into(),
            account("lucien.testnet"),
            Some(id),
            true,
            Some(2),
            0,
        );
    });
    as_actor("vesper.testnet");
    let no_delegate = w.grant_access(
        "crypt".into(),
        "enter".into(),
        account("lucien.testnet"),
        None,
        false,
        None,
        1,
    );
    rejects(|| {
        grant(
            &mut w,
            "lucien.testnet",
            "other.testnet",
            Some(no_delegate),
            None,
        );
    });
    rejects(|| {
        grant(&mut w, "other.testnet", "lucien.testnet", Some(id), Some(1));
    });
}

#[test]
fn depth_and_cycles_are_bounded() {
    let mut w = world();
    let a = grant(&mut w, "vesper.testnet", "player.testnet", None, None);
    rejects(|| {
        grant(&mut w, "player.testnet", "player.testnet", Some(a), None);
    });
    rejects(|| {
        grant(&mut w, "player.testnet", "vesper.testnet", Some(a), None);
    });
    let b = grant(&mut w, "player.testnet", "lucien.testnet", Some(a), None);
    rejects(|| {
        grant(&mut w, "lucien.testnet", "player.testnet", Some(b), None);
    });
    let c = grant(&mut w, "lucien.testnet", "third.testnet", Some(b), None);
    let d = grant(&mut w, "third.testnet", "fourth.testnet", Some(c), None);
    assert!(w.valid(d));
    rejects(|| {
        grant(&mut w, "fourth.testnet", "fifth.testnet", Some(d), None);
    });
}

#[test]
fn expiration_and_turn_races() {
    let mut w = world();
    grant(&mut w, "vesper.testnet", "player.testnet", None, Some(1));
    as_actor("player.testnet");
    rejects(|| w.advance_night(0));
    as_actor("keeper.testnet");
    rejects(|| w.advance_night(1));
    w.advance_night(0);
    rejects(|| w.advance_night(0));
    as_actor("player.testnet");
    rejects(|| w.enter_room("crypt".into(), 0));
    rejects(|| {
        grant(&mut w, "vesper.testnet", "lucien.testnet", None, Some(1));
    });
}

#[test]
fn replay_cannot_restore_or_reuse_revoked_grants() {
    let mut w = world();
    let id = grant(&mut w, "vesper.testnet", "player.testnet", None, None);
    as_actor("vesper.testnet");
    w.revoke_grant(id, 1);
    rejects(|| w.revoke_grant(id, 1));
    rejects(|| w.revoke_grant(id, 2));
    rejects(|| {
        w.grant_access(
            "crypt".into(),
            "enter".into(),
            account("player.testnet"),
            None,
            true,
            None,
            0,
        );
    });
    rejects(|| {
        grant(&mut w, "player.testnet", "lucien.testnet", Some(id), None);
    });
    as_actor("player.testnet");
    w.enter_room("library".into(), 0);
    rejects(|| w.enter_room("library".into(), 0));
    assert!(!w.has_access(account("player.testnet"), "crypt".into()));
}

#[test]
fn initialization_is_private() {
    as_actor("intruder.testnet");
    rejects(|| {
        World::new(
            account("vesper.testnet"),
            account("player.testnet"),
            account("keeper.testnet"),
        );
    });
}

#[test]
fn failed_payout_restores_claimability_and_callback_is_private() {
    let mut w = world();
    let price = NearToken::from_millinear(20);
    as_actor("vesper.testnet");
    w.offer_lease(
        "crypt".into(),
        account("player.testnet"),
        U128(price.as_yoctonear()),
        3,
        2,
        0,
    );
    testing_env!(
        VMContextBuilder::new()
            .current_account_id(account("world.testnet"))
            .predecessor_account_id(account("player.testnet"))
            .attached_deposit(price)
            .build()
    );
    w.accept_lease(0, 0);
    as_actor("vesper.testnet");
    let _promise = w.claim_rent(0, 1);
    rejects(|| {
        let _ = w.claim_rent(0, 2);
    });
    rejects(|| {
        w.rent_paid(0, Ok(()));
    });
    as_actor("world.testnet");
    assert!(!w.rent_paid(0, Err(PromiseError::Failed)));
    assert_eq!(w.leases[0].escrow_yocto.0, price.as_yoctonear());
    assert!(!w.leases[0].payout_pending);
    as_actor("vesper.testnet");
    let _retry = w.claim_rent(0, 2);
    as_actor("world.testnet");
    assert!(w.rent_paid(0, Ok(())));
    assert_eq!(w.leases[0].escrow_yocto.0, 0);
    rejects(|| {
        w.rent_paid(0, Ok(()));
    });
}


fn funded_world() -> World {
    as_actor("world.testnet");
    let mut w = World::new_political(account("vesper.testnet"), account("player.testnet"), account("seraphine.testnet"), account("marius.testnet"), account("lucien.testnet"), account("keeper.testnet"));
    testing_env!(VMContextBuilder::new().current_account_id(account("world.testnet")).predecessor_account_id(account("cassian.testnet")).attached_deposit(NearToken::from_yoctonear(PASSAGE_PRICE)).build());
    w.fund_passage(0);
    w
}
#[test]
fn passage_budget_enforces_exact_terms_identity_nonce_and_single_spend() {
    let mut w = funded_world();
    rejects(|| w.fund_passage(1));
    as_actor("lucien.testnet");
    let id = w.offer_lease("passage".into(), account("cassian.testnet"), U128(PASSAGE_PRICE), 3, 5, 0);
    as_actor("player.testnet");rejects(|| w.accept_funded_passage(id,0));
    as_actor("cassian.testnet");rejects(|| w.accept_funded_passage(id,0));
    for mutation in 0..5 {
        let original=w.leases[id as usize].clone();
        let l=&mut w.leases[id as usize];
        match mutation {0=>l.owner=account("marius.testnet"),1=>l.price_yocto=U128(PASSAGE_PRICE+1),2=>l.duration_nights=2,3=>l.offer_expiry_night=4,_=>l.property_id="library".into()};
        rejects(|| w.accept_funded_passage(id,1));
        w.leases[id as usize]=original;
    }
    w.night=5;rejects(|| w.accept_funded_passage(id,1));w.night=4;
    w.accept_funded_passage(id,1);
    assert_eq!(w.passage_budget(account("cassian.testnet")).unwrap().remaining.0,0);
    assert_eq!(w.leases[id as usize].escrow_yocto.0,PASSAGE_PRICE);
    assert!(w.has_access(account("cassian.testnet"),"passage".into()));
    rejects(|| w.accept_funded_passage(id,2));
    w.night=5;rejects(|| {let _=w.refund_passage_budget(2);});
}
#[test]
fn unused_passage_refund_retries_failure_without_double_payment() {
    let mut w=funded_world();as_actor("cassian.testnet");
    rejects(|| {let _=w.refund_passage_budget(1);});
    w.night=5;let _=w.refund_passage_budget(1);
    rejects(|| {let _=w.refund_passage_budget(2);});
    rejects(|| {w.passage_refunded(account("cassian.testnet"),Ok(()));});
    as_actor("world.testnet");assert!(!w.passage_refunded(account("cassian.testnet"),Err(PromiseError::Failed)));
    as_actor("cassian.testnet");let _=w.refund_passage_budget(2);
    as_actor("world.testnet");assert!(w.passage_refunded(account("cassian.testnet"),Ok(())));
    rejects(|| {w.passage_refunded(account("cassian.testnet"),Ok(()));});
    as_actor("cassian.testnet");rejects(|| {let _=w.refund_passage_budget(3);});
}
