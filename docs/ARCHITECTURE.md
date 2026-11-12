# Architecture — through Pass 2C

Current new-campaign behavior is described in the Pass 2C section below. Earlier
three-action/model-default descriptions are historical; legacy saves remain supported.

## Decisions and verified tooling
- Rust 1.99.0, near-sdk 5.30.1, Node 24.13.0; exact direct dependencies and lockfiles.
- React 19.3.1, TypeScript 7.0.2, Vite 8.3.6; no UI or agent framework.
- M2 supersedes the demo-credit plan: native NEAR in disposable Sandbox only.
  Exact prepaid rent is held in escrow, vested on acceptance, claimable by lessor.
- SDK methods and WASM exports share the same Rust implementation.
- M1B: Workspaces 5.0.0, pinned Sandbox 2.14.0/protocol 88 on Ubuntu WSL2.
  Build WASM with cargo-near 0.22.0 (`--cfg near` plus WASM optimization).
  Nine authority scenarios plus twelve economy scenarios pass. Default browser
  mode now signs real Sandbox transactions; explicit `local` retains M1 simulation.

## Trust boundaries
- Contract owns property titles, scoped grants, effective access and action nonces.
- Ancestry is immutable bootstrap history. No authorization reads genealogy.
- The deterministic TypeScript engine owns Blood/transitional Exposure, major
  actions, finite discoveries, signed relationships and temporary conclusions.
  It owns no fictional currency, contract rights or political votes.
- Future agents may propose typed actions only; never authoritative actor IDs.
- React renders `get_world(account_id)`; `account_id` in views is not authentication.
- Mutations authenticate `predecessor_account_id`, never `signer_account_id` or UI input.

## Entities and limits
- `new` preserves M1 bootstrap; private `new_economy` adds Lounge (Seraphine).
  Both are one-time initialization, not post-init property/admin overrides.
- Grant scope is only `enter`; immutable IDs are append-only indices.
- Parent grants must be live, delegable, held by caller, same property/scope.
- Expiry is exclusive (`current_night < expiry_night`), bounded by parent.
- Four grants maximum along a chain; account cycles and self-grants rejected.
- Grantor can revoke its own grant; bounded ancestor walk resolves descendants.
- Separately rooted grants and ownership survive unrelated revocation.
- Maximum 256 grants bounds storage and full-view scanning for this spike.
- No transfers; future transfers MUST increment a property authority epoch and
  invalidate old roots (with explicit surviving-lease design), with tests.
- Per-account nonces reject duplicate/stale room, grant and revoke actions.
- Private one-time initializer seeds the two owners and one ancestry edge.
  No seed/admin mutation method exists after initialization.
- Only configured executor advances nights; expected-night check prevents races.
  Executor remains trusted to choose when nights advance; no autonomous clock.

## Client and local bridge
- `src/chain.ts`: typed World/Grant views and adapter; no local permission engine.
- Existing Vite/JSON-line bridge selects either M1 `local-demo` or M2 Sandbox
  runner. No additional HTTP service. Windows launches Ubuntu through WSL2.
- Explicit M1 `local` mode uses SDK mocked contexts, **not NEAR Sandbox**;
  it has no signatures or real receipts. Default `sandbox` mode signs with
  disposable accounts and records actual execution receipts and hashes.
- Bridge exists only in dev server, bound to loopback, Host/Origin checked.
- Graceful restart resumes the saved Sandbox/campaign. New Game resets only its
  owned chain. Browser reload reads
  live contract state. Grant is one-shot in the M1 scenario UI/bridge.
  The actual owner may intentionally issue a NEW grant with a fresh nonce.
- Mutations validate before writes. Payout uses a pending flag and private callback;
  failed native transfers retain the claim, successful ones clear escrow once.
- Runtime errors clear UI authority; pending operations prevent double-clicks.
- Testnet mode uses finality `final` and official testnet RPC for views only.
- Production bundle contains no bridge; M2 is local-only, not a deployable website.

## Lease and political flow
- Max 64 immutable offer records; 0 < rent <= 0.1 NEAR, duration 1–7 nights,
  offer expiry within seven nights. One active commercial lease per property.
- Scope is entry/use only, with no ownership transfer, delegation or income.
- Buyer alone accepts/rejects; owner alone cancels an unaccepted offer or claims
  vested rent. Accepted lease rights are not Grant descendants and cannot be revoked.
- Pure sequence in `scenario.mjs`: offered → rejected OR accepted → retaliation
  pending → independent. Vesper revokes only after a finalized accepted view.
- Acceptance returns before retaliation. End-night runs the scripted Vesper response using
  her separate transaction. Initialization never accepts or revokes. Room scenes
  are presentation state; navigation/information use fresh contract permission
  reads. Routine narrative interactions do not sign transactions.
- New Game serially replaces only the play process's own Sandbox worker after
  successful fresh initialization. No saved evidence or other worker is deleted.
  All tabs on one development server share that disposable session.
- Guarded campaign dawn requests require ID/revision. Only the keeper advances nights;
  tests exercise expiry. Rent is nonrefundable and remains payable after expiry.
