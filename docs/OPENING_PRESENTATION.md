# Opening presentation consistency — IMPLEMENTED locally

## Changes
Only `src/style.css` changes application presentation in this pass. Existing GameEntry/Prologue components, source prose, progress storage, handlers and artwork remain untouched.

- Title cover uses its exact 1671:941 ratio with contain sizing. The artwork and existing inactivity note fit together without unnecessary page scrolling at the tested sizes; the whole composition is centered when space remains.
- Native title controls remain invisible overlays aligned to the existing painted labels. No additional visible buttons; the initially explored visible fallback was removed at the user's direction.
- Four prologue panels and Before the First Dawn share overlapping narrative panels, existing crimson/neutral borders, more balanced heading/body sizes and prominent illustrations. Marius retains the alternating composition.
- Continue/Skip remain in a separate restrained footer, outside the narrative columns. Long text scrolls inside the narrative panel with controls reachable; tablet/mobile use an overlapping vertical composition.
- No encounter coupling, component abstraction, new asset, dependency, narrative revision or authoritative state change.

## Verification
PASS: 23 targeted entry, room-introduction and narrative tests; full 221/221 regression; production build; whitespace review.
PASS: five complete local Chrome opening sequences at 1672×941, 1100×720, 820×1180, 390×844 and 844×390. Verified all four panels and arrival against exact source text, image ratio, no horizontal overflow/title page overflow, readable internal scrolling, keyboard focus and Continue transition. All requests were view-only mocked API responses.
PASS: two additional desktop/mobile browser scenarios exercised the original painted-label controls, keyboard New Game confirmation/cancel, reload on panel two, Skip intro and Skip scene. Intro HUD stayed absent and no gameplay requests occurred.
PASS: playable Night 1 screenshots are byte-identical to the before baseline at all five viewport sizes after normalizing the mouse position. Playable encounter CSS/logic is untouched.
NOT RUN: live Testnet, Sandbox transaction suites, hosted deployment or another campaign walkthrough; no relevant execution code changed.

## Limitations
The title is a flattened landscape illustration including its labels. Keeping every pixel and the existing labels means they remain small on narrow phones, with intentional letterboxing; enlarging them independently requires a separately approved asset/layout change. Narrative panels retain internal scrolling for long text on small/short screens. Existing portrait/environment assets are unchanged.

## Evidence
Local mocked API fixtures, decoded images and completed paint frames. Before/after pairs use matching viewports.

| View | Before | After |
|---|---|---|
| Title desktop | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/title-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/title-1672.png>) |
| Title intermediate | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/title-1100.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/title-1100.png>) |
| Title tablet | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/title-820.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/title-820.png>) |
| Title mobile | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/title-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/title-390.png>) |
| Prologue 1 desktop | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/panel-0-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/panel-0-1672.png>) |
| Prologue 2 intermediate | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/panel-1-1100.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/panel-1-1100.png>) |
| Prologue 3 mobile | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/panel-2-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/panel-2-390.png>) |
| Prologue 4 tablet | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/panel-3-820.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/panel-3-820.png>) |
| Before First Dawn intermediate | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/arrival-1100.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/arrival-1100.png>) |
| Before First Dawn mobile | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/arrival-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/arrival-390.png>) |
| Short landscape | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/panel-0-844.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/panel-0-844.png>) |
| Playable Night 1 unchanged | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-before/night-one-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/opening-ui-after/night-one-1672.png>) |

Documentation: updated README and PROGRESS; reviewed AGENTS, PROJECT_REQUIREMENTS and HACKATHON_REQUIREMENTS, with no mechanical or external-rule revisions needed. Other working-tree changes predate this pass. No commit, push or deployment.


## Final prologue layout refinement (supersedes the separate footer above)
Measured the existing longest-panel overflow: 41 px at 1366×768 and 151 px at 1100×720; all panels already fit at 1672×941. The external strip, panel margins/padding and full blank-line paragraph gaps consumed avoidable height.

Changed `src/GameEntry.tsx` only to move the same controls into the frame, make prose keyboard-scrollable, and wrap existing paragraphs for spacing. Exact DOM text still matches authored source, including paragraph separators; no content, state or handlers changed. Updated `src/style.css` to:
- Remove the full-width footer row, widen the desktop panel from 47% to 50%, reduce outer margin from 24px to 16px and padding from 24×30px to 20×26px.
- Reduce heading spacing, line-height from 1.5 to 1.4 and visual paragraph gaps to 0.7em. Existing font sizes are unchanged (18–23px desktop, 18px mobile, existing 17px short landscape).
- Put the outlined primary Continue inside the frame below prose, with the existing secondary Skip control at its upper-right. Both retain at least 44px hit height.
- Scroll only prose when necessary; headings and controls remain visible and outside that scroll area.

PASS: every panel fits without internal scrolling at 1672×941, 1366×768 and 1100×720; tablet 820×1180 also fits. Mobile 390×844 and short landscape 844×390 still require prose scrolling. Verified the text can reach its end, controls do not overlap it, and there is no horizontal overflow. No promise of no scrolling at browser zoom or smaller heights.
PASS: 23 targeted tests, 221 full regressions, production build, six full opening browser fixture sequences and two Skip/reload scenarios. Playable Night 1 screenshots remain byte-identical at all six sizes. Requests during narration/navigation remained view-only. Before First Dawn prose, title and playable encounter styling/handlers are unchanged.
Updated the existing SSR navigation-placement assertion, README, AGENTS continuity and PROGRESS. Reviewed project/hackathon requirements; no gameplay or external requirement changes. No commit, push, deployment or live-network transactions.

