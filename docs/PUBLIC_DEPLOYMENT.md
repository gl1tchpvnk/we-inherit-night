# Public Render deployment — in progress

**Stuck provisioning recovery PASS:** commit `5b5ef54` is deployed and one fresh
public New Game created a real, independently FINAL-verified Testnet campaign.
Complete seven-night public gameplay remains unverified. Historical checkpoints
below explain the resolved blockers; see the final recovery result at the end.

Public gameplay is **NOT YET VERIFIED**. GitHub preparation and security review
precede the user-controlled Render payment and runtime-secret handoff.

## Pre-push security review

- Expanded `.gitignore` for encrypted DPAPI/age/GPG bundles, runtime credential
  exports, local deployment configurations, SQLite variants/sidecars and signed
  recovery payloads. Safe `.env.example`, public `NIGHT_CONFIG_JSON`, runtime-key
  documentation and public transaction receipts remain eligible for Git.
- Scanned candidate working files, the Git index, and Git objects reachable from
  all refs and reflogs, including commit messages. Fetched origin before final
  staging; local main and origin/main initially matched.
- Searched for PEM/OpenSSH private material, NEAR secrets, GitHub/provider/AWS/
  Render tokens, credential assignments and credential-bearing URLs. Checked
  tracked paths independently of ignore rules; no tracked ignored credential or
  database file was found.
- Long `ed25519:` values in public receipts/CLI evidence were classified as
  signatures only after confirming the signature field and checking that their
  seed/public-key halves do not form a valid Ed25519 secret key. Known unit-test
  placeholders and the documented private-key placeholder were reviewed.
- No real secret was identified. No history rewrite, deletion or credential
  rotation was performed. Scanner output contains filenames/categories/counts,
  never secret values. No automated scan is a mathematical guarantee of absence.
- Administrative keys remain in the OS keychain. The restricted runtime vault
  remains DPAPI-encrypted outside Git. `NIGHT_RUNTIME_KEYS` identifiers in code
  and documentation are expected; live credential values are not included.

Audit and build evidence is recorded under `evidence/public-deployment/`.

Local preflight PASS: walletless production TypeScript/Vite build on Windows,
the exact install/build commands in a fresh Linux Node 24 directory, and Linux
production startup with SQLite WAL, health response and static frontend. No live
credentials or chain calls were used for that smoke check. Frontend import audit
found no server signing/private-environment/provider code in emitted assets.
Dependency audit reports 13 low-severity transitive findings stemming from the
existing elliptic advisory; no moderate/high/critical findings. No automatic
dependency changes were made. Existing 141 Node, 24 Rust and five focused Sandbox
results are reused; the unchanged broad suites were not repeated. Raw historical
CLI evidence retains its original whitespace; it was not reformatted.

## Deployment configuration

Use repository `gl1tchpvnk/we-inherit-night`, branch `main`, Blueprint `render.yaml`:
one native Node 24 Starter Web Service, one instance, 1 GB persistent disk mounted
at `/var/data`; SQLite and its recovery/lock files use `/var/data/night`.

Build: `npm ci --include=dev --ignore-scripts && npm run build`

Start: `node --max-old-space-size=256 scripts/testnet/start.mjs`

Health endpoint: `/healthz`. Render supplies PORT, external HTTPS URL and restart
supervision. Automatic deploys remain off. Current Testnet contract capacity is
5; finite pool, gas allowances and storage controls remain enforced.

The user must explicitly approve paid service creation and runtime-secret upload.
Use public `evidence/runtime-keys/NIGHT_CONFIG_JSON.json` for NIGHT_CONFIG_JSON.
For NIGHT_RUNTIME_KEYS, follow `docs/RUNTIME_KEYS.md`: run the existing local
clipboard helper, paste only into Render's protected environment configuration,
clear the clipboard, hide secret values and return to Events before agent review.
Do not paste secrets into chat or use administrative keys on Render.

## Acceptance still required

