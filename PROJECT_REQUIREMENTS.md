# WE INHERIT NIGHT — Project Requirements

Version: 0.7 / 2026-11-12 | Target: NEAR HACKATHON, 2026-11-14 | Status: **Pass 2D Living Court presentation implemented locally; deterministic agents; public deployment and council unimplemented**

> **Everyone wants immortality. Nobody wants to answer to their sire forever.**

> Deployment update: Pass 4D is PARTIAL. Sustainable Testnet code and provisioning are verified on the new night account; live walletless runtime remains blocked on isolated credentials. See [Pass 4D](docs/PASS4D.md). No public launch is claimed.

## 1. Product brief
- **Title:** We Inherit Night. Previous working titles BLOODLINE / BLOODRIGHT are retired; *bloodline* remains the name of an in-world ancestry and authority mechanic.
- **Genre:** gothic social simulation / political dynasty strategy with autonomous non-player characters (NPCs).
- **Platform:** browser, desktop and mobile-friendly, keyboard-accessible.
- **Primary hackathon track:** Games With Real Economies (`games`). Potential secondary tracks only if the shipped build demonstrates them: Agent Economy (`agents`), AI Security & Defense (`security`), or NFTs That Do Something (`nfts`). Don't select tracks merely because they sound plausible.
- **Player fantasy:** rise from dependent fledgling to independent ruler by exploiting trade, property, alliances and revocable/irrevocable privileges.
- **Core differentiator:** actual, inspectable NEAR authority and economic consequences change the castle the player can explore.
- **Positioning:** not the first vampire game, the first AI vampire, or an invented general-purpose delegation primitive. Novelty claims require competitive evidence.

## 2. Non-negotiable product test
**If the smart contract rejects an action, the game must not behave as though it happened.** A player should see: an NPC offers rights; acceptance changes a valid on-chain record; a rival revokes a *derived* privilege within its authority; the contract rejects subsequent unauthorized use; separately owned rights remain; the castle and political choices update from the authoritative state.

The same loop must be interesting **without** a blockchain explorer on screen. Evaluate political stakes and available countermoves, not simply whether transactions executed.

## Pass 2C current requirements (supersede earlier provisional gameplay)

New games: one major action per night, automatic journaled reckoning and seven
nights; free exploration/inspection/conversation. Explicit Pass remains available.
Eight autonomous deterministic NPCs, zero live model calls. Preserve the adapter
for legacy tests; do not enable it in MVP gameplay. New PROVISIONAL authority roots
and minor NPCs are documented in `docs/PASS2C.md` and `VAMPIRE_AGENTS.md`.

Exact rights-based outcomes: Unbound (Library title plus active non-revocable
sanctuary lease), Favoured (effective institutional protection), Failure (resource
collapse, no shelter after the ultimatum, or no qualifying position at Night 7).
Temporary sanctuary never means ownership. No final council voting. Pass 2D adds static illustrated encounters without changing these mechanics.
Older saves retain legacy rules; new rights require an explicit fresh bootstrap.

## 3. Core gameplay: Night → Dawn
1. **Nightfall:** display Blood, rights and finite opportunities. Show actual NEAR funds/deposits separately.
2. **Choose action:** feed, negotiate/counteroffer, invest/lease, explore, delegate or conspire. Limit per night to force trade-offs.
3. **The Court acts:** Vesper, Lucien, Seraphine choose and pursue distinct goals, also interacting with each other.
4. **Resolve:** schema-validate actions; authenticate accounts; apply deterministic rules; submit on-chain economic/authority changes in consistent order; only acknowledge finalized successful actions.
5. **Dawn:** deterministic upkeep and rights-based consequences; council votes remain planned; open/close rooms and change political positions based on current rights.

