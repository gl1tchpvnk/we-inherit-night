# Deterministic game rules

## Pass 3B continuity

The Pass 2C one-major-action default remains the documented alternative permitted by the Pass 3B request; legacy limits are unchanged. NPCs still act once per bounded nightly phase. Dorian petitions only while a live Mirelle investigation can be replaced and completed in time (petition through internal night 3). Actor-specific priorities use validated choices and minimal observations; no model calls. Reactions are presentation-only, capped at 64, with at most one automatic consequential scene per reckoning. Explicit relationship descriptions derive from existing records, not new meters or rights. See docs/PASS3B.md.

## Pass 2C — current new-campaign rules

The rules below supersede older provisional rules for **version-3 new games**.
Older saves retain version-2 behavior and do not acquire rights during migration.

| Rule | Status | Enforcement |
|---|---|---|
| Appointment, Mirelle authorization, Dorian authorization and temporary passage commission each cost 1 Blood per successful commitment; starting Blood remains 8 | IMPLEMENTED locally | Existing ACTIONS validation/playerAction and persisted commitment recovery; sanctuary acceptance stays 0 Blood |
| One major action/night, seven nights; internal playtest limit 1–3, no UI/API override | IMPLEMENTED | game.ts newCampaign; default 1 |
| Last major action automatically enters persisted reckoning; explicit Pass also advances | IMPLEMENTED | campaign.mjs automatic marker, existing journal/nonce/postconditions |
| Exploration, records, rights/terms, character information and bloodline/expiry inquiries free | IMPLEMENTED | actionAvailability/enter/view; title filing remains consequential |
| Vesper revokes her grant at third reckoning | IMPLEMENTED | validateNpc, restricted issuer transaction; no unrelated revocation |
| Sanctuary covenant: qualified title/dossier, 0.02 NEAR, seven-night lease, offer deadline 3 | IMPLEMENTED | existing accept_lease; exact owner/buyer/terms verified |
| Marius's finite service grants revocable court protection; fulfil during internal nights 3–4 | IMPLEMENTED | actual grant_access; issuer revokes at night 5 if unmet |
| Lucien's commissioned passage grants temporary shelter until internal night 5 | IMPLEMENTED | actual owner grant with exclusive expiry |
| Mirelle publishes with valid Library access; Cassian/Dorian compete; Sabine delegates a legitimate child grant | IMPLEMENTED | restricted observations/validator/journal and contract grant rules |
| Seed derives from campaign ID; per-night actor selection and outcomes persist | IMPLEMENTED | politics.ts seededRoll; encounters and finite opportunity claims in journal |
| At most one turn per eight NPCs/night; pass counts; provider always disabled | IMPLEMENTED | COURT_ORDER, history guards; at most 56 records |
| Shelter from Crypt/sanctuary/court/passage costs 1 Blood, none costs 3 | IMPLEMENTED | dawn over effective contract view |
| No shelter after third dawn or Blood 0 causes early failure | IMPLEMENTED | fresh-state politicalEnding plus assess |
| Final Unbound = Library ownership AND effective accepted sanctuary lease ending after current night | IMPLEMENTED | politicalEnding; fixed-term protection, not permanent ownership |
| Otherwise final Favoured = effective court access; otherwise Failure | IMPLEMENTED | politicalEnding; no score/victory flag or automatic discovery right |
| Cutscenes / illustrated encounter presentation | IMPLEMENTED | Pass 2D pure scenes over verified results |

See `docs/PASS2C.md` for the authority matrix, exact strategies and evidence.
The following table documents preserved earlier passes; three-action and model
configuration entries are historical, not the new MVP defaults.

Statuses: `IMPLEMENTED` = existing verified mechanism; `PASS 2A` = foundation
added here; `PASS 2B` = this pass (live verification distinguished below);
`PASS 3` = deferred scope, not shipped; `TBD` = undefined.
The engine validates actions; NEAR enforces rights. Sources refer to executable
code, not presumed future authorization. Internal nights are 0–6, displayed 1–7.

