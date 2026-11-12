# Pass 3A — the gothic RPG

Status: IMPLEMENTED for the existing seven-night Living Court campaign. Two complete browser routes, 76 Node tests and 38 real local Sandbox tests pass. Narrative limitations are reviewed separately below. No public deployment or paid model execution.

## Canon and campaign dependency map

The player is newly awakened, Vesper's descendant, and already owns the Library independently. Vesper owns the Crypt and withdraws its shelter at the third reckoning. House Volari was founded by the married Marius and older Seraphine from independent lineages. Marius administers castle and succession; Seraphine retains her independent rights. Neither marriage nor blood creates authority. Exact succession procedures, unnamed ancestry, the player's past/personality, and minor characters' biographies remain TBD.

Seven nights is the existing campaign horizon, not a newly invented council election or historical ceremony. The opening must distinguish that horizon from the immediate three-night shelter deadline. No invented archive scandal or hidden ancestry will be used to explain the research.

| Night | Dramatic purpose | State dependencies and real decisions | Later consequences |
|---|---|---|---|
| I — A bed before dawn | Vulnerability and a concrete objective | File existing title for Seraphine; seek Marius's finite appointment; learn about Lucien; hunger | Filing opens sanctuary; appointment blocks Cassian; NPCs act independently |
| II — The price of company | Competing patrons | Accept sanctuary after filing, take still-open appointment, commission passage after public lead | Paid non-revocable fixed term vs service vs temporary escape |
| III — The last borrowed night | Deadline reveals limits of a sire's power | Last sanctuary/appointment/passage chance; feeding may compete with protection | Vesper's actual withdrawal; independent Library and other rights survive |
| IV — Your door, their quarrel | Reverse the dependency | Mirelle/Cassian serving Marius or Dorian/Lucien serving an outsider; direct service remains possible | Actual derived assistant rights; Dorian may petition after Mirelle selection |
| V — Before the ink dries | Publication or interruption | Keep research running, stop it, fulfil outstanding service, survive | Publication closes rival route; patron independently rewards work; temporary passage deadline |
| VI — What survives a promise | Consolidation and sacrifice | Last new investigation start; withdraw unfinished work; sustain Blood; face actual dismissal if service unmet | Last research can finish on VII; stopping it forfeits that opportunity |
| VII — The door you leave open | Final consequential decision | Allow pending research to finish or stop it; reclaim a published investigator's access or retain it; hunt if needed | Recorded surviving permissions differ; research can still earn protection at final reckoning; original ending predicates decide outcome |

If earlier choices have closed the research route or withdrawn all researcher rights, Night VII does not invent a replacement political opportunity. Survival and keeping existing bargains remain decisions; this limitation must be included in the qualitative review.

## Narrative implementation boundaries

New chapter titles, scene blocking and authored dialogue are PROVISIONAL presentation. The existing finite investigation is newly framed as an account of present Library obligations: invitations and promises that stand independently of them. This is compatible new fictional subject matter, not a historical scandal, secret ancestry or newly discovered contract right. Specific documents and historical contents remain TBD. No fabricated betrayal, history, romance, relationship score or NPC location. NPC statements use public court state and their own recorded acts; private player resources are narrated to the player, never attributed to NPC insight. Free questions have distinct informational replies, not fake relationship effects.

The existing director, available action list, deterministic NPC selector/validator, restricted signers, recovery journal, save schema and ending calculation remain authoritative. Current Living Court campaigns receive the new narrative; legacy campaigns retain their prior mechanics and compatible scenes.

## Character voices and revised encounters

| Character | Provisional voice direction | Revised conversation |
|---|---|---|
| Vesper | Direct, possessive, impatient; no invented personal grievance | Her Crypt deadline versus the player's independent Library; her confirmed withdrawal |
| Seraphine | Social confidence, dry wit, plain bargaining | Why she can offer separate shelter, what she wants, the paid finite refuge |
| Marius | Restrained institutional confidence | The finite appointment, duty and the difference between service and permanent dependence |
| Mirelle | Polished, practical, competitive | What the investigation concerns, why Cassian accompanies her, Marius's interest |
| Dorian | Precise, guarded, unwilling to invent accusations | Rival work is a competing patron route, not proof of Mirelle's wrongdoing; Lucien's involvement |
| Cassian | Candid ambition and concise impatience | Appointment competition; whether he actually has an assistant's invitation |
| Lucien | Informal calculation and dry humour | Temporary passage versus his separate protection after Dorian delivers |
| Sabine | Observant, socially pragmatic | Her own role and public developments; no access to player-private decisions |

Each contact supplies two distinct information questions and, where available, an offer. Questions are free and explicitly have no fabricated affinity reward. The same encounter engine moves from interest to material terms to an existing validated action. Chapters, proactive incidents, negotiations, completed NPC acts and final pages are revised across all seven nights.

The opening names the player as newly awakened and Vesper's descendant, establishes her three-night deadline, and gives the seven-night objective: survive with separate shelter or a patron. It does not invent a personality, earlier relationship, election or final ceremony. The prologue leads into this problem before discussing solutions.

## Choices and consequences

Action labels express intention: “I want a refuge of my own”, “Back Dorian and Lucien”, “I want my Library back”, “Keep my word to Marius”. Acceptance still exposes Blood/action cost, exact NEAR payment, non-refundability/gas where applicable, duration, withdrawal conditions and foreseeable competition. Optional inspection retains mechanics and receipts.

Existing research results change later questions, chapter narration, room records, reckoning and endings. A confirmed assistant invitation is distinguished from a proposed one. Publication closes the rival route. Withdrawing the Library key stops unfinished work and dependent invitations; it does not retract published findings or separate patron protection. Pending and failed NPC events cannot be narrated as completed outcomes.

