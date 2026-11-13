# Pass 4C.2 — PASS locally

Implemented and verified on disposable local Sandbox chains. **No Testnet/Mainnet
transactions, credential access, deployment, upgrade, funding, commit or push.**
Public readiness is not claimed. The existing Testnet deployment is unchanged.

## Architecture and authorization

One registry still contains independent `World` records. Existing authority,
ancestry, grant validation, inheritance, revocation, lease validation and NPC
policies are preserved. World templates now have internal constructors so a
validated provisioner can initialize them; the original private constructors and
their negative tests remain private.

The fixed 3 NEAR reservation is removed. Creation accepts zero attached deposit
when the contract already has sufficient unencumbered backing. Every mutation
checks measured storage usage at `env::storage_byte_cost()`, the pending root
serialization, and financial liabilities. A conservative **global**, not
per-campaign, root-serialization allowance plus 128 bytes covers the root write
after method return. It is not gameplay income or a maximum-world reservation.
The existing 262,144-byte World bound, 256 grants, 64 leases, 256 nonce actors and
16 initial participants remain. Total contract storage is capped at 32 MiB,
including code and retained tombstones. This is a quota, not prepaid capacity.

Backing must cover storage **plus** aggregate rent/passage liabilities **plus**
campaign treasuries **plus** the operator's prepaid pool. Pending transfers remain
conservatively counted until their callbacks finalize. Insufficient backing
rejects the entire NEAR receipt. A real Sandbox test drains only operational
headroom and proves failed creation leaves neither a World nor lifecycle record.
Pending payments can temporarily reduce available mutation headroom; their
balances are never reclassified as storage funding.

### Bounded repeat creation

The operator privately configures an immutable `Provisioning` policy: a distinct
provisioner, fixed ten-role roster, maximum active worlds (at most 100), minimum
creation interval (at least ten blocks), and player treasury allocation (at most
1 NEAR). The operator funds a separately accounted pool through `fund_pool`.

The provisioner needs only an `open_campaign` FunctionCall key. It cannot choose
actors, change policy, withdraw funds, deploy code, or invoke administrative
methods. `open_campaign` atomically creates the existing Living Court bootstrap:
four initial grants, the Lounge and sanctuary offers, initial nonces, and the
bounded Cassian passage mandate. It consumes exactly the configured player
treasury plus 0.01 NEAR for that mandate. The usual configured treasury is 0.04
NEAR, enough for the two existing 0.02 NEAR offers; this is economic funding,
not storage backing.

Actors can be reused across worlds. Each World and treasury independently
authenticates its assigned predecessor and permissions. **A shared player key is
a custodial capability across its assigned campaigns**, not cryptographic visitor
identity. SQLite sessions enforce visitor ownership before execution; possession
of a campaign ID grants no API access. Compromising the trusted runtime could
affect worlds sharing its actors. No claim that FunctionCall keys restrict
campaign arguments is made.

## Prepaid economy and financial invariants

`accept_lease` retains its legacy attached-deposit path for nonprepaid campaigns.
For prepaid campaigns it requires zero deposit, the recorded player, sufficient
campaign treasury and the existing offer/buyer/owner/expiry/nonce checks. The
exact price moves atomically from treasury into existing rent escrow; rights and
duration use the same lease acceptance implementation. Rent vests at acceptance
and is paid to the existing lessor through the existing asynchronous settlement.
This is not a claim that the later transfer/callback is atomic with acceptance.

- Treasuries, escrow, passage mandates and operator pool are separately accounted
  real NEAR obligations. No tokens or fictional currency were introduced.
- A repeated nonce cannot debit twice; a different campaign's player cannot spend
  the target treasury. Another campaign's balance remains unchanged.
- Failed rent/refund callbacks retain or restore their original obligations.
- Completion returns unspent player treasury to the operator pool once. This is
  an internal, fully backed allocation return, not a withdrawal to the player.
- Passage mandates retain their existing seller, amount, expiry and refund
  beneficiary. In newly provisioned worlds the operator endows that mandate;
  unspent passage money refunds to Cassian under the existing rule. It is not
  silently confiscated back into the operator pool.
- Pool replenishment and gas funding remain real operating costs. Paid NPC
  receipts do not magically become new pool funds. This supports repeated funded
  play, not unlimited free chain activity.

## Lifecycle, archival and reclamation

Atomic creation enters **ACTIVE** directly; there is no partially initialized
public World. The subsequent states are **COMPLETED → ARCHIVED → RECLAIMED**.

`complete_campaign` requires the assigned executor, at least seven completed
nights, zero remaining financial liabilities, no pending callbacks, and a SHA-256
archive commitment. It freezes normal mutations and returns unused treasury to
the pool. The contract authenticates the commitment; it does not recompute the
off-chain narrative ending. The trusted engine establishes that ending and the
backend persists its data before committing the hash.

