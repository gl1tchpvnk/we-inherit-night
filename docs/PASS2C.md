# Pass 2C — political authority and playable campaign

## Initial audit and design decision

Baseline: 28 Node and nine Rust tests passed; production build passed. The preceding
Pass 2B audit also completed a clean 28-entry real Sandbox regression run.
Read root instructions, requirements, canon, rules, prior pass reports, architecture,
security, bootstrap, runner, provider, UI and existing tests. No nested AGENTS found.

Existing contract supports only entry grants, issuer revocation and prepaid leases;
it has no ownership transfer, appointments or general-purpose political scopes.
Therefore a new **private, one-time `new_political` initializer** is required to
seed three explicit capability properties alongside the unchanged original rooms:
`court` (Marius), `sanctuary` (Seraphine), `passage` (Lucien). These are enforceable
entry/access domains used by the deterministic rules, not three new navigable rooms.
No new runtime mutation, admin override, scope, state layout or lease semantics.
Existing initializers remain intact. Rebuild WASM and rerun all old contract suites.

These are newly introduced PROVISIONAL gameplay assignments, not historical canon.
All new accounts are disposable Sandbox identities. Public identities remain absent.
Marius's institutional root and Seraphine's sanctuary root are unrelated. Library
remains player-owned. Mirelle receives Library access from its actual owner;
Sabine receives delegable court access from Marius. Neither is a fabricated sire link.

New campaigns default to one major action and automatic reckoning. Version-2 saves
retain legacy rules and rights without seeding new chain state; New Game starts 2C.
The provider adapter remains available for historical tests, but gameplay never
configures/calls it. Eight deterministic agents receive restricted observations.

## Intended playable routes

- File Library title on Night 1; accept seven-night sanctuary on Night 2 or 3.
  Pay real Sandbox rent; survive with Library ownership and a non-revocable lease.
  This is temporary sanctuary, never permanent ownership. Feed when necessary.
- Claim Marius's finite administrative service before Cassian; receive a revocable
  court grant. Fulfil the obligation during Nights 4–5; otherwise Marius may revoke
  his grant at the sixth reckoning. Maintain Blood and reach Night 7 as a dependent.
- Mirelle publishes a lead; a finite dossier competes with Dorian and can qualify
  sanctuary negotiations. Lucien's short passage grant can bridge the ultimatum,
  but expires at internal night 5 and cannot alone win the campaign.

## Authority matrix

All rights use the unchanged `enter` scope. Political consequences are local rules
over effective contract rights, not new on-chain scopes or voting rights.

| Actor | Right/source | Expiry | Revocation authority | Gameplay consequence |
|---|---|---|---|---|
| Player | Library ownership, existing independent title | None | No grant issuer; no transfer API | Information and qualifying title; not shelter by itself |
| Vesper | Crypt ownership; grant 0 to player | None until revoked | Vesper alone; descendants cascade | Initial shelter; revoke at third reckoning, never seize Library |
| Seraphine | Existing Lounge ownership and lease 0 | Existing three-night terms | Accepted lease cannot be revoked | Original commercial path preserved |
| Seraphine | NEW independent sanctuary capability ownership; lease 1 to player | Offer exclusive deadline 3; accepted duration 7 | Accepted lease cannot be revoked; no Marius parent | Protected upkeep and Unbound eligibility while active; temporary, no title transfer |
| Marius | NEW court capability ownership | None | Marius issues/revokes own grants | Institutional protection for one finite service; dependency survives to Favoured |
| Lucien | NEW independent passage capability ownership | Player grant expires at internal night 5 | Lucien is issuer | Temporary alternative shelter, cannot alone win |
| Mirelle | NEW Library grant 1, from actual player owner | None | Player issuer | May publish a public archive lead while access is effective |
| Sabine | NEW delegable court root grant 2, from Marius | None | Marius issuer | May delegate a child grant to Cassian; root revocation invalidates it |
| Cassian | Potential appointment grant from Marius / child grant from Sabine | None | Actual issuer, plus ancestors | Competes for appointment and can acquire actual court access |
| Dorian | No seeded contract right | Dossier closes at internal night 4 | Not applicable | Competes for a finite information opportunity; no invented authority |

## Deterministic court and encounter hooks