**Historical Pass 1 campaign:** seven nights, three major actions per night (provisional). Blood exhaustion or Exposure 10 causes defeat; surviving Night 7 gives a temporary development conclusion. Resource-purchased three-seat victory is deprecated. **Pass 3 target (PLANNED):** eight identifiable seats and five valid supporting votes at Night 7. Final voting is not implemented.

## 4. World / interfaces

| Room | Player-visible value | Consequential right |
|---|---|---|
| **Ancestral Crypt** | shelter, low upkeep | valid property owner or scoped resting/access grant |
| **Forbidden Library** | finite title, lineage and lease-deadline investigations | contract-verified access; discoveries grant no authority |
| **Crimson Lounge** | finite character interests and a future access-exchange opportunity | expiring commercial entry lease; no income or automatic political support |
| **Hunting Grounds** | feeding versus political action | location use rights; nightly action cost |
| **Council Chamber** | debates, votes, succession | voting authority, seat ownership or explicit delegation |

Primary UI: **Castle Map** (rooms, characters, context actions), **Bloodline Tree** (siring, power relationships, derived vs independent privileges), **The Court** (typed proposals, negotiation, event outcomes, audit trail). No platformer in the MVP. Ghosts and additional cities are later concepts.

### Character seeds
- **Lady Vesper:** calculating traditionalist. Starts controlling Crypt and court advantages. Goal: preserve ruling dynasty; may legitimately revoke grants she issued.
- **Seraphine:** pragmatic rebel. Controls a commercial opportunity; seeks independence and deals with the player.
- **Lucien:** opportunistic diplomat. Seeks authority through inheritance, vote trading and strategic deals.
- **Player:** newly awakened vampire, starts dependent on Vesper, can win independent title and political backing.

## 5. Economic resources
- **Blood (retained):** local survival/exertion resource, 0–12. Feeding/rest restore it; investigations, lying low and dawn consume it. Never purchases political power.
- **Coin (removed):** no fictional currency, production, costs or replacement token. Existing native NEAR leases remain the economic commitment.
- **Influence (removed):** no spendable universal political stat or farming. Information, signed relationships and explicit contract rights remain distinct.
- **Exposure (retired):** removed from active gameplay by the approved refinement. Historical save values and completed outcomes remain intact; no replacement penalty.

No custom tradable token is required for v0.1. NFTs/NEP-171 and multi-tokens/NEP-245 are **optional** integrations only if they add real game value and can be finished. NEAR Intents are **not** required for on-NEAR property and lease contracts.

**M2 decision (supersedes the earlier demo-credit plan):** use native NEAR only in
disposable local Sandbox. Player starts with 0.25 Sandbox NEAR; Lounge rent is
0.02 NEAR for three nights. Exact prepaid rent vests on acceptance and is held in
contract escrow until the lessor claims it. Failed transfers restore claimability;
accepted leases cannot be cancelled. No income, custom token, or redeemable game
resource is implemented. See `docs/M2_ECONOMY.md` for rules and receipt evidence.

**M2 usability correction:** initialization leaves the offer unresolved. Explicit
player acceptance signs with a disclosed disposable local player account, confirms
payment, then existing scripted Vesper/Seraphine consequences resolve at dawn. Room scenes
use fresh contract permission reads without narrative transactions; New Game resets only the disposable play session.
Public testnet wallet signing remains unimplemented; no browser private keys.

### Lease MVP (after permission vertical slice)
- Property owner creates offer with property, buyer/lessee eligibility, price, duration in nights, revenue share (optional), and expiry.
- Authorized account accepts once. Validate ownership/availability/price/expiration atomically on-chain. Consume/lock agreed economic value and grant lease-backed scoped rights.
- Duplicate accept, wrong buyer, expired/revoked authorization, insufficient funds and unauthorized property sale must fail without a partial transfer.
- On-chain audit log includes real account IDs and transaction references when available; client reconciles final outcome before unlocking assets.
- For any native NEAR deposit/withdrawal design: use appropriate attached-deposit checks, safe refunds or withdrawal semantics, adequate storage accounting and cross-contract promise failure handling. **Do not deploy custody of mainnet funds.**

