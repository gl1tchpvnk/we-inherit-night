# Pass 3C — the reckoning

Status: **PARTIAL against the complete requested acceptance standard.** Campaign integration and presentation refinements are implemented; existing economic paths are verified. The required NPC-to-NPC economic transaction cannot be demonstrated because Pass 3B did not implement NPC purchasing or treasuries. No fabricated purchase, unrestricted signer, public deployment, paid provider or Pass 3D mechanic was added.

## Implementation and preserved boundaries

Reviewed source and reports for 3A/3B, game/political rules, actor observations and policies, library authority, Rust lease settlement, Sandbox journal/recovery, ending predicates, visual canon and existing tests. The founders remain independent bloodlines; no genealogy, historical event, private motive or character fate was invented. Research remains the provisional account of present Library obligations. Unspecified historical contents and succession procedure remain TBD.

The documented one-major-action-per-night rule remains, with legacy saves retaining their stored limits. The request's three-action assessment does not describe current new campaigns. This pass changes no resource calculation, action routing, contract method, restricted signing permission, deterministic policy, save schema or authoritative ending predicate.

Implemented:

- Court records consolidate Rights, Bloodline, Relationships, Chronicle and Diagnostics behind one native disclosure. Chronicle's execution log is separately expandable. Private NPC policy memory is no longer rendered in Diagnostics.
- Exposure is always visible beside Blood: an existing fatal resource must not disappear from the Living Court HUD.
- Castle navigation uses the approved clean cutaway, reduced to 48% of the desktop composition alongside the current situation. No repeated landing title. Mobile castle and objective share one scrollable surface.
- Mobile character scenes use the original full 4:3 portrait and one scrolling page, replacing the cropped 30vh strip plus independent dialogue scroller. Desktop Marius remains on the opposite side from other portraits; no image is mirrored, stretched, recoloured or replaced.
- Consequence scenes immediately expose the factual change and current standing alongside the character response. Players need not advance dialogue to learn the material outcome. Major/significant presentation now says “The balance has shifted” or “Word from the court”; minor updates remain optional.
- Epilogues explain recorded service, investigator publication, the closed rival route, player withdrawal, ongoing invitations and separately surviving patron protection. These are pure projections; stored outcomes remain untouched.
- A surviving Crypt right after Vesper's withdrawal is described as independent access, rather than falsely claiming Vesper still permits entry.
- Removed late title filing from the main decision list once its sanctuary offer has closed. This corrects a misleading expenditure observed on the Marius browser route; the underlying legacy action and journal remain compatible.

Approved landing, castle and all nine portraits are unchanged. The three existing provisional room interiors remain explicitly labelled; they have not gained visual approval through this pass.

## Seven-night experience and balance

| Night | Immediate purpose and meaningful change | Observed limitation |
|---|---|---|
| I | Establish three-night shelter threat; choose appointment or title route. Initial NPC publication opens passage discussion. | Ownership/title filing still feels procedural despite better terms. |
| II | Pay for fixed refuge or secure a finite appointment; NPC competition can take that appointment. | Payment is affordable by default; little genuine financial scarcity. |
| III | Vesper withdraws her actual grant; independently secured shelter survives. | Scheduled threat is predictable and offers no negotiation. |
| IV | Choose researcher/patron; actual assistant invitation enables later publication. | Investigation subject remains abstract. |
| V | Allow publication, stop work, or fulfil direct service. Mirelle's finished work can satisfy service instead. | Direct service has no concrete playable task. |
| VI | Withdraw a published key or begin replacement research before the final deadline. | Already-secure routes have weak opposition. |
| VII | Switch route can finish or stop Dorian's work; consolidated route may only manage survival. | No universal political confrontation or satisfying defeat of an opponent. |

Blood matters most around early opportunity deadlines. Hunt uses the night's major action and adds Exposure; sheltered dawn costs one Blood. Tested safe routes can plan feeding rather than face difficult ongoing scarcity. No resource numbers were changed without comparative balance evidence. Authority has stronger demonstrated value: opening the Library enables research, withdrawing stops dependent work, and separate patronage survives it. Published-key withdrawal has little later incentive beyond retaining control; this is a 3D gap.

## Economy: actual implementation and missing acceptance

