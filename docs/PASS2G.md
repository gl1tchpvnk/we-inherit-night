# Pass 2G — Directed story and RPG interaction

## Focused findings

Reviewed AGENTS, Pass 2F/progress, game.ts, politics.ts, navigation.ts, encounter
director, existing tests and relevant canon/rule sections. Baseline Node 56/56
and build passed. No contract or NPC policy audit/rewrite was performed.

- Lounge access is a three-night ordinary entry lease. It never qualified as
  shelter in Pass 2C. Library ownership is also not shelter. The four shelter
  capabilities are Crypt, sanctuary, court and passage. This was unclear design
  communication, not a contract failure; valid room access can coexist with defeat.
- Blood zero and Exposure ten independently cause defeat. Existing protection does
  not cancel these resource requirements. Endings now show those requirements and
  surviving access beside the recorded cause, rather than implying every right vanished.
- Marius does not remove Seraphine's authority or lock out her route. Restricted
  Lounge navigation and the three-lead cap hid her contact. Discovery now reaches
  all eight remote contacts without room entry or a gameplay command.
- Early commitment is a real opportunity cost: appointment + title filing +
  sanctuary can fit into three nights, but filling a slot with another action can
  miss sanctuary's deadline. Dialogue itself never spends that time.
- Existing viable routes remain: title filing then sanctuary for Unbound; claim
  Marius's appointment and perform service during Nights 4–5 for Favoured. Feed as
  needed. Lucien's temporary passage is a bridge, not a third winning route.

## Changes and boundaries

No survival predicate, action cost, deadline, ownership, contract method or NPC
policy changed. Only the failure explanation in politics.ts changed. Original
saves/migrations and server action validation remain authoritative.

src/story.ts projects current Results into the existing encounter scene model.
Night 1 retains Vesper's ultimatum. Subsequent nights introduce an automatic
incident after the previous reckoning, prioritized by low Blood, patron obligation,
ultimatum, temporary passage or final consolidation. Selection is state-dependent,
not seven fixed chapters; it never rolls randomness or mutates campaign state.

Discovery and Decision are presentation phases, not a second game scheduler.
Discovery provides eight free contacts, questions about present circumstances and
relationships, and two conversational attitudes per character. New dialogue is
PROVISIONAL. Tone choices carry no hidden penalties or relationship changes.
Existing character openings still acknowledge current grants, agreements and claims.

Decision lists only currently available major actions, with benefits, resource
costs, protection relevance, beneficiary/dependency, deadlines and opportunity
cost. It includes ordinary Lounge tenancy explicitly labelled NOT protection and
an explicit pass. Inspection opens the existing action/lease scene; only the
existing explicit commit executes. Players can return to Discovery at any time.
Questions are free; publicly filing the Library title remains a major political
act. No unsupported counteroffers, rights or free authoritative discoveries added.

Stable incident/topic/phase IDs use existing browser scene memory and viewed state.
Explored topics are labelled. Returning or reloading does not reroll, sign, advance
night or repeat NPC turns. Pending/error Results suppress automatic scenes and
binding choices. Existing action revision checks and transaction recovery remain.

Vesper.png and the user-corrected Marius.png and Dorian.png are copied unchanged
to public/art and mapped through existing Portrait. The reader is Dorian; the
bearded second portrait is Marius. Seraphine art is retained. Lucien, Cassian,
Mirelle and Sabine remain symbolic placeholders. Images imply no new genealogy
or authority.

## Verification

- PASS: baseline Node 56/56 and build.
- PASS: final Node 63/63, no failures/skips; .local/pass2g-node.log.
- PASS: final TypeScript/Vite production build; .local/pass2g-final-build.log.
- PASS: seven-night rendered in-app walkthrough to Unbound (details below).
- PASS: full real NEAR Sandbox 32/32, no failures/skips, 1173.80 seconds; .local/pass2g-sandbox.log. Unbound/Favoured, early failure, temporary passage, issuer rights, expiry and transaction recovery passed.
- NOT RERUN: unchanged Rust contract; last Pass 2E baseline 11/11.
- NOT RUN: live LLM, public deployment, physical mobile device, novice usability test.

New tests cover all seven nightly incidents, reckoning order, phase/topic reload,
eight free branching contacts, Marius-to-Seraphine access with a locked Lounge,
current command availability, late qualification/resource warnings, precise
Lounge-only defeat and no eighth-night decision. Existing two-route, ending,
authority and recovery regressions remain in place. Provider tests are mocks;
local Sandbox tests are actual contract execution, never live LLM evidence.

