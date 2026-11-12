# Pass 1 — Gameplay and authority foundation

## Initial audit (2026-11-08)

- Only root `AGENTS.md` applies; no additional `AGENTS.md` or `agents.mg` found.
- `src/game.ts` defined and modified all four local resources. Feeding/rest
  produced Blood; dawn consumed it. Trade/hosting drew Coin from a finite pool;
  research, concealment and lobbying spent Coin. Research/hosting repeatedly
  produced Influence; lobbying spent it. Exposure rose with feeding/hosting/work,
  fell with research/rest/concealment/dawn, and could cause defeat.
- `spendAction` enforced three actions in the engine; the server serialized
  commands and checked campaign ID/revision. Failed local validation mutated a
  clone only; failed contract transactions restored resources/action count.
- Farming root cause: research/hosting had no completion flags or finite
  opportunities. Repeated production bought three seats through `lobby`.
- The old local conclusion required three seats and three Coin after seven dawns;
  neither those seats nor any game resource was on-chain voting authority.
- `get_world` / `has_access` computed actual access from ownership, accepted live
  leases, or live grant chains. `enter_room` authenticated predecessor and nonce.
  The runner checked permission through an actual transaction before room effects.
- `grant_access` enforced ownership/valid delegable parent, scope, depth, expiry
  and cycles. `revoke_grant` required the original grantor; upstream revocation
  invalidated descendants. Ancestry alone conferred no right.
- `offer_lease`, `accept_lease`, `reject_lease`, `cancel_lease`, `claim_rent` and
  private `rent_paid` already enforced the native NEAR agreement. Lease access
  expired when contract night reached its end; `advance_night` required keeper
  plus expected night. No property-transfer or political-voting API exists.
- Relationships were bounded signed local values with small NPC memories;
  they were distinct from spendable resources but did not gate seat purchasing.
- Baseline: production build, seven Node tests and nine Rust tests passed. The
  preceding seven-night/restart and gameplay/reset Sandbox regressions also passed.
  Authority/economy baseline: all nine plus twelve scenarios passed (23 Node
  entries including parent tests), zero failures/skips.

## Scope

Pass 1 supersedes the unfinished M3A resource/council design. It must not claim
Pass 2 AI agents or Pass 3 voting. Historic M1B/M2/M3 evidence remains historical;
current implementation and verification are recorded below.

## Implemented foundation

- Removed all fictional Coin/treasury mechanics, spendable Influence, repeatable
  hosting/research rewards, lobbying and resource-based political victory.
- Retained seven nights, three major actions, Blood 0–12, transitional Exposure
  0–10, existing lease/payment/delegation/revocation, signed relationships and
  temporary legacy seat data. Seat count is historical, not usable voting power.
- Blood funds survival/exertion, never authority. Feed: +4 Blood/+2 Exposure;
  Crypt rest: +2 Blood/−1 Exposure with current access; lie low: −1 Blood/−3
  Exposure. Dawn drains 1 Blood with Crypt access, otherwise 3, and eases Exposure
  by 1. Blood 0 or Exposure 10 defeats; surviving dawn seven gives a labeled
  development conclusion, not a final political win.
- Library IDs: `investigate_title` (1 Blood), `investigate_bloodline` (2 Blood),
  `investigate_expiry` (1 Blood, unlocks on accepted lease). Lounge IDs:
  `learn_seraphine`, then `discuss_exchange` (zero Blood). Each costs one major
  action, records a persisted discovery once and becomes exhausted. The exchange
  is only a future negotiation opportunity; no agreement/right/support/vote exists.
- Navigation, character/authority inspection and chronicle reading are free.
  Narrative actions query current `has_access`; they do not sign transactions.
  Actual lease acceptance/refusal still signs as the disposable player. Existing
  scripted Vesper/Seraphine consequences resolve at dawn under their restricted
  accounts. Lucien has no new autonomous action; broader NPC economy was removed.

## Authority and action interface

`availableActions` returns typed costs, property requirements, availability and
all missing conditions. `validateAction` rejects invalid proposals; `playerAction`
validates before modifying a clone. The runner reads fresh contract state and
rechecks room permission immediately before committing local effects. UI disables
unavailable choices and displays those same reasons. UI bypasses are revalidated.

`inspectRights` identifies property owner, effective access, grantor/holder,
scope, parent, expiry, revocation, delegation sources and revocation authority.
The only contract change adds `grant_validity` to `get_world`, using existing
recursive `valid` logic in the same view. No new mutation rule, state layout or
contract. Delegation sources remain subject to target/scope/expiry/depth/capacity
and nonce checks by the actual `grant_access` transaction. Ancestry, access,
ownership and leases are distinct; political support/voting are explicitly absent.

Future selectors can consume read-only action/authority snapshots and return
`GameProposal` or validated `NpcProposal`. They never receive keys or clients.
Identity is fixed by the server. There are no model calls, agent wallets or new
agent identities. NPC bootstrap full-access keys are replaced by restricted
receiver/method keys with finite gas allowance. A future grant/negotiation policy
needs an explicit method/key review; present NPC keys cannot sign arbitrary actions.

## Persistence and replay

