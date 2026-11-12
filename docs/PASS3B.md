# Pass 3B — the living court

Status: IMPLEMENTED. Verification results below distinguish automated and browser evidence. No public deployment, LLM activation or Pass 3C.

## Preserved architecture and rules

The existing bounded eight-NPC nightly scheduler, journal, restricted signers, validation and chain postconditions remain authoritative. Rust and contract methods are unchanged. Reactions never execute a contract or write campaign state. The documented Pass 2C one-major-action/night design remains in force for current campaigns; legacy saves retain their existing limit. Navigation, information, relationships and reaction inspection are free. Commitments retain their explicit costs and validated paths.

Canon is unchanged: independent cofounder bloodlines and rights, Marius's institution, Seraphine's separate bargains, Vesper's Crypt and the player's Library. New reaction prose is PROVISIONAL. No hidden historical betrayal, ancestry, physical NPC location or secret knowledge has been invented.

## Operational motivations

| NPC | Priority and cooperation | Change of circumstance |
|---|---|---|
| Vesper | Withdraw her own Crypt invitation on schedule | Stops once revoked; no independent right affected |
| Seraphine | Collect accepted sanctuary/Lounge rent, otherwise offer where supported | No repeated collection; rejection creates no invented personal penalty |
| Marius | Address breached service, reward delivered research, honour available appointment | Fulfilled service prevents dismissal; existing protection prevents duplicate reward |
| Mirelle | Invite Cassian, finish authorised work, publish the initial public lead | No research without her effective invitation and assistant; published work closes rival race |
| Dorian | Invite Lucien, finish work, petition against a viable live rival | Petition now requires effective Mirelle invitation and enough time to withdraw, switch and finish; no futile late petition |
| Cassian | Claim the finite appointment before it closes | Passes when claimed/closed; Library access is separate from court position |
| Lucien | Reward Dorian's completed work, otherwise fulfil requested temporary passage | Permanent reward takes priority; no duplicate promise; dependent Library key is separate |
| Sabine | Sponsor Cassian through a valid delegable court invitation | Does not sponsor without legitimate parent or repeat an existing grant |

Actor-specific priority lists replace the shared generic list. Existing seeded competition remains. The validator computes legitimate choices; neither authored prose nor a stored reaction chooses NPC actions. Broader motives and undisclosed biographies remain TBD.

Compatibility detail: the live-rival/time cutoff filters **new policy observations**. The original validator still accepts a previously journaled local petition, allowing older interrupted saves to recover. No contract action is loosened. This distinction was checked in the targeted regression and all three new seven-night Sandbox routes were rerun after the correction.

## Information boundaries

Decision observations now carry only the political seed, not the full `Politics` object. Each actor receives public ledger records, actor-specific effective access, own memory/relationship values, own agreements, and server-validated available proposals. Player title filing, passage requests, all court encounters and other actors' private agreement decisions are no longer handed wholesale to every selector. Available proposals necessarily communicate the immediate legitimate opportunity to its intended actor. The trusted validator still checks full authoritative state.

Reaction prose uses completed (`confirmed`/`local`) NPC journal entries, player-issued ledger grants/revocations, accepted/rejected leases, recorded agreement responses and fulfilled service. Pending/error results suppress the reaction projection. NPC memory is never copied into scene prose. Public publication is an explicit transmission event; public ledger changes support reactions to invitations. Declining or leaving an ordinary conversation does not fabricate a rejection, debt or grudge.

## Event-to-scene mapping

`src/reactiveCourt.ts` is a pure projection into the existing encounter director, not a second encounter engine.

| Evidence | Level | Scene and follow-up |
|---|---|---|
| Player Library grant | Significant | Investigator invitation → current conversation |
| Revoked player Library root | Major | Key taken back → research record; dependent route lost, separate rights retained |
| Confirmed Vesper revocation | Major | Crypt door → current Crypt record; acknowledges independently surviving access |
| NPC assistant grant | Significant | Second investigator → Library record |
| Dorian's validated rival petition | Significant | Reconsider allegiance → Dorian; actual opportunity availability still enforced |
| Completed research | Major | Work leaves Library → record and patron conversations |
| Independent patron grant | Major | Separate promise → inspect retaining/withdrawing Library invitation |
| Appointment / dismissal | Major for player's protection; otherwise significant | Marius/Cassian response; service obligation or lost protection |
| Temporary passage / public lead | Significant | Lucien conversation and actual deadline |
| Sponsorship, competition, collected rent | Minor | Brief court update; no forced scene |
| Accepted or rejected lease | Significant | Recorded bargain/refusal → Seraphine; no inferred acceptance |
| Free proposal rejection | Minor | No bargain, no fabricated penalty |
| Fulfilled service | Significant | Obligation acknowledged → Marius |

At most 64 reactions are projected; IDs use existing actor/night/kind, grant IDs or agreement IDs. Only one major (or otherwise significant) event from the latest completed night opens automatically. Full reckoning remains accessible in Chronicle. Other developments are optional room/castle links. Existing scene memory persists completion and line position. Reactions do not recursively generate events. Missing historical timestamps are marked internally as unknown rather than assigned an invented night.

## Relationships and evolving rooms