- Economy runner waits for RPC `FINAL`, including refund receipts, before balance
  reads/UI success. React never invents settlement or permission changes.
- Fixed local actors and finite funding; keys stay in the runner. Existing funded
  contract subsidizes bounded storage. No unrestricted withdrawal method exists.

## Accounts, wallets and deployment plan
- `src/game.ts` exposes `availableActions`, `validateAction`, `playerAction`,
  `inspectRights` and validated scripted NPC proposals. Selectors receive data,
  never clients or keys. `campaign.mjs` rechecks access just before local effects.
- `get_world.grant_validity` exposes the contract's existing recursive `valid`
  calculation in the same snapshot. No new authority rule or state layout.
- Stable opportunity IDs are persisted once. Dawn has a saved per-step journal;
  expected contract night and local revisions prevent duplicate resource resolution.
  Lost confirmed-dawn responses recover without advancing twice.
- Persistent local Sandbox uses the pinned binary and Workspaces custom loopback
  RPC with a saved database/keystore. NPC keys are restricted to receiver/methods
  with a finite gas allowance; their bootstrap full-access keys are deleted.
  Local contract account retains upgrade authority for compatible read-view updates.
- Version-2 local saves remove legacy currency, keep Blood/Exposure/history, and
  replace obsolete political outcomes. No blockchain state is reconstructed.
- There are no support/voting/property-transfer methods. Access exchange remains
  a labeled future opportunity; AI negotiation and voting require later design.
- Wallet Selector repository recommends HOT's NEAR Connect. Select that direction;
  wallet integration/testnet signing compatibility is UNVERIFIED and deferred.
- Future NPC keys: receiver/method/gas limited; gas allowance is NOT spend policy.
  M2 enforces exact native rent and bounded offers inside the contract; generic
  NPC spending budgets remain unimplemented.
- No unrestricted signing keys in browser, source, logs or model context.
- Local Sandbox deployment/signing was explicitly authorized and verified in M1B.
  Before public-network deployment: review storage/gas and obtain explicit approval.
- After approval only: provision testnet accounts, deploy to contract account and
  call private `new` in the same transaction, then collect actual receipt links.
- Explicit Sandbox tests and default dev server deploy/sign only in disposable
  local Sandbox. Install/build/native tests never deploy; testnet unconfigured.
- Upgradable account owner and centralized executor remain trust assumptions.

