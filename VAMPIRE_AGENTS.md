# Vampire agents — canon and behaviour register

## Pass 2C current additions and overrides

**CANON (user Pass 2C):** Lucien is external to House Volari. Marius and Seraphine
remain married co-founders with independent lineages. No sire edge is added.
Marius administers the castle and formal succession in fiction; the implemented
court protection is a limited institutional function, not a succession system.

**PROVISIONAL, newly implemented gameplay assignments:** Marius has a disposable
Sandbox identity owning `court`; Seraphine independently owns `sanctuary` in addition
to her existing Lounge; Lucien independently owns `passage`. These capability
properties represent institutional protection, non-revocable leased sanctuary and
temporary escape respectively. They do not establish historic ownership or rooms.
Original Library/Crypt/Lounge ownership is unchanged. Source: new_political and
scenario.mjs; full authority matrix in docs/PASS2C.md.

| New minor identity (PROVISIONAL) | Motivation | Dependency | Player interaction / independent action |
|---|---|---|---|
| Cassian, disgraced courtier | Secure appointment | Finite unclaimed service | Compete with player; claim service, then receive authorized grant |
| Mirelle, archivist | Publish archive lead | Player-issued Library grant | Provides dossier/passage lead; publishes once while permission valid |
| Dorian, opportunist | Secure dossier | Public lead and finite dossier | Competes with player's investigation; consumes opportunity once |
| Sabine, intermediary | Sponsor Cassian | Marius-issued delegable court grant | Inspect patron dependency chain; exercises actual child delegation |

All four names/roles were suggested by the user and adopted as new gameplay
assignments, not rediscovered canon. Their genealogy, House membership, history,
physical appearance and established dialogue are **TBD**. Portraits are symbolic.

**PROVISIONAL current policies:** Vesper enforces a three-night ultimatum; Seraphine
honors and settles accepted leases; Marius grants protection for service and can
revoke his own grant upon breach; Lucien trades temporary access; minors act as
above. Seeded competition is deterministic. No LLM is configured or invoked.
Marius's biography/personality/voice and exact formal succession remain **TBD**.
His new implementation goal is institutional service, not an invented canon trait.

The older pass register below remains source history. Statements that Marius has
no account, Lucien has no rights, or adding them is forbidden describe the Pass 2B
boundary and are superseded only by these explicit Pass 2C implementation decisions.

Pass 2B, 2026-11-11. This register separates established fiction, proposed behaviour,
and enforceable authority. `CANON` means a cited source supports the statement;
`PROVISIONAL` means a gameplay choice; `TBD` means undefined; `CONFLICT` identifies
contradictory claims. A character profile never creates a contract right.

## Sources and limits

- `PROJECT_REQUIREMENTS.md` §4 supplies the three NPC seeds and player premise.
- `src/main.tsx` supplies existing room descriptions and inscription voice.
- `src/game.ts` supplies finite discoveries about Seraphine and independence.
- `contract/src/lib.rs` (`new`, `new_economy`) and `scripts/sandbox/scenario.mjs`
  supply the actual bootstrap identities, genealogy, titles, grants and lease.
- `docs/PASS1.md` and `docs/M2_ECONOMY.md` explain the transitional policies.
- The user's **WE INHERIT NIGHT — PASS 2A** instruction establishes the names
  Marius and Seraphine Volari, House Volari context, and their independent
  bloodlines and authority. A repository search before this pass found no
  Marius/Volari material. The Pass 2B user instruction adds the marriage, co-rule and domains below.
  No missing biography has been reconstructed.

## Lady Vesper

- **CANON identity/personality/objective:** Lady Vesper, calculating traditionalist;
  preserve the ruling dynasty (`PROJECT_REQUIREMENTS.md` §4).
- **CANON genealogy/relationships:** sire of the player in the bootstrap;
  player begins dependent on her Crypt shelter (`contract/src/lib.rs::new`).
  Other family, marriages and relationships: **TBD**.
- **CANON authority:** Crypt owner in the current scenario; issuer of grant 0.
  May revoke that grant, not seize the independently owned Library or cancel
  an accepted Lounge lease. Always consult the contract.
- **PROVISIONAL behaviour:** revoke her own Crypt grant after accepted lease 0;
  otherwise pass. This preserves the old deterministic retaliation, not AI.
- **PROVISIONAL knowledge:** public ledger and her own local memory/relationships;
  no private player discoveries, Blood, Exposure or other NPC memories.
