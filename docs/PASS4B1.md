# Pass 4B.1 — one contract, isolated campaigns

Status: **PASS — local multi-campaign acceptance met.** Local implementation only. No Testnet RPC, account operation, credential access, deployment, hosting or live LLM execution in this pass.

## Architecture and creation policy

`Authority` is the sole NEAR contract state. A validated immutable 1–64 character campaign ID addresses one Borsh `World` at `campaign:v1:<id>`. Each world contains properties, ancestry, grants, grant indices, leases, nonces, night, executor, registered initial participants and passage budgets. Existing World authority algorithms remain the internal implementation; World constructors/methods are no longer separate exported contract entry points.

`new_registry` is private, one-time initialization. `create_campaign` is private to the contract account, rejects duplicate IDs, validates the bootstrap mode and actor roster, and establishes the existing basic/economy/political ownership templates. No arbitrary caller can mint a world naming themselves as an existing world's owner. No post-creation owner override, campaign deletion or replacement method exists. Actor authorization always uses predecessor identity and the target World's rights, never ID secrecy or transaction signer claims.

A trusted provisioning process can create walletless visitors' worlds without another deployment. It must be kept outside the gameplay executor: current creation requires a self-signed call with exactly 3 NEAR attached and sufficient unencumbered contract balance. Contract-account deployment/provisioning credentials remain highly privileged and must not be exposed through a public endpoint. Production provisioning custody, abuse limits and session authorization are not implemented here. Public account sharing is not automatic: the fixture creates distinct prefixed actors for its second campaign. Explicitly shared accounts only receive the roles/rights actually assigned in each world; a function-call key limits receiver/method, not campaign arguments, so sharing an identity authorized in both worlds shares its signing authority over both.

## Storage and financial integrity

Each campaign reserves 3 NEAR of contract funding for at most 262,144 serialized bytes plus storage-key overhead. Creation checks current storage price and total backing against existing reserves, aggregate economic liabilities and base contract storage. A self-transfer is not counted as new revenue: actual contract balance must back the new reservation. Fixed reserves are not rent, spendable passage budgets or fictional wealth; they are retained and have no withdrawal interface. Storage growth past the bound rejects atomically. The existing 256-grant/64-lease limits remain; nonce actors are capped at 256 and bootstrap participants at 16.

Passage budgets now live inside their World instead of global account-keyed storage. Only registered campaign participants can fund them; otherwise an outsider could consume someone else's prepaid storage. Original exact amount, recipient/property/duration/expiry, finite mandate, rent escrow, refund and nonce rules remain. Aggregate liabilities conservatively include pending payouts/refunds until callbacks confirm success. Creation cannot treat another world's escrow as storage funding.

Every callback carries the originating campaign ID. `rent_paid` and `passage_refunded` remain private and require pending state in that same campaign. A failed transfer restores its original budget or retains rent for retry. Receipt failure rolls back the campaign mutation; callbacks do not touch another world. Native NEAR is physically held by one contract, with separately accounted obligations: there are no separate on-chain wallets per campaign and no claim of cross-receipt atomic payouts.

## Interface changes

New exports: `new_registry`, `create_campaign`.

All existing runtime exports require `campaign_id`: `get_world`, `has_access`, `passage_budget`, `grant_access`, `revoke_grant`, `enter_room`, `advance_night`, `offer_lease`, `accept_lease`, `cancel_lease`, `reject_lease`, `claim_rent`, `rent_paid`, `fund_passage`, `accept_funded_passage`, `refund_passage_budget`, `passage_refunded`. Views and event logs identify the campaign. Existing single-world `new`, `new_economy`, `new_political` remain internal bootstrap functions, not exported API.

## Sandbox, persistence and compatibility

`createScenario` accepts `campaignId`, `actorPrefix`, and an existing `contract`. Only the first scenario deploys/initializes the registry; later scenarios create worlds in that same instance. The adapter supplies campaign ID after caller arguments, validates returned world identity, and records contract/campaign in evidence. Existing deterministic decisions and finality/postcondition recovery are unchanged.

Save journals bind to both contract and on-chain campaign before recovery. A mismatched binding is rejected; legacy unbound saves are accepted only for the original default world. Windows atomic save replacement has a bounded sharing-violation retry, with no unlink of the previous journal.

The new Borsh registry is **not an in-place upgrade of old single-World state**. Automatic resume-time code upgrades are disabled. Existing saved Sandbox chains retain their original WASM/state and accept the extra JSON campaign argument as before; no local saves are reset or converted. New sessions use the registry. An explicit audited state-and-outstanding-callback migration would be needed to move a legacy chain into this registry. No such destructive migration is attempted. The existing mocked-host demo remains a clearly labeled single-World local fixture, not multi-campaign evidence.

