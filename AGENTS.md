# AGENTS.md — We Inherit Night

Scope: this repository. Read this file automatically at task start; do not paste it into replies.

## Mission
Ship a playable, verifiable NEAR testnet vertical slice of a gothic dynasty strategy game by 2026-11-14 23:59 UTC. **Gameplay comes first; NEAR must enforce consequential rights and transactions.** See `PROJECT_REQUIREMENTS.md` for product decisions, `HACKATHON_REQUIREMENTS.md` for submission rules, and `CODEX_START.md` for the initial task.

## Work style / token budget
- Prefer the smallest correct implementation. Make one focused vertical slice at a time; no speculative features, huge refactors, broad research dumps, or placeholder systems presented as real.
- Inspect repo structure, package manifests, and relevant files **once** before changing code. Search by filename/symbol; avoid repeatedly reading entire files, huge logs, `node_modules`, build artifacts, or lockfiles.
- Before implementing: state a 3–6-line plan only when changes are nontrivial. Then implement. Do not ask routine questions already answered by project docs.
- Choose existing utilities/dependencies when fit; do not install an agent framework, monorepo framework, UI component library, or chain-abstraction SDK without a demonstrated need.
- Keep responses short: changes, tests with PASS/FAIL/NOT RUN, blockers, next one task. No repeated summaries of requirements; no motivational filler.
- Prefer targeted tests first. Run full checks only for a milestone or when necessary. Cap verbose command output; report the meaningful failure lines. Do not claim tests ran if they did not.
- Don't spawn parallel agents by default; no recursive research. Don't browse unless documentation, APIs, or dependencies require verification. Cite doc links in architecture notes, not lengthy summaries.
- Maintain `PROGRESS.md` at each completed milestone (5–12 lines: done, tests, next, known risk). Keep user-facing answer separate and concise.

## Risk-based, change-scoped verification — user direction

Applies to all remaining work. Preserve the existing suite and all required security, contract-authority, transaction, payment and persistence checks; never weaken tests to reduce verification time.

1. Run targeted tests for changed functionality and the production build.
2. Run the full automated regression suite at pass completion or when shared systems change.
3. Run Sandbox integration tests only for affected contract interactions unless contract logic or shared execution infrastructure changes.
4. Do not repeat full seven-night browser walkthroughs unless campaign-wide behaviour changed, a critical regression requires it, or the user explicitly requests one.
5. Do not repeatedly inspect unchanged UI, genealogy, technical disclosures, accessibility or previously verified mechanics.
6. Prefer automated state assertions over manually navigating numerous screens.
7. If a long-running browser or Sandbox process stalls, diagnose it once, resolve the problem, and avoid repeated polling without a specific reason.
8. Reuse valid verification evidence where relevant code has not changed. Clearly distinguish previously verified behaviour from newly verified behaviour.
9. Leave unrelated defects alone unless they block the requested work or represent a critical security, data-loss, payment or authority-enforcement issue.
10. Keep final reports concise: changes, tests run, PASS/FAIL results and known limitations.

Stop additional verification once required acceptance criteria pass. Prioritize completing the requested implementation over exhaustive exploratory testing. Documentation-only instruction updates do not require application builds or runtime tests.

## Rules of authority (non-negotiable)
- NEAR contract is authoritative for ownership, leases, economic balances, and delegated/revoked rights. UI/backend/LLM cannot assert these without contract verification.
- Deterministic engine owns game resource and turn calculations. LLMs propose **typed actions** only. Validate schema, identity, permissions, economics, nonce/expiry, and game rules before any signing.
- Never trust claimed actor IDs from user input. On-chain mutations must authenticate the **transaction predecessor** or a separately verified authorized capability.
- Genealogy never automatically implies economic authority. Revoking a *derived* grant invalidates its descendants; independently owned assets and independent grants remain intact.
- NEAR function-call keys are method/receiver/gas-limited, **not** the game's spend policy. Contract-enforced limits and escrow accounting are mandatory. Avoid unrestricted private keys in model context.
- No faked on-chain activity: demo/mocks must be clearly labeled. Never print fabricated transaction hashes, deployment IDs, AI-provider decisions, or verification claims.