- **CANON voice evidence:** “All who shelter here answer to their sire.”
  (`src/main.tsx`, Crypt inscription). **PROVISIONAL voice guidance:** formal,
  possessive of tradition. No broader dialogue corpus exists.

## Seraphine Volari

- **CANON identity:** repository's Seraphine, identified as Seraphine Volari by
  the Pass 2A instruction. Pragmatic rebel seeking independence and deals
  (`PROJECT_REQUIREMENTS.md` §4).
- **CANON genealogy/authority constraint:** her bloodline and authority remain
  independent of Marius Volari's (Pass 2A instruction). Neither House membership
  nor any marriage creates a sire edge or enforceable right.
- **CANON relationship:** married to Marius; older than him; together they united
  two previously independent bloodlines to establish House Volari and have ruled
  for centuries (Pass 2B instruction). She retains independent ancestral rights
  Marius cannot unilaterally revoke. **TBD:** specific sire/descendants and the
  precise scope/representation of ancestral rights beyond implemented Lounge title.
- **CANON authority:** Lounge owner in `new_economy`; lease 0 offers the player
  entry, not title. Rent vests upon acceptance. No authority over Library/Crypt.
- **CANON objectives/relationship evidence:** values independent tenancy and
  respect for her property; prospective Library/Lounge access exchange is only
  a discovery, not an agreement (`src/game.ts`, Lounge discoveries).
- **PROVISIONAL behaviour:** may present her existing Lounge lease, collect
  vested rent if unpaid and no payout is pending, or pass. An LLM may choose only
  validated available actions; unconfigured/failed providers use labelled fallback. **PROVISIONAL knowledge:** same public ledger/own
  memory boundary as Vesper. **PROVISIONAL voice:** practical, explicit about
  terms; no invented quotations. Established extended narrative voice: **TBD**.

## Lucien

- **CANON identity/personality/objective:** opportunistic diplomat seeking
  inheritance, vote trading and strategic deals (`PROJECT_REQUIREMENTS.md` §4).
- **TBD genealogy/relationships:** no sire, descendants, marriage or specific
  alliance is established. Initial signed local relationships are zero, a
  simulation default rather than proof of narrative neutrality.
- **CANON authority boundary:** no seeded property/grant/vote in this scenario;
  his account has only a restricted `enter_room` key. Historical local seat
  data does not establish a council right (`docs/PASS1.md`, `scenario.mjs`).
- **PROVISIONAL behaviour:** pass; negotiation and voting are unavailable.
  **PROVISIONAL knowledge:** public ledger and own local memory/relationships.
  **PROVISIONAL voice:** diplomatic and transactional; established dialogue: **TBD**.

## Marius Volari and House Volari

- **CANON:** Marius Volari is named in the Pass 2A instruction; Marius and
  Seraphine have independent bloodlines and authority. Preserve House Volari
  as a House concept, distinct from both genealogy and enforceable permissions.
- **CANON (Pass 2B instruction):** Marius is the male head of House Volari;
  controls the castle and formal succession and possesses enforceable authority
  over those domains in established fiction. He and Seraphine are married
  co-rulers of centuries; marriage does not subordinate either lineage.
- **Implementation boundary:** no Marius wallet, castle-wide property, succession
  API or ancestral-right record exists in the current bootstrap. This is a gap
  between canon and represented mechanics, not permission to invent transactions.
- **TBD:** specific sire/descendants, personality, objectives, voice, exact
  succession rules and contract representation. No Marius account is seeded.
- **PROVISIONAL implementation boundary:** not scheduled until canon, identity
  binding and actual permitted actions are supplied. Adding invented assets or
  a default political role would violate this pass.

## Player

- **CANON:** newly awakened vampire, Vesper's descendant, dependent on Crypt
  permission but independently owns Library in the implemented bootstrap.
  Name, personality, additional genealogy, marriages and narrative voice: **TBD**.
- **CANON authority:** explicit player account accepts/rejects the Lounge offer;
  title and permissions are contract-backed, not inferred from discoveries.
- **PROVISIONAL knowledge:** inspection is free; finite investigations reveal
  recorded facts. The player is human-controlled, not an NPC scheduler entry.

## Conflicts and explicit non-inferences

- **CONFLICT (resolved implementation precedence):** the aspirational player
  seed says the player can *win* independent title, while bootstrap already
  gives Library title. Current gameplay follows the contract; future acquisition
  is not implemented. Sources: requirements §4 versus `new` and `docs/PASS1.md`.
- No contradictory Marius/Volari sources were found; absent facts are **TBD**,
  not conflicts. Do not turn Marius into Seraphine's sire, dependent or owner.
