# Progress — 2026-11-08
- Pass 1 IMPLEMENTED: seven nights / three major actions, Blood survival, transitional Exposure; Coin, spendable Influence and purchased seats removed.
- Library/Lounge now offer five finite discoveries with prerequisites; exhausted/unavailable actions explain their restrictions.
- Engine validates atomic costs, permissions and proposal shape; server checks current contract access, serialized revision and pending operations.
- NEAR ownership/lease/delegation rules preserved; read-only grant validity uses the existing recursive contract validator.
- Persistent local chain/game saves, legacy migration, restricted NPC signing, dawn recovery and isolated New Game are implemented.
- PASS: 12 Node tests, nine Rust tests, 25 full Sandbox entries (zero failures/skips), focused mixed-grant regression, native/WASM/production builds and Rust formatting.
- PASS browser: seven-night acceptance path, five discoveries, actual payment/retaliation, revocation/expiry, free navigation, completed-state reload, rejection without retaliation and reset.
- Evidence and audit: docs/PASS1.md; docs/evidence/pass1-sandbox.json, pass1-reset.json and pass1-browser.jpg.
- Limits: game calculations remain trusted local simulation; subsidized storage, keeper/upgrade trust, callback gas exhaustion and production custody remain concerns.
- No public deployment, wallet integration, AI or final voting. Historical Pass 1 boundary; see the Pass 2A milestone below for current progress.

# Progress — 2026-11-11 — Pass 2A
- IMPLEMENTED: typed static NPC profiles, restricted observations, centralized proposal validation and character-specific deterministic fallback.
- Existing dawn journal now enforces one scheduled turn per NPC/night and persists structured confirmed outcomes; reload avoids duplicate execution/effects.
- Removed mutable holdings/profile copies from campaign saves; actual authority remains contract-backed. Seven-night Pass 1 mechanics preserved.
- Added VAMPIRE_AGENTS.md and GAME_RULES.md; Volari independence retained, missing Marius/House details explicitly TBD; no invented genealogy or rights.
- PASS: 18 Node tests, nine Rust unit tests, native bridge build, Rust formatting and TypeScript/Vite production build.
- PASS: 25 existing Sandbox entries plus one new real-chain agent recovery test (26 total across two runs), zero failures/skips.
- Evidence: docs/evidence/pass2a-sandbox.json; existing authority/economy/campaign/reset evidence refreshed by regressions. Report: docs/PASS2A.md.
- Documentation synchronized: requirements, AGENTS, README, architecture/security and Pass 1 cross-reference; hackathon rules reviewed unchanged.
- NOT RUN: manual browser/mobile review, WASM rebuild (unchanged contract/artifact), public testnet. No LLM, negotiation, new signing or council voting.
- Risk/next: trusted local scheduling/saves and fixed-ID recovery remain limited; Pass 2B needs bounded provider decisions, negotiation design and permission review.

# Progress — 2026-11-11 — Pass 2B and preview assessment
- IMPLEMENTED: opt-in real Responses adapter, strict typed envelopes, bounded time/retry/input/output, durable per-turn reservation and explicit fallback.
- Seraphine can present existing lease 0; acceptance uses existing NEAR operation; political rejection is local/penalty-free. No contract/key expansion.
- Persistent political outcomes and crash recovery tested; independent Library, revocation, rent and seven-night mechanics preserved.
- Visual prototype: monochrome architecture, replaceable symbolic portraits, supplied Seraphine art, encounter view and separate genealogy/House/right presentation.
- PASS: 28 Node tests, production build; nine Rust tests at baseline (Rust unchanged).
- PASS across suite/focused reruns: 26 existing Sandbox entries plus two negotiation cases. JSON reload regression and negative-test key/contract boundary corrected.
- NOT RUN: live model call (no credentials), browser/mobile QA, public testnet or Vercel deployment; autonomous AI acceptance remains unverified.
- Local HTTP: initial execution isolation fixed for frontend; original game save lock preserved; separate disabled-LLM preview verified HTTP 200 with real near-sandbox world, night 0. Vercel work set aside.
- Docs: PASS2B, Vercel assessment, canon/rules, requirements, README, architecture/security synchronized; hackathon rules unchanged.
- Next: verify one genuine configured model proposal through the existing validated Sandbox flow; hosted playable preview still needs a persistent authenticated executor.

# Progress — 2026-11-11 — Pass 2B final regression audit
- PASS: clean full Sandbox run 28/28, zero failures/skips; 726.94 seconds.
- PASS: Node 28/28, Rust 9/9, TypeScript/Vite production build; preview frontend HTTP 200.
- Refreshed real Sandbox evidence for acceptance/rejection, lost-response recovery and independent rights; provider HTTP remains mocked.
- Windows and WSL config: provider disabled, API key absent, model unset. Live AI NOT VERIFIED.
- Visual prototype implemented; browser/mobile QA and final placeholder replacement outstanding.
- Vercel static frontend build ready; playable deployment blocked by dev-only API and local runner/persistence.
- Audit report: docs/PASS2B_AUDIT.md; PASS2B, README and requirements synchronized. AGENTS/hackathon rules reviewed, unchanged.
- No application/contract changes, paid AI calls, browser automation or deployment during this audit.
- Next: configure an authorized provider and verify one genuine model decision through validated Sandbox acceptance.

# Progress — 2026-11-12 — Pass 2C political campaign
- IMPLEMENTED: version-3 one-action campaign, automatic journaled reckoning, free inspection, seven nights and rights-based Unbound/Favoured/Failure.
- Eight bounded autonomous deterministic NPCs; seeded finite competition, public encounter history, service obligation and three-night ultimatum. LLM gameplay disabled.
- Explicit disposable Marius/Lucien identities and independent court/sanctuary/passage capability roots; Mirelle/Sabine have legitimate grants. Old saves retain their original rules/rights.
- Rust adds only a private initializer; runtime grant/lease/revocation/economy semantics unchanged. Rebuilt WASM hash recorded in docs/PASS2C.md.
- PASS: Node 37/37, Rust 11/11, native demo build, production build, WASM build.
- PASS: all 28 legacy Sandbox entries; four new real Sandbox campaign scenarios across suite/focused runs. Final focused sanctuary label/recovery regression passed.
- Evidence: pass2c-unbound/favoured/failure/passage.json; actual NEAR receipts distinct from mocks. No duplicated payment/turn after tested reload windows.
- Existing visuals retained; essential threat, opportunities, obligation and ending UI added. NOT RUN: browser/mobile QA or public deployment. No LLM calls.
- Docs synchronized: rules/canon, requirements, README, AGENTS, architecture/security and PASS2C. Hackathon rules reviewed unchanged.
- Limits: trusted local operator/save/RPC; fixed-term sanctuary is not ownership; invalid unresolved intent can pause reckoning; production custody remains absent.
- Next: Pass 2D encounter/cutscene presentation and final portraits; human browser/keyboard/mobile acceptance review. Do not activate a provider for the deterministic MVP.