Hosted checkpoint (2026-11-13): the user approved the Starter/1 GB disk cost,
entered restricted runtime secrets manually, and deployed commit
`291ac80556d74017e596db050b70cb933f4e14b7`. Render deployment
`dep-dbrao3d6e07s73b3f4ig` reports Live. The production build, Node 24.13.0
startup and public HTTPS `/healthz` (200, `{"ok":true}`) passed at
https://we-inherit-night.onrender.com. Successful guarded startup also confirms
the required disk mount and restricted roster checks passed.

PARTIAL: first walletless creation failed before inclusion. The durable journal
retains `open_campaign` transaction
`9Dc5Gtrux5zwbAYZ56bdotq8kv4Rk7579SZwu2VykXLg` in broadcast phase.
Rebroadcasting the identical bytes with inclusion checking returned
`InvalidTxError.NotEnoughBalance`: provisioner balance
0.0499579391840732 NEAR versus required upfront cost 0.0509193907729125 NEAR,
a 0.0009614515888393 NEAR shortfall before storage/headroom. Its restricted
allowance is also only 0.05 NEAR. Contract capacity remains 5 and funded registry
state was unchanged. No replacement transaction, key change or funding transfer
was made. Funding/allowance remediation and durable recovery must precede
further gameplay acceptance; the service is not yet verified playable.

Funding follow-up: [all eleven runtime accounts are now gas-funded and verified](RUNTIME_GAS_FUNDING.md).
The existing pending provisioning journal still requires safe reconciliation;
this funding-only pass did not resume gameplay or modify Render configuration.

Read-only reconciliation follow-up: both Testnet providers confirm the original
provisioning hash is unknown, the contract's entire storage is unchanged from
before the attempt, and its only storage key is `STATE`. There are no campaigns,
replay tombstones, liabilities or allocated campaign treasuries; pool remains
1.15 NEAR and all five capacity slots are free. Render SQLite contains zero
campaigns/sessions/states/archives and one transaction in `broadcast`, with its
provision job still `pending`. The signed nonce is 277462237000001; current
restricted-key nonce is 277474089000000. It was rejected before inclusion for
insufficient balance, has not expired by block age, and is now permanently
nonce-invalid. It never executed; UNKNOWN_TRANSACTION alone was not treated as
proof. No cleanup transactions are necessary.

**STOPPED — not ready for New Game:** existing `scenario.reconcile()` has no
terminal transition for this independently proven non-executed, obsolete-nonce
case; `ensureCapacity()` therefore keeps the pending job. Safe resolution needs
an evidence-preserving terminal journal/job transition under exclusive runtime
ownership, rather than deletion or blind resubmission. No application change,
database mutation, replacement signing, deployment or funding was performed.
The unchanged record SHA-256 and full independent chain checks are retained in
`evidence/provisioning-reconciliation/read-only-verification.json`.

Recovery correction prepared: provisioning-only recovery verifies the exact
signed payload/hash, checks UNKNOWN_TRANSACTION on two independent providers,
then pins finalized access-key and storage queries to each provider's block.
Both must show a strictly newer nonce and no world or permanent lifecycle
tombstone. Payments and other uncertain transactions retain existing recovery.
The running service's exclusive writer and provisioning queue own one atomic
SQLite transition, rechecking the old record/job and retaining payload, hash,
prior job and full proof while marking it rejected. Fresh creation uses a new
campaign ID and current nonce. No manual database edits or discarded evidence.
Local verification: one focused regression plus existing affected backend tests,
47/47 PASS; production Testnet frontend build PASS. Initial sandbox HTTP checks
were denied by local network permissions; rerun outside the sandbox passed.
Hosted verification of this correction remains pending deployment.

