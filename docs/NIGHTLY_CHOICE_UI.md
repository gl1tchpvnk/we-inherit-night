# Nightly choice and narrative UI correction — IMPLEMENTED locally

## Scope
- Shared strategic choices retain source order, reviewed state, conditions and original commands; political/conversation choices precede a Nightly actions section containing existing Feed then Wait entries.
- Optional entries retain explicit labels; reviewed conversations stay in their existing disclosure. Existing feeding consequence text is visible before opening its confirmation. Wait uses a neutral secondary treatment with visible hover/focus.
- Removed Action counter from both HUD renderers. Playable encounters, including room introductions, share Night/Blood/survival information; the HUD stays visible while scrolling.
- Feed toolbar is confined to strategic decisions, deduplicated against existing Feed choices. Character responses contain no Feed/Wait utilities. Explicit feeding confirmation remains intact.
- Existing GameEntry prologue/arrival boundary already suppresses gameplay HUD and actions. It is unchanged, as are Continue/Skip and all narrative text.
- Removed strategic location heading; existing cinematic label removals, artwork, navigation, scene data and handlers are preserved.

## Verification
PASS: 35 targeted tests (scene presentation, encounter flow, Blood, room introductions, entry); full regression 221/221; production frontend build.
PASS: 10 local Chrome scenarios with mocked API responses at 1672×941, 390×844 and 844×390. Checked order/deduplication, reachable final controls, no horizontal overflow, keyboard focus, exact existing Feed/Wait request envelopes, conversation reload, Back/Tonight’s choices/Castle map, entry Continue/Skip, and Lounge/Library intro HUD.
Narrative/navigation cases issued only view requests. Feed/Wait request tests used simulated responses, not blockchain execution. Existing engine cost/availability tests remain intact.
NOT RUN: live Testnet, Sandbox transaction suites, hosted verification, full campaign walkthrough; no relevant authoritative code changed.
No remaining functional issue found in exercised states. Long strategic lists use ordinary scrolling. Existing flattened portraits and provisional environments are unchanged. No commit, push or deployment.

## Files in this correction
`src/VampireEncounter.tsx`, `src/scenePresentation.ts`, `src/main.tsx`, `src/style.css`; rendering expectations in `tests/blood.test.mjs`, `tests/encounter-flow.test.mjs`; this report, README and PROGRESS.
Reviewed AGENTS, PROJECT_REQUIREMENTS and HACKATHON_REQUIREMENTS; no authority, product-mechanics or external-rule changes needed. Other working-tree changes predate this correction.

## Before / after evidence
Local mocked UI fixtures, matching viewport sizes. Images wait for decode and paint before capture. Scrolled images show reachable lower actions; initial images show composition and HUD. Pre-night images intentionally match: the existing entry boundary was already correct.

| State | Before | After |
|---|---|---|
| Desktop strategic choices | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-1672.png>) |
| Desktop nightly actions (scrolled) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-bottom-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-bottom-1672.png>) |
| Mobile strategic choices | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-390.png>) |
| Mobile nightly actions (scrolled) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-bottom-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-bottom-390.png>) |
| Pre-Night-1 narrative (HUD remains hidden) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/pre-night.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/pre-night.png>) |
| Playable Night 1 (HUD visible) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/playable-night-one.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/playable-night-one.png>) |
| Character dialogue (Feed removed) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/dialogue.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/dialogue.png>) |
| Choices after leaving dialogue | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/after-dialogue.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/after-dialogue.png>) |

[Feed available after leaving dialogue (scrolled)](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/after-dialogue-actions.png>) · [Short landscape verification](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/verified-nightly-844.png>).


## Confirmed playable-night cinematic — IMPLEMENTED locally
Application changes: `src/VampireEncounter.tsx` and scoped `src/style.css`. The existing director observes a confirmed increase in campaign night, then waits for any automatic reckoning to be completed/dismissed before presenting a transient native-dialog cover. No backend, lifecycle, action handler, campaign state or persistent marker changes.

Sequence: 350ms fade from the outgoing view to black, centered NIGHT II–VII for 1000ms, then 350ms reveal of the next view. The prior React view is retained only until black; the existing next scene then renders behind the cover. No narration or new route. Reduced-motion users bypass the animation. Click/tap/key skips; triggering events and their key/click tail are consumed, with held keys blocked through release. Blur releases the cover safely. The cover and input capture are removed after completion.

The observed-night baseline is component-local. Reload resumes existing scene/campaign memory without replaying a night card; no new persistence is introduced. Only playing nights 2–7 are eligible. Pending/error/closure/busy results cannot trigger, and campaign conclusion has no NIGHT VIII.

PASS: 27 focused encounter/rendering tests; production build; full existing suite 223/223 in the current working tree. Nine local mocked-browser scenarios cover all six boundaries (desktop/mobile), click/key/held-key skip, reduced motion, final conclusion, pending → confirmed → reckoning, and mid-animation reload with the actual next-night fixture. No extra gameplay requests arose from skip input. The initial synthetic Night VIII test used an invalid still-playing campaign; corrected to the normal concluded-campaign response, which passes. No gameplay code was changed to accommodate a fixture.

Evidence: `.local/night-cards.mjs`, `.local/night-card-recovery.mjs`, `.local/night-cards-after/night-2.png`, `.local/night-cards-after/night-3.png`; logs `.local/night-card-tests.log`, `.local/night-card-regression.log`. Existing unrelated working-tree edits were left untouched. No live Testnet/Sandbox transaction suite, commit, push or deployment. Reviewed required repository/project/hackathon documents; no external-rule changes.

## Night transition and NPC wording follow-up — IMPLEMENTED locally
Supersedes the earlier 1.7-second card timing above. The same existing cover now fades to black (350ms), fades the exact ambitions sentence in (150ms), holds it (1050ms), fades it out (200ms), displays NIGHT II–VII (1000ms), then reveals gameplay (350ms): 3.1 seconds total. Skip/input protection, reduced-motion bypass, confirmation gating and reload observation are unchanged.

Only actual `reaction:npc:` scenes with recorded activity receive AND WHILE YOU SLEPT… and the factual caption immediately underneath. The renderer strips the technical night prefix; source activity data, dialogue, event order and handlers are unchanged. No new screens, gameplay, NPC policy or persistence changes.

PASS: 33 targeted rendering/reaction/flow tests, all 223 regression tests, production build. Four local mocked Chromium cases verified desktop/mobile sentence-before-title timing, NPC caption, keyboard skip and reduced motion with no extra action requests or horizontal overflow. Inspected desktop/mobile screenshots in `.local/night-text-after/`; harness `.local/night-text.mjs`, logs `.local/night-text-{targeted,regression,browser,build}.log`. Prior six-boundary/reload tests above cover unchanged lifecycle behavior; they were not repeated. Live transactions NOT RUN (presentation only).

Modified for this follow-up: VampireEncounter.tsx, style.css, encounters.test.mjs, README, PROGRESS, this report and NPC_VISIBILITY.md. Reviewed repository/project/hackathon requirements; no changes needed. Existing unrelated edits preserved. No commit, push or deployment.