Paid rights are not shortened to make deletion convenient. If a sanctuary term
extends beyond the story, the executor uses `settlement_dawn` with an exact
expected night until the last accepted term naturally expires. These are the
existing logical night ticks after story completion, not new playable nights or
a real-time expiry claim. `archive_campaign` rejects unexpired paid leases.

`reclaim_campaign` requires the executor, archived status, matching commitment,
no liabilities, no pending callbacks and no unexpired lease. It deletes the World
and retains a compact ID/status/player/commitment tombstone. IDs cannot be reused;
old callbacks and signed mutations cannot revive the deleted World. Removing
storage releases backing without transferring or spending protected money.

SQLite retains the final ending, game state, decisions, NPC history, final
financial snapshot, transaction hashes and serialized archive commitment. Continue
can return the archived conclusion after restart without reading a deleted World.
Responses label it **verified historical state**, not current live authority.
Previous archives follow the session through New Game and are available through
authenticated `GET /api/history`; there is no new visual archive browser in this
pass. The existing conclusion presentation is preserved.

## Backend integration

The existing single Node service, HttpOnly/SameSite sessions, SQLite revision
journal, deterministic engine and same-origin command API remain. New additive
tables hold provisioning jobs, immutable archives and session history. Existing
files and databases are not destructively migrated.

The provisioner generates a unique ID and persists its job before signing. The
existing transaction adapter persists intent/signed identity before broadcast,
verifies the exact public key and action, checks FINAL receipts, and reconciles
uncertain outcomes without resending. Campaign registration and completion of
the provisioning job commit together in SQLite. An unresolved/rejected job stops
allocation for operator review rather than creating a replacement world blindly.

Creation is globally serialized, limited to once per minute by the durable backend
job, and additionally bounded by contract frequency/capacity/pool/storage limits.
Dynamic provisioning refuses New Game replacement of a still-playing campaign.
Capacity exhaustion remains a clear HTTP 409. A visitor does not acquire a wallet
or cause account/contract deployment.

`prepaid: true` selects treasury-backed player payment routing and balance views.
The exact-key offline signing mechanism is preserved. Gas remains 10 Tgas for
ordinary calls; claim/refund/provisioning calls use bounded 50 Tgas because their
existing transfer methods require at least 30 Tgas. Keys remain method/receiver
restricted; no FullAccess runtime fallback exists. Runtime Windows identity
separation from provisioning custody is still required.

For future operation, add `provisioning` to the private server configuration with
the approved contract ID and existing actor/public-key bindings, including a
distinct `provisioner`; set `lifecycle: true`. Configure/fund the contract policy
through the separate operator entry points first. **Do not point this capability
at the current Testnet WASM.** The adapter's approved receiver constant must be
updated to the newly authorized deployment in a subsequent deployment pass.

## Storage measurements

Observed Sandbox protocol price: **10^19 yoctoNEAR/byte = 0.00001 NEAR/byte**.
Footprints below exclude WASM and shared registry overhead. They include campaign
records/key overhead where stated, not just JSON size.

| Measurement | Bytes | Backing at observed price |
|---|---:|---:|
| Initial playable prepaid fixture | 1,441 | 0.01441 NEAR |
| Marius seven-night peak | 2,033 | 0.02033 NEAR |
| Independent seven-night peak | 2,101 | 0.02101 NEAR |
| 256 grants + 64 offers fixture | 27,011 | 0.27011 NEAR |
| Simple reclamation, net recovered | 1,321 | 0.01321 NEAR released |
| Marius route, net recovered from final story state | 1,836 | 0.01836 NEAR released |
| Independent route, net recovered from final story state | 1,899 | 0.01899 NEAR released |
| Retained tombstones in these fixtures | 191–202 | 0.00191–0.00202 NEAR |

Seven-night peaks are reconstructed from measured per-transaction storage deltas
before lifecycle closure. The 27,011-byte case is the **maximum observed test
footprint**, not a proof of the maximum possible World: actor names, nonce actors,
budgets and IDs can vary. Growth is still capped by the existing World quota and
the new total quota. Tombstones accumulate and eventually require capacity
planning; there is no unlimited-campaign claim.

Evidence: [lifecycle and bounded growth](evidence/pass4c2-lifecycle.json),
[two complete archived routes](evidence/pass4c2-campaigns.json),
[verification summary](evidence/pass4c2-verification.json).
Prior pass evidence was restored after regression generators ran.

## Verification results