## 6. Authority / inheritance rules (highest priority)
**Genealogy is history, not authorization.** Never derive room entry, payment or ownership from a family edge alone.

- `Property`: unique ID, owner account ID, relevant access scopes, transfer/succession policy.
- `Vampire`: NEAR account ID or explicitly linked game ID, sire link, public traits. No private player data on-chain.
- `Grant`: unique ID; scope + property, grantor, grantee, optional parent grant, delegation flag, deadline in game nights, revoked status, provenance.
- Ownership is a **root of authority**, not a revocable descendant grant. Direct rights from a property owner and rights delegated downstream must remain distinguishable.
- To delegate, caller must be property owner or hold a currently valid delegable parent right; scope must not expand, expiration cannot outlive parent, and maximum depth should be bounded (e.g. 4).
- Revocation propagates **effective invalidity** down descendant grants but does not delete permanent ancestry and cannot seize separately owned property or unrelated rights.
- Decide and document what **property transfer** does to prior owner-issued root grants. Recommended MVP default: epoch/version property authority; prior rooted grants become invalid on transfer unless an explicitly modeled lease survives. Tests must cover it when transfers are introduced.
- Query methods must resolve current effective rights; no cached UI authorization as source of truth.
- Contract mutation authenticates `predecessor_account_id` (or deliberately verified delegated call identity). No trust in caller-supplied actor IDs or an LLM's assertion.

## 7. Three trust domains

| Layer | Can decide | Cannot decide |
|---|---|---|
| **NEAR contract (Rust near-sdk)** | persistent ownership, grants/revocations, leases, balances, enforceable votes | arbitrary LLM narrative, player UI state |
| **Deterministic engine (TypeScript)** | Blood rules, actions available, night advancement calculations, win/loss proposals | create title, override finalized contract, mint testnet NEAR |
| **AI agent orchestration (TypeScript + optional provider)** | bounded goals, counters, strategic negotiation, dialog, typed action proposals | choose unchecked account IDs, access unrestricted signing keys, bypass contract policies |

### Wallet / account model
- Dedicated NEAR **testnet** NPC accounts. Where used, give each off-chain runner only narrow **function-call access keys** to an allowlisted contract and methods. Private keys remain in backend secret storage, not browser, repo, logs or LLM prompts.
- Function-call key gas allowance is **not** an account spending budget. Contract must enforce game escrow, price limits and per-agent spending quotas separately.
- Game/player signatures: choose current supported connector after checking official docs; user must explicitly authorize any economic action the protocol requires. If using a sponsor/relayer for UX, document its security/trust assumptions and constraints.
- One designated turn executor may advance the game, but the contract must prevent unauthorized advancement, duplicate turns and out-of-order actions. NEAR contracts **do not wake themselves up**; a keeper/cron/external call is necessary.
- Trust/centralization claims: the MVP is **not** decentralized end-to-end if AI inference, turn executor or client hosting relies on operator-run services. Disclose them.
- Public on-chain records can expose NPC relationships, strategies and transactions. Do not imply private negotiations on a public ledger.

## 8. AI NPC requirements

**Preserved Pass 2B adapter (disabled for the deterministic MVP):** real opt-in bounded Responses provider, strict envelopes,
existing validator/executor, durable decision reservations and political presentation
of Seraphine's actual Lounge lease are implemented. Acceptance uses the existing
player-signed lease operation; political rejection is local and penalty-free.
Fallback remains explicit. Tests use mocked provider HTTP and real Sandbox receipts;
no live model credentials were configured, so autonomous AI evidence is unverified.
See `docs/PASS2B.md`; broader bargaining, NPC-to-NPC deals and public deployment
remain deferred. Vercel hosting blockers are in `docs/VERCEL_PREVIEW.md`.
Final regression audit: Node 28/28, Rust 9/9, clean Sandbox 28/28 and production
build PASS; live provider and visual browser QA still unverified (`docs/PASS2B_AUDIT.md`).

