# Pass 2H — Political Power and the Living Court

Status: authority gameplay implemented; new NPC-funded earnings/purchases explicitly deferred by user. Local Sandbox only; deterministic policies, no live LLM. Rust unchanged.

## Focused review and decisions
Reviewed AGENTS, PROGRESS, Pass 2G, relevant rules/canon, scene/navigation, agent, campaign journal and contract-interface code. Baseline: 63 Node tests and production build passed. The adversarial review was supplied in conversation, not a repository report.

The player already owns the Library. `grant_access`, derived delegation, `revoke_grant` and `enter_room` were supported but largely unavailable as normal player power. Vesper controls her Crypt grants; Marius owns institutional Court rights; Seraphine owns independent Sanctuary/Lounge; Lucien owns Passage. Genealogy conveys none of these permissions.

Lounge tenancy had no compelling strategic payoff. New Living Court bootstraps now receive an actual Seraphine-issued Lounge invitation. Existing lease records and semantics remain untouched. The standing Lounge lease, duplicate dossier route, unfinished exchange, redundant investigations, Exposure controls and decorative numeric relationship scores are demoted in new campaigns. Legacy saves retain their original UI/rules. Conversations and leaving an offer are free; commitments retain one action per night.

## Authority and late-game dispute
New assignments are PROVISIONAL gameplay, not recovered historical canon:

| Actor | Actual operation / authority | Consequence |
|---|---|---|
| Player | Own Library; grant scoped entry with delegation | Choose Mirelle or Dorian on Nights 4–6 |
| Mirelle | Player-issued Library root; delegates entry to Cassian | Research on a later reckoning satisfies Marius’s service |
| Dorian | Alternative player-issued root; delegates entry to Lucien | Research unlocks permanent patron-dependent Passage |
| Player | Revoke own Library root | Both investigator and derived assistant lose access; unfinished research stops |
| Marius | Own Court; independent nondelegable entry grant | Rewards Mirelle’s completed research with protection |
| Lucien | Own Passage; independent nondelegable entry grant | Rewards Dorian’s research with protection without scheduled expiry |
| Vesper | Issuer of Crypt grant only | Revokes Crypt at ultimatum; cannot revoke player Library grants |
| Seraphine | Own Lounge and Sanctuary | Actual Lounge invitation; existing paid Sanctuary lease |

Mirelle’s initial bootstrap Library permission now expires at the start of Night Four in **new** Living Court saves. An explicit player grant is then required. No existing grant is edited. Research is one finite publication: an assistant must hold an effective derived grant, and the investigator must successfully execute `enter_room` at a later reckoning. Publication closes the competing research opportunity. Revocation cannot erase published information or unrelated patron rights.

Dorian’s competing petition is an off-chain reaction, not an authority operation or penalty. His conditional dialogue acknowledges Mirelle’s selection. NPC-to-NPC effects are real derived permissions (Mirelle → Cassian or Dorian → Lucien), plus the existing Sabine → Cassian institutional delegation. Patron rewards are independent grants, not children of the Library grant.

## Presentation and Lounge
`livingCourt.ts` projects state into the existing `VampireEncounter`/director; no second dialogue engine. Ask, inspect an offer, commit, or leave. Material benefits, costs, dependence and publication risk stay visible. Expanded inspection contains methods, current rights and actual available transaction records. Existing Seraphine, Vesper, Marius and Dorian artwork is retained; the other four remain symbolic placeholders. Dialogue is provisional and gives no permission itself.

Lounge entry is free and verified. Its normal interactions offer sanctuary negotiations, useful conversations, and the Library bargains. The player can authorize another vampire from the encounter and see delegation, publication and patron responses in reckoning. The two initial protection routes remain available. Lucien’s previously dead-end temporary route can now become lasting patron protection through Dorian’s timely work.

## Economics: explicit scope limit
The existing Sanctuary acceptance costs **0.02 Sandbox NEAR**, prepaid through `accept_lease`; Seraphine can collect through the existing `claim_rent` semantics. New NPC-funded jobs, player earnings, and NPC purchases are **NOT IMPLEMENTED**. Restricted NPC function-call keys cannot attach the required deposit to the existing paid lease method. The user chose to keep Rust unchanged rather than add escrow functionality or weaken signing with full-access NPC keys. No balance changes or payments were fabricated. The original Lounge “earn actual NEAR” acceptance requirement remains deferred; this is not a complete economic redesign.

## Validation, execution and recovery
`library.ts` centralizes typed Library rules/operation derivation; `agents.ts` remains the single NPC proposal/validation boundary. Observations remain actor-specific. The campaign runner derives a fixed allowed operation, revalidates fresh authority, journals intent and nonce, executes through the existing restricted signer, and verifies postconditions before committing consequences. A lost `enter_room` response is recovered by the actor’s recorded nonce; grant/revocation recovery checks issuer and actual effective ledger state. No arbitrary method, recipient, gas or deposit comes from dialogue.