- **PROVISIONAL:** deterministic NPC ordering, retaliation, collection and local
  relationship deltas are gameplay policies, not additional character canon.

## Supplied visual references (Pass 2B)

The user supplied bloodline.png, castle.png and Seraphine.png as visual references.
Seraphine's supplied portrait is used in encounters. Embedded Coin/Influence,
Blood /10, extra rooms and unverified genealogy/rights are legacy reference data,
not current rules. CONFLICT: depicted ancestry/authority cannot override the
explicitly independent married Volari lineages or the actual contract. Adrian,
Isolde, Darian, Elara, Viktor and Lilith are not added as runtime agents or family
edges by copying the layout. Other portraits are labelled symbolic placeholders.

## Pass 2D dialogue
PROVISIONAL: restrained conditional encounter lines in src/encounters.ts are newly authored presentation, not historical canon or model output. All eight existing actors use current public political results; no new genealogy, House membership or holdings. Undefined physical appearances and biographical details remain TBD.

Pass 2E PROVISIONAL presentation: four prologue passages summarize the established player/Vesper relationship, independent Volari founding lineages and current ultimatum. No new ancestry, player biography, holding or personality is assigned. Existing physical/biographical TBDs remain.

## Pass 2G dialogue and artwork
PROVISIONAL: src/story.ts adds short free question/relationship/attitude branches
for the eight current actors and state-dependent nightly incidents. These are
newly authored presentation, not historical canon, NPC policy or live AI. Tone
choices have no hidden political effects. Existing genealogical TBDs remain.
User-supplied Vesper.png and corrected Marius.png/Dorian.png are now mapped in
public/art. The user identifies the reader as Dorian and the bearded second
portrait as Marius; this supersedes the earlier mistaken filename mapping.
Portraits imply no new property, genealogy, House membership or enforceable rights.

## Pass 2H — PROVISIONAL gameplay assignments
New Living Court bootstrap only: Mirelle’s initial Library permission expires at Night Four; Seraphine grants the player an independent Lounge invitation. Player ownership of Library and all existing owners are unchanged. No historical canon or genealogy is added.
Mirelle may delegate the player's new Library permission to Cassian and publish research; Marius rewards completed work with institutional protection and recognizes the service as fulfilled. Alternatively, Dorian delegates to Lucien and publishes research; Lucien grants permanent but patron-revocable Passage protection. Both delegations depend on the player's revocable root. Dorian's rival petition is off-chain and cannot confer access.
Eight short voices in src/livingCourt.ts are newly authored PROVISIONAL dialogue, not historical fact. Existing ancestry/personality TBDs remain. These policies are deterministic, not LLM decisions. NPC-funded payments remain deferred.
# Pass 3A narrative continuity — PROVISIONAL

The seven-night Living Court presentation now gives each existing NPC a distinct conversational voice (docs/PASS3A.md). These voices do not change policy goals, ancestry, historical relationships or permissions. The finite investigation is framed as an account of present Library obligations and independently held promises, not a newly invented historical scandal. Specific historical documents and undeclared biographies remain TBD. NPC dialogue reads public developments and the speaker's recorded actions; player-private resource warnings belong to the narrator. Deterministic policies remain the runtime decision source.

# Pass 3B operational continuity — PROVISIONAL

Actor-specific deterministic priorities are documented in docs/PASS3B.md. Available actions remain bounded by agents.ts/library.ts and verified ledger access. Dorian's rival petition now requires a live rival and sufficient remaining nights; no late impossible offer. Observations no longer include the whole Politics object or unrelated private agreement decisions. Explicit cooperation/service/patronage descriptions and correspondence react to recorded acts; no new ancestry, physical locations, secret information or grudges. Broader motives remain TBD. This supersedes older notes implying unrestricted political observation or live-provider activation in current gameplay.

## Pass 3D provisional operational additions
PROVISIONAL current-campaign objectives, not history: Cassian seeks independent escape after losing the appointment; Lucien sells one fixed temporary passage when legitimately owned; Marius seeks continuing Library entry at the final confrontation. Mirelle’s public account, completed service and Cassian’s settled independent passage support Marius accepting limited inspection instead. Dorian’s competing account does not satisfy that institutional preference. All evidence is published research or public verified lease/grant state, not inferred secret knowledge or physical presence.
Exact proposal eligibility and terms live in finalCourt.ts and are validated through agents.ts. Existing bounded nightly schedule, restricted signing and information boundaries persist. No paid provider. See docs/PASS3D.md.