## Safety and operational boundaries
- Default to local sandbox and **NEAR testnet only**; no mainnet or real funds.
- Do not sign, deploy, fund accounts, publish/force-push, make repo public, post on X, or submit hackathon forms without specific user approval.
- Never commit private keys, mnemonics, API keys, `.env`, generated account credentials, or personal data. Provide `.env.example` with placeholders only. Do not log secrets.
- Don't use a central admin override to bypass core permissions after initialization. Any demo seeding privilege must be isolated, minimal, and disabled in production design.
- Preserve existing work. No destructive git operations unless directly requested. Record limitations and unresolved threats instead of claiming security is solved.

- Pass 1 economy: retain Blood and transitional Exposure; no fictional Coin, spendable Influence or resource-purchased political authority. Finite discoveries are information, not rights/votes. New Pass 2C campaigns use one major action per night and automatic reckoning over seven nights; legacy saves retain their old rules. Deterministic agents are the MVP; keep the LLM provider disabled. Eight-seat voting remains Pass 3; cutscenes belong to Pass 2D.

## Engineering expectations
- Prefer TypeScript for app and agent runner, Rust + `near-sdk` for contract, and official NEAR tooling when verified compatible. Pin dependencies after checking currently available versions.
- Test negative cases: unauthorized call, revoked ancestor, unrelated independent right, overspend, replay/double action, expiration, wrong actor, and turn-order safety.
- Accessibility: keyboard-operable room navigation, visible focus, readable contrast, reduced-motion-safe UI. Mobile-friendly.
- Mark each feature `IMPLEMENTED`, `PARTIAL`, or `PLANNED` in README. Clear 'do X, see Y' judge instructions; never exaggerate.
- Favor data-driven room/character definitions over hardcoded UI duplication; separate domain, chain adapter, agent policy, and presentation.

## Definition of done for a milestone
Code builds (or exact blocker documented); relevant tests run and results disclosed; a human can reproduce the feature; docs and `PROGRESS.md` updated; no secrets; no simulated outcome described as a verified chain result.

## Persistent documentation maintenance
- At the end of every development task, review this file, `PROJECT_REQUIREMENTS.md`, `HACKATHON_REQUIREMENTS.md`, `README.md`, and milestone progress documentation.
- Make targeted updates only where actual changes or evidence affect documentation; record completed/remaining work, failed checks, and limitations.
- Keep requirements synchronized with implemented architecture; never mark completion without evidence or change externally verified hackathon rules without confirming their source.
- Preserve existing decisions unless explicitly superseded, and include documentation changes in the final task summary.

## Engineering Standards — Senior-Level Code Quality

Write code as an experienced senior software engineer would on a well-maintained production project.

Prioritize clarity, cohesion, simplicity, security, and long-term maintainability.

### Architecture and Organization

- Use a clear, conventional directory structure appropriate to the technology stack.
- Organize code by responsibility and feature, not arbitrary file-size limits.
- Maintain explicit boundaries between presentation, game logic, AI decision-making, and NEAR contract interactions.
- Prefer established framework conventions over custom architecture.
- Keep related logic together when practical.
- Avoid unnecessary indirection, abstraction layers, factories, wrappers, and dependency injection.
- Do not create a new file for every function, interface, or component.
- Avoid deeply nested directories and excessive barrel exports.
- Do not introduce design patterns without a concrete problem they solve.
- Prefer straightforward functions and modules over elaborate class hierarchies.

### Code Quality

- Use descriptive, consistent naming.
- Keep functions focused without fragmenting simple operations into excessive helpers.
- Avoid duplicated business logic.
- Use strong TypeScript typing; avoid `any` unless justified.
- Handle errors explicitly and predictably.
- Keep comments focused on intent, non-obvious behavior, security assumptions, and important constraints.
- Do not add comments that merely restate the code.
- Do not leave speculative TODOs, placeholder implementations, or dead code.
- Avoid introducing dependencies for trivial functionality.