# Progress — 2026-11-12 — Pass 2D Living Court
- IMPLEMENTED: reusable static encounter/negotiation/reckoning/conclusion scenes; eight existing actors and conditional provisional dialogue.
- Exact terms and authority inspection use existing validated commands; scene storage cannot execute actions or reroll events.
- Preserved Seraphine art, seven symbolic portraits, room hotspots, rights inspector and secondary diagnostics; no contract/policy changes or LLM calls.
- PASS: final Node 45/45, production build; Rust baseline 11/11 (unchanged in this pass).
- PASS: full real Sandbox regression 32/32, zero failures/skips; scene-selected acceptance/rejection and recovery included.
- PASS: in-app desktop/mobile viewport checks, keyboard/skip, dialogue reload, sanctuary acceptance, third-reckoning revocation and preserved independent rights.
- NOT RUN: complete seven-night browser ending walkthrough, physical mobile devices, live LLM or public deployment.
- Local preview remains port 5187, isolated Pass 2D save at Night 4; previous preview save preserved. Screenshots/logs in .local.
- Docs: PASS2D, architecture/security, rules/canon, requirements, README and AGENTS synchronized; hackathon rules reviewed unchanged.
- Next: replace symbolic artwork and review all ending screens; council needs real seat/vote mechanics. Production hosting/custody still separate.

# Progress — 2026-11-12 — Pass 2E game entry and narrative
- IMPLEMENTED: dedicated title, New Game with replacement confirmation, Continue, four illustrated passages and Skip Intro; subtitle “A political strategy game”.
- Read-only metadata endpoint and lazy bridge prevent title visits from starting/recovering Sandbox; metadata and runner share server-only save configuration.
- Existing Vesper ultimatum follows intro; direct free Seraphine/Marius leads and first-choice guidance use existing scenes/actions.
- Browser intro progress remains separate from campaign/transaction journals. No mechanics, contract, NPC policy, migrations or room-navigation changes.
- PASS: Node 50/50; final affected entry/scene tests 13/13; Rust 11/11; final TypeScript/Vite build.
- PASS: real Sandbox full suite 32/32, no failures/skips, 1223.22 seconds; reset, negotiation/recovery and four campaign routes preserved.
- PASS: rendered desktop/mobile viewport, keyboard, confirmation/cancel, normal/skip intro, Vesper transition, free lead and reload/Continue restoration.
- PASS: frontend/metadata HTTP 200; title reads left campaign/transaction/index hashes unchanged and did not start a runner.
- Preview: http://127.0.0.1:5187/ using isolated .local/pass2e-preview; earlier saves preserved. Evidence/report: docs/PASS2E.md and .local/pass2e-*.
- Limits: browser-specific intro progress, placeholder art, local WSL/Vite persistence; physical devices/live AI/public deployment not tested or activated.
- Docs synchronized; hackathon requirements reviewed unchanged. Pass 2F not started; await its scope.

# Progress — 2026-11-12 — Pass 2F scene navigation
- IMPLEMENTED: one primary Castle/Room/Encounter/Reckoning/Conclusion view; title/prologue retained and old dashboard removed.
- Contextual contacts/actions, exact commitment terms, bounded guidance and secondary Rights/Bloodline/Relationships/Chronicle/Diagnostics dialogs reuse existing mechanics.
- Existing scene memory now retains accessible rooms; denied/lost access returns safely; night transitions present recorded reckoning before exploration.
- PASS: Node 56/56; final affected navigation/encounter tests 14/14; final production build.
- PASS: full real NEAR Sandbox 32/32, no failures/skips, 1135.91 seconds; all four political routes and transaction recovery retained.
- PASS: in-app desktop navigation, encounter inspection/deferral, pass/revocation, service commitment, reckoning/next night, reload/Continue and overlay focus; local HTTP endpoints 200.
- BLOCKED: mobile rendered verification; viewport override did not change actual 1280x720 browser dimensions. Responsive CSS implemented, visual acceptance incomplete.
- NOT RERUN: unchanged Rust contract (Pass 2E baseline 11/11); prologue walkthrough retained from Pass 2E. No live LLM/public deployment/novice usability claims.
- Preview remains http://127.0.0.1:5187/ at Night 5 after Marius service; previous saves retained. Report/evidence: docs/PASS2F.md and .local/pass2f-*.
- Targeted architecture/requirements/README docs updated; canon, contract rules and hackathon requirements unchanged. Next: mobile viewport verification; Pass 2G not started.

# Progress — 2026-11-12 — Pass 2G directed story and RPG interaction
- IMPLEMENTED: state-dependent incidents across seven nights; free branches for eight vampires; explicit Discovery and Decision scenes using the existing director.
- All patrons remain reachable remotely; Marius does not hide Seraphine behind the locked Lounge. Current commitments show benefits, costs, dependencies, deadlines and survival relevance.
- No rule/authority changes: clarified ordinary room access versus shelter, Blood/Exposure failure, late filing, and final outcomes; no eighth-night decision or phantom quiet-reckoning actor.
- Added approved Vesper and corrected Marius/Dorian artwork; Seraphine retained. Remaining four actors use symbolic placeholders.
- PASS: Node 63/63, final TypeScript/Vite build; full real NEAR Sandbox 32/32, no failures/skips, 1173.80 seconds.
- PASS: in-app seven-night run (appointment, filing, sanctuary, service, feed, pass, pass) to Unbound; 56 unique NPC turns and one sanctuary transaction across reloads.
- PASS: preserved Lounge-access defeat explicitly explained; actual narrow browser 715x764; corrected portraits rendered. NOT RUN: physical phone, novice test, live LLM/public deployment. Rust unchanged; last baseline 11/11.
- Preview restored to existing save/title on 5187. Verified orphaned stale lock moved aside without touching campaign/chain data; isolated test evidence retained in .local/pass2g-preview.
- Report: docs/PASS2G.md. Targeted canon/rules/requirements/architecture/README/AGENTS updates; hackathon requirements unchanged. Pass 2H not started.

# Progress — 2026-11-12 — Measured startup optimization
- Diagnosed real startup: baseline fresh 68.460 s / replacement 57.542 s; sequential chain bootstrap and WSL dependency imports dominate, not NPC decisions.
- Faster disposable Sandbox cadence with matching GC capacity; independent key restrictions and read queries concurrent; Windows runner bundled with existing Vite.
- Fresh verified startup 5.654 s / warm replacement 4.548 s. Under-three-second verified readiness remains unmet.
- Browser: free prologue 0.483 s; verified replacement entry 6.317 s, React commit 8.1 ms; Skip waits for actual chain initialization.
- PASS: Node 63/63, targeted entry 5/5, production build, existing real Sandbox 32/32 and additional Windows bundled/reload regression 1/1.
- Rust unchanged/not rerun (last 11/11). No live LLM, deployment, mechanics changes or Pass 2H work.
- Original preview save preserved; timing campaigns isolated. Evidence, limits and reproduction: docs/STARTUP_PERFORMANCE.md.
- Next: reduce remaining real initialization cost without changing finality or introducing privileged reset; no claim that the full three-second target was met.

