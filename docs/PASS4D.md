# Pass 4D — PARTIAL

Deployment verified on Testnet (evidence timestamps: 2026-11-13 UTC). Runtime
integration is **BLOCKED**, not publicly playable. The user explicitly chose
“Report the runtime blocker after deployment” rather than preparing `win-runtime`.

## Verified deployment

New contract: `night.we-inherit-night.testnet`. Separate authorized creator:
`provisioner.we-inherit-night.testnet`. Both names were explicitly approved,
queried absent, then created with independent Windows-keychain credentials.

Approved artifact: `target/near/night_authority/night_authority.wasm`, **579,736 bytes**.
SHA-256: `99f0deeac2fc7e95080d92656b87c0a1515311201d065c8588eacc25b35e05f0`.
Independent RPC `view_code` bytes match this checksum. No Rust changes or rebuild.

| Operation | Finalized transaction hash |
|---|---|
| Retained funding account → parent, 3.86 NEAR | `H8WRwHwzXArxBuzCUqNyJbr5ckeCs1b1cTSqAVrLft6W` |
| Create/fund night, 6.10 NEAR | `2Xjuv9CoZyNBR4JzXjS4jq3zUG4jf6wCzPtDLqYsMruC` |
| Create/fund provisioner, 0.05 NEAR | `Bc5YxHGiEHBSXj5pKkHeRWUb43GgpUY8fenupijFV7QS` |
| Deploy | `FvPeCpDbNF1pNSJZaVZfWPvWbRZatKtw3hWZxHbQw6aS` |
| new_registry | `9V8F64vK7EqkDN3VN4YV1tUFcCQXiwwWVy7U1esEkqHC` |
| configure_provisioning | `DNLAW7oHnYZbaTJqLmhWqpeM6B1R3SWUCBmJq9XjQze` |
| fund_pool | `E7ezLe9ZBjAteTutcUYut6S6qBeDJjZMNdtCPX3omGb7` |