Canon clarification from the Pass 2B instruction: Marius and Seraphine married to
unite independent lineages as House Volari and have co-ruled for centuries.
Seraphine is older with independent ancestral rights; Marius heads the House and
controls castle/formal succession in canon. These domains do not invent accounts
or authority records in the current bootstrap.


**Pass 2A IMPLEMENTED:** `src/agents.ts` centralizes static behaviour profiles,
restricted actor observations, typed proposals, deterministic validation and
character fallback. The existing dawn journal schedules Vesper, Seraphine and
Lucien once per night, persists structured outcomes, and reconciles confirmed
revocation/settlement after reload. These are deterministic policies, not AI.
At the Pass 2A boundary only revoke/collect/pass actions were enabled; Lucien passes. Existing
restricted signers and contract rules are unchanged. No new spending capability.
See `VAMPIRE_AGENTS.md`, `GAME_RULES.md`, and `docs/PASS2A.md`.
Marius and Seraphine Volari retain independent bloodlines and authority; missing
House/genealogy/voice details remain TBD. No Marius account or policy is invented.
Pass 2B owns model decisions, negotiation and expanded autonomous execution;
Pass 3 owns eight-seat voting. The requirements below remain future acceptance
criteria where they exceed this foundation.

- Each agent has public character profile, objective weights, limited memory and allowable action schema.
- Agent output MUST be a strict structured proposal such as `OfferLease`, `AcceptOffer`, `GrantAccess`, `RevokeGrant`, `Vote`, `Pass`; dialogue is presentation only.
- Decision pipeline: **observe authorized state → decide → validate → sign with constrained credentials → await chain result → present consequences**.
- Sanitize retrieved/player-provided narrative text as untrusted input. No tool invocation or key use decided directly by raw LLM text.
- Enforce hard max attempts, token budget, and action budget per turn. Seeded non-LLM policy must be available for reproducible fallback and test harness, **clearly labeled as a policy bot rather than an LLM**.
- At least one NPC-to-NPC interaction should be visible in the seven-night version; NPC-only dialogue with player is insufficient to claim an autonomous society.

## 9. MVP priority and cut line

### P0: must actually work for an honest hackathon demo
- [x] One playable, keyboard-operable castle UI with states changing after authenticated authority transitions (local Sandbox M2).
- [ ] Deployed **testnet contract** with public contract ID and transactions viewable in explorer (after user approval).
- [x] Effective delegated access, parent revocation cascade, independently surviving right, and explicit contract rejection of unauthorized action (M1B/M2 Sandbox).
- [x] One real NEAR-backed or contract-accounted economic property lease/payment settlement with double-spend/duplicate-accept tests; label exact economic semantics (native disposable Sandbox NEAR, M2).
- [ ] At least one autonomous bounded NPC decision that causes a validated NEAR transaction, plus rival reaction; reveal the action provenance (model/policy, validation, transaction).
- [ ] Clear, reproducible `README` and a start-to-finish demo path. No magic seeded state passed off as emergent AI behavior.

### P1: strong target if P0 is healthy
- [ ] Three distinct NPCs interacting over seven nights.
- [ ] Eight-seat council and final five-vote Night 7 outcome (Pass 3); three major actions/night remain provisional.
- [ ] Real user wallet flow without repeated disruptive signing prompts if the chosen integration safely supports it.
- [ ] Deployed public demo and explanatory action audit trail.

### P2: explicitly out of hackathon scope
- Multiplayer / shared persistent world; Castlevania-style combat/platforming; dozens of agents; non-NEAR chains/Intents; speculative governance; hundreds of collectibles; extensive art generation; elaborate 3D.