The existing runner persists a local Sandbox database, account keystore and atomic
JSON saves under ignored `.local/night-play`. A single-writer lock and serialized
requests enforce campaign ID/revision. The dawn journal records each scripted
step and expected contract night; a lost response after committed advancement
recovers without duplicate upkeep or another night. Failed contract actions
restore Blood/action counts; stale requests cannot execute twice.

Version-2 local migration strips legacy currency and obsolete political endings
while preserving chain identity, nights, Blood/Exposure and historical seats.
It does not replay player decisions or reconstruct rights. Compatible local view
upgrades deploy only when the actual WASM differs; stored contract state is unchanged.
New Game replaces only this runner's owned disposable session; test evidence and
other Sandbox accounts remain untouched. Multiple browser tabs share one session.

## Verification and reproduction

Use README setup, then `npm test`, `npm run build`,
`cargo test --lib --locked`, `npm run contract:wasm`.
On Linux/WSL with Node 24: `npm run test:sandbox`.
Focused test: `node --test tests/sandbox/campaign.test.mjs`.

- PASS: 12 Node tests (11 foundation cases plus native bridge), nine Rust tests,
  native bridge binary build, TypeScript/Vite production build, Rust formatting,
  optimized WASM build.
- PASS: full Sandbox suite, 25 Node test entries, zero failures/skips: nine M1B
  authority scenarios, twelve economy scenarios, seven-night foundation and
  gameplay/reset regressions. Actual rebuilt WASM executed in Sandbox 2.14.0.
- Foundation regression tests actual underpayment with no local action/resource
  loss, stale commands, restricted NPC keys, free navigation without transactions,
  revocation after inspection, immediate permission recheck, lease expiry,
  five finite discoveries, saved-chain restart, injected lost dawn response,
  seven advances, unchanged legacy seat count and development conclusion.
- Simulation tests cover zero/exact/insufficient costs, multiple requirements,
  atomic failure, invalid/prototype/spoofed proposals, no early victory, scarcity,
  exhausted/unlocked opportunities, both seven-night branches and old-save migration.

[Foundation receipts/state](evidence/pass1-sandbox.json),
[reset regression](evidence/pass1-reset.json), and the latest
[authority](evidence/m1b-sandbox.json)/[economy](evidence/m2-sandbox.json) evidence
contain actual outcomes. Historical M2/M3 numbers refer to their earlier artifacts.
Current WASM: 196057 bytes, SHA-256
`2fffcca3a734bb142313c9fb49248ea4da642c351fc22da03f87383f2de3f08f`.

The foundation evidence contains 15 FINAL transactions. Acceptance used
2.007 Tgas, authorized revocation 1.998 Tgas, settlement 4.718 Tgas, and each
night advance approximately 1.902 Tgas. Rejected underpayment used 2.051 Tgas;
it did not consume a major action or Blood. No storage failure was observed.
The final mixed-property grant/validity mapping assertion also passed in a
focused Library regression, followed by a successful production rebuild.

## Limits and Pass 2 dependencies

Game resources, discoveries, relationships and conclusions are trusted local
simulation, not on-chain mechanics. Permission checks/payments/revocations/expiry
are Sandbox-backed. There are no property-transfer, political-support or voting
contract methods. New negotiated rights must use existing grants/leases within
their actual scope or await an explicitly designed contract extension.
Public wallet signing, model-provider integration, support/voting design, final
council rules, hostile-RPC handling and production custody are not implemented.
Exposure remains transitional. Failed payout callback/gas-exhaustion risks from
M2 remain; no production security audit is claimed. Pass 2/3 were not started.

## Browser verification and changed files

Actual browser playthrough (2026-11-08), using the live local Sandbox runner:
- Fresh offer, zero rent escrow, three actions; free Library navigation preserved the action count and wallet balance.
- Explicit player acceptance paid rent; five finite opportunities were completed, exhausted controls disabled, and a prerequisite unlocked the exchange opportunity.
- Separate dawn transactions revoked Crypt access and settled rent. Library remained accessible; Lounge access later expired and displayed its reason.
- All seven nights reached CONCLUDED with Blood 9 / Exposure 3. Reload preserved the conclusion and all five discoveries. Screenshot: `evidence/pass1-browser.jpg`.
- A fresh rejection paid no rent and preserved Crypt shelter through the next dawn (Blood 7, three actions); no acceptance-specific retaliation occurred. Reset starts a new unresolved scenario.
- Automated Sandbox tests additionally cover failed payment, stale requests, immediate permission changes, process restart and lost transaction responses. These are not claimed as manually injected browser tests. Full mobile/accessibility and public-wallet testing were not run.

Source changes: `src/game.ts`, `src/chain.ts`, `src/main.tsx`,
`contract/src/lib.rs`, `contract/src/tests.rs`, `scripts/bridge.mjs`,
`scripts/sandbox/{scenario,campaign,persistence,play}.mjs`, `vite.config.mjs`.
Tests: `tests/game.test.mjs`, `tests/sandbox/{campaign,gameplay}.test.mjs`.
Documentation: root AGENTS, requirements, README and PROGRESS; architecture,
threat model, this report, targeted M1B/M2 regression notes and actual evidence.
No new dependency, artwork, public deployment, AI integration or final voting.

Pass 2A follow-up: see `PASS2A.md` for the replacement deterministic NPC boundary,
structured history and current verification. Pass 1 gameplay/contract rules remain.