# Progress — 2026-11-12 — Pass 2H Living Court
- IMPLEMENTED: new-campaign Library grants, named assistant delegation, later verified research, issuer-based cascading revocation, independent Marius/Lucien rewards.
- Cinematic encounters retain one-button commitments, free questions/refusal, visible material terms, optional technical inspection; old low-value choices demoted.
- Lounge invitation is an actual grant. Existing 0.02 NEAR sanctuary remains paid; new NPC-funded earning/purchases explicitly DEFERRED by user to preserve unchanged Rust/restricted keys.
- PASS: final Node 70/70, production build; full Linux Sandbox 35 passed/1 Windows-only skipped (556.338 s), that Windows test separately PASS 1/1.
- PASS: desktop 1280x900 seven-night browser campaign to Unbound; mobile 390x844 scoped encounter/keyboard/commitment/reckoning verification.
- Browser save/reload: 25 transactions, 56 unique NPC turns, stable ending; evidence and screenshots in docs/evidence/pass2h-*.
- Rust unchanged/not rerun (last 11/11); no live LLM, public deployment, physical phone or novice test.
- Original Night One preview restored on 5187; acceptance save isolated. Old saves retain original rules; New Game enables Living Court.
- Report: docs/PASS2H.md. Remaining: funded earning mechanism needs separately approved contract/security scope; four portraits and broader late-game competition remain limited.

# Progress — 2026-11-12 — Pass 2I graphic novel presentation
- IMPLEMENTED: visual canon, illustrated cover, four fictional prologue panels, varied encounters, castle/room compositions, chapter/reckoning, ancestry/rights and ending presentation.
- Supplied Landing/Seraphine incorporated unchanged; earlier approved portraits preserved. Three generated interiors are visibly PROVISIONAL; four symbolic portraits remain.
- Existing director, validated commands, deterministic agents, Rust, one-action rules and persistence unchanged; no runtime LLM or public deployment.
- PASS: final Node 70/70, production build; targeted real Sandbox Living Court 3/3 (57.509 s).
- PASS: desktop 1280x900 and mobile 390x844 rendered checks, keyboard navigation/Escape, focus restoration, intro/replacement and scoped commitments.
- PASS: seven-night browser route to Unbound; 25 unique transactions, 56 unique NPC turns; ending reload left campaign/transaction hashes unchanged.
- PARTIAL: final-art acceptance. Reduced-motion CSS inspected; live preference emulation, physical phones and novice test NOT RUN. Full Sandbox/Rust not rerun; interfaces unchanged.
- Evidence/report: docs/PASS2I.md and docs/evidence/pass2i-*; original Night One preview restored on 5187, walkthroughs isolated in .local/pass2i-preview.
- Docs: VISUAL_CANON, README, PROJECT_REQUIREMENTS and AGENTS updated; HACKATHON_REQUIREMENTS reviewed unchanged.
- Next: approve/replace interior studies and supply four missing portraits; complete live reduced-motion and physical-phone acceptance.

# Progress — 2026-11-12 — Approved landing restoration
- Restored the exact supplied cover composition and original painted button treatment; removed cover recomposition on mobile.
- Transparent native controls retain New Game/Continue semantics and original save protection.
- PASS: entry tests 5/5 and production build; rendered desktop/mobile inspection, keyboard focus and replacement cancellation.
- Updated VISUAL_CANON and PASS2I report/evidence. No gameplay or contract changes.
- Limitation: preserved landscape cover is small on portrait phones; no alternate composition approved.

# Progress — 2026-11-12 — Game startup recovery
- Confirmed recording failure: abandoned original-save play.lock blocked runtime; bridge retained failed child.
- Verified no WSL runner/Sandbox owner, archived stale lock, restarted preview with WSL access. Preserved original campaign.
- PASS: browser Continue reached original Night One castle; evidence start-recovery-castle.jpg.
- PASS: entry 5/5; isolated real Sandbox Windows startup/reload 1/1 (17.29 s).
- No code/gameplay changes; build/Rust NOT RERUN. Updated startup incident documentation; requirements/AGENTS/README reviewed.
- Known limit: orphaned locks require verified manual recovery; title-only inspection is insufficient for preview handoff.

# Progress — 2026-11-12 — Current castle and portrait assets
- Integrated creator cutaway castle with room-aligned Library/Lounge/Crypt controls; removed repeated in-game title and finished-art credit tags.
- Integrated all nine current supplied portraits; removed four symbolic placeholders. Player portrait appears in selected Bloodline record.
- PASS: all ten images match supplied files byte-for-byte; production build; entry/navigation tests 11/11.
- PASS: rendered desktop, medium and mobile castle; keyboard Library entry, Crypt denial, Mirelle/Sabine scenes and player image loading.
- Current Night Seven save preserved; no political commitment. Sandbox/Rust not rerun for presentation-only changes.
- Updated VISUAL_CANON, README, PROJECT_REQUIREMENTS and PASS2I evidence; AGENTS and hackathon requirements reviewed unchanged.
- Remaining: provisional room interior approval; full portrait-by-portrait viewport acceptance and prior accessibility limitations.
# Progress — 2026-11-12 — Pass 3A gothic RPG
- Revised all seven Living Court chapters, eight character voices, room records, negotiations, reckonings and endings over existing authoritative state.
- Preserved Rust, NPC policies, save schema and ending rules; restored the existing conceal action to visible survival choices.
- PASS: Node 76/76; production build; existing Linux Sandbox 35 plus new final-night tests 2 and Windows startup 1 (38 total).
- PASS: two complete browser campaigns, Unbound and Lucien Favoured; mobile terms/final choices, keyboard activation and reload without changed campaign/transaction hashes.
- New final-night Sandbox evidence proves finish versus withdrawal changes research, assistant access and patron protection while preserving sanctuary and title.
- Original save preserved; restored normal preview after archiving its confirmed orphaned lock. Documentation: PASS3A, README, requirements, rules, character notes and AGENTS updated; hackathon/visual canon reviewed unchanged.
- Known limits: abstract research/service details, quiet final turns after some earlier choices, legacy narrative retained, provisional room art and prior accessibility audit gaps.
- Next: human narrative playtest and canon approval for richer archival revelations; no Pass 3B/3C begun.