**Cut rule:** if time is short, finish one contract-backed offer → retaliation → forbidden-action rejection → preserved independence **before** expanding the world. Never substitute a fake chain demo for P0 without prominently disclosing that it is only a prototype.

## 10. User experience and aesthetic
- Pass 2I supersedes the initial pixel direction: stark black-and-white graphic-novel inkwork with selective crimson, governed by VISUAL_CANON.md. Approved supplied art is preserved; provisional art is labelled.
- Dark stone/near-black, parchment-white text, restrained crimson/burgundy. Legible fonts, proper contrast and focus states; no blinking/flashing effects.
- Every action provides clear: cost, legal authority, expiration, expected consequence, confirmed outcome. Avoid unexplained wallet jargon in the primary play loop.
- Distinguish **locked because you lack rights**, **temporarily unavailable**, **pending chain settlement**, **failed transaction**.
- Disable duplicate click while chain transaction pending, and restore safely on rejection.

## 11. Verification and acceptance cases
Mandatory tests should cover: grant -> access -> revoke -> deny; multi-level revocation; independent right survives; genealogy alone insufficient; expired grants; unauthorized issuer and actor; scope/depth limits; owner transfer invalidation; duplicate leases; replay; insufficient funds; expired offer; account quotas; failure in RPC/signing; deterministic night rollover; wallet disconnected; client fresh-load state reconstruction; and eventual turn-authority boundaries.

Use clear labels for each proof level:
1. **Unit-tested** in contract test runtime.
2. **Sandbox-tested** against local NEAR execution.
3. **Testnet-verified** with concrete transaction links and account/contract IDs.
Never label an outcome 'independently cryptographically verified' merely because one RPC endpoint returned it.

## 12. Suggested implementation sequence
**Active passes supersede the older sequence below:** Pass 1 retains seven nights,
three major actions, Blood, transitional Exposure, contract property/leases/grants
and finite discoveries. Deterministic scripted M2 consequences remain transitional.
Pass 2A adds the deterministic agent foundation; Pass 2B adds autonomous AI
vampires after its provider, authorization and validation work.
Pass 3 defines eight identifiable seats, five valid votes, opposition and balancing.
No AI, expanded council or final victory is implemented by Pass 1.

- **M1 — Authority spike:** contract rights/ancestry, multi-level revoke, negative tests, minimal castle adapter. See `CODEX_START.md`.
- **M2 — Economy:** property offers, settlement accounting, lease duration and failure handling. Verify with real contract tests.
- **M3 — Political loop:** bounded NPC strategies, one economic negotiation and hostile response on NEAR testnet.
- **M4 — Game:** Night/Dawn, resource pressure, court control, UI cohesion, save/load from authoritative state.
- **M5 — Submission:** reproducible README, deployment proof, automated tests, demo video, X post, public repo, form. Stop feature expansion early enough to validate.

No milestone completion claim without evidence. Track actual progress in `PROGRESS.md` once the repo exists.

## 13. External references
- Official: https://nearhackathon.com/ (track, deadline, submission)
- Organizer's live agent instructions: https://nearhackathon.com/HACKATHON.md
- NEAR official docs: https://docs.near.org/
- NEAR official prompt examples: https://github.com/nearai/near-hackathon-prompt-examples/blob/main/tracks/09-games.md
- NEAR Workspaces: https://github.com/near/near-workspaces-rs
- Wallet connector status: https://github.com/near/wallet-selector (notes that HOT Connect is now recommended; verify fit and testnet support before selecting)


## Pass 2E entry flow
IMPLEMENTED: dedicated title, read-only save detection, confirmed New Game, Continue, four illustrated prologue passages and automatic existing Vesper ultimatum. Skip changes narrative only. Existing Seraphine/Marius leads introduce supported choices; no settings or new mechanics. Subtitle: A political strategy game. See docs/PASS2E.md for verification and limits.