Night VII can allow Night VI research to finish or withdraw its invitation before publication. This changes assistant access and the independent patron reward, even when sanctuary keeps both runs Unbound. No ending predicate changed. Ending prose reads the stored outcome and reports surviving terms; it does not calculate victory.

No narrative schema migration was added. Existing campaign events are the memory; browser viewed-state remains presentation only. Deterministic policies are preserved, not replaced by authored dialogue or live generative AI.

## Gameplay presentation by room

- **Castle:** state-dependent chapter objective, court developments and direct routes to conversations or the night's decision. Hunger warnings belong to the narrator.
- **Library:** competing researchers and withdrawal are now situated here; current research, invitations and published results change the record and useful contacts.
- **Crypt:** Vesper's shelter, blood relationship and separate ownership are distinguished. Locked entry remains locked. Survival actions remain reachable; “Keep out of sight” restores access to the existing Exposure-reduction action without changing its rule.
- **Crimson Lounge:** patron questions, private bargaining and changing court developments. Contact buttons offer conversations, not assertions that ownership proves physical NPC presence.

Each room has a free “Read what has changed here” scene. No rooms, resources, currencies, transactions, authority or historical revelations were added. Current approved portraits and castle artwork are unchanged.

## Verification

| Check | Result |
|---|---|
| `npm test` | PASS 76/76, including six new narrative projection tests |
| `npm run build` | PASS TypeScript and production Vite build |
| Existing Linux Sandbox suites | PASS 35; Windows-only case skipped there |
| New `tests/sandbox/pass3a.test.mjs` | PASS 2/2: last-night finish versus stop, real finalized receipts |
| Windows `tests/sandbox/startup.test.mjs` | PASS 1/1, run separately; bootstrap, stale reset, scheduler, reload |
| Rust | NOT RERUN; no Rust or contract-interface changes |
| Browser route A | PASS all seven nights: title, sanctuary, hunt, Mirelle, wait, hunt, withdrawal → Unbound |
| Browser route B | PASS all seven nights: hunt, passage, hunt, Dorian, wait, withdrawal, hunt → Lucien Favoured |
| Reload | PASS both browser campaigns; campaign and transaction file hashes unchanged |
| Input and layout | Desktop and 390×844 mobile rendered; keyboard Enter activation and encounter heading focus observed; mobile terms scroll and choices remain reachable |

The full existing suites retain negative authorization, expiry, cascade, independent rights, spending, replay and turn-order coverage. The new late-research tests assert 56 NPC turns, separate sanctuary and Library survival, different research/patron outcomes and read-only reload. Existing save data was not migrated. Browser verification used `.local/pass3a-browser`; the user's original save was preserved and the preview restored afterward. Logs stay under `.local`; public evidence contains no keys.

Evidence:

- [Opening](evidence/pass3a-opening.jpg), [sanctuary terms](evidence/pass3a-sanctuary.jpg), [third reckoning](evidence/pass3a-third-reckoning.jpg), [rival conversation](evidence/pass3a-rival.jpg).
- [Night VII choice on mobile](evidence/pass3a-final-choice-mobile.jpg), [Unbound mobile](evidence/pass3a-unbound-mobile.jpg), [Lucien reward](evidence/pass3a-lucien-research-mobile.jpg), [Favoured mobile](evidence/pass3a-favoured-mobile.jpg).
- [Unbound browser state and receipts](evidence/pass3a-browser-unbound.json), [Favoured browser state and receipts](evidence/pass3a-browser-favoured.json).
- [Final-night finish](evidence/pass3a-final-finish.json), [final-night stop](evidence/pass3a-final-stop.json).

The Unbound screenshot precedes the last wording polish that replaces raw ending explanation with concise fictional terms; it is retained as walkthrough evidence, not a screenshot of that final text.

Original-save handoff: Continue successfully reopened the preserved Night VII campaign. This exposed and fixed a portrait mismatch when both court access and Lucien protection survived: conclusion artwork now follows the recorded patron, with a regression test. [Restored conclusion](evidence/pass3a-restored-conclusion.jpg). An orphaned original-save lock was archived only after checking that the sole remaining runner belonged to the isolated test save.

## Qualitative narrative review and known limits

**Stronger:** the immediate shelter problem precedes its political solutions. Patrons offer recognizably different bargains. Dorian can explicitly refuse to accuse Mirelle without evidence. Later scenes acknowledge publication and withdrawal instead of re-offering stale promises. Final research can still change actual rights. Readable costs remain visible alongside character dialogue.

**Still weak:** the investigation concerns present obligations rather than a specific historical mystery. Service remains an abstract institutional task. Exact archival evidence and minor biographies need authored canon before richer revelations can be written safely. Some earlier choices close political routes, leaving survival or keeping an existing bargain as the final-night decision; no unsupported late betrayal was inserted to disguise that. The seven nights remain a campaign horizon, without an invented diegetic election explaining its exact length.

Free questions offer different information, not branching relationship simulation. Supporting NPCs have less scene volume than the three patrons and competing researchers. The decision overview still lists available intentions, although negotiations occur inside scenes. Legacy pre-Living-Court campaigns intentionally retain older narrative paths. No claim is made that automated checks prove dialogue quality or that every possible route has been browser-tested.

Three room interiors remain provisional art. This pass does not resolve prior Pass 2I reduced-motion/screen-reader audit limitations; motion CSS was unchanged. Mobile uses a scrolling dialogue region below the portrait. No new art, voting, economic model, paid LLM, public deployment, Pass 3B or Pass 3C work was undertaken.