Relationships now expose explainable states: cooperating through your invitation, cooperation withdrawn, work delivered, rival route closed, service owed/kept, paid bargain, hospitality withdrawn and separate protection. These are derived from persisted events and actual rights, without friendship meters or new authority. Researchers whose invitation was withdrawn explicitly acknowledge stopping or previously delivered work instead of repeating their original pitch.

Library developments expose the investigator, assistant, rival petition, publication and withdrawal. Crypt denial can open the relevant consequence without asserting anyone physically guards the door; actual access checks still determine entry. Lounge developments expose patrons, rent, promises, service and sponsorship. Castle shows three recent developments; room views show three relevant developments; all retained reactions are inspectable in Chronicle. Contact buttons remain correspondence, not simulated physical presence.

Late play retains meaningful existing tradeoffs: switch investigators after a rival petition, allow a last-night publication or stop it, keep/reclaim a published researcher's key, preserve service or face dismissal, and maintain survival resources. Closed investigations are not arbitrarily replaced. Some routes still have quiet nights; no filler contract actions were added.

## Verification

| Check | Result |
|---|---|
| Node suite | PASS 84/84; eight new reaction/knowledge/replay tests |
| Production build | PASS TypeScript and Vite |
| Full Linux Sandbox suite | PASS 40, zero failures; one Windows-only test skipped |
| Windows startup/reload test | PASS 1/1 separately; 41 actual Sandbox tests total |
| Rust | NOT RERUN; contract and interface unchanged |

New Sandbox routes (`tests/sandbox/pass3b.test.mjs`) complete all seven nights and re-open the session after every decision. Each verifies unchanged campaign/transaction counts on view, no repeated scheduled actor, 56 bounded NPC turns, bounded scene scheduling and ending eligibility:

- **Marius:** appointment, hunt, hunt, service, wait, wait, hunt → Favoured, service kept.
- **Switch:** title, sanctuary, hunt, Mirelle, withdraw, Dorian, wait → Unbound with Dorian publication and independent Lucien protection on VII. Cassian's former derived Library access is ineffective.
- **Published then withdrawn:** title, sanctuary, hunt, Mirelle, wait, withdraw, hunt → Unbound, Marius protection survives, assistant access does not.

Evidence: [Marius](evidence/pass3b-marius.json), [switch](evidence/pass3b-switch.json), [published/withdrawn](evidence/pass3b-withdrawn.json). Existing suites cover accepted/rejected agreements, failed acceptance, interrupted confirmed-outcome recovery, invalid actors and methods, expiry, revocation cascades, separate rights, seeded competition and old saves. The new projection tests explicitly suppress pending/failed evidence, reject missing prerequisites, exclude private political/other-NPC knowledge, preserve independent Crypt access and prevent completed-scene automatic replay. Historical assistant/rival replies acknowledge subsequently closed routes.

Browser route A completed seven nights: Marius appointment, hunt, hunt, service, Mirelle, withdrawal, hunt → Marius Favoured. Vesper's completed scene stayed read after reload; Mirelle acknowledged unfinished work stopped while separate protection remained. Keyboard Enter committed the appointment. [State/receipts](evidence/pass3b-browser-marius.json), [Vesper](evidence/pass3b-vesper.jpg), [ending](evidence/pass3b-marius-ending.jpg).

Browser route B completed title, sanctuary, hunt, Mirelle, withdrawal, Dorian, wait. The Library displayed Dorian's eligible counteroffer alongside Mirelle's assistant. Sanctuary carried the player through the switch, and Dorian delivered on VII with separate Lucien protection. Reload immediately after the UI showed the final submission resolving recovered the patron scene: 56 unique actor/night records and 27 transactions, with no repeated actor turn. This browser timing does not prove interruption at a particular journal instruction; deterministic interrupted-recovery tests supply that coverage. [State/receipts](evidence/pass3b-browser-switch.json), [rival petition](evidence/pass3b-rival-petition.jpg), [mobile assistant scene](evidence/pass3b-dorian-mobile.jpg), [recovered final response](evidence/pass3b-final-recovery-mobile.jpg).

The route reached [Unbound](evidence/pass3b-unbound-mobile.jpg), with Dorian's invitation still open. Browser tests used `.local/pass3b-browser`; the normal preview/save was restored afterward. Original save data was not replaced by these test routes. The confirmed orphaned preview lock was archived before reopening the normal save.

Desktop and 390×844 mobile rendering were inspected. Material terms and final-night choices remained reachable; existing dialog focus and keyboard activation worked. No new animation was added, and this pass does not claim a new full reduced-motion/screen-reader audit. A final review removed a misleading next-commitment link from the already-ended campaign; its follow-up now opens the Library record. The targeted reaction suite and build were rerun after that presentation correction.

## Known limits

This remains a deterministic political simulation, not generative AI or a physical NPC schedule. Reactions interpret existing decisions; this pass adds no free-form negotiations, secret-message simulation or new historical discoveries. Browser scene memory is local to the browser; clearing storage or using another browser can replay presentation, never transactions. An already-open unfinished reaction may resume on reload; completed reactions do not automatically replay. Old saves without complete event timing retain inspectable evidence but no invented chronology. Room art remains provisional as documented in Pass 2I.