Pass 2F changes presentation only: mutually exclusive Castle/Room/Encounter/Reckoning/Conclusion views, bounded current-action guidance and secondary inspection dialogs. Existing title, one-action rules, rights, transactions and endings remain authoritative. See docs/PASS2F.md.

Pass 2G adds directed nightly incidents, free branching conversations and a
Discovery/Decision presentation flow. Existing shelter/resource predicates,
one-action costs, deadlines and chain semantics are unchanged. Commitments and
endings explicitly explain their survival relevance. See docs/PASS2G.md.

Local startup optimization is IMPLEMENTED; the under-three-second verified-state
target is PARTIAL. The prologue appears during initialization, but political actions
wait for finalized bootstrap state. No startup NPC/model decisions are added.
Measured results and limits: docs/STARTUP_PERFORMANCE.md.

Pass 2H authority gameplay is IMPLEMENTED for new Living Court campaigns: player Library grants/revocation, derived NPC access, finite research, independent patron rewards, and concise encounters. Old saves retain their original mechanics. Lounge access is an actual invitation, not a required useless tenancy. New NPC-funded earning/purchase mechanics are DEFERRED by explicit user choice to keep Rust and restricted signing unchanged. Existing 0.02 NEAR sanctuary remains real. See docs/PASS2H.md; this is a partial economic redesign, not completion of the original earning requirement.

Pass 2I presentation is IMPLEMENTED; final-art acceptance is PARTIAL. The cover, four-panel prologue, character compositions, existing rooms, reckoning, ancestry/rights inspection and endings share a graphic-novel design system. Generated room studies await approval; all eight NPCs and the player now use current creator-supplied portraits. The supplied interior castle cutaway replaces the landing artwork for room navigation. Gameplay, deterministic agents, chain execution and persistence are unchanged. Browser evidence, seven-night run and remaining accessibility limits: docs/PASS2I.md.

Pass 3A narrative is IMPLEMENTED across all seven nights of Living Court: distinct provisional voices, state-dependent room conversations, explicit fictional commitments, confirmed consequences and last-night research choices. Existing simulation, save schema and ending predicates remain unchanged; concealment is again reachable through survival choices. Two complete browser routes and automated results are in docs/PASS3A.md, alongside remaining narrative weaknesses. This pass does not implement council voting, Pass 3B/3C, live AI or public deployment.

Pass 3B reactive court is IMPLEMENTED: event-specific consequences, explicit political standing, evolving room follow-ups, bounded automatic playback and narrowed actor observations. Deterministic priorities and validated opportunities remain the decision source. Dorian no longer proposes an impossible late switch. The established one-major-action/night design is retained under the Pass 3B allowance for documented alternatives. No Rust, signing, save-schema or ending-rule changes; see docs/PASS3B.md for tests and limits. At its completion, Pass 3C integration was PARTIAL: story hierarchy, consequence clarity and route-specific endings are implemented and tested; NPC-to-NPC purchases and treasuries were absent. See docs/PASS3C.md and docs/PASS3D_HANDOFF.md for historical findings; the scoped 3D implementation below addresses that gap.

Pass 3D implements the scoped Dangerous Court rules for new campaigns: state-dependent Night VII Marius demand, published-account counterproposal, and one funded Cassian–Lucien passage purchase. Existing endings and one-action rules remain. The previous NPC-to-NPC transaction gap is addressed only for this exact restricted Sandbox agreement, not a general economy. Older saves remain unchanged. See docs/PASS3D.md for settlement and evidence.

## Locked Pass 4B architecture
One deployed authority contract supports many independently isolated on-chain campaigns. Campaign creation must not deploy another WASM, use a factory/pool, or rely on off-chain isolation. Pass 4B.1 introduces campaign-scoped World state, private storage-backed creation and scoped callbacks; see docs/PASS4B1.md for verification and compatibility limits. Testnet deployment and restricted signing were verified in Pass 4B.2. Pass 4C.1 implements a local walletless service and durable session allocation, but live gameplay acceptance remains blocked by isolated runtime custody, fresh campaign capacity and bounded player-deposit signing. See docs/PASS4C1.md.