Final evidence (local mocked fixtures):
- Longest panel at 1366×768: [before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-before/panel-3-1366.png>) / [after](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-after/panel-3-1366.png>).
- Longest panel at 1100×720: [before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-before/panel-3-1100.png>) / [after](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-after/panel-3-1100.png>).
- Marius desktop: [before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-before/panel-1-1672.png>) / [after](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-after/panel-1-1672.png>).
- Mobile narrative: [before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-before/panel-2-390.png>) / [after](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-after/panel-2-390.png>).
- Short landscape: [before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-before/panel-0-844.png>) / [after](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/prologue-final-after/panel-0-844.png>).


## Crypt-to-Vesper cinematic transition — IMPLEMENTED locally
`src/GameEntry.tsx` adds transient presentation phases only at departure from Before the First Dawn: fade the entire narration out for 350ms, mount the existing gameplay/encounter at black, hold for at least 250ms while its images decode and paint, then fade the entire interface in over 600ms. Existing scene entrance animations are suppressed for that keyed first stage so they cannot restart after reveal; the marker disappears when the scene changes. No ordinary dialogue/choice navigation receives this transition.

Input capture and an immediate ref guard prevent duplicate advancement during the fade, including input targeting native modal dialogs. There is no overlay to intercept clicks afterward. Existing arrival completion is stored at the black handoff; reload before it returns to Crypt narration, and reload after it resumes the encounter. Late verified initialization keeps the existing entry gate; initialization failure clears the presentation lock and returns to the normal title error interface. Reduced-motion users enter directly.

PASS: 19 targeted entry/room/scene-presentation tests, 221 full regressions and production build. Eight local Chrome fixture scenarios cover full title → four prologue panels → Crypt → Vesper on desktop/mobile, reduced motion, stalled image decode, delayed initialization, failed initialization, and reload during fade-out/black hold. Normal observed phases were approximately 360/251/604ms (1.21 seconds); reduced motion used no fade phases. Rapid scripted clicks did not change the first dialogue index. Images/text were ready at reveal, black captures contained no prior UI, and the final spoken line remained fully opaque after removal of the fade state. Continue and subsequent conversation navigation remain functional. All API requests in these tests were view-only mocks, not transactions.

Safety limitation: abnormally slow decoding may extend the black hold up to three seconds. The scene is then revealed rather than trapping the player; a failed image can still be absent. No network asset can be guaranteed to load. No new loading indicator or narrative was added.

Evidence: `.local/crypt-fade.mjs`, `.local/crypt-resume.mjs`, `.local/crypt-fade-after/` (decoded desktop/mobile final scenes and black captures); test logs `.local/crypt-targeted.log`, `.local/crypt-regression.log`. NOT RUN: live Testnet/Sandbox transaction suites or deployment. Application changes are limited to GameEntry and scoped CSS; docs updated here, README and PROGRESS. Required project/agent/hackathon docs reviewed without authority/rule changes.


## Staged first-Vesper reveal — supersedes the whole-interface fade above
Application files: `src/GameEntry.tsx`, `src/style.css`. No encounter-component refactor, new dependency or art change. Existing environment, portrait, script, HUD and footer layers support independent opacity animations.

Sequence: 600ms eased narration fade-out → 500ms black preparation hold → 900ms Crypt environment emergence → 500ms Vesper crossfade → 400ms dialogue/HUD/footer reveal, then input unlock. Observed normal duration ~2.92s. Replaces the old reveal rather than layering it. No movement or push-in was added. The first keyed stage keeps a full-width environment behind the portrait so its framing cannot jump at the handoff; later scene stages retain their prior styling.

PASS: 19 focused tests, 221 regressions and production build. Ten mocked Chrome scenarios: desktop/mobile full opening, reduced motion, stalled decoding, delayed initialization, failed initialization, reload during fade-out/hold, simulated hide/return, and live reduced-motion change. Checked ordered phase events, layer opacities, completely black hold, decoded art/text before reveal, stable panel geometry, rapid-click suppression, dialogue usability, view-only requests and no repeated cinematic after resume. Visibility completion occurs on return rather than on hide, preserving the existing pre-handoff reload marker. No contract/network transaction suites or audits were run.

Visual evidence (local mocked fixtures):
- [Crypt alone](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/crypt-staged-after/desktop-environment.png>)
- [Vesper before dialogue](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/crypt-staged-after/desktop-vesper.png>)
- [Mobile character reveal](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/crypt-staged-after/mobile-vesper.png>)
- [Completed mobile conversation](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/crypt-staged-after/mobile-ready.png>)

Limitations: Vesper's flattened portrait includes painted surroundings, so these crossfade in with her; it is not a transparent character cutout. Mobile retains its established portrait-above-dialogue composition. Slow decoding may extend the black hold to three seconds before recovery reveals the scene; a genuinely failed asset cannot be guaranteed visible. No broader cinematic or layout change. Updated README/PROGRESS; reviewed required agent/project/hackathon documents. No commit, push or deployment.
