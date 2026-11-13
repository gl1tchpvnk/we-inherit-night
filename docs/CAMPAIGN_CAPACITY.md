# Campaign capacity fix — local verification

Operational follow-up: the verified artifact is now upgraded on Testnet and
subsequent funding supports capacity **5**; see [current funding](TESTNET_FUNDING.md).
The original code-upgrade operation initially selected capacity 1. See
[finalized upgrade, capacity rationale and exact shortfalls](CAPACITY_TESTNET_UPGRADE.md).
The remainder records the preceding local-only preparation pass.

IMPLEMENTED locally; not deployed. No Testnet transaction, upgrade, account/key
creation, or paid service operation was performed in this pass.

## Contract and compatibility

`set_campaign_capacity({"max_active": N})` is private, contract-account-only,
and accepts a positive u32. It updates the existing `Provisioning.max_active`
field. `campaign_capacity({})` reads it. Lowering capacity below the number of
active worlds blocks new admission without deleting or changing any world.
Provisioning must already be configured. The setter does not alter the immutable
roster, creation interval, budgets, pool, liabilities, storage backing checks,
per-world bounds, or 32 MiB total storage ceiling. Runtime keys and public API
do not gain this operator method. Larger capacity is permission to admit, not
additional funding or a guarantee of server throughput.

The replacement preserves serialized Authority, Provisioning and World layouts,
storage prefixes, lifecycle metadata, callbacks and financial accounting.
Local Sandbox deployed the exact existing Testnet WASM, populated two independent
prepaid worlds with accepted leases and passage budgets, then deployed only the
replacement code. All storage records and world views remained byte-for-byte
identical. Both worlds subsequently settled and reclaimed with existing restricted
methods. A second fixture imported the exact public Testnet state from read-only
RPC, upgraded code, read capacity 4, changed it to 12 and restored 4; storage was
again identical. The captured live registry had no campaign world records, so
the populated old-WASM fixtures additionally exercise outstanding finances.

Evidence: `docs/evidence/capacity-deployed-state.json` and
`docs/evidence/capacity-upgrade.json`.

- Original deployed SHA-256: `99f0deeac2fc7e95080d92656b87c0a1515311201d065c8588eacc25b35e05f0`
- Verified replacement SHA-256: `a11d407105d4b09d17eb91642ff415040e37f0ede05355fb626d0774110df250`
- Artifact: `target/near/night_authority/night_authority.wasm`.

The artifact grows from 579,736 to 583,921 bytes. At the captured balance and
storage price, the estimated additional code stake leaves about 0.0988 test NEAR
of free backing after the 0.15 NEAR provisioning pool, before upgrade fees.
This is a snapshot estimate; the operator must recheck current backing before
the separately authorized upgrade.

Conclusion: this artifact is compatible with an in-place code upgrade of the
existing registry; no migration or reinitialization is required. A separately
authorized operator must deploy to the same account, **never call new_registry
or configure_provisioning again**, and separately call set_campaign_capacity.
Keep administrative credentials off Render. Before that operation, verify the
code/state has not changed since this evidence, retain a public-state backup,
and quiesce service transactions. No upgrade has been executed here.

## Resumable cleanup

SQLite records last gameplay-request activity, cleanup intent and frozen original
snapshot. Default abandonment is 24 hours; early defeat is immediately eligible.
Existing database rows get a full grace period on the first upgraded startup;
new allocation resets activity. Read-only title metadata does not refresh it.
The entry screen discloses the deadline. Closed games show a closure notice and
disable gameplay controls without changing their original status or ending.

One timer in the existing process checks one eligible campaign per minute.
It shares the HTTP per-campaign queue, rechecks activity after waiting, and
fairly retries unfinished records. Already-admitted gameplay recovery finishes
before freezing. Unknown transaction outcomes, pending gameplay or callbacks
block progress; they are never discarded to release capacity.

