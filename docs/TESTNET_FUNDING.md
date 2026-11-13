# Five-campaign Testnet funding — verified

**PASS: funding and on-chain capacity 5.** All seven transactions were independently
verified FINAL-success through FastNEAR and dRPC. No contract code change,
redeployment, gameplay transaction, Render work, service creation or Git push.

## Faucet accounts and custody

Exactly two normal requests used the previously successful official procedure:
`near account create-account sponsor-by-faucet-service <account>
autogenerate-new-keypair save-to-keychain network-config testnet create`.
Both accounts received **10 Testnet NEAR**. No faucet rejection, alternate faucet,
rate-limit bypass or repeated creation request occurred. Administrative funding
credentials remain in the operator's Windows keychain, never the runtime bundle,
Git, evidence or browser. Neither new account is a gameplay actor.

The first CLI command succeeded but emitted its transaction identifier on stderr,
which the initial wrapper did not capture. Read-only block/chunk lookup recovered
the creation hash and both providers verified it before the second request.
The deprecated rpc.testnet.near.org endpoint rejected a verification query;
subsequent independent verification used the Testnet providers listed in
[official NEAR RPC documentation](https://docs.near.org/api/rpc/providers).
This was an RPC-query failure, not a faucet rejection or a reason to retry creation.

## Finalized transactions

| Operation | FINAL transaction |
|---|---|
| Create/fund `win-funding-20261113-a.testnet`, 10 NEAR | [71kYzuikt6ekHUiuP5WUACc8vxL1zgXzFWqXo8XZzvRp](https://testnet.nearblocks.io/txns/71kYzuikt6ekHUiuP5WUACc8vxL1zgXzFWqXo8XZzvRp) |
| Create/fund `win-funding-20261113-b.testnet`, 10 NEAR | [DENKxGKFMJ26r6Vao35bvUzyzY1yFmTMPgfUqTt6X5o9](https://testnet.nearblocks.io/txns/DENKxGKFMJ26r6Vao35bvUzyzY1yFmTMPgfUqTt6X5o9) |
| Transfer 4 NEAR from funding A to contract | [6Xw8DCHjjt1MqdmVswvonHjp7jWX9Urf8Rz1kWxsncss](https://testnet.nearblocks.io/txns/6Xw8DCHjjt1MqdmVswvonHjp7jWX9Urf8Rz1kWxsncss) |
| Contract self-call `fund_pool`, 1 NEAR | [7Rp9Vzp3jvSou41r3SNzTwajVx4juJKUSvmRfixxvgdW](https://testnet.nearblocks.io/txns/7Rp9Vzp3jvSou41r3SNzTwajVx4juJKUSvmRfixxvgdW) |
| Keeper allowance to 0.10 NEAR | [3yzy5UtXnnMHGkuYUCGSf31UmDPhehqsaky5xPCgHCAY](https://testnet.nearblocks.io/txns/3yzy5UtXnnMHGkuYUCGSf31UmDPhehqsaky5xPCgHCAY) |
| Seraphine allowance to 0.075 NEAR | [HUKN7E2ggNpdpeafF4upjRybtE3GH66PoXqXTVJeid5k](https://testnet.nearblocks.io/txns/HUKN7E2ggNpdpeafF4upjRybtE3GH66PoXqXTVJeid5k) |
| Contract self-call `set_campaign_capacity`, 5 | [8UF4jTXgriYktTRjoUavmR2drY2ddg7wnsvzG3qq7U1Q](https://testnet.nearblocks.io/txns/8UF4jTXgriYktTRjoUavmR2drY2ddg7wnsvzG3qq7U1Q) |

Administrative transactions used existing exact-key offline signing, decoded
action/receiver/amount checks, signature verification and a durable hash before
broadcast. Each result and every receipt succeeded. No uncertain transfer was
re-signed or duplicated.

## Actual final balances and reserves

All figures are Testnet NEAR. Pool and storage backing are **included** in the
contract balance, not additional balances.

| Item | Final value |
|---|---:|
| `night.we-inherit-night.testnet` balance | 10.0903084649026567 |
| Internal gameplay pool | 1.15 |
| Current storage stake, 584,636 bytes | 5.84636 |
| Additional root-write reserve | 0.00616 |
| Unencumbered backing after pool, current storage and root reserve | 3.0877884649026567 |
| Funding account A balance | 5.9999553634875 |
| Funding account B balance | 10 |
| **Total funding-account reserve** | **15.9999553634875** |
| Reserve spendable above funding accounts' storage stakes | 15.9963153634875 |
| Outstanding contract liabilities / campaign treasuries | 0 / 0 |
| Active campaigns / admission capacity | 0 / **5** |

Funding A paid the transfer fee; funding B remains untouched after creation.
No NPC account top-up was needed. All actor balances and spendable gas balances
are recorded in `evidence/campaign-funding/final-verification.json`.

## Why this funding supports five

- Every new game reserves 0.04 NEAR player treasury plus the existing 0.01 passage
  budget. Five require 0.25 NEAR; the 1.15 pool covers **23 initial allocations**
  before recycling/replenishment. It does not fund 23 full lifetimes indefinitely.
- Existing storage stress evidence reached 27,011 incremental bytes. Budgeting
  twice that footprint for longer live account names plus 128 bytes of ID/metadata
  variation gives **54,150 bytes per campaign**, or **2.7075 NEAR for five** at
  the observed 0.00001 NEAR/byte storage price. After that budget the contract
  retains **0.3802884649026567 NEAR** of free backing. This exceeds the earlier
  normal-route estimate substantially; it is still a planning budget, not a proof
  that every campaign can fill its entire 256 KiB hard quota. Existing financial
  backing checks and the 32 MiB ceiling remain unchanged.
- Keeper's conservative five-game budget is 5 × 13 × 10 Tgas = 650 Tgas,
  or 0.065 NEAR at the observed gas price. Its previous 0.05 allowance was
  insufficient; **0.10** provides headroom for fees/recovery.
- Seraphine can claim two accepted rents per game: 5 × 2 × 50 Tgas = 500 Tgas,
  or 0.05 NEAR before extra fees/retries. **0.075** provides headroom.
- The other nine **0.05** allowances remain sufficient for the bounded initial
  cohort. Player navigation is read-only in the existing campaign backend;
  it does not spend signing gas. Seven 10-Tgas player decisions per game budget
  0.035 NEAR across five. Provisioning budgets 0.025; Lucien's bounded offer,
  collection and two grants budget 0.04; Cassian's unused-budget refunds budget
  0.025. Other NPCs are bounded to one decision per night, with many local passes.
  Allowances do not guarantee unlimited retries or repeated future cohorts.

## Restricted allowances and unchanged authority

| Role | Final allowance | Account balance |
|---|---:|---:|
| Provisioner | 0.05 | 0.0499579391840732 |
| Player | 0.05 | 0.2487404281280873 |
| Vesper | 0.05 | 0.2428006947823711 |
| Seraphine | **0.075** | 0.2482818396849511 |
| Keeper | **0.10** | 0.2498968366741432 |
| Marius | 0.05 | 0.249420319939019 |
| Lucien | 0.05 | 0.2499579307126168 |
| Mirelle | 0.05 | 0.2499579353334112 |
| Dorian | 0.05 | 0.2499579353334112 |
| Cassian | 0.05 | 0.2294624532793705 |
| Sabine | 0.05 | 0.2499579395691394 |

NEAR has no in-place allowance-edit action. Each necessary increase used one
atomic transaction deleting and re-adding the **same public key**, with the same
FunctionCall receiver/method allowlist and a larger finite allowance. No keypair
was regenerated and no runtime private key was accessed/exported. The protocol-set new nonce was
verified not to decrease, preserving replay protection. All other access keys
and permissions remain. `NIGHT_CONFIG_JSON` and encrypted `NIGHT_RUNTIME_KEYS`
require no changes; existing runtime permission validation accepts these finite
positive allowances. Historical installation evidence still records the original
0.05 allowances; this report is the current allowance evidence.

## Verification and remaining limits

PASS: two faucet creations; seven FINAL-success transactions checked independently
via `https://test.rpc.fastnear.com` and `https://near-testnet.drpc.org`; account
balances; exact pool and capacity byte changes; capacity getter 5; zero financial
liabilities; unchanged code checksum, roster, treasury and creation interval;
exact receiver/method restrictions; all retained administrative/other keys.

WASM remains SHA-256
`a11d407105d4b09d17eb91642ff415040e37f0ede05355fb626d0774110df250`.
Evidence: `evidence/campaign-funding/` (creation receipts, intents, signed-payload
verification metadata, FINAL receipts and consolidated `final-verification.json`).
No secret values are included.

No unrelated regression tests were run: no application or contract source changed.
Funding, signing gas and tombstone storage remain finite and need monitoring.
Five concurrent **on-chain** campaigns are funded and permitted; hosted five-player
memory/throughput remains unverified. This task did not change Render, run a load
test, deploy the public game, or claim public playability. Stopped after verification.
