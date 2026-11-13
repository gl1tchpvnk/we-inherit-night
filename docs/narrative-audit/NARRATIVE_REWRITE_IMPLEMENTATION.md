# Narrative V2 — implementation record

Status: **IMPLEMENTED locally; not committed, pushed or deployed.**

## Catalogue conformance

Applied the approved [V2 catalogue](NARRATIVE_REWRITE_PROPOSAL_V2.md), not the whole V1 proposal: **142 KEEP ORIGINAL, 32 KEEP V1, 33 REWRITE V2 = 207 entries**.

Static checks locate every KEEP ORIGINAL excerpt in its source file and all 45 standalone selected replacements verbatim (allowing TypeScript string escaping). The remaining 20 selected entries contain conditional, composed, template or structural instructions; these were reviewed in their projected fields and representative scene tests. Presence checks alone do not prove visibility: scene and rendered-markup assertions also check composition, action destinations and material terms.

V2's composition rule supersedes repeated assembly of retained strings. Character greetings remain in character encounters but are not prepended to negotiations. Withdrawal retains its original open/published speaker line once and original visible terms; a concise dependent-access, unfinished-work and financial-obligation disclosure preserves information formerly carried by the overlapping material sentence. Feed retains its narrator line and restoration detail.

## Actual changes

- `src/entry.ts`: selected prologue paragraphs.
- `src/livingCourt.ts`: selected character/state dialogue, chapter introductions, separate discovery prompts, action negotiations, final-demand choices, outcome epilogues and factual consequences. Scene IDs, free-question branches, command destinations and eligibility remain.
- `src/reactiveCourt.ts`: selected confirmed replies; removed duplicate reaction narration from terms; retained present standing and evidence.
- `src/encounters.ts`: Living Court standing-lease rejection accurately says no nightly action; legacy wording retained.
- `src/blood.ts`: unanswered final-demand warning on last-night Feed only when the existing demand applies. Earlier local Feed integration preserved.
- `src/leaseNarrative.ts`: after the final reckoning, describe remaining lease nights instead of promising passage through an already completed final night. No lease arithmetic or state changes.
- `src/GameInspection.tsx`: selected factual runtime and bounded NPC-economy descriptions.
- Tests: eight focused V2 cases; updated affected copy/duplicate assertions in `entry`, `pass3a`, and `pass3c`. Earlier local Blood tests preserved.
- V2 reference incorporates the final editorial corrections; this record and PROGRESS document implementation.

No contract, engine, NPC policy, chain execution, persistence, signing, campaign lifecycle, artwork, layout or cinematic implementation changed in this task. Existing unrelated working-tree changes were retained.

## Final editorial corrections

1. Marius asks: “I want an invitation to your Library that does not expire. Keep your title. I have no interest in taking it from you.” Surrounding pressure and original predicates remain.
2. Night Three: “Tonight, Vesper's promise ends. By dawn, whatever protection you have secured elsewhere must be enough.” Completed withdrawal remains tied to confirmed evidence.
3. Blood defeat: “Your Blood is exhausted. Whatever shelter you held, it could not replace what was gone.” Then: “No title could answer that hunger. No promise could sustain you.” No invented timing, earlier decision or transaction; Chronicle/replay controls unchanged.
4. Negotiating or asking alone grants nothing. Existing pending/error guards and confirmed-event filters remain intact. Material terms include separate grant confirmation and the counterproposal's temporary invitation even on rejection.

## Verification

**PASS — 68 focused tests, 0 failures.**

```powershell
node --test --test-reporter=spec tests/narrative-v2.test.mjs tests/encounters.test.mjs tests/pass3a.test.mjs tests/pass3b.test.mjs tests/pass3c.test.mjs tests/final-court.test.mjs tests/blood.test.mjs tests/navigation.test.mjs tests/entry.test.mjs
```

Coverage: representative Nights 1–7; resolvable scene links and permitted commands; Vesper before/after confirmed revocation and independent surviving rights; sanctuary proposal/acceptance/rejection; appointment/service; mutually exclusive investigators, root/derived access and irreversible publication; conditional final demand; accepted/rejected counters and the surviving temporary invitation; Unbound, both Favoured patrons and defeat; Feed warnings; input immutability; pending/failed outcomes; visible terms and duplicate narration.