One proposal per actor per reckoning; order: Vesper, Seraphine, Mirelle, Cassian,
Dorian, Marius, Lucien, Sabine. Pass is legitimate. Eight turns maximum per night,
56 per full new campaign. The runner forces deterministic decisions even when a
provider is passed or old environment flags exist. No LLM calls occur in gameplay.

- Vesper revokes her actual Crypt grant at internal night 2 (third reckoning).
- Seraphine presents the existing commercial lease and collects vested rent,
  prioritizing sanctuary settlement. She cannot cancel accepted sanctuary.
- Marius appoints the winner of the finite service; revokes his player grant at
  internal night 5 if the publicly accepted service obligation remains unfulfilled.
- Lucien delegates his own passage when commissioned before internal night 3.
- Mirelle (PROVISIONAL archivist): depends on her Library grant, publishes one
  public lead; player interaction opens the dossier and passage opportunities.
- Cassian (PROVISIONAL disgraced courtier): seeks an appointment, depends on an
  open service slot, competes from night 1; player can claim it first. He may
  acquire Marius's grant and Sabine's independent child source.
- Dorian (PROVISIONAL opportunist): depends on the public lead and unclaimed
  dossier, competes from night 2; player can secure it before him.
- Sabine (PROVISIONAL intermediary): depends on her live delegable grant;
  sponsors Cassian once from night 1. Player can inspect her actual rights chain.

New minor identities, roles and motives are implementation assignments authorized
by Pass 2C, not inherited canon. No new genealogical or House membership edges.
Lucien is explicitly external to House Volari. Minor biography/voice/family: TBD.

Competition uses a hash of persisted campaign seed, night and actor. Cassian has a
seeded chance on night 1, guaranteed eligibility on night 2 if still unclaimed;
Dorian competes from night 2. Results, public opportunity ownership and encounter
records persist in the same journal. These are event hooks for 2D, not cutscenes.
No NPC gets player Blood/private discoveries or another NPC's private memory.
Public title filing, service commitments and opportunity resolutions are explicitly
public; only those political facts enter the shared observation.

## Action and survival rules

New saves are version 3, with internal action limit default 1 (test-only constructor
override 1–3). No HTTP/UI control can change it. Spending the last action persists
an automatic-reckoning marker together with the decision. Confirmed player
transactions reconcile nonce and their specific lease/access postconditions before
reckoning. A crash between acceptance and dawn recovers without a second payment.
An uncertain transaction pauses rather than inventing success.

Exploration, rights/terms inspection, character information, prior records and
bloodline/expiry inquiries are free. Public title filing is a major action with
1 Blood cost because it qualifies sanctuary negotiation; information alone grants
no rights. Sanctuary, commissioning passage, administrative commitment, fulfilling
service, securing the dossier, and survival actions consume one action on success.
Political offer rejection remains free; legacy contract rejection retains its
existing signed one-action behavior. Explicit End Night / Pass also reckons.

Blood/Exposure bounds, feed/rest/conceal effects and lease 0 economics are retained.
Any effective Crypt/sanctuary/court/passage access gives 1 Blood upkeep; none costs
3. Exposure eases by 1. At and after the third dawn, lack of all four protections
is immediate failure. Library ownership alone is information/title, not shelter.
Marius's obligation must be fulfilled during internal nights 3 or 4, costs 1 Blood
and a major action; otherwise his revocation at night 5 creates a genuine deadline.

## Exact endings

Evaluate fresh player `get_world` after verified night advancement, never a victory
flag. Blood exhaustion or Exposure 10 always defeats, including earlier turns.
No effective shelter at internal night >=3 causes early FAILURE.
At internal night 7, in priority order:

1. THE UNBOUND: player owns Library, has effective sanctuary access, and holds an
   accepted sanctuary lease whose end night is strictly greater than current night.
   This combines independent title with fixed-term non-revocable protection, NOT
   permanent sanctuary ownership or independence from every future obligation.
2. THE FAVOURED: effective court access remains. This is patron-granted protection,
   revocable by its issuer; service fulfilment itself never substitutes for a right.
3. FAILURE: neither qualifying position exists. Passage alone cannot win.

No Regent, Exile, council votes or resource scores determine these outcomes.

## Architecture and recovery

