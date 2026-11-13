# Narrative issues

Editorial observations only; no rewrites implemented. HIGH means material choice/outcome communication risk, not a security finding. Distinguish source-confirmed conditions from unverified runtime reachability.

16 findings: HIGH 3, MEDIUM 10, LOW 3.

## I01 — HIGH — Standing rejection misstates action cost

**Encounter / branch:** lease:0 → reject

**Exact wording / construction:**

> Reject standing lease · signed, one action

**Problem:** campaign.mjs spends an action for rejection only outside Living Court. This branch exists for eligible standing offers; no live reachability was exercised.

**Editorial direction:** Use mode-accurate cost wording; retain signed rejection distinction.

**Source:** [src/encounters.ts:101](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:101>)

## I02 — HIGH — Counterproposal sounds conditional until inspection

**Encounter / branch:** final-demand → final_counter

**Exact wording / construction:**

> Propose a limited inspection using the published account

**Problem:** This navigates to inspection, but the eventual command grants access even if Marius rejects. Inspection correctly discloses that risk: an emphasis issue, not a missing safeguard.

**Editorial direction:** Bring the unilateral invitation risk into framing while retaining full terms.

**Source:** [src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>)

## I03 — HIGH — Temporary victory describes final night as future

**Encounter / branch:** Unbound summary

**Exact wording / construction:**

> Seraphine cannot withdraw her protection, and it will last through the final night. But sanctuary is not ownership.

**Problem:** Shown after the final reckoning; it describes an already-completed night and omits remaining expiry. Epilogue mentions an end date but summary weakens clarity.

**Editorial direction:** Use completed-campaign tense and verified remaining term; retain distinction from ownership.

**Source:** [src/livingCourt.ts:50](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:50>)

## I04 — MEDIUM — Paid sanctuary described as a favour

**Encounter / branch:** Dorian question

**Exact wording / construction:**

> If you want a favour with no patron attached, talk to Seraphine.

**Problem:** Seraphine sells prepaid fixed-term sanctuary. Favour blurs bargain versus revocable patronage, although material terms elsewhere are accurate.

**Editorial direction:** Keep partisan voice while distinguishing purchase from favour.