# Progress — 2026-11-12 — Pass 3B living court
- Added bounded evidence-based reaction scenes, room/castle follow-ups and explicit cooperation, service and patronage states across seven nights.
- Narrowed NPC observations and added actor-specific deterministic priorities; new Dorian petitions require a viable switch, while older journaled petitions remain recoverable.
- Preserved Rust, restricted signing, campaign schema, ending predicates and the documented one-major-action default; no paid provider or public deployment.
- PASS: Node 84/84 and production build; Linux Sandbox 40 plus Windows startup 1; three new seven-night routes rerun after final compatibility review.
- PASS: two complete browser routes (Marius Favoured and sanctuary-backed rival switch to Unbound), mobile decisions, keyboard activation and completed-reaction reload.
- Final browser submission/reload recovered 56 unique NPC turns and 27 transactions; interruption-at-instruction coverage comes from existing deterministic recovery tests.
- Updated PASS3B, README, requirements, rules, character notes and AGENTS; visual canon/hackathon requirements reviewed unchanged. Normal save preview restored after test isolation.
- Limits: deterministic bounded court, no physical NPC schedule, browser-local read memory, provisional art and occasional quiet nights; no invented history or replacement opportunities.
- Next: human playtest of reaction pacing and approval of provisional dialogue. Pass 3C not begun.

# Progress — 2026-11-12 — Pass 3C
- PARTIAL acceptance: integrated story-first records, visible Exposure, full mobile portraits, immediate consequence facts and route-specific epilogues.
- Preserved approved art, one-major-action rules, Rust semantics, restricted NPC signing, save compatibility and authoritative ending calculation.
- Corrected independent Crypt narration and misleading late title-filing recommendations without changing validated actions.
- PASS: 89 Node tests; final targeted 3A–3C 19/19; TypeScript/production build; 11 Rust tests with documented bundled NASM setting.
- PASS: existing 40 Linux Sandbox tests plus separate Windows startup test; three new seven-night integration routes (44 actual Sandbox tests total).
- PASS browser: Marius/research/withdrawal to Favoured; sanctuary/rival-switch to Unbound with Lucien protection; mobile terms, keyboard, disclosures and pending-UI reload.
- Reports: docs/PASS3C.md and docs/PASS3D_HANDOFF.md; route records and screenshots in docs/evidence/pass3c-*.
- Missing: NPC purchasing treasuries and NPC-to-NPC transactions. Player-paid rent collection does not satisfy that requested acceptance criterion.
- Unverified: physical devices, screen readers and reduced-motion emulation. Late consolidated routes remain strategically thin; no claim of fun.
- Next: review the prioritized 3D climax/counterplay and bounded economic capability scope. No 3D mechanics, paid models or public deployment introduced.

## Verification workflow update
- Recorded the user's risk-based, change-scoped verification rules in AGENTS.md for all remaining work.
- Existing tests and security, authority, payment and persistence requirements remain intact.
- Reuse unchanged evidence; scope Sandbox and browser checks to affected behaviour; full regressions at pass completion or shared-system changes.
- Documentation-only change: application tests/build NOT RUN; no runtime behaviour changed.
- Reviewed project requirements, hackathon requirements and README; no product or submission requirement changes needed.

## Pass 3D — Dangerous Court completed
- New campaigns: Night VII Marius demand, published-account leverage and a costly limited-inspection counterproposal with deterministic acceptance/refusal.
- One finite Cassian-to-Lucien passage purchase: exact funded mandate, restricted keys, atomic budget/escrow/access acceptance, separate verified seller payout, unused-expired refund.
- Preserved old saves, one-action rule, existing ending predicates, independent rights, artwork and restricted execution. No public deployment or model activation.
- PASS: 92 Node tests, 13 Rust tests, locked WASM build and TypeScript/production build; targeted final/epilogue checks 8/8.
- PASS: complete Linux Sandbox suite 49; Windows-only startup separately 1 (50 actual tests total). Five new seven-night routes include lost-payment-response recovery, distinct final outcomes and alternate investigation.
- PASS: focused rendered final encounter, keyboard commitment and reopened accepted result. Screenshots/receipt evidence and exact files in docs/PASS3D.md.
- Updated requirements, rules, agent continuity and README; hackathon requirements reviewed, unchanged. Original user save preserved; normal preview restored after isolated verification.
- Limits: one authored fixed-price agreement, not a general economy; new mobile prose and screen-reader checks NOT RUN. Historical 3C weaknesses outside the four authorized areas remain.
- Next: user review of Pass 3D. No subsequent gameplay pass started.

## Encounter layout correction
- CSS only: 44/56 art/dialogue split above 640px; mobile portrait 26dvh with controlled proportional crops.
- One dialog scroll flow; removed independent script scrolling and full 4:3 mobile artwork override. Retained native focus, controls and reduced-motion behavior.
- PASS rendered: 1280×720, 900×700, 390×844 and 320×844; first confrontation response visible at each. Also inspected Seraphine, Reckoning, consequences and long terms.
- PASS: keyboard focus/scroll to commitment, 19 relevant UI regressions and production/TypeScript build.
- Long mobile agreements still scroll to preserve every material term. Physical devices, screen readers and reduced-motion emulation NOT RUN.
- No gameplay, narrative, contracts, save data or approved assets changed. Sandbox/full campaigns not rerun; prior evidence retained.
- Updated visual canon, README and docs/ENCOUNTER_LAYOUT.md with screenshots; requirements and hackathon rules reviewed, unchanged.
- Next: user review; no additional gameplay pass.

## Initial Git baseline preparation
- Confirmed directory had no Git repository; initialized main using the existing configured author identity.
- Expanded ignore rules for secrets, private keys, local saves/journals, dependencies, caches and build artifacts; retained complete source, artwork, docs and test suites.
- PASS: prospective-file credential scan; two explicit mock credentials reviewed, no exposed credentials found. Public Sandbox regression evidence retained; private runtime data excluded.
- PASS: ignore probes distinguish private runtime files from source, artwork and lockfiles. No project files deleted, reset or reorganized.
- No gameplay/contracts changed. Application tests/build NOT RUN; unchanged prior evidence reused.
- Baseline scope and scan limits recorded in docs/GIT_BASELINE.md. Requirements/README/hackathon rules reviewed; no product changes needed.
- Next: verify private GitHub remote and prepare push; no force-push or remote history replacement.

## Public GitHub baseline — user clarification
- Local baseline commit df1b2a7 preserves the working Pass 3D state and encounter layout correction (236 files).
- User clarified the existing repository must be PUBLIC for judging and explicitly authorized restoring its visibility and pushing after audit.
- PASS: all baseline history blobs scanned; no exposed credentials, private keys, wallet files, sensitive environment values or runtime journals found. Two explicit mock test credentials reviewed.
- Origin is the existing https://github.com/gl1tchpvnk/we-inherit-night.git; remote refs were empty. No replacement repository or force-push.
- Added explicit local-wallet ignore rules; corrected Git baseline documentation. Gameplay/contracts/artwork/project structure unchanged.
- Tests/build NOT RUN for repository-hygiene-only changes; previous results remain applicable.