| System | Finding |
|---|---|
| Fictional wealth / Coin / spendable Influence | Not implemented; not interchangeable with NEAR or Blood |
| Player funds | Disposable local Sandbox NEAR supplied for the prototype; no cryptocurrency purchase required |
| Gas | Execution cost, distinct from agreed rent and game resources |
| Sanctuary | Existing exact 0.02 Sandbox NEAR prepayment for seven nights, non-refundable after successful acceptance; access, not ownership |
| Escrow | Contract records native rent on acceptance; not a generic player treasury |
| NPC economic activity | Seraphine can collect vested player-paid rent using her restricted method; no NPC purchasing treasury or resource-shortage policy |
| NPC-to-NPC payments | **NOT IMPLEMENTED. Required demonstration NOT MET.** Library delegation, patron grants and sponsorship are rights changes, not economic purchases |
| Property value | Library ownership enables research and permission control; no invented earnings. New Lounge invitation is ordinary social access, not rental income |

`accept_lease` authenticates predecessor, nonce, buyer, offer state/expiry, owner, conflicting tenancy and exact deposit before recording acceptance/escrow. Payment acceptance and resulting lease access are one contract mutation. Seller payout is a separate asynchronous promise with callback recovery; the whole lifecycle is **not** described as atomic. Existing tests reject wrong actor, invalid amount, unaffordable payment, stale nonce, duplicate acceptance, expired/cancelled offer and duplicate payout. Failed acceptance leaves no paid lease; gas may still be consumed. Rust tests cover failed payout restoring claimability and callback privacy.

The requested NPC transaction's objective/proposal/payment/consequence evidence is absent, not a failed transaction hidden in a log. Implementing bounded funded NPC purchases needs an explicit spending capability and settlement design beyond this integration pass. See the prioritized handoff. Existing function-call keys cannot be treated as spending budgets or replaced with full-access agent wallets.

## Verification and evidence

Automated results:

- Node suite: PASS 89/89, including five new factual epilogue, independence and decision-list regressions.
- TypeScript and production build: PASS (`npm run build`).
- Rust: PASS 11/11 using the repository-documented `AWS_LC_SYS_PREBUILT_NASM=1`; initial unconfigured run failed on missing NASM. No Rust source changed.
- Existing Linux Sandbox: PASS 40, zero failures, one Windows-only test skipped. Separate Windows startup/reload regression: PASS 1/1. Includes negative payment/settlement, grants, replay, expiry, revoked ancestors, independent rights, legacy campaigns and interrupted recovery.
- New integration Sandbox: PASS 3/3. Each route reopens after every decision and verifies stable campaign/receipt counts, unique actor/night journal entries, 56 bounded turns and the expected ending. Evidence includes per-night resources, choices and available actions.

Routes: [Marius/research](evidence/pass3c-marius.json), [sanctuary/switch](evidence/pass3c-switch.json), [published then withdrawn](evidence/pass3c-withdrawn.json). The Marius route substitutes research for direct service, then withdraws access. The switch route loses Cassian's dependent Library route, grants Dorian a new root and finishes on VII. The published/withdrawn route retains Marius's independent protection. Existing 3A final-night stop-versus-finish regressions were rerun as part of the full suite.

Browser evidence and final check totals are recorded below. Testing uses `.local/pass3c-browser`; the user's normal campaign is not replaced. Failed payment/scarcity and explicit agreement rejection are automated Sandbox coverage, not claimed as browser runs. Reload timing in a browser demonstrates UI recovery but cannot prove interruption at a particular journal instruction; deterministic recovery tests supply that proof.

### Browser routes and accessibility

Both complete seven-night routes were played through the in-app browser against real local Sandbox:

- **Marius:** appointment, hunt, hunt, Mirelle invitation, wait for publication, withdraw, hunt → Favoured. Research fulfilled the service obligation; the epilogue acknowledged that work and the withdrawn key. [Campaign/receipts](evidence/pass3c-browser-marius.json), [desktop ending](evidence/pass3c-marius-ending.jpg).
- **Seraphine/switch:** title, sanctuary, hunt, Mirelle, withdraw, Dorian, final reckoning → Unbound with independent Lucien protection. Cassian took the unclaimed appointment; Dorian's eligible petition was read from the castle. Reload while the Dorian commitment UI was busy restored the existing negotiation without another commitment button, then its assistant consequence. Final record: 56 unique NPC turns and 27 transactions at campaign completion. Subsequent free room entry can add its existing entry receipt without consuming a campaign action. [Campaign/receipts](evidence/pass3c-browser-switch.json), [mobile ending](evidence/pass3c-unbound-mobile.jpg).