### NEAR and Security

- Treat the Rust contract as the authority for on-chain ownership and delegated rights.
- Never rely on frontend checks for authorization.
- Keep contract interfaces small, explicit, and auditable.
- Separate deterministic rules from AI-generated decisions.
- Avoid hidden state changes and unnecessary cross-contract complexity.
- Document security assumptions where they matter.

### Refactoring Discipline

- Modify existing code rather than creating parallel implementations.
- Remove obsolete code when replacing functionality.
- Avoid broad refactors during narrowly scoped tasks.
- Preserve working behavior unless explicitly changing it.
- Do not optimize prematurely.
- Prefer the simplest implementation that satisfies the actual requirements.

### Repository Hygiene

- Maintain a clean, predictable project structure.
- Keep generated files, build artifacts, temporary outputs, and credentials out of version control.
- Use consistent formatting and linting.
- Avoid unnecessary configuration files.
- Keep documentation accurate and proportional to the project.

### Before Completing Any Task

Review the changes as though preparing a pull request for an experienced engineering team.

Ask:

1. Is this implementation simpler than it needs to be?
2. Have I introduced unnecessary files, dependencies, or abstractions?
3. Does the code follow established conventions?
4. Are security boundaries explicit?
5. Can another developer understand the structure without an explanation from the AI?
6. Did I create duplicate functionality?
7. Are tests focused on meaningful behavior?
8. Is the implementation appropriate for the current project scope?

Correct material issues before reporting completion.

**Default principle: Build the smallest coherent system that solves the actual problem. Do not confuse architectural complexity with engineering sophistication.**

Do not overengineer for hypothetical future requirements. Design clean extension points only where current requirements justify them.

AI vampire NPCs are runtime game agents, distinct from Codex development agents. Implement their behaviour according to the character definitions, game mechanics, and authorization rules. Never substitute scripted dialogue for autonomous decision-making without explicitly documenting that limitation.

## Pass 2A continuity
- Read `VAMPIRE_AGENTS.md` and `GAME_RULES.md` before changing vampire behaviour.
  Preserve CANON/PROVISIONAL/TBD/CONFLICT distinctions and independent Volari authority.
- `src/agents.ts` is the single NPC proposal/validation boundary. Decision sources
  receive `AgentObservation`, never the full campaign, clients or credentials.
- Keep the persisted one-turn-per-NPC-per-night dawn journal and confirmed-outcome
  recovery. Pass 2A policies are deterministic, not autonomous AI; live decisions
  and negotiation belong to Pass 2B, council voting to Pass 3.

## Pass 2C continuity
- New version-3 campaigns use the private `new_political` Sandbox bootstrap; never
  invent new chain rights while migrating old saves. Version-2 campaigns remain playable.
- `src/politics.ts` defines opportunities, seeded event selection and rights-based
  endings; `src/agents.ts` remains the single NPC validator. The runtime must not
  invoke the preserved provider adapter, even if old environment flags are set.
- Persist automatic reckoning with the player decision; verify transactions before
  advancing. Preserve independent roots and fixed-term sanctuary semantics.
- New authority assignments/minor characters are PROVISIONAL gameplay decisions,
  documented in docs/PASS2C.md, not fabricated historical canon. No cutscenes here.

## Pass 2D continuity
- `src/encounters.ts` projects verified results into presentation only; `VampireEncounter.tsx` owns dialogue and browser-only viewed state. Never authorize actions from scene storage.
- Route explicit choices through existing validated actions. Skip/continue/inspect must not commit. Preserve provisional dialogue and replaceable portrait references.

## Pass 2E continuity
- Title entry may read save metadata only. Do not eagerly start the bridge or recover a campaign until New Game/Continue is selected.
- Keep intro prose/progress separate from authoritative state. Replacement requires explicit confirmation and the existing revision-checked reset.