[Deployment explorer](https://testnet.nearblocks.io/txns/FvPeCpDbNF1pNSJZaVZfWPvWbRZatKtw3hWZxHbQw6aS).
Evidence: `evidence/pass4d/`: preflight, intended actions, exact signed-key checks,
independent FINAL transaction/receipt results, deployed-code verification and
`final-verification.json`. All seven included transactions succeeded without
receipt failures. Signed identity was recorded before broadcast; none was blindly retried.

## Funding and provisioning

No faucet request, purchase or new external funding was needed. Previously retained
Testnet funds covered deployment. Pool funding is an internal allocation of the
6.10 NEAR contract balance, not additional incoming wealth.

| Account | Final RPC amount (NEAR, includes storage backing) |
|---|---:|
| night.we-inherit-night.testnet | 6.0951742617979837 |
| provisioner.we-inherit-night.testnet | 0.05 |
| we-inherit-night.testnet | 0.1175051360125 |
| win-funding-20261112-a.testnet | 0.0243815173787693 |
| castle.we-inherit-night.testnet | 11.1357778046366181 |

Protocol storage price: 10^19 yoctoNEAR/byte. New contract uses **580,451 bytes**,
requiring **5.80451 NEAR** backing (WASM alone: 5.79736 NEAR). Contract transactions
consumed 0.0048257382020163 NEAR from its initial balance. After measured storage
and the 0.15 NEAR pool, remaining balance is **0.1406642617979837 NEAR** for storage
growth and operating headroom; it is not campaign spending money.

Independently decoded finalized registry STATE confirms zero active campaigns,
zero treasury/liability totals and pool **0.15 NEAR**. Immutable policy: creator
`provisioner`, ten existing role accounts (Vesper, player, keeper, Seraphine,
Marius, Lucien, Mirelle, Dorian, Cassian, Sabine), **four concurrent active worlds**,
minimum **ten blocks** between creations, **0.04 NEAR player treasury** per world.
Existing bootstrap also allocates **0.01 NEAR passage funding**: pool covers three
initial allocations before recycling/replenishment. Four is not a lifetime play
limit. Backend's existing creation throttle remains separate. Actual new-world
storage and restricted-key gas costs still need live measurement.

Old `castle` code hash, storage usage and balance match preflight exactly. It was
not upgraded, funded, initialized or used for transactions. Its prior campaigns
and financial obligations remain in place; this pass does not claim settlement.

## Runtime signing and integration boundary

CLI 0.31.1 and existing NEAR JavaScript tooling were reused. Administrative setup
used exact-key, offline prepared transactions with decoded actions and signature
verification before broadcast, followed by independent finalized RPC checks.
Private keys were neither exported nor written to project files. Existing keys
were not rotated or replaced.

Initial high-level offline transfer preparation stalled **before signing output
or broadcast**. Supported low-level CLI Transfer construction succeeded instead;
the successful transfer above is the only funding transfer. This was not an
uncertain on-chain payment retry.

`scripts/testnet/signing.mjs` and `.env.example` now target the new contract.
The existing exact-key runtime checks and dedicated-user gate are unchanged.
Public runtime must not run as `gauge`, whose keychain contains administrative
credentials. The separate `win-runtime` identity/profile has not been prepared.
Neither new account has a runtime FunctionCall key installed; their verified
single FullAccess keys are administrative only. No runnable configuration was
fabricated with these administrative keys. Runtime player/NPC/keeper/provisioner
keys for the new receiver must be generated in the dedicated user's credential
store and installed through the separate administrative process.

Shared actor identities still require trusted backend session authorization:
FunctionCall keys do not constrain campaign arguments. Existing SQLite session
ownership, journals, recovery, deterministic engine, prepaid payment and lifecycle
code are preserved, not replaced by administrative transactions.

## Verification results

| Check | Result |
|---|---|
| New accounts, funding, code checksum, registry and policy/pool state | PASS, real Testnet RPC/FINAL receipts |
| Old castle unchanged | PASS, independent RPC comparison |
| `node --test tests/testnet-backend.test.mjs tests/backend-lifecycle.test.mjs` | PASS 7/7; local fixtures, not real gameplay |
| Production build, VITE_MODE=testnet and VITE_TESTNET_BACKEND=1 | PASS (TypeScript/Vite) |
| Restricted provisioner creates a campaign | BLOCKED: runtime identity/keys |
| Player payment and autonomous NPC Testnet actions | NOT RUN; no gameplay transaction hashes |
| Two independent browser visitors and conflicting decisions | NOT RUN |
| Live reload/backend restart/seven-night completion/archive/reclaim/replay | NOT RUN |
| Full Rust/Node/Sandbox regression suites | NOT REPEATED: unchanged approved artifact; reuse Pass 4C.2 evidence |

Previously verified **local** 4C.2 evidence: 23 Rust, 100 Node, 52 executed Sandbox
cases and two complete independent campaigns with lifecycle/replay. These do not
establish live Testnet gameplay acceptance. Focused tests cover session ownership,
restart persistence, exact signed payload validation and interruption recovery;
no simulated transaction is presented as a Testnet result.

## Next steps and hosting requirements

1. Prepare standard `win-runtime` Windows login/profile; keep its password private.
   Generate only restricted runtime keys there, install their public keys for the
   new contract using administrative tooling, and verify keychain access under
   the actual service logon. Do not copy provisioning credentials.
2. Configure existing Node service with private durable SQLite/journals, the new
   contract, approved roster and exact restricted public keys. Exercise live
   provisioning, prepaid payment, NPC execution, two visitor sessions, restart,
   seven-night completion, settlement, archival/reclamation and repeat play.
3. Only after acceptance and separate public-launch authorization: use one
   persistent Windows host, dedicated runtime identity, Node 24 and verified CLI,
   loopback Node listener, filesystem ACLs/backups, and HTTPS reverse proxy.
   A modest 2-vCPU/4-GB host is an initial sizing proposal, not a load-tested claim.
   Caddy can terminate TLS with a domain, correct DNS, reachable ports 80/443 and
   persistent certificate data; preserve the Host/origin checks, secure cookies
   and same-origin API. Configure finite gas/pool monitoring and abuse limits.

Windows credential access follows the current logon token, and network logons
lack a credential set: [Microsoft CredRead documentation](https://learn.microsoft.com/en-us/windows/win32/api/wincred/nf-wincred-credreadw).
Service-profile/keychain portability therefore remains **unverified**.
[Caddy HTTPS requirements](https://caddyserver.com/docs/automatic-https).
No hosting was purchased or deployed, and no public-readiness claim is made.

Pass-specific tracked changes: signing receiver constant, `.env.example`, this
report, deployment/status documentation and public `evidence/pass4d/` receipts.
Temporary administrative preparation stayed under ignored `.local`. No Rust,
gameplay, narrative, artwork, existing saves or Git history changed in this pass.
