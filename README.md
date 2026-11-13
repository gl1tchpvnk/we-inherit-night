# We Inherit Night

A gothic dynasty game slice: buy independence from Seraphine, then survive your
sire's retaliation. **Pass 3D: seven chapters of character-driven bargains, a final political demand, research-backed counterproposals and one bounded NPC passage purchase on local NEAR Sandbox. Autonomous deterministic NPCs; no LLM calls or public deployment.**

## Feature status

Quit Campaign: **IMPLEMENTED and verified on public Testnet**. The Testnet game menu requires
confirmation, immediately begins existing settlement/archive/reclaim, and returns
to title only after verified reclamation. Pending closure resumes through Check
settlement; history and financial obligations remain intact. See
[hosted Quit verification](docs/PUBLIC_DEPLOYMENT.md#quit-campaign--hosted-pass).

Campaign capacity fix: **contract upgraded on Testnet; backend prepared locally**. Operator-adjustable
admission, durable abandoned/early-defeat settlement and reclamation, and bounded
configurable creation quotas. Existing state layouts and 32 MiB ceiling remain.
See [upgrade verification and configuration](docs/CAMPAIGN_CAPACITY.md).
Current funded on-chain capacity: **5**, with a 1.15 Testnet NEAR gameplay pool.
See [finalized funding and remaining reserves](docs/TESTNET_FUNDING.md).
The [corrected runtime gas budget](docs/RUNTIME_GAS_FUNDING.md) verifies all eleven
accounts and finite allowances; the existing hosted provisioning journal still
needs safe reconciliation before gameplay verification resumes.
Hosted five-player performance and public gameplay remain unverified.

New Game startup is measured and optimized: a local benchmark improved from
68.46 s to 5.65 s; the browser prologue appeared in 0.48 s. Fully verified gameplay
is **not yet under three seconds**. See [startup measurements](docs/STARTUP_PERFORMANCE.md)
for configuration, reproducible profiling, regression evidence, abandoned-lock recovery and limitations.

| Feature | Status | Evidence / limit |
|---|---|---|
| Render deployment preparation | IMPLEMENTED locally | One Node 24 service, persistent SQLite, Linux restricted signing, recovery/privacy/abuse fixes and memory assessment. Public hosting remains unverified. [Setup and verification](docs/PASS4E.md). |
| Sustainable Testnet deployment | PARTIAL | New `night.we-inherit-night.testnet` code, registry and bounded pool verified. Eleven restricted runtime keys are now installed and independently verified; live walletless acceptance remains pending. [Key setup](docs/RUNTIME_KEYS.md). Render replaces the earlier Windows-host proposal. [Pass 4D](docs/PASS4D.md). |
| Sustainable campaign lifecycle | IMPLEMENTED locally | Measured storage, prepaid restricted-key payments, bounded provisioning, archives and reclamation. 23 Rust, 100 Node and 52 executed Sandbox cases pass. Fresh deployment recommended; public operation remains blocked. [Pass 4C.2](docs/PASS4C2.md). |
| Multi-campaign authority | IMPLEMENTED locally | One Sandbox contract, two complete independent campaigns; 19 Rust, 92 Node and 52 Sandbox cases pass after focused fixture corrections. [Pass 4B.1](docs/PASS4B1.md). Testnet deployed with two verified worlds; exact-key restricted signing verified (local operational tooling, public runtime pending): [Pass 4B.2](docs/PASS4B2.md). |
| Pass 3D Dangerous Court | IMPLEMENTED | New campaigns: final demand, published-account leverage, counterproposal and verified Cassian–Lucien payment. 92 Node, 13 Rust, 50 actual Sandbox tests; five full routes. [Report](docs/PASS3D.md). |
| Pass 3C integration and evaluation | PARTIAL | Story-first records, complete mobile portraits, immediate consequences and route-specific epilogues. 89 Node, 11 Rust and 44 actual Sandbox tests pass. NPC-to-NPC purchase was absent at 3C completion; the single scoped 3D agreement now fills that gap. [Report](docs/PASS3C.md), [3D handoff](docs/PASS3D_HANDOFF.md). |
| Pass 3B reactive court | IMPLEMENTED | Evidence-based consequence scenes, evolving room follow-ups, explicit political relationships and narrower NPC observations; 84 Node and 41 Sandbox tests. [Report](docs/PASS3B.md). No physical NPC simulation or new historical canon. |
| Pass 3A seven-night Living Court narrative | IMPLEMENTED | Two full browser routes, 76 Node and 38 Sandbox tests; provisional dialogue and qualitative limits in [PASS3A](docs/PASS3A.md). Legacy scenes remain compatible. |
| Rust ownership, scoped delegation, ancestor revocation | IMPLEMENTED | 13 actual contract unit tests; rebuilt WASM verified in Sandbox |
| Permanent ancestry distinct from rights | IMPLEMENTED | Contract tests and bloodline panel |
| Authenticated room action, nonces, expiry, bounded depth | IMPLEMENTED | Negative contract tests |
| Castle, agreement, court log, keyboard controls | IMPLEMENTED | M2 browser walkthrough; Hunting Grounds/Council remain planned |
| Local contract adapter | IMPLEMENTED | Actual Rust methods in SDK mocked host; bridge integration test |
| WASM Sandbox authority verification | IMPLEMENTED | Nine scenarios pass on Sandbox 2.14.0/protocol 88; receipts and gas recorded |
| NEAR network integration | PARTIAL | Read-only adapter/config; live account RPC verified in Pass 4A, contract queries pending deployment |
| Walletless Testnet gameplay | PARTIAL | Contract deployment and restricted signing verified in [Pass 4B.2](docs/PASS4B2.md). Pass 4C.2 resolves prepaid payment and repeat creation locally; deployment, runtime custody and live end-to-end acceptance remain outstanding. See [Pass 4C.1](docs/PASS4C1.md) and [Pass 4C.2](docs/PASS4C2.md). |
| Native Sandbox NEAR lease/payment/settlement | IMPLEMENTED | 12 economy scenarios, actual transfer and refund receipts |
| Deterministic Vesper retaliation | IMPLEMENTED | Authorized contract revocation after finalized lease acceptance |
| Seven nights / one major action | IMPLEMENTED | Automatic reckoning; Unbound, Favoured and Failure from verified rights; legacy saves retain old rules |
| Finite Library/Lounge opportunities | IMPLEMENTED | Stable discovery IDs, completion guards and fresh contract access checks |
| Typed NPC profiles, restricted observations, fallback and bounded scheduler | IMPLEMENTED | Deterministic fallback plus optional provider; persisted per-night outcomes, reload recovery |
| Preserved model adapter | PARTIAL | Disabled in gameplay; mocked provider tests retained; no live verification |
| Distributed authority and eight deterministic NPCs | IMPLEMENTED | Institutional grants, independent sanctuary, temporary passage and finite competition; no LLM calls |
| Eight-seat council / final vote | PLANNED | Pass 3; no resource-purchased political authority |
| Title / New Game / Continue / prologue | IMPLEMENTED | Read-only entry, confirmed replacement, existing recovery; see docs/PASS2E.md |
| Directed story / nightly decisions | IMPLEMENTED | State-dependent incidents, eight free branching contacts, explicit survival consequences; see docs/PASS2G.md |
| Castle / room scene navigation | IMPLEMENTED | One primary view, contextual interactions and secondary inspectors; see docs/PASS2F.md |
| Living Court scenes | IMPLEMENTED | Eight encounters, exact negotiation terms, verified reckoning and engine conclusion scenes; desktop/mobile in-app checks |
| Graphic-novel presentation | IMPLEMENTED | Cover, four-panel prologue, varied cinematic encounters, illustrated rooms, chapter/reckoning, ancestral record and ending; see [Pass 2I](docs/PASS2I.md) |
| Final artwork | PARTIAL | Current nine supplied portraits, landing and cutaway castle integrated; three provisional generated room interiors await approval |

NEAR's intended role is enforceable ownership and revocable delegation: room entry
must reject an unauthorized predecessor even if a client claims access. Current
proof includes local NEAR Sandbox execution of actual WASM, **not testnet verification**.
The default browser mode uses real Sandbox WASM; explicit `local` mode preserves
the clearly labeled M1 SDK simulation.

## Prerequisites and setup

Verified here: Windows, Node 24.13.0/npm 11.6.2, Rust 1.99.0 MSVC, installed
`wasm32-unknown-unknown` target and C/C++ build tools. Native SDK dependencies need
a C compiler. Windows also needs NASM, or the dependency's bundled prebuilt objects:

```powershell
$env:AWS_LC_SYS_PREBUILT_NASM='1'
npm ci --ignore-scripts
cargo test --lib --locked
cargo build --features local-demo --bin local-demo --locked
npm test
npm run build
npm run contract:wasm
wsl -d Ubuntu -- bash scripts/setup-sandbox.sh
npm run dev
```

WASM builds use official `cargo-near` 0.22.0, verified here: install with
`cargo install cargo-near --version 0.22.0 --locked` if needed.
On systems with NASM, omit the environment setting. On Linux/macOS use the same
commands except the PowerShell environment line. Install the WASM target with
`rustup target add wasm32-unknown-unknown` if absent. Exact packages are pinned in
manifests and lockfiles. `npm ci` is the clean-install command; this session used
`npm install --ignore-scripts` to create the lockfile.

Open [the local castle](http://127.0.0.1:5187/). Use the exact loopback address;
the bridge rejects other Host/Origin headers. Port 5187 must be free. The dev
server spawns the Sandbox runner through Ubuntu on Windows (Linux uses bash).
Linux Node 24 must be on PATH, or available at the workspace-local
`.local/node-v24.13.0-linux-x64/bin/node`. Initial setup may take a minute.
A missing runtime shows an error and unknown rights; no simulated fallback exists.
The browser shows no real wallet prompt because this local-only runner holds
disposable Sandbox credentials. Do not expose this development server publicly.

## Pass 1 mechanics — retained

1. Open the castle or use New Game. Inspect the contract-backed rights; enter an
   accessible room freely. Disabled controls explain missing requirements.
2. Complete a Library investigation: Blood and one major action are spent, a
   finding is recorded, and that opportunity becomes exhausted permanently.
3. Inspect Seraphine's pending lease. Accept signs an actual 0.02 Sandbox NEAR
   payment; Reject signs a refusal. Both cost one major action only on success.
4. With Lounge access, learn Seraphine's interests, then discuss a possible access
   exchange. This records a **future opportunity**, not a completed agreement.
5. End night: established scripted M2 revocation/settlement resolve, then upkeep.
   Crypt access reduces dawn Blood loss from 3 to 1. Lease access expires normally.
6. Feed/rest/manage transitional Exposure and explore remaining finite leads.
   Three major actions reset each night; navigation and inspection are free reads.
7. Survive seven dawns for a **temporary development conclusion**, not political
   victory. Blood 0 or Exposure 10 causes defeat. No Coin, spendable Influence,
   purchasable seats, AI agents or final voting exists.

Saves and the disposable chain persist across reload and graceful server restart
under ignored `.local/night-play`. New Game replaces only that owned session.
Do not publish saves or generated credentials. A writer lock blocks concurrent
runners; after a crash, verify the old runner/node stopped before removing only
its `play.lock`. Never delete a live lock.
See [Pass 1 audit, validation and remaining gaps](docs/PASS1.md).
Historical Pass 1 verification: 12 Node tests, nine Rust tests, 25 Sandbox test entries
(including parent entries), optimized WASM and production build passed.

## Historical M2 walkthrough (superseded by Pass 1 above)

1. Open the castle → Crypt granted by Vesper; Library independently owned; Lounge locked.
2. **Inspect Seraphine's offer** → 0.02 Sandbox NEAR, three nights, entry/use only.
3. **Accept and sign** → the disposable player signs; finalized rent enters escrow.
   Crypt stays accessible until **Face Vesper’s response** submits her separate
   transaction. Crypt then locks; Lounge and Library stay open.
4. **Try locked door** at Crypt → readable denial; receipt in Developer details.
5. Enter rooms → distinct scenes. Read the Crypt inscription, study your Library
   deed, or take your leased Lounge seat; each use rechecks contract access.
6. **Ask Seraphine to collect paid rent** → native transfer; escrow becomes zero.
7. Reload → contract rights, settlement and transaction history remain accurate.
8. **New Game / Reset Scenario → Start fresh game** creates a fresh chain and
   unanswered offer. **Reject agreement** instead → no
   rent paid and no retaliation. Rejection itself is a small gas-costing transaction.

Tab and Enter operate the buttons; focus is visible. Pending operations disable
controls. State and court history survive page reload for the running Sandbox
session; New Game replaces only that session's disposable chain, not test evidence
or unrelated accounts. No decisions execute during initialization. Local signing
is explicitly disclosed; no public testnet wallet signing is implemented.
`VITE_MODE=local` selects the old M1 simulation (grant/revoke controls, no payment).

## Earlier milestone checks

- PASS: `cargo test --lib --locked` — 8 tests, including cascade, independent
  root/ownership, wrong predecessor, scope/depth/cycle limits, expiry, replay,
  unauthorized revocation/init, and turn-order checks.
- PASS: `cargo build --features local-demo --bin local-demo --locked`.
- PASS: `npm test` — bridge end-to-end test using that real Rust binary.
- PASS: `npm run build` — TypeScript check plus Vite production bundle.
- PASS: `cargo build --target wasm32-unknown-unknown --release --lib --locked`.
- PASS: `cargo fmt --all`; browser grant/entry/revoke/denial/Library/reload path,
  including keyboard-triggered entry.
- Initial FAIL resolved: native dependency required NASM; documented bundled
  prebuilt NASM option allowed build/tests to pass.
- Initial dev start FAIL resolved: port 5173 occupied; project uses 5187.
- M1B PASS: nine Sandbox scenarios, 62 recorded transaction outcomes and receipt
  outcomes. Existing eight unit tests, bridge test, and frontend build also pass.
- M1B resolved failures: Workspaces selected obsolete Sandbox 2.6.2; raw Cargo
  WASM returned generic traps on denied calls. Pinning runtime 2.14.0 and using
  `cargo-near` (including `--cfg near` and WASM optimization) gives explicit
  contract rejection reasons. Rust authority source is unchanged.
- M2 PASS: 12 economy scenarios / 37 finalized transactions; all nine M1B cases;
  nine native unit tests (including payout recovery), native bridge test, frontend
  build and browser acceptance/rejection-of-entry/settlement/reload walkthrough.
- Resolved M2 failures: starter wallet initially lacked upfront gas reservation;
  balance assertions initially ran before gas refunds. Now use finite 0.25 NEAR
  treasury and await `FINAL`, including refunds. No authority bypass was found.
- At M2: NOT RUN testnet deployment/transactions, wallet integration, live testnet RPC,
  mobile viewport and comprehensive accessibility audit remain unverified.

Verified WASM artifact: `target/near/night_authority/night_authority.wasm`.
See [Sandbox setup, commands, hashes and gas](docs/M1B_SANDBOX.md).
These small-fixture tests do not establish worst-case gas/storage limits.

## Testnet configuration and deployment prerequisites

For the new local walletless backend, use [Pass 4C.1 setup and blockers](docs/PASS4C1.md). The following M1 instructions describe the older read-only adapter; they are not current deployment instructions. The multi-campaign contract is already deployed as documented in Pass 4B.2.

Copy `.env.example` to `.env` if configuring read-only access. Browser-exposed
variables are public: never put credentials in them.

| Variable | Meaning |
|---|---|
| `VITE_MODE` | `sandbox` (default), `local` (M1 simulation), `testnet` (read-only) |
| `VITE_NETWORK` | Reserved deployment metadata; only testnet supported |
| `VITE_RPC_URL` | Only `https://rpc.testnet.near.org` accepted in M1 |
| `VITE_CONTRACT_ID` | Actual deployed `.testnet` account, currently unset |
| `VITE_VIEW_ACCOUNT_ID` | Account whose rights to inspect, not authenticated identity |
| `VITE_WALLET_CONNECTOR` | Future `near-connect` choice; integration not implemented |

Production `dist` does not contain the local bridge. Do not publish the Sandbox/local-mode
bundle expecting a hosted demo. Testnet mode requires a compatible initialized
contract; signing controls remain disabled. RPC errors clear authority display.

Before any public-network deployment: review storage/gas limits and key custody,
and obtain explicit approval. M1B verified the authority scenarios in local Sandbox.
Deploy and invoke private one-time `new(vesper, player, executor)` atomically from
the contract account. Public-network actions remain unauthorized; the default
dev server and explicit Sandbox tests provision only disposable local accounts.
Contract ID: **none**. Explorer receipts: **none**. No mainnet use.

## Limits and design

The contract subsidizes bounded storage (256 grants, 64 leases). Native rent is
exact, prepaid, nonrefundable, and vested at acceptance; only the lessor can claim
it once. Failed payout restores claimability; expiry ends entry, not the debt.
Player starts with 0.25 valueless Sandbox NEAR; rent is 0.02; there is no income.
The configured keeper and upgrade key remain centralized trust points. No browser
direct night advancement is exposed; guarded campaign dawn requests use the keeper.
This schema requires fresh deployment; no migration
of existing contract state is implemented.

On Linux/WSL with Node on PATH: `npm run test:sandbox` runs authority and economy
suites; `npm run test:economy` runs only the economic slice. See
[M2 economics, commands and evidence](docs/M2_ECONOMY.md).

See [M1B Sandbox reproduction and evidence](docs/M1B_SANDBOX.md),
[architecture](docs/ARCHITECTURE.md), [threat model](docs/THREAT_MODEL.md), and
[progress](PROGRESS.md). This milestone adds original AI-assisted code to the four
provided specification files. Third-party dependencies: React, Vite, TypeScript,
near-sdk and their transitive libraries (respective upstream licenses apply).
No template, generated artwork, private credentials, or prior game code was used.

License: MIT for new project code. The provided requirements retain their existing
provenance; their external event facts are not new verification evidence.

## Pass 2A — verify the agent foundation

Read [vampire canon](VAMPIRE_AGENTS.md), [deterministic rules](GAME_RULES.md),
and [implementation/test report](docs/PASS2A.md). Accept the Lounge lease, then
end the night: Vesper's deterministic policy revokes her grant, Seraphine collects
rent, and Lucien passes. Reload: completed actions and relationship effects do
not repeat. The local campaign save has one `agentHistory` record per NPC/night.
These are policy outcomes, not model decisions or autonomous negotiation.

`npm test` includes observation, identity, scheduling and journal fault tests.
On Linux/WSL with Node 24, `node --test tests/sandbox/agents.test.mjs` proves
restart after a lost finalized NPC response against real local NEAR execution.
The full `npm run test:sandbox` includes it and the seven-night regressions.

## Pass 2B — political proposal and preview

Start fresh, take an action, then End night. Seraphine can present her existing
Lounge lease in Political agreements. Inspect the fixed price/entry scope/deadline,
then accept (existing player-signed NEAR operation) or decline locally (no payment,
transaction or relationship penalty). Reload preserves pending/resolved agreements.
The standing lease controls remain compatible with Pass 1. Broader bargaining is
not implemented. History distinguishes model decisions from deterministic fallback.

No provider is enabled by default. Configure server-only `.env` with
`NIGHT_LLM_ENABLED=1`, `NIGHT_LLM_MODEL`, and `OPENAI_API_KEY` only when authorizing
paid calls; never use a VITE_ key. See [Pass 2B report](docs/PASS2B.md) for bounds,
commands, actual evidence and limitations. Automated tests do not make paid calls.

PASS: 28 Node tests, production build; all 26 existing Sandbox entries and both
new negotiation cases passed across suite/focused reruns. Provider HTTP is mocked
in tests; real live AI is NOT verified. Supplied artwork replaces only Seraphine's
placeholder; other portraits and architecture are temporary, not new canon.

Local preview: [127.0.0.1:5187](http://127.0.0.1:5187/). It uses a separate
`.local/pass2b-preview` save and disabled model calls when started for this task.
Do not remove another play session's live lock. Vercel can host `dist`, but the
playable backend is not deployable unchanged: [readiness assessment](docs/VERCEL_PREVIEW.md).
No hosted deployment was performed. No browser verification is claimed.

## Pass 2C — play the political campaign

Start the local server as above, open http://127.0.0.1:5187/ and choose **New Game**
to use the new bootstrap. Existing saves are preserved under their old rules until
reset. No provider configuration is needed or used. No browser private keys.

- **Unbound route:** Night 1 investigate/file your Library title; Night 2 accept
  Seraphine's sanctuary covenant (0.02 Sandbox NEAR); Night 3 feed. Pass or manage
  Blood through Night 7. Inspect the revoked Crypt and still-valid sanctuary/title.
- **Favoured route:** Night 1 accept Marius's service; Night 2 feed; pass Night 3;
  fulfil the service on Night 4. Retain his revocable protection through Night 7.
- **Failure:** pass three nights without securing protection. Vesper revokes only
  her own grant and the game ends early; your Library title remains untouched.

Opening rooms, reading terms and character/rights inspection are free. A successful
major action automatically resolves all eligible court actions and advances; do not
click End Night again unless you intend to pass the new night. Watch the current
night and obligation summary. Lucien's passage is temporary, not a final victory.
The original Lounge lease remains optional; it is not the sanctuary covenant.

See [Pass 2C rules, authority matrix and evidence](docs/PASS2C.md). Current artwork
is preserved; seven portraits remain symbolic placeholders. Pass 2D adds illustrated
encounters, inspectable negotiation terms and recorded reckonings/conclusions.
Desktop/mobile in-app acceptance and revocation were checked; a complete seven-night
browser run remains unverified. Public hosting/wallets and council remain unimplemented.
See [Living Court architecture, verification and limitations](docs/PASS2D.md).

## Start at the title
Launch the local dev server and open http://127.0.0.1:5187/. New Game starts the four-part prologue (or asks before replacing a save); Skip Intro still leads to Vesper’s ultimatum. Continue restores the campaign and supported presentation progress. Opening the title alone does not start or recover Sandbox. Read [Pass 2E](docs/PASS2E.md) for tests and limitations.

### Living Court (Pass 2H)
IMPLEMENTED in new campaigns: Library grants, derived assistant access, issuer-based revocation, finite research and independent patron rewards. Follow Seraphine or Marius for early protection, then hear the Library petitions on Night Four. The Lounge is accessible through a verified invitation; old lease records remain unchanged.
PARTIAL economics: existing sanctuary costs 0.02 Sandbox NEAR. New NPC-funded jobs/player earnings are deferred by user decision; no Rust or signing-boundary changes. Old saves retain their prior campaign. See [Pass 2H](docs/PASS2H.md).

### Dangerous Court (Pass 3D)
IMPLEMENTED for **new games**: Night VII Marius demand, actionable published research, a limited-inspection counterproposal, and one bounded real Sandbox NPC payment. Old saves keep their previous rules.
To reproduce: seek Marius’s appointment I → feed II/III → invite Mirelle IV → wait V → withdraw her invitation VI → answer Marius VII. Accept keeps protection for continuing Library entry; counter proposes time-limited entry using the published account and Cassian’s settled paid escape; refusal costs Marius’s protection. Independent rights remain independent.
Cassian’s 0.01 allowance is actual pre-funded local Sandbox NEAR, separate from gas, not real money or a generic currency. No testnet migration. See [Pass 3D evidence and limitations](docs/PASS3D.md).

Encounter layout correction: IMPLEMENTED — 44/56 desktop/tablet split, compact 26dvh mobile portraits and one natural scroll flow. Rendered checks at 1280, 900, 390 and 320px widths: [layout evidence](docs/ENCOUNTER_LAYOUT.md). Gameplay and artwork unchanged.

### Multi-campaign contract (Pass 4B.1)
One authority WASM now hosts campaign-addressed World state. The private registry creates storage-backed campaigns; every runtime call and callback includes campaign_id. The Sandbox adapter can bind distinct actor sets and separate recovery journals to the same deployed contract. Testnet deployment and restricted signing are verified in Pass 4B.2. Public session/signing integration remains PARTIAL; see docs/PASS4C1.md. See [architecture, verification and legacy-save limits](docs/PASS4B1.md).
