# Shared restricted-actor recovery

## Correction

A campaign reconciled only its own transaction journal, while admission blocked on any unresolved transaction using the same restricted account. Consequently, an absent player's keeper transaction could strand other players at dawn and block their lifecycle operations.

The SQLite store now exposes nonterminal transactions by actor, retaining their owning campaign IDs. Recovery, foreground signing and periodic maintenance share the same actor queue. Journal updates always use the original owning campaign; recovery never loads a gameplay session, chooses an NPC action, signs a new transaction, or changes campaign ownership.

Before admitting a new transaction, the runtime reconciles that account's existing operations. Startup and the existing maintenance interval run the same recovery without requiring either player's return. Independent actors continue to reconcile even when one remains uncertain. Maintenance is awaited during graceful shutdown; the existing exclusive SQLite writer lock remains unchanged.

## Safety

- Verify original campaign binding, role/method allowlist, exact key, signature, transaction hash, arguments, receiver, gas and zero deposit before recovery.
- Query transaction status with `wait_until: NONE`, accepting only a validated `FINAL` result. This avoids waiting for a nonexistent transaction to become final before checking the recorded state.
- UNKNOWN_TRANSACTION alone never permits replacement, deletion or terminal classification.
- Identical-byte replay requires a currently valid restricted permission, an unconsumed signed nonce and a block reference still within the authoritative protocol validity window at a finalized block. No new signature is produced.
- Expired/consumed-nonce unknown transactions, malformed identities, partial receipts and RPC failures remain blocked with original evidence intact. There is deliberately no generic inference that an expired transaction never executed. Such cases need independently proven, method-specific resolution; they are not cleared to force availability.
- Finalized failed operations retain their actual outcome. Existing engine and lifecycle logic decides how to proceed; reconciliation does not fabricate success or settlement.
- Existing payment, refund, archive, replay and campaign-specific authorization remain unchanged.

## Local verification

PASS: 66 focused recovery/backend/lifecycle tests, including eight new shared-actor cases. PASS: full existing automated suite with the new cases, 179 tests. PASS: production TypeScript/Vite build. Loopback HTTP tests ran outside the shell socket restriction; no live transactions were involved in these tests.

Coverage includes A blocking B; B recovering A without A's session; maintenance with neither session; concurrent reconciliation; same signed identity; unknown/expired/mismatched/nonfinal outcomes; no new signing while blocked; subsequent progression; two independent abandonments through existing lifecycle with one claim/refund/archive/reclaim and preserved historical outcomes.

Existing Render configuration, accounts, keys, funding, contract and frontend remain unchanged in this deployment. Uncommitted narrative and UI work is excluded. Hosted results and operational evidence will be recorded separately after deployment.

## Authorized hosted scope

Only these campaigns may be permanently abandoned in this operation:

- `visitor-53e191e8-ac11-4440-8cbc-702164237aef`
- `visitor-4abbbeae-11dc-407f-ade2-70afb2f9c584`

Resolve their existing journal identities first, then use the existing Quit/settlement/archive/reclaim lifecycle. Do not force-clear pending state or delete rows. Verify final receipts independently and retain replay tombstones and SQLite archive commitments.