Rendered checks used desktop 1280×720 and mobile 390×844. [Castle](evidence/pass3c-castle.jpg), [Vesper consequence](evidence/pass3c-reckoning.jpg), [full mobile portrait/research](evidence/pass3c-mobile-research.jpg), [mobile payment terms and visible commitment](evidence/pass3c-mobile-terms.jpg). Portraits remain proportional; long text and choices scroll on one mobile encounter page. Library publication changed contacts to Dorian/Lucien; Lounge contacts reflected Lucien's reward; denied Crypt navigation showed the recorded withdrawal without entering.

Keyboard Enter committed Marius's explicit choice and toggled payment/record disclosures; Escape closed encounters and inspections without a political action. Scene/inspection headings received focus; closing Rights returned focus to its invoking control. Rights, Bloodline, Chronicle and Diagnostics remained accessible from Court records. Material payment risks were visible before acceptance. Diagnostics distinguished local funding, gas and escrow and did not expose NPC private memory.

**NOT RUN:** physical-device, screen-reader and reduced-motion emulation. Existing reduced-motion CSS remains, but source inspection is not acceptance. No animation gates essential choices. Original approved cover was preserved; no new artwork acceptance is claimed. The final late-filing copy correction passed 19 targeted 3A–3C tests and a fresh production build after the 89-test full Node run.

Normal preview was restored at `http://127.0.0.1:5187/`. Continue opened the original Night I negotiation; its campaign remains at revision 0. The abandoned empty normal-save lock was archived only after checking that the sole live runner belonged to the isolated 3C save. No original campaign replacement or commitment was made. AGENTS, project requirements, README, visual canon and progress were synchronized. Hackathon requirements were reviewed and left unchanged; no external rules were reverified or altered.

## Engagement assessment — not a claim of fun

| Question | Evidence-based assessment |
|---|---|
| Intentional strategy? | Yes, within narrow routes: Marius/research saves direct service; sanctuary/switch funds time for a rival publication. |
| Information overcomes opposition? | Limited. Public lead opens passage; title enables a bargain. No secret can be deployed to defeat a patron. |
| NPCs disrupt plans? | Cassian takes the finite appointment in the sanctuary browser route; Vesper closes her grant on III. After protection, disruption is weak. |
| Intelligent responses? | Existing alternative shelter and investigator switching work. No counterproposal to Vesper or contested patron demand exists. |
| Wealth/authority tradeoffs? | Authority yes: published versus stopped research changes patron/assistant access. Wealth weak: no competing purchase or NPC shortage. |
| Rewarding success? | Tangible protection and route closure are verified on V/VII. Political reward remains mostly safety, not power over the court. |
| Consequential failure? | Missing shelter, fatal resources and stopping research have explicit consequences. Existing negative tests prove enforcement; they do not prove dramatic quality. |
| Interesting decisions or content selection? | IV–VII switch sequence is a timing decision. Many free questions and routine feeding turns are content/maintenance. |
| Strongest moments player-caused? | Withdrawal before publication and replacement are. Vesper's strongest threat is scheduled, not caused by a new player betrayal. |
| Anticipation? | Waiting for publication creates a concrete next-night stake. Early-safe routes lose it after V. |
| Meaningful V–VII decisions? | Yes on the switch route; materially thinner after Marius consolidation. No fake final choice was added. |
| Different experiences? | Marius has service pressure and can satisfy it through Mirelle; sanctuary permits a late Dorian switch and separate Lucien reward. Both converge on protected survival, limiting replay depth. |

## Remaining limits

Pass 3C cannot be accepted as complete while NPC-to-NPC economic activity is missing. No generative NPC intelligence, physical court simulation, negotiated counteroffers, useful secrets or succession contest is claimed. Scene completion is browser-local; another browser can replay presentation without re-executing contracts. No physical-device or screen-reader acceptance is claimed. Reduced-motion emulation requires separate verification if unavailable through the browser controls. Approved-art fidelity is preserved; room illustrations remain provisional.

The next scoped work is defined in [PASS3D_HANDOFF.md](PASS3D_HANDOFF.md), not implemented here.
