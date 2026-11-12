# Pass 2D — The Living Court

## Audit and scope

Reviewed instructions, requirements, canon/rules, architecture/security, Pass 2C
authority matrix, seeded encounter records, agent history, transaction journal,
artwork, React/CSS and tests. Baseline: Node 37/37, Rust 11/11 and production build
PASS. Only the supplied Seraphine image is a finished reference asset in public/art.
The remaining portraits and three room illustrations are existing symbolic SVGs.

No gameplay, Rust, bootstrap, agent policy, signing infrastructure or provider
configuration changes. Existing one-action reckoning, seven nights, rights-based
endings and legacy saves remain authoritative. No LLM calls or public deployment.

## Presentation architecture

`src/encounters.ts` is a pure projection from the current server Result into scene
data. It neither rerolls the seed nor writes campaign state or calls a signer.
`VampireEncounter.tsx` contains the common native-dialog presentation and the
EncounterDirector that sequences scenes, tracks viewed IDs and submits an explicit
choice through App's existing action handler. Types: ENCOUNTER, NEGOTIATION,
RECKONING, CAMPAIGN CONCLUSION. Each scene carries ID, location vignette, one/two
portraits, identified speakers, lines, exact terms, relevant rights and choices.

Stable IDs: character:<actor>, action:<existing action>, lease:0, ultimatum,
reckoning:<internal night>, conclusion:<engine outcome>. Location backgrounds are
symbolic vignettes of existing rooms, not claims that a character/player has entry
permission or occupies a new room. Navigation still checks contract access.

The opening ultimatum appears on a fresh political campaign. Eight court portraits
open free conversations. Available major opportunities lead to an inspectable
negotiation before an explicit commitment. Free information commands need no
confirmation. Sanctuary, Marius's service/fulfilment, Lucien's passage, dossier and
title filing all route through unchanged validated game actions. Lounge proposal
acceptance/rejection uses the existing agreement commands; standing-offer controls
retain their actual signed one-action semantics. Sanctuary has no invented reject
operation: leaving defers without changing its terms or deadline.

## Conditional dialogue and canon

Dialogue reacts to actual Crypt revocation, sanctuary access, title filing, public
archive lead, appointment/dossier claimant, service obligation, passage status and
recorded sponsorship. Historical campaigns get dialogue limited to their supported
mechanics. No private NPC memory, invented ancestry, House membership or biography
is used. Lucien remains external; Marius/Seraphine remain independent co-founders.

All newly authored lines are **PROVISIONAL presentation**, not recovered canonical
quotations. Marius and minor voices remain deliberately restrained; established
voice/body/biography details remain TBD. No model-generated dialogue is claimed.
Untrusted text renders as React text. Narrative wording never authorizes a command.

Material terms are always visible, including costs, action use, obligations,
duration, exclusive deadline, lack of ownership and nonrefundability. Rights
inspection expands current contract records. Choice availability comes from the
server snapshot; the executor revalidates again. Stored scene IDs cannot contain
commands. Pending/error snapshots suppress commitment choices and automatic success
scenes. UI and backend both retain duplicate-execution guards.

## Reckoning, conclusion and persistence

Reckonings summarize committed non-pass history, distinguish NEAR-confirmed actions
from off-chain competition/information, and display actual lease acceptance/expiry
and passage expiry from contract records. Quiet turns do not force redundant scenes.
Only the latest unseen reckoning automatically opens; older ones remain reviewable.
The conclusion illustrates the engine's existing reason/outcome and never computes
a separate victory. Continue/skip/review never calls the executor.

Browser-only `night-scenes:v1:<campaign ID>` stores viewed IDs, active scene ID and
line index. It is separate from the authoritative campaign/NEAR journal. Reload
resumes supported dialogue or suppresses already viewed automatic scenes. Malformed
storage is discarded safely; denied storage may repeat presentation but cannot
repeat NPC turns or transactions. Viewed state is per browser, not cross-device.
New games receive a different namespace and clear the prior requested scene.

## Art and interface

`PORTRAIT_ASSETS` maps stable actors to replaceable asset references and symbolic
initial emblems. Seraphine retains /art/seraphine-reference.png; CSS frames the
supplied full-screen reference. Other seven portraits are clearly labelled
monochrome placeholders, not canonical physical designs. RoomArt still covers only
Crypt, Library and Lounge. No invented rooms or new graphics dependencies.