## Testnet deployment preflight — awaiting required naming approval
- Reviewed contract constructor, Sandbox signing/bootstrap, centralized Testnet views, local persistence and hosting constraints; no gameplay or contract changes.
- PASS: Rust 13 tests and fresh locked cargo-near WASM build; SHA-256 recorded in docs/TESTNET_DEPLOYMENT.md.
- PASS: official Testnet RPC returned UNKNOWN_ACCOUNT for all 12 proposed project IDs; names are not reserved or approved.
- PASS: current storage price queried; WASM-only storage floor 2.15688 Testnet NEAR, additional state/account/gas budget still required.
- BLOCKED: mandatory user account-name approval. No account creation, keys, funding, signing, deployment or initialization performed.
- near-cli-rs not found on Windows/WSL PATH; official installation route identified, installation deferred until approval.
- Existing frontend Testnet mode is read-only; public playable hosting needs a trusted durable execution service and isolated campaign worlds. Vercel NOT RUN.
- Next: obtain explicit name approval, then install/verify CLI and prepare approved Testnet identities/funding. Existing Sandbox saves and Git history preserved.

## Pass 4A — approved Testnet accounts created and verified
- PASS: official near-cli-rs 0.31.1 installed; all 12 approved names rechecked and created on Testnet only.
- Faucet funded parent with 10 NEAR; castle received 5, ten actors 0.25 each; parent retains 2.4217351150875 after fees.
- PASS: finalized account/key queries and 12 creation/funding transactions; exact recipients/deposits, distinct keys and successful receipts verified.
- Provisioning credentials saved in OS keychain outside Git; no plaintext fallback, overwrite or runtime executor access.
- Evidence/hashes: docs/PASS4A.md and docs/evidence/pass4a-testnet-accounts.json. All accounts have no deployed code.
- Build/regression tests NOT RUN: account/docs-only task; previous contract evidence retained.
- Next: separate deployment approval, initialization and restricted runtime signing. Public multi-campaign architecture remains undecided.

## Pass 4B.1 — multi-campaign authority, verified locally
- IMPLEMENTED: one Authority registry with immutable campaign-keyed Worlds; scoped reads, mutations, budgets, nonces, executor and callbacks.
- Private creation validates initial actors and reserves bounded storage; unrelated worlds' economic liabilities cannot fund new storage. No runtime admin override.
- Sandbox scenarios share one deployed contract with distinct actors; recovery journals bind contract/campaign. Legacy saves retain old WASM; automatic incompatible upgrade disabled.
- PASS: 19 Rust, 92 Node, production build and 52 unique Sandbox cases (49 initial Linux passes, two corrected fixture reruns, one separate Windows startup pass).
- PASS: two simultaneous seven-night worlds finish Favoured/Mirelle and Unbound/Dorian; lost payment recovery, shared-account permissions, replay/concurrency and callback isolation covered.
- WASM 492306 bytes; SHA-256 a96adbe06a90e92a6a92a4c82da1165273c6e054c3cf1c55e6a15861bd0e92a5. Raw release build used to avoid cargo-near's incompatible CLI-config migration.
- Risks: privileged provisioning custody, conservative permanent storage reserve, no automatic legacy on-chain migration, no public execution service. See docs/PASS4B1.md.
- No Testnet/credential operations, deployment, hosting, artwork/gameplay changes or Git history changes. Await Pass 4B.2 approval; previously verified 5 NEAR is insufficient for code plus first campaign backing.

## Pass 4B.2 — Testnet preflight; funding deferred
- PASS: approved 492306-byte WASM checksum, all twelve accounts and empty castle code/state verified on finalized Testnet RPC.
- Castle retains 5 NEAR; measured code/base plus two campaign reserves needs 10.92616 before gas; working target 11.1 NEAR.
- FAIL: direct castle faucet request finalized with Invalid receiver_id; parent request returned no hash/error and no confirmed funds; alternative faucet HTTP 503.
- User requested skipping additional funding; stopped without transfers, deployment, initialization, campaigns or key changes.
- PARTIAL: all contract smoke tests NOT RUN; unchanged Pass 4B.1 regressions reused, not repeated.
- Public evidence under evidence/; docs/PASS4B2.md records balances, failed transaction, exact shortfall and resume prerequisites.
- Next: adequate free Testnet funding, then recheck prerequisites and resume authorized deployment. Pass 4C not started.

## Testnet funding recovery — policy prerequisite unresolved
- Official CLI documentation confirms sponsored account creation, but current funding limits and permission for multiple donor accounts could not be established.
- Honored the user's stop condition: zero accounts/credentials created, zero funding submissions or transfers, no deployment.
- Finalized RPC: castle 5.005 NEAR, 182 bytes, no code; storage price unchanged; 11.1 NEAR target leaves 6.095 NEAR shortfall.
- Evidence: evidence/pass4b2-funding-recovery.json; docs/PASS4B2.md updated with sources and exact limitation.
- Tests NOT RUN: documentation/public-read-only evidence changes. Prior regression evidence retained.
- Next: establish official faucet policy/operator permission or obtain a direct authorized Testnet top-up; do not infer permission from technical capability.

## Testnet funding recovery — PASS
- Normal official CLI faucet accepted one funding account, win-funding-20261112-a.testnet, with 10 Testnet NEAR; second account unnecessary.
- Independent key stored in Windows OS keychain; existing credentials untouched, no private material recorded.
- Transferred 6.095 NEAR to castle; finalized RPC verifies exact amount/recipient and all successful receipts.
- Castle now 11.1 NEAR; funding account 3.9049553634875 NEAR; target shortfall zero. No deployed code.
- Public creation/transfer evidence and transaction hashes recorded in docs/PASS4B2.md and evidence/pass4b2-funding-*.json.
- No deployment, initialization, contract changes or Pass 4C work. Regressions not repeated for funding/docs-only task.
- Next: await deployment resumption, then refresh prerequisites and complete Pass 4B.2 smoke tests.

## Pass 4B.2 — PARTIAL: deployed, restricted signing blocked
- PASS: approved WASM deployed once to castle.we-inherit-night.testnet; RPC bytes/checksum match, registry initialized, two full political verification worlds created.
- PASS: grant/entry/revocation, finalized denied entry, independent Library entry, cross-world rejection and unchanged-world comparisons.
- PASS: B sanctuary accepted with actual 0.02 NEAR escrow; A finances unchanged. Both remain night 0 for targeted smoke verification.
- BLOCKED: CLI 0.31.1 used existing FullAccess key despite explicit restricted public-key argument. Restricted key is correctly installed but unused; stopped signing.
- Negative method/deploy attempts finalized rejected by authority/protocol checks, not restricted-key checks. No unauthorized mutation; provisioning keys preserved.
- Castle balance 11.1357778046366181 NEAR, storage 496223 bytes; includes 0.04 NEAR liabilities and backing for two reserves.
- RPC 429 recovered through documented public Testnet endpoint with existing transaction hash; no resubmission. Evidence under evidence/pass4b2/.
- docs/PASS4B2.md, deployment overview and README updated. Prior 4B.1 regressions reused; no source/WASM/save changes or Pass 4C.
- Next: fix isolated key selection and verify signed public key before broadcast, then complete restricted signing acceptance; do not redeploy/recreate worlds.