## Pass 4C.2 local lifecycle and treasury implementation
One contract still hosts isolated worlds. Fixed 3 NEAR reservations are superseded locally by measured storage checks, explicit per-world/total quotas and separately backed pool/treasury/escrow accounting. Restricted provisioning creates fixed-roster worlds; paid player actions debit their prepaid treasury with zero attached deposit. The trusted walletless backend enforces visitor ownership even when role accounts are shared. Completed, settled worlds can archive and reclaim while retaining nonreusable ID/commitment tombstones; abandoned or financially unresolved worlds remain retained. See docs/PASS4C2.md for measurements, tests and limits. The root layout is incompatible with the deployed registry: recommend a separately approved fresh deployment, not an automatic upgrade. Existing Testnet state and obligations remain untouched. Public deployment and runtime credential provisioning are not completed.

## Pass 4E deployment preparation
The current target is one paid Render native Node 24 Web Service with persistent
SQLite at /var/data/night, serving the existing Vite build and game API together.
The existing night.we-inherit-night.testnet deployment is preserved. Runtime-only
FunctionCall keys use protected server environment configuration, with exact-key
permission/signature verification and no FullAccess fallback. Prepaid affordability,
interrupted signing, public snapshot privacy and durable abuse limits are corrected
locally. No paid service, live credentials or public gameplay were configured in
this pass. See docs/PASS4E.md for measurements, setup and remaining live acceptance.

## Pass 4E deployment preparation
The current target is one paid Render native Node 24 Web Service with persistent
SQLite at /var/data/night, serving the existing Vite build and game API together.
The existing night.we-inherit-night.testnet deployment is preserved. Runtime-only
FunctionCall keys use protected server environment configuration, with exact-key
permission/signature verification and no FullAccess fallback. Prepaid affordability,
interrupted signing, public snapshot privacy and durable abuse limits are corrected
locally. No paid service, live credentials or public gameplay were configured in
this pass. See docs/PASS4E.md for measurements, setup and remaining live acceptance.

## Restricted-key operational follow-up

Current funding status: two official faucet accounts were FINAL-verified and
funded the existing contract with 4 Testnet NEAR. Pool is 1.15; capacity is 5.
Only necessary keeper/Seraphine allowances increased (same keys and permissions)
to 0.10/0.075. Remaining funding reserve is 15.9999553634875 NEAR. No contract
code change or Render work; hosted performance remains unverified. See docs/TESTNET_FUNDING.md.

Historical initial upgrade:

The verified capacity WASM was subsequently upgraded code-only on the same
Testnet account. Exact storage was preserved; only max_active was then set to 1,
the initial capacity justified by actual backing after fees. Expansion above
four is PARTIAL pending funding, gas-budget and higher-capacity measurements.
No Render deployment or live gameplay acceptance. See docs/CAPACITY_TESTNET_UPGRADE.md.

At preparation completion, the campaign capacity follow-up was IMPLEMENTED locally: the existing provisioning cap
is operator-adjustable without changing serialized state. Abandoned (default 24h)
and defeated campaigns retain actual outcomes while existing restricted lifecycle
methods settle and reclaim them. Creation quotas remain durable and configurable.
Exact deployed-WASM/state compatibility is tested locally; no Testnet upgrade or
public gameplay verification occurred. See docs/CAMPAIGN_CAPACITY.md.
Eleven independent runtime FunctionCall keys for night.we-inherit-night.testnet
are installed on the existing actor/provisioner accounts with exact method lists
and 0.05 test NEAR allowances. Independent RPC and existing runtime preflight
pass. Private material is DPAPI-encrypted outside the repository; Render entry
is manual and has not occurred. No application changes or deployment in this
operational task. See docs/RUNTIME_KEYS.md and evidence/runtime-keys/verification.json.
