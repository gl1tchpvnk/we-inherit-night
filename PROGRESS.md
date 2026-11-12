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
