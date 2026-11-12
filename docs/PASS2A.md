# Pass 2A — vampire canon, deterministic rules and agent foundation

## Audit and scope

Read root AGENTS, project/hackathon requirements, Pass 1, architecture, threat
model, economy documentation, game/UI definitions, scenario runner, persistence,
contract and existing tests. No nested repository instructions were found in the
file inventory. This checkout has no `.git` directory; no commit/diff claim is made.
Baseline: 12 Node tests, nine Rust unit tests and TypeScript/Vite build passed.
The existing full Sandbox regressions were also run against the resulting code.

Canon: `VAMPIRE_AGENTS.md` cites existing seeds, room text, discoveries and actual
bootstrap. House Volari/Marius had no prior repository source. The Pass 2A user
instruction is explicitly recorded as the source for their names and independent
bloodlines/authority. Sires, marriage, House hierarchy and missing personality/
voice details remain TBD. No Marius account, assets or policy were fabricated.
`GAME_RULES.md` classifies each deterministic rule and deferred requirement.

## Implementation

- `src/agents.ts`: centralized typed profiles, actor observations, proposal
  schema, deterministic policies and the single NPC validator moved from game.ts.
- `Campaign.npcs`: mutable relationships/memory only; static goals come from
  profiles, actual holdings from contract records. No narrative authority.
- Observations include public ledger records and only the selected NPC's own
  local memory/relationships. They exclude player resources/discoveries and other
  NPC private state; actor access is queried for that account, not the player.
- Only existing `revoke` (grant 0), `collect` (lease 0) and `pass` proposals are
  enabled. Claimed identities, arbitrary targets/methods and extra fields fail.
  Vesper retaliates, Seraphine collects vested rent, Lucien passes. These are
  deterministic policies; no LLM decisions, autonomous AI or negotiation.
- Existing serialized dawn schedules each NPC once per night. Invalid/throwing
  selector falls back once, then the same validator checks it. A journaled intent
  is revalidated against fresh authority/night before the existing signer runs.
  Chain postconditions are confirmed before local relationships/history commit.
- Structured `agentHistory` persists night, actor, action, provenance and outcome
  (max 21 entries in a fresh campaign). Pending effects are not exposed as final
  outcomes. Reload reconciles already-revoked/already-settled records without
  submitting again or applying relationships/upkeep twice.
- Existing version-2 saves migrate additively: strip stale profile/holdings copies,
  add empty history without fabricating old decisions; retain journal recovery,
  contract identity, resources, discoveries and nights. Legacy migration remains.
- UI clearly labels deterministic policies and directs holdings inspection to
  actual contract authority. No graphics, currencies, voting, provider, signing
  infrastructure, contract changes or dependencies were introduced.

## Authorization findings

Rust `revoke_grant` checks original issuer and not-already-revoked, not effective
validity. Revoking an expired grant is legal. Accepted rent remains payable after
lease entry expires. Accepted leases cannot be revoked/cancelled. Ancestry never
confers access; independent Library title and unrelated grant roots survive.
Views are read data, not authentication. Transactions still authenticate predecessor
and enforce nonce, scopes, ownership and economic rules in the existing contract.

## Verification

- PASS: 18 Node tests (`npm test`), including six agent tests for observation
  boundaries/copy isolation, strict shape/identity, unauthorized actions,
  expired decisions, revoked rights, pending payouts, post-expiry rent, fallback,
  nightly scheduling, migration and three persistence fault windows.
- PASS: nine Rust tests (`cargo test --lib --locked`), native bridge build
  (`cargo build --features local-demo --bin local-demo --locked`), Rust format
  check and TypeScript/Vite production build.
- PASS: focused real Sandbox agent test (`tests/sandbox/agents.test.mjs`):
  invalid selector falls back, actor-specific observations, finalized revocation
  response lost, process/chain restart, exactly one revoke/claim/advance, preserved
  Library title and three committed agent outcomes. Actual receipts:
  `docs/evidence/pass2a-sandbox.json`.
- PASS: all 25 existing Sandbox test entries, zero failures/skips (authority,
  economy, seven-night campaign/restart and gameplay/reset); plus the separate
  focused agent test above = 26 passing Sandbox entries across the two runs.
  Existing regression evidence files were refreshed by their test harnesses.
- No Rust source changed. Sandbox executed the existing Pass 1 WASM, SHA-256
  `2fffcca3a734bb142313c9fb49248ea4da642c351fc22da03f87383f2de3f08f`;
  WASM rebuild was NOT RUN for this TypeScript-only change.
- Manual browser/mobile/accessibility re-test: NOT RUN. Public testnet: NOT RUN.
  No public deployment, signing or funding occurred; tests use disposable local
  Sandbox accounts only. Mock runner fault tests are not chain evidence.

Environment notes: initial WSL access was sandbox-blocked; approved tool execution
allowed local tests. WSL has no Cargo on PATH, so Rust checks used installed
Windows Cargo (`AWS_LC_SYS_PREBUILT_NASM=1`). The Linux Node runtime is
`.local/node-v24.13.0-linux-x64/bin/node`. Initial new fault tests hit Windows
temporary-directory rename permissions; moving their fixtures to ignored `.local`
resolved that environment failure. Final Node checks pass without escalation.

## Reproduce

Use README setup. Run `npm test`, `npm run build`, `cargo test --lib --locked`.
With Linux Node 24 on PATH, run `npm run test:sandbox`. On this Windows checkout:

```powershell
wsl -d Ubuntu -- .local/node-v24.13.0-linux-x64/bin/node --test --test-concurrency=1 tests/sandbox/agents.test.mjs tests/sandbox/authority.test.mjs tests/sandbox/campaign.test.mjs tests/sandbox/economy.test.mjs tests/sandbox/gameplay.test.mjs
```

Accept the Lounge lease, end the night, inspect current rights and policy log,
then reload. Confirm Crypt denial, Library access and no duplicate relationship
changes. The saved campaign's structured history records the NPC turns.

## Unresolved and Pass 2B dependencies

- Supply missing Marius/House genealogy, relationships, objectives and voice;
  do not infer marriage, dependency or assets from shared House membership.
- Introduce bounded asynchronous provider decisions (timeouts, tokens, attempts),
  untrusted narrative handling and explicit decision provenance. Current selector
  is synchronous and trusted code, not an execution sandbox for arbitrary code.
- Design negotiation/NPC-to-NPC actions and typed targets, review allowed methods
  and contract-enforced economics before expanding permissions. Current actions
  cannot spend NPC funds; method/gas limits do not implement a spending budget.
- History, nightly limits and resource rules remain trusted local simulation.
  Recovery uses fixed immutable IDs and observed postconditions; external writers,
  hostile RPC, all crash interleavings and power-loss durability are not solved.
- Eight-seat identities/eligibility and final Night 7 voting remain Pass 3.
  Public wallet/testnet deployment and production custody remain unimplemented.

Documentation reviewed/updated: AGENTS, PROJECT_REQUIREMENTS, README, PROGRESS,
architecture, threat model and Pass 1 cross-reference; new canon/rules/this report.
HACKATHON_REQUIREMENTS reviewed and unchanged: no new externally verified rules.
