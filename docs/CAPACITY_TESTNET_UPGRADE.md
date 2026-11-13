# Testnet code upgrade and initial capacity

Superseded operational limit: subsequent authorized faucet funding set capacity
to **5** and replenished the pool/necessary allowances. See [current funding and
reserves](TESTNET_FUNDING.md). The figures below preserve the earlier upgrade record.

Result: **PARTIAL for capacity expansion**. The approved code-only upgrade and
an operationally justified initial capacity of **1** are FINAL and independently
verified. Current funding does not justify increasing above the previous setting
of 4. No Render deployment or public gameplay verification was performed.

## Finalized operations

Account: `night.we-inherit-night.testnet` (Testnet only).

| Operation | FINAL transaction | Tokens burnt, test NEAR |
|---|---|---:|
| Single DeployContract action; no initialization | [F3wPz6J9xdoKtjpg12YTLGytMkh9L5JNkqgmDPtdKAuz](https://testnet.nearblocks.io/txns/F3wPz6J9xdoKtjpg12YTLGytMkh9L5JNkqgmDPtdKAuz) | 0.0042269401722503 |
| Self-signed `set_campaign_capacity({"max_active":1})`, zero deposit | [5PQw61q96tiuQSL5ohZp51g74c9FZzWkvwetEUMXi6xq](https://testnet.nearblocks.io/txns/5PQw61q96tiuQSL5ohZp51g74c9FZzWkvwetEUMXi6xq) | 0.0002130423685678 |

Deployed WASM SHA-256:
`a11d407105d4b09d17eb91642ff415040e37f0ede05355fb626d0774110df250`
(583,921 bytes). NEAR code hash:
`BqvWZg8ztTnwk6xSWBBURScjhbCcZ4LfpYWwJkSNSTM9`.

Existing exact administrative public key was selected for offline CLI signing.
Decoded actions, nonce, block hash, receiver, signer, code checksum/function
arguments and Ed25519 signature were verified before submission. Private keys
remained in the Windows keychain. Durable intent/hash records precede broadcast.
Independent RPC retrieved FINAL receipts with no failed receipt outcomes.

## State and finances

Both `https://test.rpc.fastnear.com` and `https://rpc.testnet.near.org` confirmed
that the pre-upgrade code and complete public storage matched the local upgrade
verification snapshot. Code deployment preserved every storage record byte for
byte. The capacity call changed only the existing max_active field (4 to 1),
verified against an exact expected byte-level diff. No migration or initialization.

| Final value | Result |
|---|---:|
| Contract balance | 6.0907342792571656 test NEAR |
| Storage usage | 584,636 bytes |
| Protocol storage price | 0.00001 NEAR/byte |
| Storage stake | 5.84636 NEAR |
| Provisioning pool | 0.15 NEAR |
| Outstanding liabilities / allocated treasuries | 0 / 0 |
| Active campaigns | 0 |
| Unencumbered backing after storage and pool | 0.0943742792571656 NEAR |
| Additional contract root-write reserve (488 + 128 bytes) | 0.00616 NEAR |
| Player treasury per campaign | 0.04 NEAR, unchanged |
| Passage allocation per campaign | 0.01 NEAR, unchanged |
| Provisioner / ten-actor roster / creation interval | Unchanged / unchanged / 10 blocks |
| Capacity getter | 1 on verified deployed code |

No existing campaigns or obligations were removed: the preflight registry was
empty. Operator access keys retained their permissions; only the signing nonce
advanced. All eleven exact runtime keys were independently rechecked: unchanged
nonce and receiver/method permissions, no FullAccess, each still has a 0.05 NEAR
allowance. No runtime key signed in this task. Actor balances/free gas balances
are recorded in preflight evidence; the smallest is the provisioner's
0.0465979391840732 NEAR above storage stake.

## Why capacity is one

The resource limit is storage backing, not the 32 MiB ceiling:

- Prior seven-night tests measured peak incremental storage of 2,101 bytes.
  Planning allows twice that footprint for longer live account names plus 128
  bytes for campaign-ID/lifecycle variation: **4,330 bytes = 0.0433 NEAR per
  campaign**. This is a conservative estimate relative to the tested routes,
  not a proof of every possible game's maximum. Actual storage checks still
  reject unbacked growth. One campaign leaves useful room for variation.
- After subtracting the contract's 0.00616 root reserve and a **0.002 NEAR
  operational fee margin** (two nominal 10-Tgas operator-call budgets at the
  observed gas price), only **one** whole planned campaign fits. It leaves
  0.0429142792571656 NEAR beyond those planning reserves and one campaign.
- The 0.15 NEAR pool funds three initial 0.05 allocations. Reclamation returns
  unused player treasury; payouts and beneficiary passage refunds do not all
  replenish that pool. Neither active capacity nor reclaim means unlimited play.
- Runtime allowance is per key, shared across campaigns. At observed gas price
  100,000,000 yoctoNEAR/gas, the keeper's conservative full-prepaid-gas budget is
  13 calls × 10 Tgas = 0.013 NEAR per campaign: seven clock advances, up to three
  paid-term settlement advances, and complete/archive/reclaim. One cohort fits
  the 0.05 allowance with headroom; five would require 0.065 before extra fees
  or retries, exceeding that allowance by **0.015 NEAR** under this budget.
  Actual burn can be lower. Other actors' 0.05 allowances and account gas balances
  cover an initial bounded game, not unlimited repeated reads/actions/retries.
- The existing local synthetic four-campaign benchmark peaked at 220.85 MiB RSS;
  it did not measure more than four or hosted throughput. Render's former
  Starter plan is 0.5 CPU/512 MB, now named `0.5c-512mb` in
  [Render's official compute-plan table](https://render.com/docs/compute-plans).
  One is within that measured workload; hosted performance remains unverified.

Preflight initially supported two under the estimate, but actual deployment
fees reduced the margin. A fresh pre-signing guard blocked the two-capacity
attempt before creating an intent or signing. Recalculation selected one; only
the one-capacity transaction was signed and sent. No failed capacity transaction
or duplicate deployment was broadcast.

## Exact additional funding under this planning budget

Snapshot arithmetic after both finalized operations; values are test NEAR.
These are funding shortfalls, not guarantees of unmeasured throughput or all
possible storage paths. Backing must stay unencumbered; pool funding cannot be
counted again as storage backing. Future transaction fees/state changes require
a fresh preflight.

| Target capacity | Additional free storage backing | Additional provisioning pool | Total additional contract funding |
|---:|---:|---:|---:|
| 1 | 0 | 0 | 0 |
| 2 | 0.0003857207428344 | 0 | 0.0003857207428344 |
| 3 | 0.0436857207428344 | 0 | 0.0436857207428344 |
| 4 | 0.0869857207428344 | 0.05 | 0.1369857207428344 |
| 5 | 0.1302857207428344 | 0.10 | 0.2302857207428344 |

Five is the first increase beyond the old four-campaign setting. Besides the
funding shown, it lacks measured server capacity and exceeds the conservative
keeper allowance budget above. No funding, credential change, larger benchmark
or hosting change was performed. Tombstones accumulate; gas, pool and backing
remain finite and need monitoring before further admissions.

## Verification evidence

Public evidence directory: `evidence/capacity-testnet/`.

- `preflight.json`: both providers, original public state/code, live protocol
  storage price, all runtime key permissions/allowances and actor balances.
- `upgrade-verified-before-broadcast.json`, `upgrade-final.json`,
  `upgrade-verification.json`: approved single-action upgrade and unchanged state.
- `capacity-verified-before-broadcast.json`, `capacity-final.json`,
  `capacity-verification.json`: authorized capacity-only state change and getter.
- `final-verification.json`: independent final snapshots, key rechecks, exact
  funding arithmetic and transaction outcomes.

PASS: code checksum, unchanged preflight state, sufficient upgrade backing,
FINAL code-only upgrade, exact state preservation, capacity-only change, financial
and key-permission preservation. Local authority/zero/lower/raise controls and
fifth-campaign admission tests apply to this identical deployed artifact; no
additional live negative-test or gameplay transactions were sent.

PARTIAL: capacity expansion above four. No contract redesign, new accounts,
credential changes, Render deployment, Git commit or push. Stopped after verification.
