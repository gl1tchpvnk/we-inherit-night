# Pass 2F — RPG scene navigation

## Focused review

Reviewed AGENTS, latest progress, Pass 2E, main React view, scene director,
contextual actions, inspectors, Result and browser scene memory, and UI tests.
Baseline Node 50/50 and build PASS. No full project re-audit. Rust, agent policy,
bootstrap, game calculations, persistence runner and signing code are unchanged.

## Architecture

The existing GameEntry still gates title/prologue/Continue. EncounterDirector now
renders either its existing active VampireEncounter or its exploration child:
there is no dashboard behind dialogue, reckoning or conclusion. Stable scene IDs,
line progress and viewed history remain compatible. No second dialogue engine.

Exploration is one viewport-sized SceneSurface with a compact HUD. Castle and
selected Room are mutually exclusive. Existing RoomArt SVGs are the castle's
architectural hotspots; access labels use the current contract result. An allowed
entry still goes through the original `enter` command. Restricted selection shows
its reason without entering. Returning to castle is presentation-only.

Room context is a typed projection in navigation.ts. Library shows records and
investigation, Crypt shows shelter/delegation interactions, Lounge shows political
contacts and supported opportunities. Contacts are explicitly remote court
conversations, not invented physical NPC locations. All eight existing actors
remain reachable through relevant room contacts or the Relationships inspection.

## Contextual decisions and guidance

Current situation and at most three leads derive from existing availability,
rights, pending offers and resource state. Leads open a room or existing encounter.
No quest flags or new scheduler. Survival actions are in a small secondary
“Attend to yourself” disclosure, not a giant global action list. Resource decisions
use the same typed scene format, with actual costs and an explicit off-chain label.
Major actions require inspecting their current terms before the existing command.
Character dialogue still contains its supported acceptance/rejection/commitment
controls. Invalid/unavailable actions have no enabled commit choice.

## Secondary inspection

Native dialogs expose Rights (expandable property/grant/lease details), Bloodline,
Relationships, Chronicle (including scene review) and Diagnostics. Policy memory,
receipts and technical evidence remain secondary. Opening/closing inspection sends
no game command; explicit Refresh in Diagnostics retains the original recovery
behavior. Native modal focus containment, heading focus and trigger restoration.
Genealogy, House membership and enforceable rights remain separate.

## Reckoning and persistence

The unchanged executor resolves the command and journaled NPC phase first. The
scene director then presents committed reckoning data before exploration is shown.
“Continue to next night” dismisses presentation only; it does not advance again.
Quiet completed turns now also have a short reckoning scene projected from their
existing pass history. Conclusions still use the engine's recorded outcome.

The optional `room` field extends the existing `night-scenes:v1:<campaign ID>`
browser record; no parallel campaign save. Unknown room values are discarded.
Resume checks effective access in the loaded authoritative Result. Lost access
returns to the castle with an explanation. Encounters retain active ID/line.
Successful night advancement clears the selected room behind the reckoning; no
new transaction, seed or NPC state is written by navigation.

## Verification

- Baseline: Node 50/50 and production build PASS.
- Implementation: Node 56/56; six navigation/SSR tests added. Build PASS.
- Real NEAR Sandbox full regressions: PASS 32/32, no failures/skips, 1135.91 seconds; .local/pass2f-sandbox.log. Desktop browser flow PASS; mobile viewport verification BLOCKED (details below).
- Rust NOT RERUN: no contract or chain interface changes; last baseline Pass 2E
  11/11 on 2026-11-12.

Navigation tests cover accessible/denied room selection, castle return, existing
memory compatibility, lost access on reload, contextual choices, bounded guidance,
resource commitment terms, quiet reckoning, single primary render and native
inspection controls. Existing entry/encounter and Sandbox tests retain acceptance,
rejection, recovery and duplicate-execution coverage. SSR is not browser testing.

## Limits and Pass 2G

Existing symbolic architectural/character artwork remains temporary; Seraphine's
supplied image is retained. Guidance is a small deterministic view projection, not
a narrative director, location simulation or new political AI. Browser-only view
state is not cross-device and may be lost when storage is disabled. No independent
novice usability test, public deployment, live LLM, OutLayer or new council work.
Pass 2G requires a separately specified narrative-director scope and must preserve
these validation and presentation boundaries. No Pass 2G implementation started.

## Rendered browser evidence (2026-11-12)

PASS in the in-app browser: title/Continue, saved room and pending encounter resume,
Library contact to terms, free authority inspection, deferral without action cost,
restricted Lounge denial, room/castle navigation, native Rights overlay with Escape
and trigger focus restoration. Earlier desktop room check measured 1280x900 with
no document overflow. Final resumed checks rendered at 1280x720.

Explicit pass at Night 3 displayed Vesper's NEAR-confirmed Crypt revocation before
returning to the Night 4 castle. Library access remained valid. Guidance opened
Marius's existing service encounter with costs and actual court grants. Committing
that service displayed Night 4 reckoning; Continue returned to Night 5. Reload and
Continue retained Night 5, Blood 3, action 1/1 and court/passage protection, without
repeating the action or reckoning. The service itself is an off-chain obligation;
the earlier appointment and Vesper revocation are contract operations.

Screenshots: `.local/pass2f-room.jpg`, `.local/pass2f-reckoning.jpg`, and
`.local/pass2f-castle.jpg`. The attempted mobile screenshot is NOT mobile evidence:
the viewport capability accepted 390x844 but DOM/screenshot remained 1280x720,
including after reload. Mobile visual verification remains BLOCKED by the browser
viewport control; responsive CSS is implemented but not visually accepted this pass.
Viewport override was reset. No physical device or independent novice test.

Normal prologue/Skip Intro were verified in Pass 2E and retained by automated tests;
not repeated end-to-end during this resumed Pass 2F browser session. The current
local preview was preserved rather than resetting the player's campaign.

## Changed files

New: src/navigation.ts, src/GameInspection.tsx, tests/navigation.test.mjs,
docs/PASS2F.md. Updated: src/main.tsx, src/encounters.ts,
src/VampireEncounter.tsx, src/style.css, README.md, PROJECT_REQUIREMENTS.md,
docs/ARCHITECTURE.md and PROGRESS.md. No contract, NPC policy, signing or campaign
rule changes. Final accessibility correction gives the reckoning close control its
actual next-night accessible name; affected navigation/encounter tests 14/14 PASS.

Local preview HTTP checks: frontend and read-only save metadata both returned 200.
An old in-app tab had a connection error; a fresh in-app tab reached the existing
server. A redundant launch was rejected because port 5187 was already occupied;
no server replacement or network/security setting changes were needed.