| Rule | Status | Enforcement / source |
|---|---|---|
| Seven nights; three major player actions per night; unused actions do not carry over | IMPLEMENTED | `src/game.ts`: newCampaign, spendAction, dawn; provisional balance |
| Navigation, rights/character inspection and chronicle reading cost no major action | IMPLEMENTED | `campaign.mjs`: enter/view; finite investigations still cost one action |
| Blood 0–12, initial 8; legacy Exposure data is inert | IMPLEMENTED | game.ts bounds/newCampaign; local simulation, not tokens |
| Feed +4 Blood; rest +2 Blood with Crypt permission; conceal retired | IMPLEMENTED | ACTIONS/playerAction; both consume a major action; full rest cannot repeat |
| Dawn costs 1 Blood with shelter, otherwise 3 | IMPLEMENTED | dawn; clamp Blood; no Exposure calculation |
| Blood 0 defeats; survive seven dawns for temporary development conclusion | IMPLEMENTED | assess; not final political victory |
| Five finite discoveries, exact Blood costs and prerequisites | IMPLEMENTED | ACTIONS/actionAvailability; persisted once; no rights or votes granted |
| Validate shape, remaining actions, resources, access and prerequisites before effects | IMPLEMENTED | validateAction/playerAction; clone before mutation; fresh has_access recheck in runner |
| Failed local/chain action consumes no Blood or major action; rejected chain call may still cost network gas | IMPLEMENTED | campaign recovery/rollback; revision advances for failed submitted player action |
| Campaign ID/revision rejects stale requests; one serialized writer | IMPLEMENTED | campaign.mjs and play.mjs; trusted local save, not on-chain game consensus |
| Genealogy is permanent bootstrap history, never permission | IMPLEMENTED | contract new/has_access; House and marriage confer no rights |
| Marius and Seraphine Volari have independent bloodlines and authority | PASS 2A | canon constraint in VAMPIRE_AGENTS.md; no invented on-chain Marius or genealogy |
| Property owner has access and can issue root entry grants | IMPLEMENTED | has_access/grant_access; no property transfer API |
| Delegation requires live delegable parent held by predecessor; same property/scope; no expiry expansion | IMPLEMENTED | grant_access; enter is sole scope, depth <=4, no self grants/cycles, <=256 grants |
| Original issuer alone revokes a grant; descendant rights become ineffective | IMPLEMENTED | revoke_grant/valid; revoked ancestor checked at every use; records remain |
| Independent title and unrelated roots survive revocation; lease rights are not descendant grants | IMPLEMENTED | has_access/valid/lease_active |
| Grant and lease access expire when current night >= expiry/end | IMPLEMENTED | valid/lease_active; no wall-clock expiry |
| Issuer may revoke even expired or otherwise ineffective grant | IMPLEMENTED | revoke_grant checks issuer and not-already-revoked, not effective validity |
| Only keeper advances night with matching expected_night; mutations authenticate predecessor and actor nonce | IMPLEMENTED | advance_night/check_nonce; keeper timing and upgrade account are trust points |
| Property transfer and succession semantics | TBD | no API; epoch invalidation plus surviving-lease policy required before implementation |
| Owner offers named buyer lease: rent >0 and <=0.1 NEAR, duration 1–7, expiry within seven nights, <=64 offers | IMPLEMENTED | offer_lease; multiple offers possible, only one active lease per property at acceptance |
| Buyer alone accepts open unexpired offer with exact attached rent, unchanged owner and no active competing lease | IMPLEMENTED | accept_lease; consumes nonce once, grants entry only, escrow vests immediately |
| Buyer rejects open offer; owner cancels open offer; accepted lease cannot be cancelled | IMPLEMENTED | reject_lease/cancel_lease; rejection itself has no expiry check (UI is stricter) |
| Lessor claims vested rent once; payout pending blocks duplicate; private callback clears escrow or restores claimability | IMPLEMENTED | claim_rent/rent_paid; >=30 Tgas; rent payable after access expiry |
| Current scenario: player 0.25 disposable Sandbox NEAR, rent 0.02 for three nights, offer expiry at internal night 2 | IMPLEMENTED | scenario.mjs; no fictional currency, income or spendable Influence |
| Policy receives public ledger records and own local relationships/memory only | PASS 2A | observeAgent; ownAccess comes from actor-specific get_world; excludes player discoveries/resources and other private memory |
| Static profiles and goals do not contain mutable holdings or create authority | PASS 2A | agents.ts AGENTS versus Campaign NPC state versus contract view |
| Server binds actor/account; proposals contain exactly kind, never identity, keys, methods, targets or arbitrary args | PASS 2A | validateNpc; fixed revoke grant 0 / collect lease 0 / pass; not a generic transaction API |
| One scheduled decision per Vesper, Seraphine, Lucien per night, fixed order, at most one consequential outcome each | PASS 2A | NPC_ORDER, history guard and persisted dawn index; pass consumes the scheduled turn too |
| Character fallback: Vesper retaliates after acceptance, Seraphine collects vested rent, Lucien passes | PASS 2A | selectNpcAction; malformed/throwing selector uses fallback once, then validation; no model call |
| Fresh authority/night validation before execution; existing restricted signer and contract nonce enforce transaction | PASS 2A | campaign.mjs; pending intent persisted before call; effects commit after confirmed postcondition |
| Persist bounded history (at most 21 entries per seven-night campaign) and recover without duplicate confirmed NPC action | PASS 2A | agentHistory plus existing dawn journal; idempotent revoke/settled postconditions; no history invented for past completed nights |
| Failed transaction leaves intent pending; retry/reload reconciles before resending | PASS 2A | confirmed revoke/settlement skips resend; unresolved failures pause dawn; local trusted single-writer assumption |
| Configurable LLM decision adapter | PASS 2B | Responses API; explicit enable/key/model; 12-second timeout per attempt, <=2 attempts, 16 KB input body, 512 output tokens, no tools; live verification NOT RUN |
| Political offer | PASS 2B | Seraphine may present existing lease 0 at its exact terms; proposing creates no right |
| Acceptance/rejection | PASS 2B | Accept revalidates owner/buyer/terms/expiry, costs one action and existing rent, executes accept_lease; political rejection is free/local with no penalty; legacy direct rejection still uses reject_lease |
| Decision durability | PASS 2B | Reserve request before provider call; interrupted requests fall back without another call; record envelope, provenance, validation and execution; one turn per NPC/night |
| Broader proposals and NPC-to-NPC negotiation | TBD | Not implemented; requires concrete contract/policy design |
| Eight council seats, five valid supporters, final Night 7 vote | PASS 3 | requirements target only; identities, eligibility/opposition/ties and vote contract are TBD |
| Marriage, House membership, discoveries and signed local relationships confer no automatic political/economic authority | PASS 2A | explicit canon/authority constraint; any future rights require explicit enforceable design |

