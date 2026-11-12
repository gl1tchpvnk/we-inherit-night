# Pass 3D — The Dangerous Court

Status: **IMPLEMENTED and verified for new local Dangerous Court campaigns.** Local Sandbox only. No public deployment, testnet migration, paid model or new gameplay pass.

## Handoff findings addressed

The previously consolidated Marius route now reaches a Night VII demand. A published account enables a player-initiated limited-inspection counterproposal. Cassian and Lucien independently execute one bounded paid passage agreement whose settled result affects Marius’s response. The one-major-action rule and existing ending predicates remain unchanged.

These are PROVISIONAL present-campaign developments, not new historical canon: Marius seeks a continuing Library invitation; Cassian seeks a separate escape after losing the appointment; Lucien offers a fixed-price passage; completed institutional work plus Cassian’s independent paid escape makes Marius willing to accept limited inspection. No ancestry, crime, succession right, secret knowledge or physical NPC location was invented.

## Player choices and results

Only new Dangerous Court saves carry `politics.finalCourt`. On Night VII, an effective Marius-issued court grant triggers the demand. Earlier Marius commitments warn of it. Ignoring it also risks his protection; navigation remains free.

| Response | Actual consequence |
| --- | --- |
| Accept | One action; player issues non-delegable Library entry without expiry. Marius keeps his existing revocable protection. |
| Refuse | One action; Marius’s validated NPC turn revokes his own court grant. Other rights survive. |
| Counterproposal | Requires either published Library account; one action plus 1 Blood; player issues non-delegable Library entry ending at internal night 8/start of Night IX. Marius accepts only with Mirelle’s publication, fulfilled service, and Cassian’s settled, still-active purchased passage. Otherwise he withdraws his own protection. |

The counterproposal’s invitation is a real concession even if Marius rejects it. Issuing access and receiving his answer are separate operations, **not atomic settlement**. Material terms disclose this before commitment. Invitations remain player-issued revocable grants; Marius cannot delegate them. No new enforceable promise or ending is fabricated by dialogue. Existing ending logic reads the surviving rights.

Without a published account the counterproposal is unavailable. Dorian’s account permits proposing but does not satisfy Marius’s institutional priorities. Rejection can therefore coexist with survival under Lucien. Existing alternate-investigation gameplay is retained.

## Bounded economic agreement and security

New local bootstraps deposit exactly **0.01 native Sandbox NEAR** from Cassian into a one-use contract allowance before removing his full-access key. This is test funding, not gas allowance or fictional wealth. No browser credentials or unrestricted runtime wallet were added.

- Frozen recipient: current passage owner Lucien; fixed property `passage`, three nights, exact 0.01 price, offer/budget deadline internal night 5. No arbitrary target or amount.
- Funding is self-funded, once, at contract night zero; nonce checked. Runtime Cassian cannot call funding.
- Lucien offers on Night IV only after Cassian loses the appointment to the player. Cassian independently accepts on V if his mandate and the offer remain valid. Lucien collects earned rent through his existing bounded phase.
- Contract acceptance validates predecessor, nonce, budget, recipient, current ownership, exact lease terms and absence of an overlapping active lease. Budget debit, rent escrow and lease access happen in **one contract call**. Failed acceptance leaves all three unchanged.
- Seller payout is a **separate asynchronous transfer**, using the existing `claim_rent`/private callback. Failed payout preserves claimable escrow. It is not described as atomic with acceptance. A settled receipt is required for the later counterproposal benefit.
- Expired unused allowances can refund only their original funder. The pending flag blocks duplicate refunds; private callback restores funds after failure. Spent allowances cannot refund. No recurring funding, income or general market.
- Method-restricted NPC keys remain receiver/gas limited. Deterministic proposals contain the exact amount, duration, deadline and lease ID; `agents.ts` remains the single validation boundary. The runner persists intended operations and confirms actual postconditions before publishing consequences.
- `World`’s serialized layout is unchanged. New allowances use a separate versioned storage prefix; optional view data does not invent rights or allowances in old saves. Existing save flags keep old campaigns on old policies.

## Verification and evidence

Automated full-campaign routes use real local Sandbox/WASM with restricted NPC keys, not simulated transaction text. Each checks seven nights, 56 unique NPC turns, reload stability and authoritative ending state.

