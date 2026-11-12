# NEAR HACKATHON 2026 — Requirements & Submission Checklist

Verified against the **official hackathon website** on **2026-11-07**. This file is our project checklist, **not a verbatim reproduction of the organizer's `HACKATHON.md`**. The live organizer file at https://nearhackathon.com/HACKATHON.md should be fetched/reviewed again before submission; its markdown content was not directly retrievable in the environment where this file was prepared. Some extra procedural details below were cross-checked against a repository that reproduced the organizer document and should be revalidated from the live file.

Official source: **https://nearhackathon.com/**
Organizer agent file: **https://nearhackathon.com/HACKATHON.md**
Official example prompts: **https://github.com/nearai/near-hackathon-prompt-examples**

## 1. Confirmed event facts (UTC)
| Item | Rule / date |
|---|---|
| Announcement / earliest eligible new code | 2026-10-19 (per organizer's mirrored instructions; reconfirm live) |
| Hackathon begins and submissions open | **2026-11-01 00:00 UTC** |
| Development/submission deadline | **2026-11-14 23:59 UTC** |
| Judging | **2026-11-16 through 2026-11-18** |
| Results | By **2026-11-18 23:59 UTC** |
| Submission count | **One submission per project**; one individual may enter up to **two genuinely independent projects**, each naming the other in its README |
| Tracks | One project may select multiple matching tracks |
| Advance registration | None required |
| Wallet connection to submit | Not required; a **real NEAR mainnet payout account address** is entered in the form |
| Build deliverable | Running, reproducible prototype; public repository and public X demo post |

Use UTC dates, not machine local timezone. Do not invent a wallet/payout address.

## 2. Project track mapping
**Primary:** `games` — **Games With Real Economies**. Organizers emphasize NPCs with wallets, player-owned markets, and economies that evolve. The judged **game loop** matters more than a token. A low-friction wallet UX is a bonus, not a mandate.

**Possible secondary tracks only if concretely implemented:**
- `agents` — Agent Economy: NPCs independently make enforceable purchases/negotiate.
- `security` — AI Security & Defense: real limits, policy checks and denial proof for agent-controlled spending.
- `nfts` — NFTs That Do Something: only if actual standard-backed assets have useful on-chain behavior; ordinary ownership records are insufficient proof of this track.

The organizer lists technology hints (agent NPCs, social login, NEAR Intents, NEP-245). **Hints are not required integrations.** A custom NEAR contract can be eligible; do not add Intents, NFTs, a custom token, or walletless social login just to check boxes.

Other available track IDs: `defi` Unstoppable DeFi; `thesis` Investment Thesis; `privacy` Privacy & Private AI; `business` Autonomous Business; `swarms` AI Swarms; `realworld` Real-World Money; `memecoins` Memecoins With Mechanics; `social` Social Money; `open` Open Innovation.

## 3. Actual required submission elements
- [ ] Code was built within the eligibility window; older dependencies/boilerplate disclosed rather than misrepresented as new.
- [ ] **Public source repository** (not private) before 2026-11-14 23:59 UTC.
- [ ] **Working prototype** that judges can build/run, with meaningful NEAR usage.
- [ ] README includes purpose, genuine NEAR dependency, architectural limits, prerequisites, setup commands, environment variable names, contract deployment/account IDs, tests, and `DO X -> SEE Y` instructions with exact expected behavior.
- [ ] Repo includes a license and discloses templates, third-party libraries and any earlier code when relevant (license recommendation supported by reproduced organizer instructions).
- [ ] **Public X demo post** says it was built for **NEAR HACKATHON**, tags **@NEARProtocol**, includes **#NEARHackathon**, and has a **video or screenshots** attached.
- [ ] Demo shows real user action → resulting game state and the NEAR transaction/verification rather than slideware. Video is strongly recommended, especially for a local-only prototype.
- [ ] Complete official final submission form with **both public links** (repository and X demo post), all identifying fields, project description and payout address, before deadline.
- [ ] Double-check public links load without sign-in and that judges can reproduce the path without unpublished API keys or hidden manual steps.
- [ ] **Explicit human approval before final form submission.** Do not auto-submit, post, publish, sign, or deploy.

## 4. Final form fields on official website
As displayed on https://nearhackathon.com/ on 2026-11-07:

| Form field | What to provide |
|---|---|
| Project name | `We Inherit Night` |
| Team lead | **Human supplies actual name** |
| Email address | **Human supplies actual email** |
| Team size | Human chooses; mirrored organizer options: `1`, `2 - 4`, `4 - 6`, `6 - 8`, `8+` |
| Tracks | `games`; add others only if proven by delivered work |
| NEAR wallet address | Human-supplied **mainnet** prize payout address (not a testnet contract ID) |
| Repository link | The actual **public** Git repository URL |
| Demo post link | Actual publicly visible X post with media |
| What did you build? | **20–2,000 characters**; problem, prototype, NEAR's indispensable role |
| Website | Website field appears in the public form; optional; **verify live instructions before API use** |
| Consent | Human reads and agrees to organizers using details to review/contact team |

The organizer's reproduced markdown contains an API request format, but **this project will not automate submission**. Human uses the official form after reviewing the completed links. Do not hardcode these personal fields in a repository.

## 5. Judging and demo expectations
Official site says **Claude Code and Codex screen each project first for reproducibility and claims made in README; human judges decide the results**. Previous events looked at technical implementation, design, impact, originality and sustainability. This is guidance, not a published strict numerical rubric.

- [ ] All README build and test commands succeed in a clean environment or state exact limitations.
- [ ] README lists **IMPLEMENTED / PARTIAL / PLANNED** for major features.
- [ ] A judge can run the play loop without coordinating privately with the developer.
- [ ] The happy path works: grant → accepted proposal/lease → contract settlement → rival response → revoked authority → visible consequence.
- [ ] The **negative path works on contract**, not only UI: an unauthorized action genuinely fails.
- [ ] A player-owned independent asset remains unaffected by an unrelated sire revocation.
- [ ] Transactions claimed to be on testnet have real public IDs/links. No forged screenshots of chain success.
- [ ] Agents called autonomous genuinely choose from bounded actions; clearly label scripted/policy fallback and any human-triggered demo steps.
- [ ] Document operator-controlled components: LLM provider, turn scheduler, hosted frontend, account custody, upgrade authority.
- [ ] Explain why NEAR adds enforcement/value beyond a normal database; don't simply say 'powered by NEAR'.

### Recommended 60–120-second demo narrative (our plan)
1. Open castle: crypt accessible only by delegated right; Library independently owned.
2. Seraphine offers an economic lease. Player accepts; show real contract-backed settlement and updated room access.
3. Vesper revokes the crypt grant in response. The contract denies crypt entry, while Library remains usable.
4. Show activity log with transaction references and agent action rationale. State which steps were on-chain and what remains off-chain.

## 6. Publish/submission sequencing
1. Finish code and tests; collect real testnet contract ID and evidence.
2. Verify clean install/run; draft README and record video.
3. Get explicit approval to push/publish the repo (keep credentials out).
4. Human makes X demo post with required words, tag, hashtag, and media.
5. Human reviews all submission fields and prize account; **submit once** using official form.
6. Recheck visibility before the 23:59 UTC deadline; leave repo and hosted demo available throughout judging if possible.
7. If a submitted field needs correction, use **https://nearhackathon.com/request-changes**, not a duplicate entry.

## 7. Disqualifying or serious failure risks
- Private repository or missing X post link at the deadline.
- Broken install/build or features that exist only in README rather than executable code.
- An off-chain/mock balance displayed as real token settlement.
- Nonfunctioning NPC economy, with only decorative wallets or LLM prose.
- Secrets committed to public Git, unrestricted LLM signing privileges, or mainnet funds used casually.
- Submitting with a placeholder payout address; duplicate or unapproved submission.
- Treating tests against a JavaScript mock as proof of NEAR smart-contract execution.

## 8. Useful organizer clarifications (reconfirm live markdown)
The organizer's markdown **as mirrored by another participant** indicates:
- Testnet-only contract projects are eligible. A NEAR Intents testnet is **not** provided, making Intents a poor MVP dependency for this project.
- Local-only demos can qualify if the repo is reproducible; provide a video, not screenshots alone, if the judge cannot open a hosted demo.
- Libraries, AI-assisted code and templates may be used; disclose baseline/pre-existing components.
- Public repo should remain available through judging; hosted demos are best kept online through at least results.
- One person can enter up to two independent projects; cross-reference them in each README.

These are not substitutes for live organizer rules. Codex should fetch and compare the official `HACKATHON.md` before final submission, with discrepancies flagged for human review.

## 9. Prize and context (not feature requirements)
Reported prize pool: **US$250,000** paid in NEAR, with a **US$55,000 grand prize**, and for each of 13 tracks **US$10,000 / 3,000 / 2,000** for 1st/2nd/3rd. Prizes and eligibility remain subject to organizer terms.

Published judges: Illia Polosukhin, Eddy Lazzarin, Mert Mumtaz, Avichal Garg, Kain Warwick, Haseeb Qureshi, Stepan Gershuni; Claude Code and Codex are listed as AI screeners.

## 10. Sources checked
- **Official event website**, current as of 2026-11-07: https://nearhackathon.com/
- **Organizer AI agent instructions** (live URL; not directly retrievable in drafting environment): https://nearhackathon.com/HACKATHON.md
- **Organizer example prompts**: https://github.com/nearai/near-hackathon-prompt-examples
- **Participant's reproduced copy of organizer markdown**, additional details not independently verified at original URL: https://github.com/0xileri/SpactVault/blob/main/HACKATHON.md
- **Official NEAR documentation**: https://docs.near.org/

### Final checklist status
At creation, **all submission, repository, demo, contract, and test items are NOT YET COMPLETE**. This document tracks requirements and must not be presented as evidence of delivery.