The castle SVGs are keyboard-operable navigation hotspots. The living-court roster
distinguishes major actors and minor courtiers without hiding interactions. Compact
threat/dependency summaries and opportunity invitations replace dominant forms;
the full action list, rights inspector, chronicle and diagnostics remain available
in expandable secondary views. Selected room red lighting preserves text access
labels; no meaning depends on red alone.

Native modal dialog contains focus; heading receives focus on scene changes,
Escape safely leaves, and closing restores the opener. Choices use native buttons,
busy disables actions, dialogue/status is announced, terms do not wait for dialogue
completion. Responsive portrait/script stacking and existing reduced-motion rules
are retained. Browser findings and final regression counts are recorded below.

## Verification

Automated scene/SSR tests cover projection/eligibility, conditional dialogue,
material terms, exact accepted/rejected commands, pending/error suppression,
skip/reload, hostile storage/text, committed reckoning/expiry and engine endings.
Server-rendered markup checks native controls/labels and escaping; these are not
browser interaction tests. Sandbox negotiation and political tests now select
commands from scene choices and verify resulting chain/persistence behavior.

Verified 2026-11-12:

| Check | Result | Evidence |
|---|---|---|
| Node regressions including eight scene/SSR tests | PASS 45/45 | .local/pass2d-node.log; final run after presentation fixes |
| Rust unit baseline | PASS 11/11 | Run before Pass 2D; Rust unchanged in this pass |
| TypeScript + production Vite build | PASS | .local/pass2d-build.log; dist output |
| Real NEAR Sandbox full regression | PASS 32/32, zero skips/failures | .local/pass2d-sandbox.log; 1165.96 seconds |
| In-app desktop and mobile viewport | PASS for tested flows | 1280×900 and 390×844; rendered screens examined |
| Complete seven-night browser run / every ending visually | NOT RUN | Endings covered by projection tests and real Sandbox campaign tests |
| Live LLM / public deployment / physical mobile devices | NOT RUN | Intentionally disabled/deferred |

Browser walkthrough used isolated .local/pass2d-preview, preserving the prior
preview save. Verified opening Vesper ultimatum; skip without action use; Library
hotspot navigation; Mirelle encounter; title-filing commitment and automatic
reckoning; public archive lead; Seraphine exact sanctuary terms and owner/access
inspector; reload at dialogue line two; authorized acceptance; lease record through
contract night 8; reload at Night 3 with sanctuary and no repeated viewed scene;
explicit pass; Vesper's NEAR-confirmed revocation at third reckoning; Night 4 Crypt
locked while Library and sanctuary remain effective. Seraphine's dialogue then
acknowledges the covenant. Tab/Return, focus after dialogue, and Escape restoration
were exercised. Mobile scene scroll/stacking was visually examined, not a physical
device test. Acceptance/rejection and lost-response duplicate recovery are covered
by the real Sandbox tests; rejection was not repeated in this browser walkthrough.

Evidence screenshots: .local/pass2d-reckoning.jpg and .local/pass2d-mobile.jpg.
Local preview remains http://127.0.0.1:5187/ at Night 4 in the isolated test campaign.
Local HTTP probe returned 200 outside the restricted shell sandbox; the restricted
probe was denied by execution isolation, not by the application. No network or
security configuration was changed. No installed Chrome access. Provider HTTP tests use
mock responses; neither they nor deterministic policies are live LLM verification.

## Changed files

New: src/encounters.ts, src/VampireEncounter.tsx, tests/encounters.test.mjs,
docs/PASS2D.md. Updated: src/main.tsx, src/visuals.tsx, src/style.css,
tests/sandbox/negotiation.test.mjs, tests/sandbox/politics.test.mjs; README.md,
PROGRESS.md, PROJECT_REQUIREMENTS.md, GAME_RULES.md, VAMPIRE_AGENTS.md, AGENTS.md,
docs/ARCHITECTURE.md and docs/THREAT_MODEL.md. HACKATHON_REQUIREMENTS.md reviewed;
no external requirements changed.

## Dependencies and limitations

Final portraits/background plates remain replaceable placeholders. No animation,
voice acting, camera choreography or branching invented counteroffers. Closed
opportunities are still inspectable, but no unsupported commitment is offered.
Exact genealogy/ancestral/succession details remain TBD. Future council scenes
require real seat/vote mechanics first. LLM integration remains disabled and is
not required for the deterministic MVP. Hosted authentication, durable production
state and public wallet signing remain separate work.