The read-only Testnet adapter now requires public `VITE_CAMPAIGN_ID` and checks the returned world ID. This does not implement public signing or a production backend.

## Verification

| Check | Final result |
| --- | --- |
| Rust unit tests | **PASS 19/19**: 13 preserved tests + 6 multi-campaign tests |
| Existing Node suite | **PASS 92/92**, Windows Node, `--test-concurrency=1` |
| Fresh native mocked-host bridge | **PASS 1/1**, repeated existing case after rebuilding local-demo |
| Production build / TypeScript | **PASS**, `npm run build` |
| Sandbox unique cases | **PASS 52/52**, full Linux discovery plus focused corrections and Windows-only execution as detailed below |
| New same-contract seven-night routes | **PASS 2 campaigns**, included in Sandbox count |
| Testnet / hosting / live AI | **NOT RUN**, prohibited in this pass |

Full Linux Sandbox invocation discovered 52 cases: 49 passed, two fixture assertions failed, and the Windows-only startup case was skipped as designed. Corrected the legacy bootstrap count from 4 to 5 (registry initialization plus campaign creation), then reran that entire legacy campaign case: PASS. The new concurrency fixture originally submitted identical signed transactions and received the same successful transaction hash twice, with only one execution. Changed it to two distinct actions sharing the same campaign nonce; the entire isolation case passed with one success and one stale-nonce rejection. Windows startup/reload ran separately: PASS. All 52 unique cases therefore have passing final evidence; the original full invocation itself did not exit successfully. No behavioral assertion was removed, and unrelated passing cases were not rerun merely to make a single log green.

Early Windows Node runs exposed transient rename sharing violations; bounded atomic-replacement retries resolved them. A diagnostic Linux Node run lacked the Windows-installed native bundler and demo binary; the supported Windows Node suite passed. The storage-liability unit fixture was corrected to account for the SDK adding attached deposit to the mock account balance. These were test/environment issues, not successful unauthorized contract operations.

[Verification summary](evidence/pass4b1-verification.json), [isolation transactions and state](evidence/pass4b1-isolation.json), [two-campaign route transactions and final states](evidence/pass4b1-campaigns.json). Existing regression evidence files were regenerated by their established suites; hashes are local Sandbox evidence only.

### Security and gameplay results

- **PASS initialization:** two independent worlds in one deployed contract; duplicate initialization rejected; unrelated predecessor cannot create campaigns; storage reserve/actor roster validation and unknown ID rejection covered.
- **PASS authority/impersonation:** A's player, owner and executor cannot use B's roles; ID knowledge confers no rights. Revoking A's Crypt grant leaves B's grant and A's independently owned Library intact. Shared Vesper has independent nonce state; A's Library owner has no Library title in the explicitly shared-actor third world.
- **PASS economy/callbacks:** A accepts Seraphine's sanctuary while B rejects; A's payout leaves B unchanged. A's expired passage budget refunds exactly once while B retains its mandate. Outsider funding fails. Existing rent, payment amount, cascading authority and restricted-key scenarios pass. Wrong-campaign/nonpending callbacks and failed callback recovery are covered by Rust tests; actual scoped successful transfers/refunds and outsider callbacks by Sandbox.
- **PASS concurrency/replay:** different-campaign operations succeed independently; distinct same-campaign operations with the same nonce produce one mutation and a deterministic rejection. Stale/repeated commitments cannot duplicate charges. A's night advancement leaves B at night zero with its own expiry calculations.
- **PASS full campaigns:** one deployment hosts `marius-route` and `independent-route`. Each finishes seven nights with 56 unique NPC turns. A retains Mirelle research and reaches Favoured through the counterproposal; B changes investigators to Dorian and reaches Unbound. Each action leaves the other world's snapshot unchanged. A lost committed passage-purchase response recovers without another payment. Every nightly reload retains state without another transaction; a journal bound to the other world is rejected.

Commands: `cargo test --manifest-path contract/Cargo.toml --lib`; `node --test --test-concurrency=1 tests/*.test.mjs`; Linux Node `--test --test-concurrency=1 tests/sandbox/*.test.mjs`; focused reruns of `campaign.test.mjs` and the isolation case in `multi-campaign.test.mjs`; Windows Node `--test tests/sandbox/startup.test.mjs`; `npm run build`. Linux used the existing `.local/node-v24.13.0-linux-x64/bin/node`.