## Pass 4B.2-FIX — PASS, restricted signing resolved
- Root cause confirmed in official CLI 0.31.1 source: online keychain path selects FullAccess; exact public-key lookup is supported offline.
- Used existing Windows keychain via offline signing; decoded/verified exact key, signer, receiver, action, nonce and cryptographic signature before every broadcast.
- Minimal A test grant created, then revoked with existing restricted Vesper key; finalized hash Hd2YJ6KY7so6AAfWgSLD6hqkphrkreWJdmBiuhreeagm.
- PASS: MethodNameMismatch and RequiresFullAccess pre-inclusion rejections; correct-key nonce unchanged by negatives. No deployment or administration executed.
- Initial 50 Tgas reservation exceeded allowance; confirmed rejection, then bounded 10 Tgas succeeded without altering key limits.
- PASS: code unchanged, original A rights preserved, B unchanged, existing credentials intact; two FINAL successes and three pre-inclusion rejections recorded.
- docs/PASS4B2.md, deployment overview, README and evidence/pass4b2/fix-* updated. No application/WASM changes; prior regression evidence reused.
- Pass 4B.2 acceptance now PASS. Public runtime/custody/session work remains Pass 4C; not started.


## Seven-night narrative correction — PASS
- Paused incomplete Pass 4C.1 work on user direction; no further backend edits or Testnet operations during this correction.
- Replaced Night Nine references in endings, lease reactions/reckonings, and counterproposal descriptions with state-aware seven-night wording.
- Shared presentation-only expiry formatter distinguishes an early deadline, coverage through Night VII, unknown expiry and already-expired access.
- Confirmed Rust uses end_night = acceptance night + duration and active while current night < end_night. Displayed Night VII is contract night 6; end 7 expires at final dawn.
- Existing ending eligibility still requires an active sanctuary at its evaluation time; no arithmetic, duration, authority or ending-predicate change.
- PASS: 65 focused narrative/gameplay tests (pass3a/b/c, encounters, final-court, politics, game), including expiry 6/7/8/9, expiry boundary and wrong-beneficiary coverage.
- Changed src/leaseNarrative.ts, livingCourt.ts, reactiveCourt.ts, encounters.ts, finalCourt.ts, politics.ts and two narrative test files. Technical inspection retains exact raw expiry records.
- No Rust, backend, artwork/layout, save migration or network changes in this correction. Build/full regressions NOT RUN per requested targeted verification. Stop after reporting.

## Pass 4C.1 — PARTIAL: local backend implemented
- Added loopback Node service, SQLite sessions/campaign allocation, durable transaction journal and Testnet scenario adapter.
- Reused existing game/NPC engine and exact-key offline signing mechanism; no CLI reinvestigation or provisioning-key fallback.
- Frontend opt-in supports backend New Game/Continue; Sandbox file persistence and read-only Testnet remain supported.
- PASS: 98 Node tests; focused backend 5/5 after final nonce guard; targeted Sandbox campaign 1/1; TypeScript/production build.
- PASS: actual local frontend 200, save metadata 200 and empty-capacity 409; service stopped after check.
- Local HTTP fixtures verify separate sessions/restart; synthetic fault injection verifies recovery without duplicate sending. These are not Testnet evidence.
- BLOCKED: fresh visitor campaigns and isolated Windows runtime keychain. Paid player actions blocked pending a bounded deposit signer.
- NOT RUN: real backend Testnet player/NPC transactions and two-browser campaigns; no transaction hashes or live acceptance claimed.
- Report/setup in docs/PASS4C1.md; README/config/requirements updated. No Rust, art, narrative, public deployment, commit or push.
- Next: resolve these remaining 4C.1 blockers and exercise live acceptance before considering 4C.2.

## Pass 4C.2 — PASS locally; no Testnet changes
- Removed fixed campaign storage reservations; actual usage plus protected financial obligations must remain backed. Existing per-world bounds and new total quota enforced.
- Added prepaid player treasury, bounded restricted provisioner, immutable actor policy and finite operator pool; no new player account required per repeat campaign.
- Added completed/archived/reclaimed lifecycle, post-story lease-term closure, nonreusable tombstones and SQLite archive/session history.
- PASS: 23 Rust tests; 100 Node tests (seven backend cases); TypeScript/production build; two independent prepaid seven-night routes with archive/reclaim/reopen.
- Sandbox: 53 discovered, 51 initially passed, one new fixture failed and one Windows-only case skipped; corrected focused case passed. Final 52 unique executed cases PASS.
- Measured initial playable footprint 1,441 bytes; seven-night peaks 2,033/2,101; 256 grants + 64 leases 27,011. Reclamation retains 191–202-byte tombstones in fixtures.
- Final WASM 579,736 bytes, SHA-256 99f0deeac2fc7e95080d92656b87c0a1515311201d065c8588eacc25b35e05f0. Final artifact tested in focused Sandbox lifecycle case.
- Existing evidence preserved; new evidence/report in docs/PASS4C2.md and docs/evidence/pass4c2-*.json. No gameplay narrative, artwork, Testnet credentials, deployment, funding, commit or push.
- Remaining: approve a fresh deployment (incompatible root layout), provision isolated runtime custody, fund finite pool/gas, public operational safeguards and live acceptance. Abandoned/early-defeat worlds remain retained.
- Stop before any Testnet upgrade/deployment; no subsequent pass begun.

# Progress - 2026-11-13 - Pass 4D PARTIAL
- Approved sustainable WASM deployed to night.we-inherit-night.testnet; independent RPC bytes match the approved SHA-256.
- Registry, four-active-world provisioning policy and 0.15 NEAR pool initialized; seven administrative transactions finalized.
- Storage 580,451 bytes / 5.80451 NEAR; final amount 6.0951742617979837 NEAR. Retained funding used; no faucet or paid service.
- Old castle code, balance and storage unchanged; obligations preserved.
- PASS: seven focused backend tests and Testnet-mode production build. Prior 4C.2 regressions reused.
- BLOCKED: dedicated runtime identity/keys. User chose reporting after deployment; no administrative gameplay fallback.
- NOT RUN: live visitors, player/NPC transactions, seven-night completion, archive/reclaim/replay. Next: isolated runtime setup and acceptance checks.
- Report: docs/PASS4D.md; evidence/pass4d/. No public hosting, commit/push, Rust/gameplay/art changes.
# Progress - 2026-11-13 UTC - Pass 4E preparation complete
- Added one-service Render Blueprint: Node 24, existing frontend/API, /var/data persistent SQLite, PORT/0.0.0.0 and health checks.
- Added protected-environment restricted signing, exact-roster startup permission checks and retained per-call signature/finality verification; no FullAccess fallback.
- Corrected prepaid affordability, unsigned/signed/broadcast recovery, exact-byte retry safety, API privacy and durable creation/request quotas.
- Bounded concurrent requests, streamed artwork, removed unbounded visitor cache and added crash-released single-writer locking.
- PASS: 123/123 Windows Node regressions; 30/30 Linux backend/startup tests; production frontend build; five affected local Sandbox cases including two independent seven-night campaigns.
- Linux full-suite attempt: 94 pass / four environment failures (Windows-native Vite dependencies/local-demo); focused Linux runtime and full Windows suite pass. Fresh Linux install/build remains unverified.
- Linux synthetic memory: 124.1 MiB idle / 220.9 MiB peak RSS; four campaigns, 4,000 journals, 80 API + 80 artwork responses, 256 MiB heap cap. Starter is a reasonable initial sizing choice, not hosted capacity proof.
- Updated README, project/deployment docs, AGENTS, environment example and docs/PASS4E.md; reviewed hackathon rules without changing them. Memory evidence: docs/evidence/pass4e-memory.json.
- No live credentials, Testnet transactions, Rust changes, deployment, service purchase, commit or push. Existing unrelated work preserved.
- Next: separately authorize restricted-key installation and Render setup, then verify real hosted gameplay. Finite capacity/abandoned worlds and unreconciled expired transactions remain operational limits.