## Limits / Pass 2H

Dialogue is authored deterministic presentation, not model-generated conversation.
Scene progress is browser-local. Contact access does not imply physical presence or
room permission. The original Lounge design remains an optional non-protective
commitment; expanding its strategic utility would be a deliberate future rule
change, not an authority inferred from its name. Wider rights, new operations,
additional survival routes, council mechanics and production custody are outside
this pass. Pass 2H has not begun.

## Browser walkthrough evidence

Completed all seven nights through the rendered in-app browser, in an isolated
`.local/pass2g-preview` save. Path: Marius appointment (Night 1), title filing (2),
sanctuary acceptance (3), Marius service (4), feeding (5), pass (6), pass (7).
The first action did not prevent freely reaching Seraphine through Discovery while
Lounge entry was denied. Relationship questioning and the sanctuary/ordinary-entry
branch remained free. Decision inspection and return paths were exercised.

Each night presented its incident after reckoning: the initial ultimatum, competing
patron deadline, obligation reminder, low-Blood warning and final consolidation.
The run concluded Unbound with Blood 3, Exposure 0, independent Library access,
active sanctuary through contract night 9, and fulfilled Marius service. Reloads
restored the pending decision or recorded reckoning without repeating commitments.
Final reckoning now says Review campaign outcome and exposes no eighth-night
Discovery/Decision. Quiet reckoning no longer attributes an action to a portrait.

Rendered width was 715px, height 764px, document width 715px (no horizontal
page overflow). This exercises the narrow responsive layout, not a physical phone
or a 390px acceptance check. No independent novice usability test was performed.
Evidence screenshots: `.local/pass2g-decision.jpg`, `.local/pass2g-ending.jpg`.
The early `pass2g-marius.jpg` captured the mistaken reader mapping and is NOT
accepted final artwork evidence; user correction supersedes it.

Real local transaction evidence from the isolated walkthrough:
- Marius court grant: BJdyFsXFTWEjptrHtj8NpMry8ZxsMvoZzwbhaYe6WY14.
- Player sanctuary accept_lease: J9TgKjbLc6nLwqj4wf9Lke2Resu9LCjvngwD1tL5iwxc.
- Vesper Crypt revoke_grant: 5y9YZpemdNasm2x3UNQNw4TTJJSDHQKzzFxznEYHPh8h.
These are local Sandbox records, not public-network explorer links. Journal file:
`.local/pass2g-preview/f6dafece-d8dc-4743-9a28-0c07bdcd79f7/transactions.json`.
Service/filing/resource consequences remain off-chain as designed.

The existing preview save directory was retained. Its newer saved campaign was
already defeated after Night 3; it was not the older Night 5 campaign recorded in
Pass 2F. Restoring it encountered a stale play.lock. WSL process inspection found
no matching play runner or Sandbox owner; only that stale lock was moved aside,
with no campaign/chain reset. No live lock was removed. The host/origin allowlist
stays unchanged; the attempted separate-port preview was not permitted by it.

## Files changed

New: src/story.ts and docs/PASS2G.md. Updated: src/encounters.ts,
src/VampireEncounter.tsx, src/main.tsx, src/politics.ts (reason text only),
src/visuals.tsx, src/style.css, encounter/navigation/entry/politics tests,
AGENTS.md, README.md, GAME_RULES.md, VAMPIRE_AGENTS.md,
PROJECT_REQUIREMENTS.md, docs/ARCHITECTURE.md and PROGRESS.md.
Added supplied portrait files in public/art. No dependencies or contract methods
added. Hackathon requirements reviewed and unchanged.

Post-walkthrough journal check: night 7, Unbound, Blood 3, 56 NPC records and 56
unique actor/night pairs, exactly one successful sanctuary acceptance. No duplicate
NPC turn or sanctuary transaction occurred across the browser reloads.

The restored user save also provided real rendered regression evidence for the
reported failure: after Night 3, Blood 9 and Exposure 1, Library and Lounge open,
but Crypt/sanctuary/court/passage absent. The new conclusion explicitly labels
ordinary entry versus protection without changing the old recorded reason or
rights. Screenshot: `.local/pass2g-preserved-failure.jpg`.
Corrected Marius and Dorian portraits were visually checked in their contacts:
`.local/pass2g-marius-corrected.jpg` and `.local/pass2g-dorian.jpg`.
The preview was returned to title with its existing save intact.
