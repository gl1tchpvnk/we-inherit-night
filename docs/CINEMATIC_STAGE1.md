# Cinematic presentation — Stage 1

Status: IMPLEMENTED locally through Stage 1B. Overall direction approved; Stage 2 is not started.

## Scope and inspected presentation architecture

| Player-facing context | Existing implementation | Stage 1 disposition |
|---|---|---|
| Landing, replacement and Continue | GameEntry / TitleScreen | Unchanged; retain painted cover and readiness gates |
| Prologue, Crypt arrival / feeding narrative | GameEntry / Prologue, entry.ts | Unchanged; preserve approved prose and separate controls |
| Character encounters and optional questions | VampireEncounter / EncounterDirector; relationshipDialogue.ts | Opt in Seraphine sanctuary conversation and its two questions only |
| Agreements and negotiations | Same encounter renderer, projected terms/choices | Keep existing validated handlers; restyle sanctuary offer only |
| Investigations and findings | livingCourt / courtPayoff / reactiveCourt projections in encounter renderer | Unchanged |
| Nightly decisions and opportunities | DECISION scenes, main.tsx castle guidance | Unchanged; future strategic layout remains separate |
| NPC actions, consequences, night transitions, final reckoning | Existing RECKONING / reaction / incident scenes | Unchanged; verified results remain separate from flavour |
| Character endings and campaign conclusion | CampaignFinale and factual ending scenes | Unchanged |
| Replay, archive, campaign menu and secondary rights/records | CampaignFinale, GameEntry, main.tsx, GameInspection | Unchanged |

No new React infrastructure or dependency. `VampireEncounter.tsx` retains its
shared rendering and choice handlers. `scenePresentation.ts` is a small pure
presentation projection: a four-ID opt-in and authored paragraph beats. CSS is
scoped to `.cinematic-scene`. Relationship exchanges, other characters and
consequence scenes are not opted in.

## Implemented composition and pacing

- Existing supplied Seraphine portrait remains unchanged and equally sized in
  dialogue and decision states. Existing provisional Lounge art fills the scene.
- Integrated inset panel, crimson commitment, restrained Night/Blood/action HUD,
  separate optional questions, free leave and agreement inspection.
- The original offer is four paragraph beats. Short lead-ins are grouped with
  their following paragraph; no sentence chopping or authored text edits.
- Previous and dialogue history preserve reviewed beats. Reviewed introductions
  open at the decision; replay has Skip reviewed dialogue. Short questions do
  not acquire unnecessary Continue steps.
- Existing browser-only scene line/read memory persists pacing. Negotiations in
  this opt-in are marked read at their last beat, not before their text is shown.
  Existing legacy read versions/history remain valid. No authoritative state is
  changed for presentation.
- Visible material terms remain above commitments. Inspect agreement terms
  retains exact rights, duration and operations. Leaving the sanctuary offer is
  a free navigation choice; no new rejection transaction or mechanical decline
  was invented. Existing agreement-rejection handlers remain untouched.
- Desktop keeps artwork fixed while long panel content scrolls internally. Phone
  layout places the portrait above the panel with natural dialog scrolling;
  controls and terms remain reachable. No new decorative animation.

## Reproduce and review

In an eligible existing campaign, open Seraphine's sanctuary conversation through
Tonight's choices / the existing Seraphine contact. Advance the offer, inspect
terms, ask either optional question, and return. The decision resumes without
replaying the opening. Previous/history revisit prose; leaving is free. Actual
acceptance still invokes the existing paid nightly action, so use only an
approved gameplay session for a real transaction.

Local fixture screenshots use the same Night 2, Blood 6/12, Action 1/1 state and
1672×941 desktop / 390×844 phone viewports. These are mocked UI evidence, not
verified Testnet activity. Files are in `.local/cinematic-evidence/`:

- `before-dialogue-1672.png`, `after-dialogue-1672.png`, `after-decision-1672.png`
- `before-dialogue-390.png`, `after-dialogue-390.png`, `after-decision-390.png`
- `verified-decision-390.png` shows reachable lower phone choices;
  `verified-decision-844.png` checks short 844×390 landscape panel scrolling.
- `verification.json` records six completed browser scenarios. Local browser
  harness: `.local/cinematic-verify.mjs`; screenshot capture:
  `.local/cinematic-browser.mjs`. Generated evidence stays outside Git.

## Verification

PASS: 35 initial focused encounter/relationship/pacing tests; 8 narrative tests
including updated rendering acceptance; final full Node regression 220/220;
TypeScript/Vite production build; whitespace review.

PASS: six actual Chromium fixture scenarios. Three viewport scenarios check
keyboard Continue and disclosures, mid-dialogue reload, both questions and
return, Previous/history/review skipping, reload at the decision, free exit,
unchanged fixture resources/state, no free-path mutation requests, unchanged
portrait geometry and no horizontal overflow. Three response scenarios assert
one existing sanctuary command with campaign/revision binding and failure,
pending or confirmed-result handling. The confirmed fixture opens the existing
consequence scene and shows its supplied Blood value; it does not prove actual
settlement or payment.