The cascade fixture marks the root revoked and its child ineffective without falsely marking the child directly revoked. Operation assertions use existing functions against synthetic views; this is not new on-chain verification.

**PASS — production build:** `npm run build` (TypeScript + Vite).

**PASS — catalogue checks:** all dispositions accounted for, original excerpts retained and standalone replacements matched; composite instructions reviewed.

Initial focused failures involved obsolete wording/duplicate expectations and final-night expiry wording; corrected before the passing run. No required security assertions removed.

**NOT RUN:** live Testnet transactions, Sandbox integration, hosted/browser walkthrough or broad infrastructure suites. Rendering checks use React server-rendered markup and synthetic authoritative-view fixtures. No saves read or changed. Save fields remain compatible; no fresh hosted verification is claimed.

## Remaining limitations and readiness

- The retained Seraphine opening uses sanctuary access as shorthand for the normal paid-refuge route. Unusual historical/custom grants could make that shorthand inaccurate; V2 explicitly retained it. No new inference was introduced.
- V2 retained the Cassian fallback inviting pursuit of the appointment and Lucien's requested-passage/deadline fallback. Unusual older states may not fit those assumptions; their predicates were not redesigned.
- Historical correspondence may describe past arrangements; its updated caption and current-standing term distinguish those from present rights.
- Urgent final-demand and survival information may intentionally recur across entry points. Targeted ordinary introductions, chapter exposition and reaction narration no longer duplicate.
- Emotional effectiveness still needs player review. Layout/artwork were unchanged; rendered-content checks do not constitute a full visual walkthrough.

**Ready for deployment review on local verification evidence.** No known blocker in the tested current Living Court routes. Public deployment and hosted verification remain separate steps.

## Per-entry ledger

Decisions follow V2 exactly. Retained excerpts still follow the explicit structural repetition rule. Composite entries preserve original conditional arms except those selected for replacement.

