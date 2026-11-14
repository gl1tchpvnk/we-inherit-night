# Static castle and one-time room introductions — IMPLEMENTED locally

## Changes
- `src/main.tsx`, `src/style.css`: removed castle overlays/hotspots, room-view entry UI and associated hotspot styles. The existing castle artwork remains the hub. No replacement room navigation menu. Conversations, nightly decisions, records, Relationships, Rights and Chronicle remain available.
- `src/navigation.ts`, `src/GameInspection.tsx`: Library guidance opens `record:library` directly. Existing room records can also be read within their Rights inspection. Underlying properties, access checks, operations and room definitions remain intact; a record is information, not room entry.
- `src/encounters.ts`, `src/VampireEncounter.tsx`: explicit first-encounter triggers for Lounge/Library, per-room completion and pending destination in existing campaign-scoped browser memory, Continue/Skip (Escape follows Skip), no Feed or other gameplay buttons on introductions. Generic decisions/reckonings do not trigger introductions from location metadata. Completion does not mark the destination read. Old saved room views resume at their current narrative record, preserving active conversations when present.
- `src/GameEntry.tsx`, `src/entry.ts`: unchanged approved four-panel prose and first-feeding/first-day text; bridge now uses the existing Crypt interior. Existing `arrivalDone` is the campaign-scoped Crypt marker. Older midgame saves do not replay historical feeding even if an unfinished old marker survives. Initialization still gates entry; runtime labels distinguish hosted Testnet from local Sandbox/inspection.
- Tests: `tests/room-introductions.test.mjs` adds five focused tests; entry/navigation assertions updated for runtime-specific wording and direct records. README, requirements and PROGRESS updated.

## Audit disposition against the current working tree
A. Already fixed before this task: `petitionHasShelter` excludes Marius’s conditional Court grant, requires qualifying independent shelter, and preserves restricted observations. Existing warning describes the unfinished-service switching risk. Existing policy/scene regressions PASS; deliberate switching remains eligible. No new policy, cost or deadline change.
B. Already fixed: Seraphine’s questions distinguish available, expired-unaccepted (even status `offered`), active accepted and expired accepted terms using contract night. Existing regression tests PASS; late-browser question verified. No duplicate rewrite.
C. The current Castle-map exit already cleared its request. The remaining request-lifetime hazard was that requests could survive other navigation/remount paths. Accepted external navigation requests are now consumed by the director, so remounting cannot replay them over saved current view or a pending introduction. The exact Relationships → castle → Main menu → Back sequence passes in a hosted-mode local browser fixture.
D. Living Court reckoning already used “Review tonight’s choices.” Retained and verified it. Generic completion fallback now says “Continue”; explicit castle navigation actually opens the hub. No forced bypass of consequences.
E. Unconditional local-preview/local-rights wording was present. Replaced only current UI descriptions with runtime-specific text; deterministic/no-live-AI disclosure remains. Historical documentation and genuine local Sandbox wording were not globally rewritten.

## Introduction wording
### Crypt — existing approved bridge, unchanged
Hunger comes before understanding. Vesper guides your first feeding. When its urgency ebbs, she brings you to the Crypt before daylight.

You survive your first day behind its stone, sheltered by her permission.

Then you awaken. Night One begins. The next decision is yours.

### Lounge — provisional setting prose
Low light gathers around the tables. Here, a quiet conversation can carry further than a raised voice. There is room to listen before you answer.

### Library — provisional setting prose
Shelves rise into the dimness. Beyond these walls, the court measures what each invitation permits. Here, you decide whom to admit. Ownership gives you that choice; it does not keep out the dawn.

## Verification
- PASS: 37 focused checks covering introductions, entry, navigation and previously corrected policy/dialogue; full 212-test automated regression suite; TypeScript/Vite production build; final whitespace check.
- PASS: 11 actual headless Chromium scenarios against a disposable local production build configured for hosted-mode UI, with simulated API responses only. Desktop 1440×900 and mobile 390×844 screenshots inspected. No public server/configuration was changed.
- Opening completed versus skipped: identical fixture Blood 8, action allowance 1, internal night 0, rights, terms/deadlines, obligations and empty NPC history. Both paths issued only `view`. Completing/skipping while initialization was held pending stayed outside playable Night 1 until the response was released.
- Direct Seraphine conversation and sanctuary proposal, late Seraphine conversation, Library record/title/proposal/character routes all showed the appropriate first introduction. Reload during each preserved its destination; Continue/Skip returned there without a gameplay request; later reload did not repeat. Fresh campaign memory starts empty. Late closed-offer answer remained current.
- Castle has no buttons/hotspots/tab stops in the illustration. Relationships/menu return and direct Library record link passed. Old Library-room save resumed to current record; old unfinished Crypt marker did not replay midgame feeding.
- Intro rendering has only Continue and Skip; no Feed, Rest, Wait or commitments. Existing action terms remain at the actual decision. Reading memory and replies remain separate from room completion.
- NOT RUN: new Sandbox integration, live Testnet/public acceptance or another seven-night walkthrough. No contract, gameplay, economy, signing, settlement or NPC-policy logic changed. Existing automated enforcement/recovery coverage remains intact. Browser fixtures are not on-chain acceptance evidence.

No unresolved defect found in this scope. Persistence requires ordinary browser storage, as with existing reading history; disabled/cleared storage cannot retain presentation completion. No commit, push or deployment. Ignored local evidence: `.local/room-browser/report.json`, screenshots, `.local/room-focused.log`, `.local/room-regression.log`.
