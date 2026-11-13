# Gameplay and presentation refinement — local PASS

Not deployed. The public Render version is unchanged.

## Changes
- Seven nights retained. Vesper introduces the Crypt deadline; early discovery and decisions prioritize two or three responses. Named secondary choices remain expandable, and urgent commitments remain primary.
- Feeding and rest share the nightly decision list with political actions. Exploration, free conversations and optional rights inspection remain separate.
- Encounter dialogue advances before responses appear, with one exit/back control. Material commitments remain visible before confirmation; redundant cost labels and technical explanations were reduced.
- Exposure no longer changes, restricts actions, causes defeat or appears in the HUD. Conceal was retired because reducing Exposure was its only purpose. Blood, feeding/rest amounts, upkeep, action costs and political ending conditions are unchanged. Existing Exposure values and historical completed outcomes remain recorded, not recomputed.
- A persistent CAMPAIGN COMPLETE page names the ending, explains revocable patronage versus temporary sanctuary, shows up to three recorded consequences, and offers Chronicle review.
- Public replay requires an authoritative completed archive/reclamation flag, not merely an archive commitment. Pending settlement offers recovery. Normal completed archives remain reviewable after reload; Quit/abandoned campaigns remain non-resumable. Existing settlement and transaction mechanisms are reused.
- The exact inactivity notice has dedicated styling beneath the title artwork and buttons. Expiration behavior and artwork assets are unchanged.

## Verification
- PASS: final automated suite, 155/155 (`npm test`). Includes security, session isolation, payments, persistence, gameplay and replay guards.
- PASS: focused presentation/entry/lifecycle suite, 57/57. A restricted-environment run initially hit localhost EACCES; it passed with local networking permitted.
- PASS: Testnet-mode production build (`VITE_MODE=testnet`, `VITE_TESTNET_BACKEND=1`, `npm run build`).
- PASS: real local Sandbox seven-night integration, restricted prepaid actors, reload after every night, 56 NPC turns, settled passage, accepted final counterproposal, zero liabilities and active slots after reclamation. Lost finalized reclaim response recovered after SQLite reopen without another transaction.
- PASS: existing Quit Sandbox integration separately verifies paid settlement, interruption recovery, replay rejection and fresh creation in the freed slot.
- PASS: full local browser playthrough: petition Marius → feed → feed → authorize Mirelle → wait for publication → withdraw Library invitations → limited final counterproposal. Result: The Favoured. Continue after reload restores the finale; Chronicle includes all seven nights; replay returns to title.
- PASS: desktop/mobile title and finale visual checks, reachable mobile finale controls; no Exposure HUD or separate personal-action section. Title screenshots use a read-only rendering of the actual component with public-mode metadata, not a live service.
- PASS: `git diff --check`.

Evidence: `evidence/gameplay-refinement/`. Sandbox results are local-chain evidence, not Testnet evidence. No contract, signing credentials, funding, Render configuration, commit, push or deployment changes.

## Limits
Only one route received a complete browser walkthrough; other branches remain covered by automated regressions. Public deployment and hosted verification remain outstanding. These changes do not establish permanent independence where the recorded ending grants temporary sanctuary or revocable patronage. Narrative text remains provisional under existing canon rules.

## Blood visibility follow-up — local PASS
Blood now remains visible in encounters and decision screens, including while scrolling on mobile. A short hunger line scales with current Blood. Feed remains a primary choice labelled with its 4 Blood recovery. Warning text appears before lethal commitments without extra confirmation.

The presentation evaluates the existing `playerAction` and `dawn` functions on copies. A zero result after spending is immediately fatal; a zero result even with shelter is certainly fatal at dawn. If only the unsheltered result reaches zero, the warning explicitly depends on shelter because NPC actions can change rights before upkeep. No survival calculations or contract behavior changed.

PASS: 158 automated tests; boundary coverage across Blood 1–12, sheltered/unsheltered outcomes, action costs, feed/rest recovery, caps, free information, legacy nonautomatic turns, wait and pending-state handling; actual encounter rendering checks; desktop/mobile visibility and sticky scrolling; Testnet production build. The isolated real Sandbox seven-night test passed again through final counterproposal, financial settlement, archive/reclaim and interrupted-response recovery. This is a regression run, not another public Testnet playthrough. Screenshots and local-chain results are in `evidence/blood-visibility/`.

## Encounter Feed follow-up — local PASS
Title filing at 2 Blood is correctly fatal in the one-action campaign: 2 − 1 to file = 1 before dawn, then even sheltered upkeep of 1 reaches the defeat threshold of zero. NPC actions precede upkeep; losing shelter only increases the deduction. The warning now states this explicitly.

A separate **Your action** area makes Feed available from encounters without returning to the castle. It uses the existing command/availability and shared busy guard; successful feeding clears the active encounter and rebuilds from confirmed state, while uncertain results retain recovery protections. No survival or contract change.

PASS: 19 focused Blood/encounter tests and one focused SQLite campaign-engine test (including stale feed replay and unresolved-journal preservation), production build and desktop/mobile UI checks. A local React fixture double-click submitted exactly one feed and advanced from Blood 2 to 5 after restoration/upkeep and Night Two; the fixture made no chain transactions. A test fixture initially discarded error strings; correcting that fixture allowed the stale-request assertion to observe the existing backend rejection. No remaining test failures, full-suite rerun or public deployment.