Initial full regression was blocked by restricted localhost access, then exposed
one stale SSR expectation for all-at-once dialogue. The updated test asserts first
beat has no commitment, final beat has the exact material terms once and the
existing action label. No security, payment or authority assertions were removed.
Browser harness corrections accounted for existing campaign/revision fields,
pending copy, and the consequence scene that follows success.

NOT RUN: new Sandbox/Testnet transaction suites, hosted acceptance or seven-night
browser replay. No contract interaction, economics, NPC policy, backend or
campaign progression implementation changed. Existing acceptance evidence in
OPENING_CORRECTION_RELEASE.md remains historical evidence for unchanged systems,
not verification of this new presentation on the hosted build.

## Limitations and next gate

The portrait is a flattened illustration with its own environment. The separate
Lounge is a portrait-format provisional study, visibly labelled as such. A clean
character cutout and matching wide Lounge plate would allow the seamless staging
and elaborate environmental composition in the supplied mockups. No artwork was
generated, recoloured, mirrored or replaced. Phone decisions require scrolling
to retain readable costs and choice targets.

Next: user visual review of Stage 1. Do not extend the layout to other characters
or screen types until approved. No commit, push or deployment performed.

### Screenshot capture correction
The initially delivered desktop dialogue PNG captured the portrait before image
decoding/painting completed, leaving a black lower region. The local screenshot
harness now awaits `decode()` for scene images and two paint frames. Recaptured
desktop/mobile evidence was visually inspected; no application CSS or artwork
change was needed. The incomplete original is retained as
`.local/cinematic-evidence/after-dialogue-1672-incomplete.png`.

## Stage 1B — focused visual refinement

The user approved the overall Stage 1 direction. This pass changes only existing
cinematic CSS, documentation and local verification tooling; no React, pacing,
read-memory, source dialogue, assets, gameplay or transaction code changed.

Visible comparison against newly captured corrected Stage 1 baseline:
- Desktop dialogue panel begins about 52px higher and 33px farther right, is
  about 33px narrower, and has slightly tighter nameplate spacing. The panel
  exposes more of the lower illustrated scene without growing in height.
- Decision composition is retained. More space separates explanation/questions
  from commitment/leave; the explanatory rule is neutral. The paid choice uses
  a crimson edge and marker on black, with crimson fill only on hover/keyboard
  focus. Optional choices use paper hover/focus; the visible focus outline stays.
  Continue is neutral, keeping crimson associated with consequential choices.
- Mobile overlap increases from 16px to 38px and loses its outer shadow, joining
  the panel more closely to the image. Seraphine's face and all controls remain
  clear. Natural vertical scrolling and existing touch targets remain.
- A proposed uniform raised offset put the top border behind the short-landscape
  HUD. That offset was not retained at short heights: these use a 24px inset.
  Internal panel scrolling keeps the art visible and all content accessible.

Final evidence: `.local/cinematic-stage1b/` (all mocked browser fixtures):
- Desktop 1672×941: `after-dialogue-1672.png`, `after-decision-1672.png`.
- Phone 390×844: `after-dialogue-390.png`, `after-decision-390.png`;
  `after-decision-controls-390.png` shows scrolled terms/questions/accept/leave.
- Landscape 844×390: `after-dialogue-844.png`,
  `after-decision-controls-844.png` (scrolled to consequential choices).
- Corrected matching baseline: `.local/cinematic-stage1b-baseline/`.
- Captures await image decoding and two paint frames. The fresh baseline was
  inspected before CSS changes and was fully painted; no CSS was changed to
  address the old capture artifact.

PASS: 43 targeted tests, final full regression 220/220, TypeScript/Vite build,
whitespace review, and six existing browser scenarios at all three sizes.
Additional browser assertions check neutral unselected commitment, keyboard
focus fill/outline, minimum 44px interactive targets, horizontal bounds and
reachable questions/acceptance/leave/inspection. Capture asserts desktop and
landscape panels remain below the HUD. The first focus assertion used mouse
modality; corrected to actual keyboard modality without changing CSS to satisfy
an inappropriate test. All final browser checks pass.

Files changed this pass: src/style.css, README.md, PROJECT_REQUIREMENTS.md,
VISUAL_CANON.md, PROGRESS.md and this report. Local capture/check scripts and
screenshots remain ignored. Stage 1 source/test changes already in the working
tree were preserved. No new dependencies, artwork or presentation system.

NOT RUN: live Testnet, new Sandbox suites, hosted acceptance or full seven-night
walkthrough; no relevant execution changes. Flattened portrait and provisional
portrait-format Lounge remain limitations; seamless environmental integration
would require an approved character cutout and matching wide background.

Ready as the reusable visual reference for a separately authorized Stage 2,
not evidence that unmodified encounters already support this layout. Stage 2
was not started; no commit, push or deployment.