## Pass 2G continuity
- src/story.ts is presentation only: directed incidents, free branches and Decision
  choices must resolve to existing actions, never new rights or campaign state.
- Keep ordinary Lounge/Library access distinct from shelter and final protection.
  Explain Blood/Exposure defeat even when other rights remain valid.
- Dialogue attitudes are free and penalty-free; newly authored lines are provisional.

## Local startup continuity
- Keep prologue visibility separate from verified campaign readiness in timings.
- Faster block/GC settings apply only to newly created disposable Sandbox homes;
  never apply them to public networks or remove FINAL checks to improve timings.
- Windows runner bundling is code-only; title inspection must remain read-only.
  See docs/STARTUP_PERFORMANCE.md; restart the preview after backend edits.

## Pass 2H continuity
- New Living Court campaigns use optional politics.library; never migrate old rights into the new bootstrap.
- library.ts derives fixed scoped operations; agents.ts validates NPC proposals; campaign.mjs journals and verifies before publishing consequences.
- No Rust changes or full-access NPC spending keys. New NPC-funded purchases/earnings are explicitly deferred; do not fabricate payments.
- livingCourt.ts is provisional presentation only. Material risks remain visible; technical detail is optional. See docs/PASS2H.md.

## Pass 2I continuity
- VISUAL_CANON.md governs presentation; preserve supplied art and label provisional generated interiors and symbolic portraits.
- PORTRAIT_ASSETS and ROOM_ASSETS are replaceable art references only. Scene/chapter animation and current-speaker portraits never authorize actions or write game state.
- Keep the existing encounter director, material terms and optional technical disclosures. Reduced-motion rules must disable all decorative motion. See docs/PASS2I.md.

## Pass 3A continuity
- livingCourt.ts projects seven chapters, contextual room records and distinct provisional voices from recorded state; it cannot authorize actions or recompute endings.
- Preserve existing scene IDs and free-question semantics. No invented affinity effects, private NPC knowledge, physical presence, archive scandals or ancestry.
- Research is provisionally framed as present Library obligations; specific historical evidence remains TBD. Keep final-night finish/withdraw choices and material terms visible. See docs/PASS3A.md.

## Pass 3B continuity
- reactiveCourt.ts projects completed journal/ledger evidence into the existing director. Stable reaction IDs and browser-only read memory never authorize or execute actions.
- Keep NPC observations minimal: public ledger, own access/memory/agreements and validated choices; do not restore unrestricted Politics or other actors' private decisions.
- Actor priorities remain deterministic; Dorian's rival petition requires a live rival and enough time to switch and finish. No extra NPC phases or recursive reactions.
- Relationship descriptions are explicit recorded arrangements, not invented grudges, secrets or physical presence. Current one-major-action design remains. See docs/PASS3B.md.

## Pass 3C continuity
- Epilogues and consequence terms project recorded decisions and effective rights; never recalculate victory or infer a payment from dialogue.
- Keep Exposure visible, secondary records collapsed, and mobile portraits proportional with reachable scrolling choices. Private NPC memory is not player-facing diagnostics.
- Pass 3C was PARTIAL at completion: NPC-to-NPC purchases/treasuries were unimplemented. Do not claim Seraphine collecting player-paid rent meets that acceptance requirement. The original proposal is recorded in docs/PASS3D_HANDOFF.md; the narrowly implemented successor is documented below.

## Pass 3D continuity
- Only new `dangerous` campaigns carry optional `politics.finalCourt`; never fund or invent new rights during migration. Existing campaigns retain old policies.
- `finalCourt.ts` fixes the final demand and one Cassian–Lucien paid passage. `agents.ts` remains the only NPC validator; campaign journal confirms outcomes before publication.
- Narrow Rust extension: one exact self-funded passage mandate in separate versioned storage, same predecessor/nonce authority; no serialized World layout change. Runtime NPC keys remain restricted. Acceptance atomically debits mandate into rent escrow plus lease rights; seller payout is separate.
- Old blanket NPC-economy deferrals describe earlier passes. This single bounded Sandbox agreement supersedes them; recurring income, arbitrary purchases and unrestricted wallets remain prohibited. See docs/PASS3D.md.