## Build tooling and deployment boundary

The installed cargo-near 0.22.0 embeds an older NEAR CLI config reader that attempted to migrate the new CLI configuration. Sandbox permissions prevented the write. No Testnet configuration/credentials were modified. Windows known-folder resolution ignored an attempted process-local APPDATA override. Used existing Cargo with `RUSTFLAGS="--cfg near"`, `cargo build --target wasm32-unknown-unknown --release --locked --manifest-path contract/Cargo.toml`, preserving the repository release profile. The fresh release WASM is copied to the established artifact path; it is not wasm-opt postprocessed. Its actual execution is tested in Sandbox.

Deployment remains unapproved and NOT RUN. Public gameplay readiness is not implied by contract verification.

## WASM artifact

- Path: `target/near/night_authority/night_authority.wasm`.
- Size: **492,306 bytes** (un-postprocessed release WASM).
- SHA-256: `a96adbe06a90e92a6a92a4c82da1165273c6e054c3cf1c55e6a15861bd0e92a5`.
- Estimated code storage: **4.92306 NEAR**, using the previously observed storage price of 10^19 yoctoNEAR/byte. This is a reused estimate, not a new Testnet query. Add account/key/registry overhead, gas and **3 NEAR reserved backing per campaign**, separate from economic escrow.
- The existing castle Testnet account's previously verified 5 NEAR is insufficient for this artifact plus one fully backed campaign. Recheck balances/storage price and fund the deficit during an explicitly approved later task. No funds moved in 4B.1.

## Remaining risks and limits

- No automatic on-chain migration of legacy single-world state or outstanding old callbacks; do not deploy this over an initialized old contract without a separate migration design. Existing local saves keep the old code.
- Provisioning uses the contract account's privileged signing custody, not NPC runtime keys. Production walletless session authentication, funding abuse controls, rate limits and custody are not implemented. The create method itself cannot change existing worlds.
- Sharing an actor account across worlds intentionally shares that account's legitimate signing power. Independent worlds do not make a shared compromised private key safe. Default multi-campaign fixtures use independent actor accounts; shared-role isolation is tested explicitly.
- Storage reservation is conservative and retained permanently; there is no campaign deletion/reclamation API. Maximum-load gas benchmarking and protocol storage-price changes are not covered by these bounded campaign regressions.
- Failed payout/refund callbacks are tested with the SDK mocked host; successful campaign-scoped transfers/refunds and unauthorized callback calls are exercised in real Sandbox. No fabricated public transaction evidence.
- Contract calls remain transparently readable on-chain. Campaign IDs are identifiers, not secrets or authorization credentials.

## Changed implementation files

- `contract/src/lib.rs`: registry, scoped exports/storage/budgets/callbacks, reserve accounting and participant gate; existing authority logic retained.
- `contract/src/campaigns_tests.rs`: six new security/isolation tests. `contract/src/tests.rs`: existing assertions retained; Rust formatter changes only.
- `scripts/sandbox/scenario.mjs`: explicit world binding, shared-contract provisioning and scoped final transaction evidence; disables unsafe automatic storage-layout upgrade.
- `scripts/sandbox/campaign.mjs`: durable recovery binding. `scripts/sandbox/persistence.mjs`: bounded Windows atomic-rename retry.
- `src/chain.ts`, `.env.example`: required public campaign ID for read-only Testnet views.
- `tests/sandbox/multi-campaign.test.mjs`: isolation/concurrency and two-world seven-night routes. Existing authority/startup/campaign/gameplay fixtures reflect the new initialization interface; Node mock fixtures supply explicit contract identity.
- README, requirements, AGENTS, progress and deployment notes updated narrowly. No gameplay decisions, NPC policy, narrative, artwork, contract payment semantics or Git history changed. No commit/push performed.

## Pass 4B.2 readiness

**Ready as a locally verified deployment candidate, not ready to deploy without further approval and funding preparation.** The approved target is still one Testnet contract for many worlds. Before deploying: obtain explicit approval, recheck the destination remains unused, fund code storage plus the first campaign's reserved backing and gas, verify this artifact checksum, call private `new_registry`, then privately create the verification campaign with the approved actor roster and existing owner/bootstrap operations. Configure restricted runtime keys only after those legitimate setup operations. Never use old `new_political` as the deployed initializer. No Testnet keys or balances were accessed in this pass.

The production public session/execution service remains out of scope. The current local UI runner still manages one selected save; the contract and reusable scenario/session adapters support multiple concurrent worlds, as verified here. Campaign creation does not deploy WASM.