`src/politics.ts` holds the focused campaign rules/opportunities/endings.
`agents.ts` remains the only NPC proposal/validation boundary; it derives fixed
operation arguments from actual rights and server-bound identities. `campaign.mjs`
extends the existing dawn journal, validates fresh state and confirms grants,
revocations and settlements before committing memories/history. No parallel signer.
The new initializer adds no contract state fields, so old save/chain layouts remain
compatible. Old campaigns continue under legacy rules; no rights are fabricated
during migration. New games explicitly bootstrap the new disposable scenario.

NPC grant/claim/revoke keys remain receiver/method limited with finite gas allowance;
minor actors with no mutations get only enter_room. Player retains disclosed local
development signing. The local operator, upgrade key, keeper, JSON files and RPC
remain trust assumptions; no public custody or distributed exactly-once claim.
An invalid unresolved intent can pause reckoning and require operator reconciliation.

## Visual scope and remaining work

Existing castle, artwork, portraits and navigation retained. Essential additions:
one-action HUD, ultimatum/protection/obligation summary, finite opportunities,
explicit endings and deterministic provenance. New faces use existing labelled
symbolic placeholders. Browser/mobile/keyboard visual QA: NOT RUN unless separately
recorded. Pass 2D owns illustrated encounters, finished portraits and cutscenes.
Public wallets/deployment, eight-seat voting and exact ancestry/succession history
remain outside this pass. No new currencies or spendable influence.

## Test results

- PASS: baseline Node 28/28, Rust 9/9, production build.
- PASS: final Node 37/37, including nine new political rule/runner tests (mock
  authority fixture, not blockchain evidence). Covers action budget, free reading,
  automatic reckoning/pass, both routes, three endings, unmet service, temporary
  passage, identity, finite competition, seed reproducibility, reload and lost
  committed response. Historical tests explicitly select their legacy rule fixture.
- PASS: Rust 11/11 (nine original plus private/distinct political initializer and
  independent roots); native local-demo build; TypeScript/Vite production build.
- PASS: rebuilt WASM via cargo-near, 200549 bytes, SHA-256
  `0c3e631610299514dd02f0fde598215c132d55954133e0e670e3655a79466b61`.
- PASS: all 28 existing real Sandbox entries in one regression run (731.40s).
- PASS: new real Sandbox Unbound, Favoured and early-Failure scenarios (3/3,
  309.24s), plus focused Lucien passage/expiry (1/1). Four new scenarios, not a
  single combined 32-case run. Each checks persistent outcomes/no repeated turns.
- PASS: final focused Unbound run verifies corrected sanctuary transaction labels,
  lost-response recovery and the complete ending (1/1; 118.43s test body).
- NOT RUN: browser/mobile/keyboard visual QA, public testnet or deployment. No
  live model calls; provider usage is deliberately disabled, not a missing MVP step.

Evidence: `docs/evidence/pass2c-unbound.json`, `pass2c-favoured.json`,
`pass2c-failure.json`, `pass2c-passage.json`. Actual local Sandbox receipts and views
are distinct from the mocked provider fixtures retained for Pass 2B compatibility.
Logs: `.local/pass2c-node-final.log`, `pass2c-rust.log`, `pass2c-build-final.log`,
`pass2c-wasm.log`, `pass2c-legacy-sandbox.log`, `pass2c-political-sandbox.log`,
`pass2c-passage-sandbox.log`, `pass2c-unbound-final.log`.

Final verified sanctuary acceptance transaction:
`Gs2F8yLEit1V6cxLrdEmWx2JbYzCo7E1XiHwHFEhAMwp` (local Sandbox, not a public
explorer transaction). Receipt evidence confirms exact lease 1 acceptance and
expiry at night 8; current views confirm Library and sanctuary survive Crypt loss.

## Changed files

Implementation: src/politics.ts (new), game.ts, agents.ts, main.tsx;
scripts/sandbox/campaign.mjs, scenario.mjs, play.mjs; scripts/bridge.mjs;
contract/src/lib.rs and tests.rs; .env.example. No new runtime dependency.
Tests: tests/politics.test.mjs and tests/sandbox/politics.test.mjs (new);
historical game/agents/decisions/gameplay fixtures explicitly preserve legacy mode.
Documentation: AGENTS, PROJECT_REQUIREMENTS, README, VAMPIRE_AGENTS, GAME_RULES,
PROGRESS, architecture/security, this report and refreshed Sandbox evidence.
HACKATHON_REQUIREMENTS reviewed, unchanged. Existing art/CSS components retained.