The optional persisted `politics.library` field marks new Living Court campaigns. Existing migrations and old saves are not silently upgraded into different rights. Pending transactions and one-turn-per-NPC journals remain the original infrastructure. Presentation IDs/storage remain compatible.

## Outcomes
Unbound remains surviving independent Library ownership plus effective independent Sanctuary protection; the lease is not ownership. Marius’s effective Court protection with fulfilled service remains Favoured. New Living Court saves also recognize an effective **permanent Lucien-issued Passage grant** as Favoured, explicitly dependent on Lucien. Temporary passage alone does not qualify at the end. Blood and early-defeat checks remain unchanged. Published research and surviving dependent permissions are explained separately from the ending predicate.

## Verification
| Check | Result | Evidence / scope |
|---|---|---|
| Node | PASS 70/70 | Includes 17 political runner tests; mocked authority fixtures are not chain evidence |
| TypeScript + production Vite build | PASS | Final build after browser fixes |
| Full Linux NEAR Sandbox | PASS 35/35 executable tests | 556.338 seconds; one Windows-only test skipped on Linux |
| Windows-to-WSL bundled startup/reload | PASS 1/1 separately | Finalized eight-transaction Living Court bootstrap and safe resume |
| Three new real Sandbox routes | PASS | Mirelle, Dorian, revoke-before-publication; included in full suite |
| Rust unit tests | NOT RERUN | Rust/interface/WASM unchanged; last recorded baseline 11/11 |
| Desktop browser | PASS | Actual in-app 1280×900; seven-night run and ending |
| Responsive mobile browser | PASS, scoped | Actual in-app 390×844; terms, free keyboard refusal, re-entry, grant commitment, research and patron reckoning; contained scrolling |
| Physical phone / independent novice test | NOT RUN | No claim of either |
| Live LLM / public network | NOT RUN | Intentionally disabled / no deployment |

Targeted real evidence: `docs/evidence/pass2h-{mirelle,dorian,withdraw}.json`. These include actual successful receipts and actual rejection of Vesper attempting to revoke a player-issued Library grant. Sandbox tests verify the investigator and assistant lose access after revocation while separate rights survive. New mocked tests inject lost grant/enter-room responses and assert one execution after reload. Full existing authority, economy, agent, migration and recovery tests remain passing.

Browser route: N1 title filing → N2 Sanctuary (actual 0.02 NEAR acceptance) → N3 feeding/Vesper revocation → N4 Lounge visit and Mirelle permission → N5 pass, research and Marius protection → N6 withdrawal → N7 pass → Unbound. There were **25 recorded transactions and 56 unique NPC turns**; reloading the ending preserved both counts. `docs/evidence/pass2h-browser.json` records real transaction identifiers and `reloadStable:true`. Screens: `pass2h-mobile.png`, `pass2h-ending.png`.

Rendered inspection caught and fixed flex-shrink text overlap, stale dossier guidance, and a quiet-reckoning omission of the player's own withdrawal. A dedicated regression checks protected-state guidance and the withdrawal result. The original preview campaign was preserved and restored to its Night One title at http://127.0.0.1:5187/. New mechanics require New Game, with the existing replacement confirmation. The isolated acceptance save remains under `.local/pass2h-preview`.

## Changed files
- Rules/state: `src/library.ts` (new), `src/game.ts`, `src/politics.ts`, `src/agents.ts`.
- Restricted execution/bootstrap: `scripts/sandbox/campaign.mjs`, `scenario.mjs`, `play.mjs`.
- Presentation: `src/livingCourt.ts` (new), `story.ts`, `encounters.ts`, `VampireEncounter.tsx`, `navigation.ts`, `main.tsx`, `GameInspection.tsx`, `style.css`.
- Tests: `tests/politics.test.mjs`, `tests/sandbox/living-court.test.mjs` (new), `tests/sandbox/startup.test.mjs`.
- Documentation/evidence: this report, PROGRESS, AGENTS, PROJECT_REQUIREMENTS, GAME_RULES, VAMPIRE_AGENTS, README, docs/ARCHITECTURE and the named evidence files. HACKATHON_REQUIREMENTS was reviewed and left unchanged.

## Limits and deferred work
No new Rust methods, live LLM, public deployment, council voting or new currency. Dialogue is authored, policies deterministic. Publication is an explicit off-chain political consequence of verified access, not an on-chain document system. The local single-runner/serialized-signing assumptions remain; production custody and tamper-resistant off-chain saves are not solved. Final portraits, financial earning mechanisms and broader late-game competition remain deferred. Independent novice playtesting has not occurred.

Visual limitations: four symbolic portraits remain. Seraphine's supplied composition includes an embedded BACK graphic; the portrait crop retains that noninteractive artwork. Mobile dialogue/inspection uses contained scrolling. Late play is still intentionally small: one finite investigation with two alternatives, not a general bargaining simulation. Dorian’s rival petition has no hidden retaliation penalty. After publication, withdrawing access changes future entry but not already-earned protection; the limited campaign gives that choice less immediate risk than pre-publication withdrawal.