| Check | Result |
|---|---|
| Rust contract tests | **PASS 23/23**: original 19 retained/adapted, four new treasury/lifecycle/provisioning cases |
| Node suite | **PASS 100/100**, including seven backend/session/recovery cases |
| Full Sandbox discovery | 53 cases: initial 51 PASS, one new fixture FAIL, one Windows-only SKIP |
| Corrected lifecycle Sandbox case | **PASS 1/1** against final WASM; 52 unique executed Sandbox cases now PASS |
| Two independent seven-night routes | **PASS**: Favoured/Mirelle and Unbound/Dorian; 56 unique NPC turns each, prepaid player keys, reload/interruption recovery, archive/reclaim/SQLite reopen |
| TypeScript/production build | **PASS** |
| Final archive historical-proof change | **PASS 2/2** focused archive tests |
| Windows-only startup, visual/browser review | **NOT RUN**; no UI redesign, prior startup evidence retained |
| Testnet/Mainnet operations | **NOT RUN**, prohibited |

Commands: `cargo test --manifest-path contract/Cargo.toml --lib` (Windows
`AWS_LC_SYS_PREBUILT_NASM=1`); `node --test --test-concurrency=1 tests/*.test.mjs`;
WSL Node 24 `--test --test-concurrency=1 tests/sandbox/*.test.mjs`; focused
`tests/sandbox/lifecycle.test.mjs`; `npm run build`.

Corrections during verification: the first provisioner attempt exposed the old
internal private-constructor assertion; private external initialization remains
guarded after splitting the template. New stress fixtures needed enough disposable
actor gas funding and a 50-Tgas provisioner call within its restricted allowance.
No existing assertion was removed to conceal these failures. The old fixed-reserve
test now verifies zero-deposit measured creation and insufficient unencumbered
backing; real Sandbox also checks atomic rollback. The full-suite invocation itself
was not green; the failed new case passed its focused rerun. The final formatted
WASM passed the lifecycle case; the full suite used behavior-identical pre-format
code. No unrelated passing suite was repeatedly rerun.

## WASM and Testnet migration recommendation

- Artifact: `target/near/night_authority/night_authority.wasm`
- Size: **579,736 bytes**
- SHA-256: `99f0deeac2fc7e95080d92656b87c0a1515311201d065c8588eacc25b35e05f0`
- Build: existing Cargo release configuration, `RUSTFLAGS="--cfg near"`,
  `cargo build --target wasm32-unknown-unknown --release --locked --manifest-path contract/Cargo.toml`.
- Code-only storage at the measured price: **5.79736 NEAR**. Add measured registry,
  campaign/tombstone storage, explicitly funded pool/mandates, and signer gas.
  For example, two existing offers and one passage mandate allocate 0.05 NEAR
  per new campaign, separately from approximately 0.014–0.022 NEAR observed
  initial/story storage. Re-query protocol price, balances and account overhead
  before funding; no live funding minimum was established in this local pass.

**Recommend Option B: fresh deployment to a newly approved account.** The root
Borsh registry layout changed and existing worlds lack lifecycle metadata. No
compatible state migration has been implemented or verified. A direct overwrite
of `castle.we-inherit-night.testnet` would be unsafe. Retain its code, worlds,
escrow, passage budgets and callbacks; continue their original settlement through
the original interface when separately authorized. Their exact current obligations
were not queried here—Pass 4B.2 evidence is historical, not a fresh balance audit.
Any alternative upgrade needs an explicit migration covering every World,
aggregate liability and outstanding callback, with independent tests.

## Remaining public-operation limitations

- Deployment/account naming, funding, receiver configuration and runtime keychain
  provisioning require a later authorized pass. No live acceptance is claimed.
- Early-defeat or abandoned worlds that have not completed seven nights are
  retained, not confiscated. They can consume the bounded active capacity; an
  explicit abandonment policy is still needed before broad public operation.
- Pending financial outcomes or a known rejected provisioning job require operator
  reconciliation; no blind retry/reset automation is provided.
- Session history has an authenticated API; a visual history selector is deferred.
- Public HTTPS, OS ACLs, backups, monitoring and stronger anti-abuse controls remain
  operational prerequisites. Shared actor/session custody remains a trusted-server
  model. Pool and gas replenishment are finite operating requirements.

Files changed in this pass: `contract/src/lib.rs`, new `contract/src/lifecycle.rs`,
`contract/src/campaigns_tests.rs`; `scripts/sandbox/scenario.mjs`;
`scripts/testnet/{signing,scenario,store,server,start,register}.mjs`, new
`scripts/testnet/lifecycle.mjs`; `tests/sandbox/multi-campaign.test.mjs`, new
`tests/sandbox/lifecycle.test.mjs`, new `tests/backend-lifecycle.test.mjs`; this
report, README, requirements, progress and new Pass 4C.2 evidence. No artwork,
gameplay narrative, NPC policy, Rust authority algorithm, existing save or Git
history was replaced. Stop before Testnet deployment or upgrade.