Public ledger visibility is not private knowledge protection against an external
reader: get_world exposes public records to everyone. Observation filtering limits
what the decision source is given. No final council, live AI, public wallet,
new signing infrastructure or public deployment is part of Pass 2A.

Pass 2B extends the exact `{kind}` internal fallback with a strict external envelope:
actor, kind, target, parameters, observation ID, bounded dialogue/rationale.
Provenance comes from the runner, never model assertions. Offer terms are immutable
existing lease terms. Pending offers expire at the contract deadline. A real API
adapter is implemented; HTTP responses in automated tests are mocked, not live AI.
Marriage and House membership remain distinct from genealogy and contract rights.

## Pass 2D presentation — IMPLEMENTED
Free dialogue, inspection, deferral and skipping do not consume actions or execute transactions. Explicit commitments retain the existing action costs and validation. Reckoning/conclusion scenes project recorded results; they cannot create rights or endings. Browser scene progress is separate from authoritative persistence. See docs/PASS2D.md.

## Pass 2E entry — IMPLEMENTED
Opening title reads metadata only. New Game with an existing save requires explicit replacement confirmation. Continue runs existing save recovery. Prologue Continue/Skip and first-lead conversations are informational; they cannot spend actions, reroll or sign. Vesper’s existing ultimatum follows prologue; the three-night deadline and seven-night campaign are unchanged.

## Pass 2G presentation — IMPLEMENTED
Discovery/Decision are browser presentation phases, not a new scheduler. Questions
and conversational attitudes are free, carry no hidden penalties and grant no
rights. Public title filing remains one major action. Lounge entry and Library
ownership do not qualify as shelter; Blood zero can end a protected
campaign. Incidents, commitment explanations and endings clarify the unchanged
Pass 2C predicates. See docs/PASS2G.md.

## Pass 2H — IMPLEMENTED for new Living Court campaigns
One major action and seven nights remain. Nights 4–6 permit one investigator at a time to receive player-owned Library entry with delegation. The investigator can authorize one named assistant; on a subsequent reckoning effective parent/child access and successful enter_room permit finite publication. A published result closes competing research. Revoking the player's root invalidates descendants but cannot erase published information or independent patron grants.
Mirelle research fulfils service and permits Marius's independent Court grant. Dorian research permits Lucien's independent Passage grant without scheduled expiry. Effective permanent Lucien protection qualifies for Favoured in these campaigns; temporary passage alone does not. Unbound and resource failure retain existing predicates.
New campaigns receive Seraphine's actual Lounge invitation and an initial Mirelle Library grant expiring at Night Four; old saves/records are unchanged. Ordinary conversation/refusal is free. Paid tenancy, duplicate dossier, unfinished exchange and decorative relationship numbers are demoted from primary UI; underlying legacy mechanisms remain.
DEFERRED: new NPC-funded purchases and player earnings. User chose unchanged Rust and method-restricted NPC keys. Existing paid sanctuary/settlement semantics are unchanged.
# Pass 3A presentation continuity

Seven Living Court chapters now frame the existing rules through character conversations and state-dependent room records. No cost, deadline, agent policy, authority or ending predicate changes. The existing conceal action is reachable again in survival choices. Free questions are informational and do not award invented relationship effects. Research begun on Night VI can finish or be stopped on VII through the existing commands; see docs/PASS3A.md and its Sandbox evidence.

## Pass 3D — new Dangerous Court campaigns only
One action per night remains. On VII a surviving Marius court grant prompts a demand for non-delegable Library entry. Accept gives continuing entry; refusal/silence costs his protection. A published account permits offering entry through the start of IX for one action and one Blood. He accepts only Mirelle’s completed institutional account/service plus Cassian’s settled active paid passage. Otherwise he revokes his own protection; the offered limited invitation remains. Other protection is independent.
Cassian’s one-use 0.01 Sandbox NEAR allowance buys Lucien’s fixed three-night passage after losing the appointment (offer IV, eligible acceptance V). Funds are finite, contract-held and distinct from gas. No recurring income. Detailed constraints and verification: docs/PASS3D.md.

## Investigation/finale follow-up
IMPLEMENTED locally: Dorian’s existing rival petition is selected only with a publicly recorded lasting-shelter fallback; otherwise he passes. Existing petition validation, one NPC turn per night and recovery remain. Account findings and final correspondence are presentation only; completed research requires committed publication plus successful journal evidence. Finale responses are free and penalty-free, persisted only as browser reading progress. See docs/INVESTIGATION_FINALE.md.