## Pass 4B.1 continuity
- Locked architecture: one deployed contract, many isolated on-chain campaigns; no factory or per-player deployment.
- Authority registry exports require campaign_id; World remains the internal authority implementation. Budgets and callbacks must remain campaign-scoped.
- Private creation reserves bounded storage and excludes escrow liabilities from available backing. No runtime owner override or public provisioning endpoint.
- Persist contract/campaign bindings before recovery. Do not automatically upgrade old single-World Sandbox saves into the incompatible registry layout.
- Shared actor accounts confer only the rights assigned in each World; function-call keys cannot restrict campaign arguments. Never reuse identities implicitly.
- No Testnet deployment in 4B.1; see docs/PASS4B1.md for results and remaining provisioning risks.

## Pass 4C.2 continuity
- Measured storage accounting supersedes 4B.1 fixed reserves locally. Keep pool, campaign treasuries and pending financial liabilities excluded from storage backing.
- Provisioning policy/funding remain private operator operations; runtime open_campaign uses a distinct restricted identity and immutable roster/limits. Shared actor identities require trusted session authorization; campaign IDs are never credentials.
- Prepaid accept_lease uses zero deposit and existing lease validation. Legacy attached-deposit campaigns remain supported; no unrestricted runtime payment signer.
- Complete only after seven nights and financial settlement. Archive/reclaim must preserve paid terms, reject pending callbacks, retain replay tombstones and keep the committed SQLite history.
- New registry layout is not a verified migration of current Testnet state. No automatic upgrade or deployment. See docs/PASS4C2.md.

## Pass 4E continuity
- One Render Node 24 service serves the frontend and API; /var/data/night holds
  SQLite, journals and OS-released writer lock. No second writer or ephemeral DB.
- Protected environment keys are restricted runtime keys only. Verify the exact
  roster at startup and permissions before each call; never allow FullAccess fallback.
- Payment affordability uses campaign treasury when prepaid. Preserve signed
  identity before submission and block uncertain broadcasts until FINAL evidence.
- Public API projection strips NPC memory/private journals; durable request and
  creation limits and bounded in-flight work remain. No public admin endpoints.
- Local sizing supports an initial Starter trial, not verified hosted capacity.
  No deployment, live credential installation or live gameplay in this pass.
  See docs/PASS4E.md; do not treat its setup instructions as deployment approval.

## Campaign capacity continuity
- Capacity changes use private set_campaign_capacity on the existing policy field;
  no migration/reinitialization, runtime operator authority or larger storage cap.
- Cleanup freezes actual outcomes after recovery, serializes with gameplay and
  uses existing restricted clock/settlement/archive/reclaim calls. Never fabricate
  NPC turns or endings; retain unknown outcomes, financial obligations and tombstones.
- Default inactivity is 24h with durable activity and disclosed closure; configuration
  stays bounded. The verified WASM is now upgraded and funded on Testnet with max_active=5;
  backend/hosted gameplay is not deployed or verified. Do not reinitialize. Expansion
  remains funding/gas/measurement-limited. Current pool is 1.15 Testnet NEAR;
  keeper/Seraphine allowances are 0.10/0.075, other nine 0.05. Same keys/methods.
  See docs/TESTNET_FUNDING.md; no implicit additional funding or hosting approval.

## Installed runtime key continuity
- Eleven receiver-specific restricted Testnet keys are installed; use the public
  manifest/config in evidence/runtime-keys and docs/RUNTIME_KEYS.md. Preserve all
  existing keys; do not regenerate, reinstall, rotate or delete them implicitly.
- Private runtime JSON is DPAPI-encrypted outside Git. Never read it into model
  output, logs, evidence or frontend assets. Render upload remains operator-controlled.
- No hosting approval follows from key installation. Scoped production import
  review found no demonstrated issue requiring source removal; do not general-clean.
