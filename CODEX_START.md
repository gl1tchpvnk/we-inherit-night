# Codex prompt 01 — We Inherit Night: authority first

**Paste the entire content of this file into Codex in a new repository containing `AGENTS.md`, `PROJECT_REQUIREMENTS.md` and `HACKATHON_REQUIREMENTS.md`.** This is an instruction to implement, not to merely write a plan.

You are starting **WE INHERIT NIGHT**, a browser-based gothic social/dynasty strategy game for the NEAR Hackathon's `games` track. The central gameplay conflict is that a vampire can inherit *access* from a sire but must be able to gain independently owned power that the sire cannot revoke. Autonomous rival vampires will later negotiate property and authority using constrained NEAR accounts.

**Read** `AGENTS.md`, `PROJECT_REQUIREMENTS.md`, and only the relevant sections of `HACKATHON_REQUIREMENTS.md` before working. Inspect existing files; never overwrite useful existing code. The deadline is November 14, 2026, 23:59 UTC.

## Your task: ship Milestone 1, a thin vertical slice

**Success demo:** Lady Vesper gives the player access to the Ancestral Crypt. The UI shows the crypt open. Vesper revokes her *delegated* grant; the crypt is now inaccessible to that player, and a forbidden on-chain room-access action fails. A separate independently owned room/right remains usable. The success and failure must be established by tests of the actual contract, **not** a UI-only permission flag.

### Step A — verify architecture before implementation (brief)
1. Check latest official NEAR docs and currently installed toolchain before choosing versions. Use Rust + `near-sdk` for the contract and a lightweight TypeScript + React/Vite frontend, unless a concrete incompatibility requires an alternative. For wallet integration, review the current recommended connector; do not assume older Wallet Selector is preferred.
2. Create `docs/ARCHITECTURE.md` (max ~100 lines): trust boundaries, account/key model, contract entities, interface between client/contract/agent, testnet deployment plan, and an explicit decision on **on-chain native NEAR vs internal demo credits** for the later property economy. Do not conflate gas allowance with spending authority.
3. Create `docs/THREAT_MODEL.md` (max ~70 lines): unauthorized actor, recursive grant, stale rights, revoked ancestor, replay, double-spend, malicious LLM output, compromised agent function-call key, turn race, admin upgrade, and private keys. Identify mitigations and residual risks.
4. If tool/docs can't be reached, work from verified local capabilities; mark technical assumptions `UNVERIFIED` and don't invent current SDK versions.

### Step B — implement contract first
Create the smallest Rust contract representing:
- A world with one authoritative owner for each room/property (e.g., Crypt, Library).
- A **permanent ancestry edge** (sire -> descendant) that **does not itself grant authority**.
- An explicit scoped access grant `{id, property_id, grantor, grantee, parent_grant_id?, can_delegate, expiry_night?, revoked}`.
- A grant may be created only by a current property owner or a grantee holding a valid, delegable parent grant; nested grants may not exceed parent's scope or expiry. Cap depth or use an auditable bounded walk. Reject self-grants/cycles where relevant.
- Only a legitimately authorized grantor can revoke the specific grant it controls; derived access becomes ineffective if any ancestor is revoked. Independent property ownership and separately rooted valid rights **survive** such a revocation.
- Access query method(s), and a state-changing `enter_room`-style action that asserts access using the authenticated NEAR caller (not an untrusted parameter). Emit readable events for successful grants, revocations, and access actions.
- Stable readable views designed for the room map and future bloodline tree.
- Minimal initialization/seed mechanism for **local tests**; never leave a generic administrator bypass around rights checks.

Use NEAR account IDs and contract-native authentication. Mark any deferred transaction/economy design explicitly rather than pretending a mock ledger is financial settlement.

### Step C — tests before visual polish
Write and run focused contract tests demonstrating:
1. Sire owns Crypt, grants access to child, child can enter.
2. Sire revokes that grant, child can no longer enter; forbidden transaction rejects.
3. Grantor delegates through child to grandchild; ancestor revocation invalidates both derived grants.
4. Independently owned Library (or separately rooted direct right) still works after Crypt revocation.
5. Unrelated account cannot mint/revoke rights; grantee cannot exceed delegated scope or expiry.
6. Genealogy edge alone never opens a room.
7. Repeated/stale actions cannot restore a revoked grant.

If feasible, exercise the contract with NEAR Workspaces sandbox; report whether tests are unit-only, sandbox-integrated, or real testnet. Do not silently substitute mocks for chain execution.

### Step D — minimal browser prototype
- Build one gothic **clickable, keyboard-accessible** castle map with Crypt and Library and placeholder rooms (Crimson Lounge, Hunting Grounds, Council Chamber), a basic bloodline panel, and a court event log.
- Display **contract-derived** lock/unlock states through a typed chain adapter. Provide a clearly labeled local sandbox/demo mode if not connected to testnet.
- Establish config for `testnet`, RPC endpoint, contract ID, and wallet connector without hardcoded credentials. A deploy script and `.env.example` are fine. **Do not deploy or sign any transaction without explicit user approval.**
- UI can be visually restrained: gothic blacks, parchment/off-white, burgundy accents; no generic bright crypto dashboard. Don't spend this task on custom art/animations.
- In `README.md`, document exact commands to build/test/run, testnet deployment prerequisites, and `DO X -> SEE Y` reproduction steps. Distinguish local simulation from testnet verification.

### Step E — stop at checkpoint
Create `PROGRESS.md` with completed pieces, test results, unanswered NEAR assumptions, and **one next recommended task** (likely property lease/payment escrow). **Do not implement** the full economy, LLM agents, NFT standards, full campaign, or account funding in this milestone unless essential to proving the access vertical slice.

When finished, reply in this format only:
- **Built:** 3–6 bullets.
- **Checks:** command + PASS/FAIL/NOT RUN (with reason).
- **NEAR proof:** exact type of evidence available (unit / sandbox / testnet + links if real).
- **Risks:** max 3 concrete items.
- **Next:** one narrowly scoped Codex task.

Do the work now. Do not stop after proposing a plan. Don't ask about colors or framework preferences already decided here.
