# Encounter layout correction

IMPLEMENTED. Runtime change: `src/style.css` only. No narrative, component behavior, game state, contracts, saves or artwork changed.

- Above 640px: 44% portrait / 56% script, including 900px narrow desktop. Marius retains artwork on the right; other characters retain their established composition.
- Phones: portrait height 26dvh, proportional `object-fit: cover` with controlled positioning. No image modification, mirroring, recolouring or stretching.
- Dialog owns natural vertical scrolling. Desktop art stays alongside the script; script/stage have no independent scrollers. Mobile artwork scrolls away with the page.
- Compact headings, terms and secondary outcome spacing; integrated black panel. Native controls retain at least 44px targets. Focus handlers and reduced-motion rules are unchanged.

## Rendered verification

In-app browser, actual `VampireEncounter` component and current scene projections in an isolated presentation fixture derived from recorded 3D evidence. Fixture callbacks do nothing: no game action, backend operation or save write. These are layout checks, not additional campaign or transaction evidence.

| Viewport | Art size | First meaningful confrontation response ends at | Result |
| --- | --- | --- | --- |
| 1280×720 | 563px wide (44%) | y=432px | PASS: dialogue and all responses fit |
| 900×700 | 396px wide (44%) | y=430px | PASS: split retained; all responses fit |
| 390×844 | 219px high (26%) | y=605px | PASS: dialogue and all responses fit |
| 320×844 | 219px high (26%) | y=715px | PASS: first response fully visible; subsequent responses use single scroll |

Also inspected Seraphine at 900px, Reckoning at 390px, narrative consequence at 390px, and long counterproposal terms at 320px. The consequence return button ends at y=842px. Long agreement terms still need modest scrolling before commitment: material consequences were not hidden or reordered. Keyboard Tab reaches the commitment and the single dialog scrolls it into view with visible focus. Initial focus remains on the scene heading. No horizontal overflow observed.

Evidence: `docs/evidence/encounter-layout-{1280,900,390,320,seraphine,reckoning,consequence,keyboard}.png`. Reckoning/keyboard captures preceded the final small mobile spacing refinement; desktop and final 390/320/consequence captures represent final sizing.

## Checks and limits

- PASS: production build / TypeScript.
- PASS: 19 relevant tests in `tests/encounters.test.mjs` and `tests/pass3c.test.mjs`.
- NOT RUN: Sandbox, Rust, full campaigns and unrelated regression suites; no affected authority, payment, persistence or gameplay paths. Existing 3D evidence retained.
- NOT RUN: physical-device, screen-reader or reduced-motion emulation. Existing reduced-motion rule and focus/event code unchanged.
- Extremely short viewports and long agreements may require scrolling; no content is clipped to force a one-screen fit.

Documentation updated: visual canon, README and progress. Requirements, hackathon checklist and agent instructions reviewed; no changes warranted.