On this Windows installation, the existing clipboard helper and encrypted vault
resolve outside the app sandbox under
`C:\Users\gauge\AppData\Local\Packages\OpenAI.Codex_2p2nqsd0c76g0\LocalCache\Local\WeInheritNight\Render-night-testnet\`.
Use that actual helper location from ordinary Windows PowerShell; do not move or
regenerate the credentials to compensate for the app's redirected filesystem.

Verified public HTTPS/startup, actual mounted-disk persistence and restart,
isolated walletless sessions, real prepaid payments and NPC transactions,
save/resume, seven-night completion, financial settlement/archive/reclaim/replay,
and observed hosted memory/funding. Local tests and funding verification do not
substitute for this hosted acceptance. No repeated broad regression suite is
required unless a deployment defect changes shared code.

## Hosted provisioning recovery — PASS

- Deployed `5b5ef54c17557f3f81243c357d407df35c3335e2` to existing service;
  successful Render deployment `dep-dbrb9drtqb8s73e2cb70`. One initial build stalled
  at cloning and was canceled after 5m21s; one cache-cleared retry succeeded in
  36.4s. No service/configuration/disk/credential change.
- Public New Game created `visitor-5457928e-f82e-4e75-b9b9-520324cd6318` and opened
  the first encounter, A BED BEFORE DAWN. No gameplay choice was committed.
- New `open_campaign` transaction
  [FLT7p9ifoVkN9bPE5QRuDgWZzW8NEGfGu7pvsYdHYpjQ](https://testnet.nearblocks.io/txns/FLT7p9ifoVkN9bPE5QRuDgWZzW8NEGfGu7pvsYdHYpjQ)
  was independently FINAL-success with successful receipts on FastNEAR and dRPC.
  Exact restricted public key, receiver, campaign argument, zero deposit, 50-Tgas
  bound and fresh nonce 277474089000001 were verified.
- SQLite now has one campaign/session/state, two transaction records and a done
  provisioning job. The old attempt is rejected with its signed payload retained,
  original record SHA-256 `0292963b6c649220bdd3dd296123e46cdcda9b3225782f9e5a9e115b4e779ffa`,
  previous phase/job and independent finalized proof blocks 277476355/277476356.
  Its nonce 277462237000001 was below 277474089000000; both providers proved
  absence of its world and permanent tombstone before the service marked it terminal.
- New campaign is active/prepaid with 0.04 NEAR treasury; the established 0.01
  passage budget is an outstanding liability. Pool is 1.10 NEAR after allocation.
  This was ordinary authorized provisioning, not a pool configuration/funding change.
- PASS: 47 focused backend checks (one new regression), production build, secret
  scans, hosted health 200, persisted evidence and independent chain verification.
  No broad regression suite, seven-night walkthrough or extra campaign was run.

[Public receipt and runtime evidence](../evidence/provisioning-reconciliation/hosted-success.json)
and [browser confirmation](../evidence/provisioning-reconciliation/public-new-game.png).
Stopped after the requested New Game verification. No recovery blocker remains.
# Quit Campaign — local only

Implemented locally; no deployment or live Testnet transaction was performed for
this change. In the playable Testnet frontend, choose **Main menu → Quit Campaign
→ Confirm Quit Campaign**. Keep playing cancels without submitting Quit. Save and
return to title remains a separate operation that does not abandon the campaign.

The owned-session POST command `quit` requires the current campaign ID/revision,
same-origin JSON, and no pending gameplay transaction. The existing per-campaign
queue and exclusive SQLite writer serialize it. Explicit Quit bypasses only the
inactivity eligibility deadline; existing reconciliation, restricted signing,
financial settlement, archive commitment, reclamation and replay checks remain.
The original outcome is frozen before maintenance clock advances; no NPC turns or
fictional gameplay results are generated. SQLite history is retained.

A durable closure that cannot finish returns a pending status. Gameplay and
duplicate Quit controls are disabled; **Check settlement** resumes the same
lifecycle. After reload, the title exposes Check settlement and blocks New Game
until completion. A confirmed quit returns to title only with a completed closure
and archive commitment. New Game uses the existing revision-checked reset and
session rotation; normal admission quotas still apply.

Local verification: **PASS** — 32 cleanup/entry tests (including interruption at
each settlement stage), 29 affected backend security/startup tests, one real local
NEAR Sandbox integration, and the Testnet-configured production frontend build.
The Sandbox test paid an existing lease, quit at night zero, recovered a lost
finalized reclaim response after SQLite reopen, verified zero liabilities and
active slots, rejected replay/reused identity, then finalized a fresh campaign
under a one-slot capacity. See `tests/sandbox/quit-campaign.test.mjs`.
The local UI fixture verified confirmation/cancel, pending status, single Quit
submission, title transition and fresh New Game; it is not blockchain evidence.
No contract changes, broad suites, credentials, funding, Git commit/push or Render
changes. Hosted Quit acceptance remains **NOT RUN**.

## Quit Campaign — hosted PASS

Deployed application commit `b0f96c07032b808886120abc38d4c4f8900d6c85` in Render
`dep-dbrbtd59fdbs73du1nkg` (46.3 seconds). HTTPS health returned 200 and the public
JS asset matched the verified local build byte-for-byte. No contract, service,
credentials, funding or gameplay configuration changed. The proposed pacing,
ending and title notice changes are excluded.

Live test campaign: `visitor-45473548-25f8-4b10-8f42-fb51eebe8571`.
- Opened a fresh campaign, filed the Library claim and accepted the existing
  0.02 Testnet NEAR prepaid sanctuary. Normal NPC gameplay settled rent once.
- Opened Quit confirmation, cancelled without abandonment, then explicitly
  confirmed. Gameplay/duplicate controls were disabled during closure. Returned
  to title only after reclamation; Continue remained disabled after reload.
- FastNEAR and dRPC independently verified 17 unique transactions FINAL-success,
  exact restricted signing identities, receiver/method/campaign and zero deposit;
  no failed receipts. Exactly one rent claim, passage refund, complete, archive
  and reclaim. Reload/New Game did not change the old transaction inventory.
- Before confirmed Quit: active 1, world bytes 2033, total contract storage 587182,
  treasury 0.02 and remaining passage liability 0.01 Testnet NEAR. After Quit:
  active 0, world bytes 0, total storage 585120, treasury/liabilities zero; 0.02
  unspent treasury returned to pool (1.09). Replay tombstone remains intentionally.
- Archive commitment `587d1e249a497fb6633803037202c7ddf11d2e5c0698d199e6a1cfa57d3d8bd2`
  matched both the stored serialized archive SHA-256 and finalized chain state.
  SQLite preserved actual Night 3 (index 2) playing outcome separately from the
  settlement clock, the earlier completed campaign, transaction evidence and two
  session-history entries. Neither provider can retrieve the reclaimed world.
- Reclaim: `8GLziUSt7TtbQZRrkNrKJSicvySwBBtyVVxepH1dAvhF`.
- Fresh New Game: `visitor-f4b04392-d292-4f9b-8c2b-f9c1d56199ad`, creation
  `3FgkhAMJFUQxfqZ7gwFc35T3ZNF7WQHTeHxQ9EGMGhqG`, independently FINAL-success.
  Left at the first encounter without gameplay choices. Active 1/5, four slots
  free; pool 1.04, new treasury 0.04 and new passage liability 0.01 Testnet NEAR.
  These new obligations belong only to the fresh campaign, not the quit campaign.

**Quit Campaign is ready on the public Testnet service.** No live acceptance
failure or unresolved blocker. Existing 61 focused tests, local Sandbox and build
results were reused; no broad regression suite. Pre-push history/index/worktree
secret scans passed. The existing ignore rules already cover credential bundles,
local configuration, SQLite, journals and private keys. No secrets were exported.
Public-safe evidence: `evidence/quit-campaign/` (dual-provider snapshots/receipts,
archive and final SQLite summary, deployed asset digest, and fresh-game screenshot).

## Opening/V2 release — public acceptance PASS, 2026-11-13

User-triggered manual deployment now serves the verified V2/opening implementation
(`1a818df`, plus documentation `1020406`); public JS matches the Testnet production
build byte-for-byte. No service configuration, credential, contract or funding
change. Approved prologue V2 remains; V3 is unimplemented and excluded.

A real public walletless browser campaign completed all seven nights, paid
sanctuary, investigator publication/withdrawal, a final counter, personal reply,
factual Unbound ending, reload and replay. Startup was 5.10 s; prologue 0.20 s.
All 21 recorded transactions independently verified FINAL-success; replay creation
also FINAL-success. Both completed and deliberately quit replay campaigns are
independently verified reclaimed with matching archive commitments.

[Detailed release/acceptance report](OPENING_CORRECTION_RELEASE.md) and
[public-safe evidence](../evidence/opening-correction/public/). No active test
campaign remains. This supersedes older public-gameplay-unverified checkpoints
for the exercised route; hosted capacity/load and every alternative route are not
claimed verified.