Cleanup advances only the contract's existing keeper clock to night seven;
it does not run additional player/NPC turns or calculate a fictional ending.
Existing owners claim accepted rent; the actual passage beneficiary receives
unused budget refunds. Remaining prepaid player treasury returns to the pool
through complete_campaign. Paid leases keep their full contract-night terms:
settlement_dawn reaches their expiry before archive_campaign/reclaim_campaign.
Original gameplay and later settlement evidence are stored separately in the
committed SQLite archive. Existing transaction journaling/finality and replay
tombstones remain authoritative; campaign IDs are never reused. Lost responses
resume from verified chain state without duplicate payments.

These are campaign-night leases, not wall-clock tenancies. Abandoned campaigns
are permanently closed after the disclosed deadline. Cleanup uses the already
installed keeper/owner/beneficiary method restrictions; no new credentials.
Finite storage, gas allowances and economic pool funding still bound service
operation. Pending obligations may legitimately keep a slot occupied.

## Configuration

Add these optional objects to existing `NIGHT_CONFIG_JSON`; omission retains
the shown defaults. They contain no secrets:

```json
{
  "creation": {"perMinute": 4, "perDay": 24, "cooldownMs": 60000},
  "cleanup": {"inactivityMs": 86400000, "intervalMs": 60000}
}
```

Allowed integer ranges: perMinute 1–120, perDay 1–10000, cooldownMs
1000–86400000, inactivityMs 3600000–2592000000, intervalMs 10000–3600000.
Zero/unsafe values fail startup. Durable global fixed-window quotas remain;
HTTP limits (120 requests/minute globally, 30 per campaign) and eight in-flight
requests remain unchanged. Contract creation-block interval, capacity and funding
checks still apply. A finalized rejected provisioning attempt permits a fresh ID
after cooldown; uncertain submissions always retain their original identity.

## Reproduction and results

- PASS: 24 Rust tests, including operator authority, positive capacity, lowering
  below active count, unchanged finances/worlds and exact root-byte restoration.
  Windows environment: `AWS_LC_SYS_PREBUILT_NASM=1`; `cargo test --lib`.
- PASS: 141 Node regression tests (`npm test`), including 18 new focused tests
  covering interruption at every cleanup stage, both termination reasons,
  financial integrity, pending outcomes, queue/activity races, replay, configurable
  admission and revision-checked replacement.
- PASS: `npm run build` (TypeScript and production Vite build).
- WASM built with `RUSTFLAGS="--cfg near"` and `cargo build --target wasm32-unknown-unknown --release
  --manifest-path contract/Cargo.toml --locked`, copied from
  `target/wasm32-unknown-unknown/release/night_authority.wasm` to the artifact path.
  The cargo-near wrapper was blocked by a local near-cli configuration migration;
  direct Cargo avoided changing operator configuration. The initial direct build
  omitted `--cfg near`; the existing lifecycle test caught generic panic traps.
  The corrected artifact restores NEAR panic diagnostics without weakening tests.
  Initial native Rust
  builds lacked NASM/CMake; bundled prebuilt NASM objects resolved that locally.
- PASS: 5 Sandbox tests: exact upgrade, early reclamation, existing financial
  lifecycle/storage bounds, campaign isolation/replay, play runner and two complete
  independent seven-night games. Command (Linux Node 24): `node --test --test-concurrency=1
  tests/sandbox/capacity-upgrade.test.mjs tests/sandbox/lifecycle.test.mjs
  tests/sandbox/multi-campaign.test.mjs tests/sandbox/gameplay.test.mjs`.
  The upgrade test requires the public old WASM at `.local/capacity-deployed.wasm`
  and verifies its hash before use. Obtain it using read-only RPC view_code and
  base64-decode code_base64; do not use any signing credential.

Higher-concurrency hosted memory/performance and public gameplay remain unverified.
Pass 4E's existing four-campaign memory measurement is not a larger-capacity
benchmark. No deployment, commit or push was performed.
