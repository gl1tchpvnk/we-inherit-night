# Pass 4C.1 — PARTIAL

Implemented locally on 2026-11-12. No public deployment, contract modification,
Testnet transaction, credential export, commit or push in this pass.

## Implemented and locally verified

- A single loopback Node 24 service serves the Vite build and gameplay API.
- SQLite WAL/FULL persistence stores hashed visitor tokens, unique campaign
  allocation, campaign revisions/NPC journals, and transaction recovery records.
- Random 256-bit session cookies are HttpOnly, SameSite=Strict, Secure by default.
  Explicit insecure-cookie mode is restricted to local development. Host/Origin,
  command shape, ownership and revision checks reject cross-session requests.
- Campaign allocation is transactional, never recycles worlds, and preserves the
  existing session when replacement capacity is exhausted. Title inspection does
  not allocate or query chain state. Verification campaigns cannot be imported.
- Existing `createCampaignSession` remains the gameplay/NPC engine. Its optional
  storage adapter writes SQLite; default file persistence preserves Sandbox.
- Frontend opt-in `VITE_TESTNET_BACKEND=1` with `VITE_MODE=testnet` uses same-origin
  gameplay requests. Existing Sandbox and read-only Testnet modes remain available.
- Signed identity is journaled before sending. FINAL outcomes must match the
  expected hash, signer, public key, receiver, method, arguments, gas and deposit;
  receipt failures remain failures. Unknown finality blocks recovery and further
  conflicting actions rather than resubmitting. Per-campaign and shared-actor
  queues serialize requests. A single-process writer lock protects the database.

## Implemented but not verified against live Testnet

`scenario.mjs` implements the engine interface with campaign-bound Testnet views,
allowlisted zero-deposit player/NPC calls, fixed receiver and bounded gas. It
reuses Pass 4B.2-FIX offline CLI exact-public-key Windows keychain signing and the
existing NEAR decoding dependency. It verifies the Ed25519 signature and complete
transaction before broadcast, and rejects FullAccess keys and unsafe nonces.
Provisioning is not exposed through an API.

`register.mjs` is a read-only administrative import: it checks fresh bootstrap
grants, offers, bounded passage funding and restricted access keys through RPC
before adding capacity. Imported visitor campaigns require distinct player
accounts. NPC identities may be shared; session authorization and contract
permissions remain necessary, and a compromised shared actor can affect every
campaign in which that actor has authority.

No fresh visitor campaign was provisioned or imported. No live signing or
transaction was performed by this backend. Earlier Pass 4B.2-FIX evidence proves
the signing technique for its tested operations, not this backend's acceptance.

## Blockers and custody boundary

1. The current Windows identity owns FullAccess provisioning credentials. The
   runtime refuses that configured identity. A separate Windows runtime account
   and keychain containing only restricted runtime credentials must be prepared.
   Username checks do not audit vault contents: the operator must enforce OS
   separation and filesystem ACLs. Existing credentials were not changed.
2. Fresh funded campaign capacity, distinct visitor player accounts, and the
   required runtime keys must be provisioned by a separate trusted administrator.
   `verification-a` and `verification-b` are preserved. Automatic provisioning is
   not implemented. Current funding capacity was not re-queried in this pass.
3. FunctionCall keys cannot attach deposits. Paid player lease acceptance is
   deliberately blocked before signing; a secure bounded deposit-signing service
   is **not implemented**. No FullAccess fallback exists. Therefore the full
   economic gameplay path is incomplete.

These are unresolved Pass 4C.1 acceptance items, not work claimed complete for
Pass 4C.2. No real transaction hashes exist for this pass.

## Local operation

Requires Node 24 with `node:sqlite` (experimental warning), installed project
dependencies, built frontend and official NEAR CLI for eventual live signing.
Use an ignored `.local/testnet-server.json`, without private keys:

```json
{
  "database": ".local/testnet-game/game.sqlite",
  "origin": "http://127.0.0.1:5190",
  "port": 5190,
  "secureCookies": false,
  "dist": "dist",
  "signing": {
    "cli": "C:/path/to/near.exe",
    "provisioningUsername": "PROVISIONING_USER",
    "runtimeUsername": "SEPARATE_RUNTIME_USER"
  }
}
```

PowerShell build/run:

```powershell
$env:VITE_MODE='testnet'
$env:VITE_TESTNET_BACKEND='1'
npm run build
$env:NIGHT_SERVER_CONFIG='.local/testnet-server.json'
npm run testnet:serve
```

With no registered capacity this safely serves the title and returns HTTP 409
when New Game requests allocation. Before registering capacity, stop the service
and complete trusted on-chain provisioning. Import using
`npm run testnet:register -- <database> <public-manifest.json>`.
The manifest contains `campaignId`, `contractId` (the existing castle Testnet
account), and `actors`: player, keeper, vesper, seraphine, marius, lucien, mirelle,
dorian, cassian, sabine; each has `accountId` and its restricted `publicKey`.
It contains no private credentials. Registration does not create chain state.

Keep database, signed transaction journals, configuration and backups private.
On Windows, POSIX file modes do not establish ACL isolation. Configure ACLs for
the runtime user. After a crash, confirm the PID recorded in `.writer` is no
longer the service before removing that lock; never start a second writer.
An unresolved broadcast remains blocked for operator/RPC reconciliation.

## Verification

| Check | Result |
|---|---|
| `node --test --test-concurrency=1 tests/*.test.mjs` | PASS 98/98; full suite warranted by shared persistence hook |
| `node --test tests/testnet-backend.test.mjs` | PASS 5/5, repeated after nonce safety guard |
| WSL Node `--test tests/sandbox/campaign.test.mjs` | PASS 1/1: seven nights, rights, persistence, replay |
| `npm run build` with Testnet backend flags | PASS TypeScript and production Vite build |
| Actual local service on 5190 | PASS frontend 200, read-only save metadata 200, empty capacity 409 |
| Two independent HTTP cookie clients and service/database reopen | PASS automated fixture; not two real browser campaigns |
| Delayed-response recovery | PASS controlled synthetic transaction, one send, pending retained until FINAL |
| Wrong signing key/arguments/signature and privileged identity | PASS local negative tests |
| Real player/NPC Testnet execution and two-browser campaign acceptance | BLOCKED by custody and fresh capacity |
| Real paid player agreement | BLOCKED by missing bounded deposit signer |
| Rust/full Sandbox/4B.2 signing investigation | NOT RUN; unchanged contract and prior evidence reused |

HTTP/game-state fixtures and synthetic signed transactions are explicitly local
tests, not evidence of Testnet activity. An initial HTTP restart test encountered
a stale pooled socket; the test now closes connections across restart. Final
tests pass. Logs: ignored `.local/pass4c1-node.log` and
`.local/pass4c1-sandbox.log`. No visual redesign or accessibility acceptance is
claimed; browser campaign verification remains outstanding.

## Changed files

- New: `scripts/testnet/{store,signing,scenario,server,start,register}.mjs` and
  `tests/testnet-backend.test.mjs`.
- Updated: `scripts/sandbox/campaign.mjs` storage/reconciliation hook;
  `src/chain.ts`, `src/GameEntry.tsx` backend routing/entry;
  `package.json`, `.gitignore`, `.env.example` configuration.
- Documentation: this report, README, PROJECT_REQUIREMENTS and PROGRESS.

Other existing working-tree modifications, including the completed seven-night
text correction and earlier contract migration, are not attributed to this pass.

## Before Pass 4C.2

Complete the three blockers, then perform the specified real player/NPC action,
two-browser isolation, reload/restart and transaction-recovery acceptance. Only
after those pass assess public hosting: HTTPS, OS credential custody, private
durable storage/backups, capacity/abuse controls and operational recovery. This
service is loopback-only and is not declared ready for public gameplay.