## Official references checked 2026-11-07
- [SDK release/API](https://docs.rs/near-sdk/5.30.1/near_sdk/)
- [NEAR unit versus integration tests](https://docs.near.org/smart-contracts/testing/unit-test)
- [Official cargo-near build tooling](https://github.com/near/cargo-near)
- [Wallet Selector migration recommendation](https://github.com/near/wallet-selector)
- [Sandbox integration tooling](https://github.com/near/near-workspaces-rs)

## Pass 2A decision boundary

`src/agents.ts` owns static profiles, observations, proposal types, policies and
NPC validation (moved from game.ts, not duplicated). Campaign NPC state contains
only relationships and bounded memory; holdings always come from NEAR views.
The UI reads static goals and directs players to actual authority records.

The runner obtains get_world for the selected NPC account, constructs a detached
observation with public ledger records and that NPC's local memory/relationships,
and invokes a data-only selector. Player resources/discoveries and other NPC
memories are absent. Server-fixed identity and exact proposal fields are checked;
only established grant 0 revocation / lease 0 collection / pass are allowed.
A failed or malformed decision uses the character-specific fallback once.

The existing dawn journal stores intent and projected effects before submission,
revalidates fresh authority/night, uses existing restricted scenario signers and
waits for the confirmed postcondition before committing local effects. Recovered
revoked/settled records skip resubmission. Fixed ordering and per-night history
prevent another scheduled action; a failed unresolved transaction pauses dawn.
History is at most 21 records in a fresh seven-night campaign. Legacy saves gain
an empty history without reconstructing past decisions; in-flight journal steps
remain recoverable. JSON saves and the operator remain trusted.

No contract, signing method, account bootstrap, provider or dependency changed.
Pass 2B can replace the decision source; validation/execution remain the same.
Async provider deadlines, tokens, broader proposals, negotiated commitments and
any expanded key/contract spend policy require explicit Pass 2B work. These
policies do not demonstrate autonomous AI or NPC-to-NPC negotiation.

## Pass 2B extension

`src/decision-provider.ts` implements the opt-in Responses adapter using native
fetch, strict output schema, bounded bytes/tokens/time/retries and no tools. The
server loads ignored environment configuration; provider code is not imported by
the browser. `agents.ts` owns external envelope validation over the existing NPC
validator, available proposals and exact lease agreement checks.

The existing dawn journal reserves each provider request before calling it.
Recovery falls back rather than invoking a paid provider twice. Prepared effects
remain journaled until confirmed postconditions. Acceptance reconciles player
nonce plus actual lease/access state before committing; failed calls do not invent
agreement success. Political rejection is local; existing direct lease controls
remain unchanged. No contract method/key permission or package was added.

Seraphine's offer is presentation of existing signed lease 0, not autonomous
creation of variable terms. LLMs may choose among available actions or pass.
Live provider verification is outstanding; mocked transport is labelled in test
evidence. Server deployment/authentication/durable hosting remain separate work.
See PASS2B.md and VERCEL_PREVIEW.md. Official provider schema reference:
https://developers.openai.com/api/reference/resources/responses/methods/create

## Pass 2C campaign extension

The new private `new_political` initializer adds independent court, sanctuary and
passage capability properties without changing Rust state layout or runtime rights
methods. These are access domains, not additional navigable rooms. Existing
initializers and all lease/delegation/revocation semantics remain available.

Version-3 new campaigns default to one major action; `src/politics.ts` defines
finite opportunities, seeded court events and rights-based outcomes. Version-2
saves retain their old campaign and bootstrap; no migration invents new rights.
The play runner stores bootstrap mode in ready.json and disables provider calls
for all gameplay. The adapter and historical mocked provider tests are preserved.

The existing journal carries an automatic-reckoning marker atomically with the
successful major decision. A pending player transaction reconciles nonce and
lease/access postconditions before court actions begin. `agents.ts` still owns
identity/proposal validation and derives fixed court operation arguments. The
runner confirms immutable grant/lease outcomes before committing NPC memories,
public opportunity claims and encounter records. At most eight actors per night.

Final political outcomes evaluate fresh effective access, Library ownership and
actual lease expiry after the keeper advances. Information and service flags
only permit negotiations/requests; they never substitute for an actual right.
The finite service/dossier and seed are trusted off-chain state, serialized with
the campaign. See PASS2C.md for exact endings, authority matrix and evidence.

## Pass 2D presentation boundary
`encounters.ts` purely projects Result into typed scenes; `VampireEncounter.tsx` renders native modal dialogue and exact terms. Explicit choices re-resolve against current choices before the unchanged App action pipeline. Browser scene IDs/line/viewed state are isolated from authoritative saves. Latest committed reckonings and engine conclusions are rendered, never recomputed. See PASS2D.md.

## Pass 2E entry boundary
GameEntry gates App: title -> optional prologue -> existing encounter director. `/api/save` uses read-only disk inspection; Vite lazily creates the bridge only for explicit campaign requests. Continue uses the original view/recovery path; confirmed replacement uses loaded campaign ID/revision and reset. `entry.ts` stores prose and pure progression. Browser-only intro state is scoped by campaign ID; it never authorizes an action.

## Pass 2F scene navigation
GameEntry remains the read-only title/prologue boundary. EncounterDirector renders
one active existing dialogue/reckoning/conclusion scene OR the exploration child.
Exploration switches Castle/Room; navigation.ts projects room context and bounded
leads from Result availability. Native inspection dialogs retain rights, genealogy,
relationships, chronicle and diagnostics. The optional room field extends existing
browser scene memory, rechecked against effective access on resume. Commands still
use the original App handler/adapter and backend validation/recovery. Quiet completed
NPC phases get presentation-only reckonings; Continue dismisses, never advances.
See PASS2F.md for verification and limits.

## Pass 2G directed presentation
src/story.ts extends the existing encounter projection with state-dependent nightly
incidents, free branches and Discovery/Decision scenes. It reads public Result
state only; no random rolls, signing, new campaign flags or NPC policy changes.
Existing scene memory retains topic/incident IDs; explicit commitments still use
EncounterDirector's current-choice resolution and the original validated executor.
Failure explanations distinguish valid ordinary access from qualifying protection.
See docs/PASS2G.md for rule findings, evidence and limitations.

## Local startup performance
Confirmed New Game renders the free prologue while the existing serialized bridge
initializes; gameplay still waits for verified state. Windows bundles the runner
with Vite to avoid WSL filesystem import overhead. New disposable chains use faster
local blocks and matching GC capacity; independent signing-key restrictions run
concurrently, while nonce/grant ordering and FINAL checks remain unchanged.
Continue preserves existing chain configuration. See STARTUP_PERFORMANCE.md for
measured spans, opt-in diagnostics, tests and the unmet three-second readiness goal.

## Pass 2H Living Court
Optional politics.library marks new campaigns; old save migrations are preserved. library.ts contains typed scoped operation derivation. agents.ts validates each NPC observation/proposal; campaign.mjs revalidates fresh authority, persists intent/nonce, executes restricted methods and verifies issuer/effective postconditions. Lost research receipts recover using the actor nonce. No parallel save system or contract authorization model.
Player grants can produce derived NPC-to-NPC Library grants; successful later access publishes one off-chain investigation and unlocks a separately authorized patron grant. Publication never grants authority by itself. livingCourt.ts projects existing encounter scenes with provisional dialogue and material terms, with technical details expandable.
Security limit: native-Near attached-deposit purchases cannot use current NPC function-call keys. User explicitly deferred new NPC-funded purchases/earnings; Rust and key boundary remain unchanged. Local serialized-runner and off-chain save trust assumptions persist. See PASS2H.md for evidence and limitations.
