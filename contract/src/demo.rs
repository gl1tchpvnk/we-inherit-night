//! Local SDK mocked host, executing actual World methods. No keys or transactions.
use near_sdk::{
    AccountId,
    serde_json::{self, json},
    test_utils::{VMContextBuilder, get_logs},
    testing_env,
};
use night_authority::World;
use std::io::{self, BufRead};
fn account(s: &str) -> AccountId {
    s.parse().unwrap()
}
fn context(actor: &str) {
    testing_env!(
        VMContextBuilder::new()
            .current_account_id(account("world.testnet"))
            .predecessor_account_id(account(actor))
            .signer_account_id(account(actor))
            .build()
    );
}
fn main() {
    std::panic::set_hook(Box::new(|_| {}));
    context("world.testnet");
    let mut world = World::new(
        account("vesper.testnet"),
        account("player.testnet"),
        account("keeper.testnet"),
    );
    for line in io::stdin().lock().lines() {
        let Ok(line) = line else {
            break;
        };
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            let request: serde_json::Value = serde_json::from_str(&line).expect("invalid request");
            let action = request["action"].as_str().unwrap_or("view");
            let actor = if action == "grant" || action == "revoke" {
                "vesper.testnet"
            } else {
                "player.testnet"
            };
            context(actor);
            let nonce = world.get_world(account(actor)).next_nonce;
            match action {
                "view" => {}
                "grant" => {
                    assert!(
                        world.get_world(account(actor)).grants.is_empty(),
                        "demo grant already issued"
                    );
                    world.grant_access(
                        "crypt".into(),
                        "enter".into(),
                        account("player.testnet"),
                        None,
                        true,
                        None,
                        nonce,
                    );
                }
                "revoke" => world.revoke_grant(0, nonce),
                "enter" => world.enter_room(
                    request["property_id"]
                        .as_str()
                        .expect("room required")
                        .into(),
                    nonce,
                ),
                _ => panic!("unknown action"),
            }
        }));
        let error = result.err().map(|e| {
            e.downcast_ref::<String>()
                .cloned()
                .or_else(|| e.downcast_ref::<&str>().map(|s| s.to_string()))
                .unwrap_or("contract rejected".into())
        });
        println!(
            "{}",
            json!({"world":world.get_world(account("player.testnet")),"error":error,"events":get_logs(),"proof":"local-sdk-runtime"})
        );
    }
}