| Entry | Disposition | Source | Verification |
|---|---|---|---|
| R1 — Prologue — A borrowed shelter | REWRITE V2 | src/entry.ts | Replacement matched |
| R2 — Prologue — House Volari | KEEP ORIGINAL | src/entry.ts | Original excerpt checked |
| R3 — Prologue — A power of her own | KEEP ORIGINAL | src/entry.ts | Original excerpt checked |
| R4 — Prologue — Three nights | KEEP V1 | src/entry.ts | Replacement matched |
| R5 — Vesper — opening | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R6 — Vesper — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R7 — Vesper — answer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R8 — Vesper — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R9 — Vesper — reply | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R10 — Night 1 — ultimatum narrator | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R11 — ultimatum → discovery:0 | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R12 — ultimatum → character:vesper | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R13 — Seraphine — opening | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R14 — Seraphine — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R15 — Seraphine — answer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R16 — Seraphine — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R17 — Seraphine — reply | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R18 — Sanctuary — whole negotiation | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R19 — Sanctuary inspection label, not commitment | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R20 — Mirelle — opening | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R21 — Mirelle — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R22 — Mirelle — answer | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R23 — Mirelle — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R24 — Mirelle — reply | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R25 — Dorian — opening | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R26 — Dorian — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R27 — Dorian — answer | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R28 — Dorian — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R29 — Dorian — reply | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R30 — authorize_mirelle — whole negotiation | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R31 — authorize_dorian — whole negotiation | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R32 — authorize_mirelle inspection and existing commit label | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R33 — authorize_dorian inspection and existing commit label | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R34 — final-demand; opening reused by incident:6, decision:6 and character:marius | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R35 — final-demand → corresponding existing action inspection | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R36 — final-demand → corresponding existing action inspection | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R37 — final-demand → corresponding existing action inspection | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R38 — action:final_accept; before commitment | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R39 — action:final_refuse; before commitment | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R40 — action:final_counter; before commitment | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R41 — final_counter commit | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R42 — conclusion:unbound; stored Unbound result | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R43 — endingSummary active accepted Unbound lease branch; retain existing title prefix | KEEP V1 | src/livingCourt.ts | Composite instruction reviewed |
| R44 — Favoured epilogue | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R45 — Chapter 1 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R46 — Chapter 1 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R47 — Chapter 1 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R48 — Chapter 2 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R49 — Chapter 2 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R50 — Chapter 2 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R51 — Chapter 3 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R52 — Chapter 3 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R53 — Chapter 3 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R54 — Chapter 4 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R55 — Chapter 4 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R56 — Chapter 4 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R57 — Chapter 5 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R58 — Chapter 5 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R59 — Chapter 5 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R60 — Chapter 6 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R61 — Chapter 6 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R62 — Chapter 6 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R63 — Chapter 7 title | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R64 — Chapter 7 question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R65 — Chapter 7 base paragraph | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R66 — discovery:0 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R67 — discovery:1 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R68 — discovery:2 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R69 — discovery:3 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R70 — discovery:4 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R71 — discovery:5 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R72 — discovery:6 — shorter hub | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R73 — n=5, published result | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R74 — effective chosen root, result open; preserve leading separator | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R75 — n=6, no root and no published result; preserve leading separator | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R76 — no root, open result, before final night; preserve leading separator | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R77 — Marius — opening | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R78 — Marius — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R79 — Marius — answer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R80 — Marius — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R81 — Marius — reply | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R82 — Lucien — opening | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R83 — Lucien — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R84 — Lucien — answer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R85 — Lucien — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R86 — Lucien — reply | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R87 — Cassian — opening | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R88 — Cassian — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R89 — Cassian — answer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R90 — Cassian — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R91 — Cassian — reply | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R92 — Sabine — opening | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R93 — Sabine — question | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R94 — Sabine — answer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R95 — Sabine — personal | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R96 — Sabine — reply | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R97 — Current Living Court active action negotiation opening selector | KEEP V1 | src/livingCourt.ts | Composite instruction reviewed |
| R98 — investigate_title — composed negotiation | KEEP V1 | src/livingCourt.ts | Composite instruction reviewed |
| R99 — petition_marius — composed negotiation | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R100 — fulfil_service — composed negotiation | KEEP V1 | src/livingCourt.ts | Composite instruction reviewed |
| R101 — withdraw_library — composed negotiation | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R102 — broker_passage — composed negotiation | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R103 — feed — composed negotiation | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R104 — rest — composed negotiation | KEEP V1 | src/livingCourt.ts | Composite instruction reviewed |
| R105 — investigate_title label | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R106 — petition_marius label | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R107 — fulfil_service label | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R108 — withdraw_library inspection; ownership never left player | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R109 — broker_passage label | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R110 — rest label, avoids attributing all later access to Vesper | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R111 — Night 7 Feed warning only when the existing finalDemand is true and no response is recorded; otherwise retain current sentence. | KEEP V1 | src/blood.ts | Composite instruction reviewed |
| R112 — record:crypt | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R113 — record:library | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R114 — record:lounge | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R115 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R116 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R117 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R118 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R119 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R120 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R121 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R122 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R123 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R124 — roomDevelopment existing matching branch | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R125 — passage_offer — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R126 — passage_buy — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R127 — passage_collect — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R128 — final_answer — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R129 — revoke — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R130 — dismiss — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R131 — archive_assist — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R132 — archive_challenge — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R133 — archive_research — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R134 — archive_protect — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R135 — appoint — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R136 — open_passage — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R137 — publish — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R138 — sponsor — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R139 — compete — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R140 — collect — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R141 — collect_sanctuary — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R142 — offer — narrator | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R143 — reactionReply — withdraw, speaker published | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R144 — reactionReply — withdraw, speaker did not publish | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R145 — reactionReply — service-kept | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R146 — reactionReply — Vesper revoke; confirmed only | REWRITE V2 | src/reactiveCourt.ts | Replacement matched |
| R147 — reactionReply — Marius dismiss | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R148 — reactionReply — archive_assist, child no longer effective | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R149 — reactionReply — Mirelle archive_assist | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R150 — reactionReply — Dorian archive_assist | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R151 — reactionReply — Dorian challenge no longer viable | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R152 — reactionReply — Dorian live challenge; existing time/choice guard | KEEP V1 | src/reactiveCourt.ts | Replacement matched |
| R153 — reactionReply — Mirelle research confirmed | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R154 — reactionReply — Dorian research confirmed | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R155 — reactionReply — Marius archive_protect confirmed | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R156 — reactionReply — Lucien archive_protect confirmed | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R157 — reactionReply — Marius appoint player | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R158 — reactionReply — Marius appoint Cassian | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R159 — reactionReply — Lucien open_passage | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R160 — reactionReply — Mirelle publish | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R161 — id:`reaction:key: — narration | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R162 — id:`reaction:withdraw: — narration | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R163 — id:`reaction:lease: — narration | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R164 — id:`reaction:decline: — narration | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R165 — id:'reaction:service-kept' — narration | KEEP ORIGINAL | src/reactiveCourt.ts | Original excerpt checked |
| R166 — All generated court reaction scenes | KEEP V1 | src/reactiveCourt.ts | Composite instruction reviewed |
| R167 — Historical correspondence caption | KEEP V1 | src/reactiveCourt.ts | Composite instruction reviewed |
| R168 — reckoning — revoke | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R169 — reckoning — archive_assist | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R170 — reckoning — archive_research | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R171 — reckoning — archive_protect | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R172 — reckoning — archive_challenge | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R173 — reckoning — appoint | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R174 — reckoning — dismiss | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R175 — reckoning — open_passage | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R176 — reckoning — sponsor | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R177 — reckoning — publish | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R178 — reckoning — compete | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R179 — reckoning — collect | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R180 — reckoning — collect_sanctuary | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R181 — reckoning — offer | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R182 — Accepted lease recap | REWRITE V2 | src/livingCourt.ts | Composite instruction reviewed |
| R183 — reckoning fallback when no generated lines | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R184 — reckoning fallback when no generated lines | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R185 — Ending — Blood defeat epilogue | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R186 — Ending — Non-Blood, nonhistorical-Exposure failure epilogue | REWRITE V2 | src/livingCourt.ts | Replacement matched |
| R187 — Ending — Blood failure summary | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R188 — Ending — Early shelter failure summary; avoids assuming which loss caused the state | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R189 — Ending — Night 7 failure summary | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R190 — Ending — Unbound diagnostic fallback; do not embellish contradictory state | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R191 — Ending — appointment player, service fulfilled; ending consequence | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R192 — Ending — existing revoked court-grant branch; do not infer a specific motive from the revocation alone | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R193 — Ending — unfulfilled, no recorded revoked court grant | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R194 — Ending — published Mirelle ending consequence | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R195 — Ending — published Dorian ending consequence | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R196 — Ending — result open; does not deny independently earned service protection | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R197 — Ending — recorded withdrawn delegable player Library grant | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R198 — Ending — accepted final counter | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R199 — Ending — accepted standing final invitation | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R200 — Ending — rejected final result; include silence, do not assert player explicitly refused | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R201 — Ending — rejected counter with matching effective temporary invitation | KEEP V1 | src/livingCourt.ts | Replacement matched |
| R202 — decision:n narrator | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R203 — hold:n with root/open result | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R204 — hold:n otherwise | KEEP ORIGINAL | src/livingCourt.ts | Original excerpt checked |
| R205 — lease:0 rejection in current Living Court only; retain legacy one-action label outside Library mode. | KEEP V1 | src/encounters.ts | Replacement matched |
| R206 — Diagnostics; finite passage mandate feature. | KEEP V1 | src/GameInspection.tsx | Replacement matched |
| R207 — Diagnostics shared renderer; preserve the existing runtime proof/network indicator. | KEEP V1 | src/GameInspection.tsx | Replacement matched |

## Subsequent investigation/finale follow-up
The scoped follow-up in [INVESTIGATION_FINALE.md](../INVESTIGATION_FINALE.md) adds pre-commitment research purpose, evidence-gated findings/free interpretations and personal correspondence before the retained V2 results text. Completed-investigator question menus and research reaction composition are intentionally superseded by that follow-up. Other approved V2 selections remain. Dorian’s bounded policy change and current verification are documented separately there.

## Subsequent encounter-flow repair
The [encounter-flow repair](../ENCOUNTER_FLOW_REPAIR.md) preserves approved characterization while consolidating mandatory screens and updating state-mismatched openings/questions. Exploratory labels, explicit cost-bearing commitments, unavailable-offer status, final-response consolidation and browser-only read versions supersede earlier route/badge assertions. The V2 text catalogue remains historical approval evidence; it is not proof of current interactive acceptance.