**Source:** [src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

## I05 — MEDIUM — Opening repeated in action negotiation

**Encounter / branch:** Character → action

**Exact wording / construction:**

> voices[speaker].opening

**Problem:** Most action scenes reuse the same character opening and append terms. Title and withdrawal have custom alternatives.

**Editorial direction:** Start at offer rather than repeat greeting.

**Source:** [src/livingCourt.ts:212](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:212>)

## I06 — MEDIUM — Reaction narrator repeated in terms

**Encounter / branch:** Recorded reactions

**Exact wording / construction:**

> terms:[u.text,politicalRelationship(r,u.actor)]

**Problem:** u.text is both a dialogue line and a visible terms entry.

**Editorial direction:** Keep one narrative presentation, with distinct detail in inspection.

**Source:** [src/reactiveCourt.ts:198](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:198>)

## I07 — MEDIUM — Incident/discovery repeat the same situation

**Encounter / branch:** Incident → discovery

**Exact wording / construction:**

> const chapter=CHAPTERS[n],text=chapterSituation(r);

**Problem:** Both reuse text; navigation guidance also uses chapterSituation. This repeats exposition during normal navigation.

**Editorial direction:** Give one location the full beat and others concise directions.

**Source:** [src/livingCourt.ts:290](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:290>)

## I08 — MEDIUM — Night Six invites a new start while work is already underway

**Encounter / branch:** Night 6 chapter default

**Exact wording / construction:**

> There is just enough time to begin one last investigation and let it finish tomorrow.

**Problem:** Published research is explicitly handled by a different chapterSituation sentence. The remaining issue is an open investigation with an existing root: the paragraph says to begin an investigation while the appended progress says one is already running. Starting another requires withdrawal and can consume the final viable start.

**Editorial direction:** When an investigation is already underway, focus on letting it finish or stopping it; retain the implemented separate wording for published work.

**Source:** [src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>)

## I09 — MEDIUM — Final feeding warning does not name unanswered demand

**Encounter / branch:** Night 7 Feed

**Exact wording / construction:**

> No nightly action will remain for another commitment.

**Problem:** Accurately warns of final reckoning, but does not name loss of Marius protection for silence; hold scene does.

**Editorial direction:** Contextualize this known consequence when the demand is unanswered.

**Source:** [src/blood.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/blood.ts:44>)

## I10 — MEDIUM — Historical correspondence mixes times

**Encounter / branch:** Historical reactions

**Exact wording / construction:**

> Correspondence from Night ${u.night+1}. Your current standing is shown above.

**Problem:** Replies and text rebuild from current state. Provenance helps but old action and current authority can read as one moment.

**Editorial direction:** Separate past event from present standing.

**Source:** [src/reactiveCourt.ts:198](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:198>)

## I11 — MEDIUM — Diagnostics deny bounded NPC purchase

**Encounter / branch:** Diagnostics

**Exact wording / construction:**

> NPC purchasing treasuries are not implemented.

**Problem:** The finite Cassian-funded passage exists in finalCourt.ts. Blanket statement contradicts implemented political consequence.

**Editorial direction:** Describe bounded exception and broader limitations accurately.

**Source:** [src/GameInspection.tsx:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/GameInspection.tsx:41>)

## I12 — MEDIUM — Local-only diagnostic wording in shared renderer

**Encounter / branch:** Diagnostics

**Exact wording / construction:**

> Local development signing. No public wallet or LLM activation.

**Problem:** Hardcoded across modes; can misdescribe hosted Testnet signing. No-LLM portion remains consistent with default runtime.

**Editorial direction:** Use actual runtime mode without private configuration.

**Source:** [src/GameInspection.tsx:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/GameInspection.tsx:41>)

## I13 — MEDIUM — Missed-offer claim inferred from absent access

**Encounter / branch:** Seraphine, n>=3

**Exact wording / construction:**

> You missed the offer. I can still listen, but listening will not put a roof over your head.

**Problem:** Selector checks current sanctuary access/night, not historical decline or acceptance. Can misattribute a historical/expired absence; all such states not proven reachable.

**Editorial direction:** Use recorded lease decisions for historical wording.

**Source:** [src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

## I14 — LOW — Legacy free-tone disclaimer repeated

**Encounter / branch:** 32 legacy paths

**Exact wording / construction:**

> This conversation is free. Your tone changes no relationship, right, resource or deadline.

**Problem:** Honest but identical explanation after every answer; not current Living Court.

**Editorial direction:** Explain free conversation once while preserving penalty clarity.

**Source:** [src/story.ts:63](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:63>)

## I15 — LOW — Mirelle explains absent story premises

**Encounter / branch:** Mirelle question

**Exact wording / construction:**

> Not a secret ancestry or a convenient scandal.

**Problem:** Reads as scope explanation rather than naming her practical interest.

**Editorial direction:** Emphasize present obligations and patron motive.

**Source:** [src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

## I16 — LOW — Key/publication metaphor repeatedly restated

**Encounter / branch:** Sabine and aftermath

**Exact wording / construction:**

> Taking back the keys cannot undo it.

**Problem:** Important theme but repeated across characters, records and terms.

**Editorial direction:** Retain at commitments; later reactions can emphasize chosen patron.

**Source:** [src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

## Character voices

Vesper: clipped, parental, concerned with dependence. Seraphine: commercial, dry, independently powerful. Marius: institutional and reciprocal. Lucien: sardonic, explicit about time. Mirelle: exacting, practical. Dorian: candidly partisan. Cassian: impatient and status-conscious. Sabine: detached and diagnostic. Current personal answers distinguish them; repeated grant/key/independence explanations in terms and reactions flatten those differences.

Nearly interchangeable legacy exposition: Seraphine “You need not trust a promise. Inspect the authority and decide from the terms.”; Mirelle “Check the record yourself. A sharp question changes no grant.”; Sabine “Scepticism is useful. It is not a substitute for checking the issuer.” These are similar functions/tones, not identical sentences. [src/story.ts:36](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:36>)

## Progression and agency

Night 1 establishes the deadline and distinguishes Library ownership from shelter. Nights 2–3 create a genuine deadline/action bottleneck. Nights 4–5 develop delegated work, competing patrons and irreversible publication. Nights 6–7 test remaining time and Marius’s conditional demand. Players without effective Marius protection do not receive that confrontation; their campaign can conclude with less dramatic exchange despite valid state-based outcomes.

Current free questions and legacy tone paths write no political state. They supply information, while appointment/service, title/sanctuary, research patron, revocation, feeding opportunity cost and final invitation have genuine delayed effects. Convergence does not make those commitments cosmetic: publication survives withdrawal, dependent access does not, unrelated patron rights survive, and a counterproposal invitation survives rejection.

The finale uses recorded outcomes and rights. Its three highlighted consequences can omit earlier meaningful choices; Chronicle carries additional retained history. No hidden affinity or tone penalty was found. Active default NPC policy is deterministic rather than live LLM conversation.

## Design-document discrepancies

PROJECT_REQUIREMENTS.md:3 and :7 retain historical local-only/public-launch-blocked status, while implementation includes hosted Testnet support. This audit did not verify live deployment. Historical Pass 1 Exposure wording is not current: the same document marks Exposure retired. Provider adapter existence does not establish live LLM narrative. These are documentation/mode distinctions, not extra dialogue branches.