# Progress - 2026-11-13 UTC - Restricted runtime key installation complete
- Verified all eleven existing Testnet accounts and current key lists through FastNEAR and official NEAR RPC; immutable roster unchanged.
- Installed eleven independent Ed25519 FunctionCall keys for night.we-inherit-night.testnet with exact role allowlists; eleven AddKey-only transactions FINAL.
- PASS: independent exact-key verification, all prior credentials preserved, production verifyRuntimeRoster, and unchanged deployed registry. All new allowances remain 0.05 test NEAR each.
- Private JSON is DPAPI CurrentUser encrypted outside Git under AppData/Local/WeInheritNight/Render-night-testnet; user/SYSTEM-only ACL and secret/public matching verified.
- Exact public NIGHT_CONFIG_JSON and encrypted NIGHT_RUNTIME_KEYS are ready; manual clipboard helper syntax passes and was not executed. Nothing uploaded to Render.
- PASS: scoped production Vite bundle/import review; no signing/private environment/provider code in frontend. Dormant Sandbox/Windows helpers reported and preserved; no demonstrated issue warrants removal.
- Initial protection cmdlet failure occurred before writing secrets; direct DPAPI succeeded. Corrected expected new-key nonce after provisioner FINAL; no duplicate installation transaction.
- Docs: docs/RUNTIME_KEYS.md, Pass 4E follow-up, README, requirements and AGENTS. Public evidence: evidence/runtime-keys. Hackathon requirements reviewed unchanged.
- No application/Rust/art/gameplay changes, new tests, deployment, new accounts, fund transfers, paid service, commit or push. No remaining key-installation blocker.
- Next: separately approved Render setup and live hosted acceptance; no public playability claim.

## Campaign capacity fix — locally verified
- IMPLEMENTED: private operator setter updates existing max_active; no serialized layout changes; 32 MiB ceiling and financial backing checks retained.
- IMPLEMENTED: durable, serialized inactivity/defeat cleanup freezes actual outcomes, settles through existing restricted methods and retains replay tombstones/history.
- Creation quotas/cooldown are bounded configuration; finalized provisioning rejection can retry; uncertain identity remains journaled. Deadline/closure disclosed in existing UI.
- PASS: 24 Rust tests, including fifth-campaign admission after raising capacity; 141 Node tests; TypeScript/Vite production build.
- PASS: 5 Sandbox tests covering exact old-to-new upgrade, two early reclaimed worlds, financial/storage/replay protections and two complete independent seven-night games.
- Exact public Testnet state and populated old-WASM state remained byte-identical across local code-only upgrade. Verified artifact SHA-256 a11d407105d4b09d17eb91642ff415040e37f0ede05355fb626d0774110df250.
- Initial direct build missed --cfg near; unchanged lifecycle regression caught generic traps. Corrected build passed; no checks weakened. Native tests used bundled prebuilt NASM objects.
- Docs: docs/CAMPAIGN_CAPACITY.md, public evidence, Render example, Pass 4E follow-up, README, requirements and AGENTS. Hackathon requirements reviewed unchanged.
- No live transactions, upgrade/deployment, credentials, paid service, commit or push. Higher-capacity hosted memory/performance remains unverified; funding/gas/storage stay finite.
- Next: separately authorized same-account code-only upgrade (no reinitialization), operator capacity selection and hosted acceptance.

## Testnet upgrade and initial capacity — verified; expansion PARTIAL
- PASS: two RPC providers confirmed preflight code/state unchanged; checksum a11d407105d4b09d17eb91642ff415040e37f0ede05355fb626d0774110df250 and sufficient storage backing verified.
- FINAL code-only upgrade: F3wPz6J9xdoKtjpg12YTLGytMkh9L5JNkqgmDPtdKAuz. All stored bytes preserved; no initialization or provisioning/credential edits.
- FINAL capacity=1: 5PQw61q96tiuQSL5ohZp51g74c9FZzWkvwetEUMXi6xq. Exact capacity-only byte diff, getter, code and financial state independently verified.
- Actual deployment cost reduced the two-campaign planning margin; fresh guard blocked that attempt before signing. Only the one-capacity call was sent.
- Balance 6.0907342792571656 test NEAR; storage 584636 bytes; pool 0.15; liabilities/treasuries/active worlds zero. All eleven runtime allowances remain 0.05 and permissions/nonces unchanged.
- PARTIAL expansion: under documented measured-storage budget, capacity 2 needs 0.0003857207428344 extra free backing; capacity 5 needs 0.2302857207428344 total contract funding plus gas-budget/higher-capacity measurement clearance.
- Evidence: evidence/capacity-testnet; report docs/CAPACITY_TESTNET_UPGRADE.md. README, requirements, prior capacity report and AGENTS synchronized; hackathon requirements reviewed unchanged.
- No gameplay transactions, account/key changes, funding transfers, Render deployment, unrelated tests, commit or push. Existing local tests apply to the identical deployed artifact.
- Stopped after independent verification. No public playability claim; additional funding/hosting operations need separate authorization.

## Testnet funding — PASS, capacity 5
- Two normal official CLI faucet requests created win-funding-20261113-a.testnet and win-funding-20261113-b.testnet with 10 Testnet NEAR each; both FINAL and independently verified. No rejection/bypass/repeated request.
- First CLI hash capture missed stderr; read-only block/chunk lookup recovered and verified creation before proceeding. Deprecated RPC query rejection resolved using documented FastNEAR/dRPC providers, not another faucet.
- FINAL transfer: 4 NEAR to existing night contract; authorized self-call adds 1 NEAR to pool. Final pool 1.15, capacity 5, contract balance 10.0903084649026567 NEAR.
- Keeper/Seraphine finite allowances raised to 0.10/0.075 via atomic same-public-key delete/add; receiver/method permissions and all other keys preserved. Other nine allowances remain 0.05; no actor balance top-ups needed.
- Five adjusted stress-storage footprints budget 2.7075 NEAR; free backing after current storage/pool/root reserve is 3.0877884649026567. Additional stress-budget headroom 0.3802884649026567.
- Funding reserves: A 5.9999553634875, B 10; combined 15.9999553634875 NEAR (15.9963153634875 above their storage stakes).
- PASS: all seven transactions FINAL-success through two RPC providers; balances, capacity getter, pool-only/capacity-only state changes, unchanged code/roster/policy and exact restricted permissions verified.
- Evidence evidence/campaign-funding; docs/TESTNET_FUNDING.md, prior capacity/key docs, README, requirements and AGENTS updated. Hackathon requirements reviewed unchanged.
- No contract/application changes, redeployment, live gameplay, Render work, unrelated tests, commit or push. Funding is verified; hosted five-player performance/public playability is not.
- Stopped after verification; no additional operations authorized by this milestone record.