| Route | Final consequence |
| --- | --- |
| `counter` | Mirelle publishes V; investigator withdrawn VI; VII limited counterproposal accepted; Favoured, invitation expires IX. Injected lost response after actual purchase recovers once. |
| `accept` | Same consolidated route; continuing Library invitation; Favoured. |
| `refuse` | Same earlier work; Marius revokes his protection; no qualifying refuge, lost ending. |
| `rejected` | Dorian publication plus direct Marius service; limited proposal rejected; Marius right lost, independent Lucien protection survives. |
| `alternate` | Sanctuary, Mirelle withdrawal, Dorian start VI/publication VII; Unbound with Lucien protection, no Marius demand. |

`docs/evidence/pass3d-{counter,accept,refuse,rejected,alternate}.json` contain per-night decisions, final world/campaign, real finalized transactions and receipts. Successful `fund_passage`, `accept_funded_passage` and Lucien `claim_rent` records demonstrate funding, budget debit, escrow, access and exact native transfer. The suite asserts the transfer’s receiver and exact amount, not merely a narrative label. `pass3d-security.json` covers failed terms, expiry, unchanged budget and unused refund.

Focused browser verification used a separate genuine save prepared through Night VI. The new demand and costs rendered with Marius’s approved portrait; keyboard Enter committed the limited proposal; reopening displayed its accepted result. Screenshots: [demand](evidence/pass3d-demand.png), [counterproposal](evidence/pass3d-counterproposal.png). A legacy dialogue override found during this check was fixed. No repeated full browser campaign or unchanged-screen audit. Prior 3C responsive/accessibility evidence applies to unchanged layouts; mobile/device/screen-reader testing of the new prose was NOT RUN.

| Check | Result |
| --- | --- |
| Targeted final-court and epilogue Node checks | PASS, 8 tests |
| Complete Node regression suite | PASS, 92 tests |
| TypeScript and production build | PASS |
| Rust contract unit tests | PASS, 13 tests (11 preserved plus 2 new security tests); Windows bundled NASM setting |
| WASM build | PASS, pinned/locked cargo-near build |
| Complete Linux Sandbox suite | PASS, 49 tests; 1 Windows-only test skipped there |
| Windows startup/funding/reload regression | PASS, 1 test; total 50 actual Sandbox tests across both platforms |
| New seven-night routes | PASS, all five; included in Sandbox totals |
| Focused browser encounter and keyboard commitment/reopen | PASS |
| New mobile prose/device/screen-reader acceptance | NOT RUN; unchanged layout evidence reused from 3C |
| Public deployment/testnet migration/paid LLM | NOT RUN, outside authorized scope |

No unresolved FAIL or BLOCKED check. Existing regressions include sanctuary payment, independent roots, cascading revocation, Library withdrawal, competing investigations, existing endings and persistence. Wrong-price, expired and duplicate calls intentionally fail and are asserted as negative security tests. Full suite ran because contract/shared execution changed; no unrelated exploratory testing was added. No passing build is treated as gameplay or payment evidence.

## Exact implementation files

- `contract/src/lib.rs`, `contract/src/tests.rs`: fixed funded mandate, acceptance/refund, view and negative tests.
- `src/finalCourt.ts`: focused final demand, fixed economic terms, eligibility and postconditions.
- `src/game.ts`, `src/politics.ts`, `src/chain.ts`: optional new-campaign state, actions and view types.
- `src/agents.ts`: bounded proposals, priorities, validation and recorded response.
- `scripts/sandbox/scenario.mjs`, `scripts/sandbox/play.mjs`, `scripts/sandbox/campaign.mjs`: isolated funding/key restrictions, save feature flag, journaled validated execution/recovery.
- `src/encounters.ts`, `src/livingCourt.ts`, `src/reactiveCourt.ts`: Marius encounter mapping, commitments, verified consequences and final concession acknowledgement; corrected old reckoning’s blanket Seraphine attribution for leases.
- `tests/final-court.test.mjs`, `tests/sandbox/pass3d.test.mjs`, `tests/sandbox/startup.test.mjs`: targeted coverage and new funded-bootstrap assertion; existing tests retained.
- Documentation: this report, `AGENTS.md`, `PROJECT_REQUIREMENTS.md`, `GAME_RULES.md`, `VAMPIRE_AGENTS.md`, `README.md`, `PROGRESS.md`; generated evidence files above. Hackathon rules reviewed, unchanged.

## Limits

This is one authored conflict and one deterministic economic agreement, not a general bargaining or economy system. The fixed-price offer has no haggling. Without a player appointment Cassian does not buy it; unused funds require the restricted refund operation after expiry (not a new player menu). The political benefit depends on actual settlement, but no real-world money is involved. Night VII still ends the campaign; later expiry is a recorded obligation, not additional playable nights. Older saves intentionally do not receive these new rules. Remaining 3C weaknesses outside the four authorized areas are unchanged. No claim that test success establishes that the game is fun.
