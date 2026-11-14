# Cinematic Stage 2 — shared character encounters

Status: IMPLEMENTED locally. Seraphine Stage 1B is the approved reference;
this extends it without another design pass. No commit, push or deployment.

## Interaction inventory and conversion

| Character | Existing compatible interactions now using the shared presentation |
|---|---|
| Marius Volari | Ordinary/optional conversations, appointment negotiation, service obligations, remembered replies, acquisition-order exchanges, final political demand and recorded reactions |
| Seraphine Volari | Approved sanctuary offer/questions retained; other conversations, legacy Lounge agreement, remembered replies, acquisition-order exchanges and paid-agreement reactions converted |
| Vesper | Conversation/questions, initial ultimatum and individual contextual/revocation reactions |
| Lucien | Conversation/questions, passage proposals, research/protection discussion and individual recorded reactions |
| Mirelle | Conversation/questions, research purpose/findings, authorization/withdrawal proposals and recorded research reactions |
| Dorian | Conversation/questions, competing research proposals/purpose/findings, authorization/withdrawal and recorded reactions |
| Cassian | Conversation/questions about appointment, assistance and independent arrangements; existing recorded NPC reactions |
| Sabine | Conversation/questions about authority and independent rights; existing advice and contextual reactions |

No dialogue or reaction was authored to fill gaps. Availability, branches, replies,
commands and material terms are still projected by the original scene builders.
All compatible existing ENCOUNTER/NEGOTIATION scenes with character portraits
qualify, including legacy dialogue branches and agreement accept/reject controls.
Redirect-only records do not render their own scenes.

## Shared implementation

- `scenePresentation.ts`: replace four Seraphine IDs with structural eligibility.
  Single-line prose uses the approved authored-paragraph grouping. Multi-line
  exchanges retain original beats and line indices so existing saved offsets
  and speaker order remain valid. Short prose stays one beat; no sentence split.
- `VampireEncounter.tsx`: reuse the same dialogue, history, reviewed skip, choices,
  terms and handlers. Cinematic scenes show the current NPC portrait, or the
  scene's first portrait for player/narrator lines. Explicit speaker labels
  distinguish You, Chronicle and named NPCs when the heading is not the speaker.
  Seraphine's approved name-heading remains unduplicated. Environment credits
  identify Crypt, Library or Lounge correctly. Reactions retain “Inspect recorded
  consequence”; prose never substitutes for verified evidence.
- `style.css`: isolate legacy Marius/Dorian page-position rules from cinematic
  scenes. Marius uses 50%/22% portrait positioning; Dorian 65%/25%. Other supplied
  portraits use the approved shared composition and existing image proportions.
  Confrontation summaries remain with their commands without legacy nested cards.
  No image transformation, new masks, asset changes or dependency was introduced.
- The existing Seraphine leave control stays confined to its original offer/root
  context; extending the renderer adds no generic rejection/departure choices.
  All other screens retain their existing navigation controls and choice records.

## Intentionally unchanged

Landing, prologue, castle/campaign management, rights inspection, archive/replay,
nightly DECISION screens, strategic discovery/incident/room-record wrappers,
room introductions, aggregate RECKONING sequences and CAMPAIGN CONCLUSION/finale
remain outside this character layout. Aggregate reckonings mix nightly summaries
and multiple NPC outcomes; they already have a separate speaker-driven director.
Individual character reaction scenes are converted instead. Final-demand is an
existing character confrontation and is included; its nightly-strategy redirect
is unchanged. Interactive castle navigation was not restored.

## Verification and evidence

PASS: 35 focused encounter/projection/relationship/narrative tests; full Node
regression 221/221; production TypeScript/Vite build; whitespace review.
The old SSR Continue check now permits its decorative arrow, and reaction text
checks distinguish the spoken beat from deliberate history duplication. Existing
command, security, authority, payment and content assertions remain preserved.

PASS: 24 real local Chrome browser fixture scenarios:
- All eight character roots at 1672×941 and 390×844: dialogue, history, optional
  questions and return where available, mid-dialogue reload where applicable,
  decision reload, accessible scrolling/touch targets and no free-path mutations.
- Appointment and research authorization: exact existing command and failed
  response boundaries. Appointment retains its displayed 1 Blood/action cost.
- Paid-agreement reaction, acquisition-order exchange with saved reply/reload,
  final-demand confrontation, existing legacy lease accept/reject handlers.
- Marius 844×390 short landscape with reachable consequential action.

No browser fixture calls a live chain. Seeded outcomes are clearly mocked UI
inputs, not proof of payment, authority enforcement or settlement. No live
Testnet/Sandbox transaction suite or full seven-night walkthrough was repeated;
execution, backend, signing, economics and policies were not changed.

Browser capture waits for decoded images and paint frames. Installed Chrome was
used when the old cached Chromium path was unavailable; no dependency installed.
Local harness: `.local/cinematic-stage2.mjs`; report and screenshots:
`.local/cinematic-stage2/verification.json` and that directory's PNGs.

Representative inspected evidence:
- `marius-dialogue-1672.png`: approved framing with appointment prose beats.
- `action-petition_marius.png`: costs, optional questions and consequential choice.
- `dorian-decision-1672.png`, `lucien-dialogue-1672.png`,
  `sabine-dialogue-1672.png`: distinct supplied portraits in the shared layout.
- `vesper-dialogue-390.png`, `mirelle-decision-390.png`,
  `cassian-dialogue-390.png`: readable mobile scene integration and questions.
- `reaction-lease-1-accepted.png`, `personal-relationship-S-D.png`,
  `final-demand.png`: recorded consequence, branching reply, confrontation.
- `marius-landscape.png`: short-height scrolling without horizontal overflow.

## Limits

No unresolved functional regression found in this scope. This is local fixture
and automated verification, not hosted release acceptance or exhaustive browser
coverage of every conditional branch. Long agreements/confrontations scroll;
controls/terms remain available. The supplied portraits contain flattened
backgrounds, and three room interiors remain provisional. Fully seamless staging
would require approved cutouts and matching wide environment plates. No fragile
reconstruction was attempted. Other game interfaces retain their separate layout.


## Small correction — cinematic location/art labels

Removed persistent room headings and provisional-art badges from cinematic
character dialogue/decision panels only. Kept the Conversation/Your response
indicator right-aligned and reduced its lower spacing by 4px. Character names,
speakers, environmental images, authored location references, terms, room
introductions and scene location/authority data are unchanged. Removed unused
badge CSS. Asset provenance remains in VISUAL_CANON.md and visuals.tsx mappings;
these remain the same supplied portraits and three generated provisional rooms.

PASS: 18 targeted tests (including rendered label absence and artwork/name
retention for all eight characters), 221 regressions, production build, and three
browser fixtures/six dialogue-decision states. Inspected Seraphine desktop and
Marius mobile; Mirelle mobile also checked. Evidence:
`.local/cinematic-label-removal/`. No overflow or unexpected spacing found.
No gameplay, contract or transaction changes; no live tests or deployment.