## Public deployment — pre-push preparation
- User authorized audit, commit/push and hosted acceptance, with separate approval required for paid service and runtime-secret upload.
- Expanded ignore rules for encrypted credential exports, private local configurations, SQLite variants and signed recovery payloads; preserved safe public config/docs/receipts.
- PASS: candidate/index/all-ref-and-reflog secret scans; no valid NEAR private key or other credential found. Public Ed25519 signatures excluded only after contextual and cryptographic checks; tracked ignored-file list empty.
- PASS: production frontend build and import audit; exact Render install/build command in fresh Linux Node 24 directory; Linux SQLite WAL/startup/health/static-page smoke without credentials or chain calls.
- Dependency audit: 13 low transitive elliptic findings, no moderate/high/critical; no unrelated dependency updates. Existing regression evidence reused.
- Render sign-in completed by user; Blueprint setup awaits reviewed repository push and explicit payment/manual-secret steps. No service or secret upload yet.
- Evidence/docs: evidence/public-deployment and docs/PUBLIC_DEPLOYMENT.md. Public gameplay acceptance remains NOT VERIFIED.

## Public deployment — hosted checkpoint
- User approved paid Starter/1 GB disk and manually entered runtime credentials; deployed commit 291ac80.
- PASS: Render build/Node 24 guarded startup, Live status, public HTTPS health 200 and title page.
- PARTIAL: first campaign provisioning blocked by provisioner account gas backing; balance 0.0499579391840732 NEAR versus required 0.0509193907729125 NEAR. Restricted allowance remains 0.05 NEAR.
- Exact signed transaction remains durably journaled; identical-byte submission diagnosed NotEnoughBalance. No replacement intent, funding or key mutation performed.
- Read-only chain check: capacity 5 and funded contract state unchanged. Seven-night hosted gameplay, restart persistence and performance remain unverified.
- Next: approve bounded Testnet provisioner funding/allowance remediation, reconcile the recorded intent, then resume hosted acceptance. Details in docs/PUBLIC_DEPLOYMENT.md.

## Runtime gas funding — PASS
- Reviewed all eleven accounts against five-game call envelopes, actual protocol-88 upfront purchase price, storage, fees and operating headroom.
- Corrected earlier budget omission: receipt gas buys at 1e9 yocto/gas while observed block burn price is 1e8; gas and allowance refunds are distinct from upfront solvency.
- Transferred 0.20 Testnet NEAR from existing reserve A: provisioner 0.125, Lucien 0.025, Cassian 0.05; no other balance shortfalls.
- Increased eleven finite FunctionCall allowances to 0.125–0.25 NEAR with atomic same-public-key replacement; exact receiver/methods and all administrative permissions preserved.
- PASS: fourteen transactions and receipts FINAL-success through FastNEAR and dRPC; exact fee/balance reconciliation and independent post-operation account/key checks.
- PASS: contract balance/code/state/pool/capacity/access keys unchanged. Remaining reserves 15.79982145395 NEAR. No new accounts, faucet, secret exports or Render changes.
- Evidence/docs: evidence/runtime-gas-funding, docs/RUNTIME_GAS_FUNDING.md; funding/key/deployment status references updated. No builds/regressions needed for this operational-only pass.
- Stopped after funding verification. Old provisioning hash remains unknown; nonce-advanced pending journal requires safe reconciliation in a later authorized gameplay pass. No gameplay, commit or push.

## Provisioning reconciliation — BLOCKED
- Inspected Render SQLite in a read-only transaction: zero campaigns, sessions, history, states, archives or activity records; one broadcast transaction and one pending provision job.
- Both Testnet RPC providers: no campaign/world/tombstone storage; zero liabilities/allocated treasuries; unchanged pool 1.15 NEAR; capacity 5 with all five slots available.
- Original signed nonce 277462237000001 is below current key nonce 277474089000000. Transaction never executed (pre-inclusion balance rejection and unchanged full state), is not yet age-expired, and can no longer execute.
- No campaigns exist to settle/archive/reclaim. Original signed record and database history retained unchanged; record digest and finalized read-only evidence saved.
- STOPPED at existing backend recovery limitation: no terminal transition for proven non-execution plus obsolete nonce; pending job blocks New Game. Safe evidence-preserving journal/job reconciliation under exclusive ownership is required.
- No resubmission, replacement transaction, DB mutation, funding, contract/app changes, deployment, commit or push. See docs/PUBLIC_DEPLOYMENT.md and evidence/provisioning-reconciliation/read-only-verification.json.

## Stuck provisioning correction — local verification
- Added provisioning-only terminal recovery requiring exact signed identity, two independent UNKNOWN_TRANSACTION checks, finalized newer nonce and absent world/permanent tombstone.
- Atomic SQLite journal/job transition runs inside existing exclusive service writer/provision queue, preserves signed bytes and proof, and allows a fresh campaign identity/current nonce.
- Other uncertain transactions and payments remain blocked/reconciled by existing rules; no schema, contract, gameplay, funding or credential changes.
- PASS: one focused regression including fail-closed uncertainty/tombstone/provider cases and fresh nonce, 47 affected backend checks total; production Testnet frontend build.
- Next: secret scan, push reviewed correction, deploy existing Render service, verify one fresh New Game and independent FINAL receipt. No broad suite requested or run.

## Quit Campaign — local PASS, not deployed
- Added owned-session/revision-checked Quit and confirmation in the playable Testnet game menu.
- Explicit Quit bypasses inactivity delay only; existing settlement, archive and reclaim preserve the original outcome, obligations and history.
- Durable pending closure resumes safely through Check settlement, including cached sessions and reload; duplicate Quit controls stay disabled.
- Title returns only after verified reclamation; existing reset/session rotation permits fresh New Game subject to admission quotas.
- PASS: 32 focused cleanup/entry tests, 29 backend/security/startup tests, Testnet production build.
- PASS: one real local Sandbox test — paid lease, immediate quit, lost finalized reclaim response, SQLite reopen, zero obligations, replay rejection and fresh campaign in the freed slot.
- PASS: local UI fixture confirmation/cancel/pending/title/New Game; no chain claims from this fixture.
- Reviewed requirements and safety guidance; updated README and deployment notes. No contract, credentials, Testnet, Render, commit or push changes.
- Next: deploy only with approval and verify hosted Quit; public acceptance is not claimed.
