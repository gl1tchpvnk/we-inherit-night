# NPC visibility audit and targeted correction

Status: IMPLEMENTED locally; not deployed. Presentation only.

## Verified pipeline and existing presentation

- `scripts/sandbox/campaign.mjs::runDawn` runs after the final nightly commitment or explicit end-night. Eight roles in `agents.ts::COURT_ORDER` each receive at most one turn: Vesper, Seraphine, Mirelle, Cassian, Dorian, Marius, Lucien, Sabine. Availability depends on existing rights, night and obligations; many turns pass.
- `observeAgent` supplies restricted observations; `selectNpcAction` uses deterministic priorities/seeded competition; `validateNpc` checks identity, legal choices and one-turn limits. No model inference. Some policies are fixed enforcement, not discretionary strategy.
- Fixed operations in `agents.ts`, `library.ts` and `finalCourt.ts` implement grants, revocation, rent, scoped passage offers/purchases and authorized room entry. Pass, standing offer presentation, finite competition, publication lead and rival petition are local recorded events. Final-answer acceptance can also be local when no revocation is required. Research combines verified room entry with a local published result.
- The runner saves intent before execution, verifies outcomes, then commits history. Testnet `scenario.mjs` verifies FINAL transaction identity/receipts. `server.mjs::publicSnapshot` exposes completed history fields: night, actor, kind, source, execution, outcome; private memories, rationale and pending journals stay excluded.
- `buildEncounterScenes` builds chronological reckoning records; `courtReactions` projects completed journal/ledger evidence into authored reactions. `addCourtReactions` selects one leading reaction, prioritizing completed research, major and significant developments. The next chapter follows. `GameInspection` exposes all reaction/reckoning scenes in Chronicle, plus a collapsed execution record and night log.

## Demonstrable visibility failures

1. Any latest reaction disabled the automatic reckoning, but a night containing only minor reactions selected no automatic replacement. Completed competition, sponsorship or settlement could therefore be absent from the automatic transition.
2. NPC reactions used generic headings identical to narrative correspondence. Actor/action/recorded-night evidence was partly in terms or collapsed disclosure; the dialogue alone did not consistently establish causality.
3. The director intentionally selects one lead, not every event. The full record remains in Chronicle. This correction preserves that limit rather than adding an activity feed or another summary screen.

## Correction

- `reactiveCourt.ts`: factual activity captions derived only inside the completed, non-pass NPC-history branch. Captions name actor, recorded action and night. Wording identifies the Crypt ultimatum, unmet service, final-demand terms and agreed rent without inventing choice or motive.
- Existing priority remains; when only minor NPC reactions exist, one stable existing reaction becomes the lead. Suppress the full reckoning only when a replacement is actually selected.
- `encounters.ts`: optional presentation-only activity field. No response or persisted schema change.
- `VampireEncounter.tsx`: actual `reaction:npc:` developments now render “AND WHILE YOU SLEPT…” above the factual actor/action caption, removing only the rendered technical night prefix. The underlying activity record remains intact. Omit the redundant bottom timing paragraph on those scenes. Player actions and unrelated reactions retain their existing headings. Dialogue, choices, scene IDs, completion/read memory and artwork remain unchanged.

## Attribution boundaries

| Evidence | What can safely be communicated |
|---|---|
| Completed NPC journal entry | Named recorded action; confirmed versus local remains in the existing inspection detail. |
| Known fixed policy action | Ultimatum/service/final-demand enforcement, not invented discretionary reasoning. |
| Lease/grant expiry | Automatic rule consequence, never a fresh NPC decision. Existing projections remain separate. |
| Player-issued grant, acceptance or withdrawal | Player/contract evidence; these reactions do not receive NPC activity captions. |
| Authored reaction or continuing right | Correspondence/current condition, not proof of a new action. |
| Pass | No recorded decision reason/candidate set sufficient to distinguish strategic restraint from no opportunity. Suppressed; no motive invented. |

There is no explicit stored discretionary/mandatory classification. Known action semantics support cautious factual wording, not a general autonomy label. Public projection supplies sufficient facts for this correction; stronger explanations would require additional provenance and are out of scope. Same-night reaction ordering remains the existing stable ID order, not a claim of transaction timestamp ordering.

## Verification

- PASS: 33 targeted tests (`pass3b`, `encounters`, `encounter-flow`), including actor/action attribution, pending exclusion, non-NPC exclusion, immutable input, stable IDs, reload deduplication, minor-only selection, existing significant priority and reachable encounter targets.
- PASS: production TypeScript/Vite build; diff whitespace check.
- PASS: nine local Chromium cases, Dorian petition / Vesper scheduled revocation / Cassian competition at 1440×900, 390×844 and 320×568. Mocked API only; external network blocked. Reload resumes unread activity; completed activity does not repeat. Requests were view-only; no browser errors or horizontal overflow.
- Compared the actual caption layout with the previous generic heading plus bottom timestamp: script height decreased 22–39 pixels in all nine cases. Existing mobile vertical scrolling remains reachable; no added scrolling burden. Desktop/mobile captures visually inspected.
- Browser harness/evidence: ignored `.local/npc-visibility-browser.mjs` and `.local/npc-visibility/`. Browser initially could not reach loopback in the sandbox; isolated execution outside that restriction completed successfully.
- NOT RUN: Testnet transactions, Sandbox campaigns, full regression or public deployment. This targeted presentation correction does not alter execution or require a new campaign-wide acceptance run.

Reviewed AGENTS, project requirements, hackathon requirements, README and progress. Only README and progress require updates; no product mechanic or external submission rule changed. No commit, push or deployment.
