# M1B — NEAR Sandbox verification complete

Verified 2026-11-07 on Ubuntu WSL2, NEAR Sandbox 2.14.0, protocol 88,
near-workspaces 5.0.0, Linux Node 24.13.0. No testnet/mainnet or real credentials.

M2 regression note: all nine cases passed again on the extended contract.
`evidence/m1b-sandbox.json` is the latest run and now records the M2 WASM hash;
the artifact size/hash/gas and example IDs below describe the original M1B run.
Use the current JSON and `M2_ECONOMY.md` for the current artifact and measurements.

## Results

All nine required scenarios PASS (Node reports 10 including the enclosing test):

1. Owner grant and authorized downstream delegation succeed; descendant enters.
2. Non-owner issuance and wrong parent holder fail.
3. Revocation prevents subsequent entry.
4. Ancestor revocation denies both descendants and further delegation.
5. Independently owned Library remains usable.
6. At expiry night, parent and descendant can no longer enter.
7. Replayed entry/revocation nonces and repeated revocation fail.
8. Unrelated account and grantee cannot revoke the owner's grant.
9. Lucien's direct owner-issued grant survives loss of his player-delegated path;
   revoking the remaining direct grant then denies entry.

There is no property-title revocation API: case 8 tests grant revocation and
continued independently owned Library access. Replay tests cover application
nonces in freshly signed transactions, not resubmission of identical signed bytes.
Every expected rejection must have a failed execution receipt with the expected
contract reason and an unchanged complete game-state view for the calling actor.

## Reproduction

Prerequisites: Linux x86_64 (Ubuntu WSL2 works), Linux Node 24/npm, curl, tar;
Rust 1.99.0 with wasm32-unknown-unknown and cargo-near 0.22.0 for rebuilding.
Windows can build WASM; only Sandbox execution must run in Linux.

From the repository root, with the matching platform's Node on PATH:

```sh
npm ci --ignore-scripts
npm run contract:wasm
bash scripts/setup-sandbox.sh
npm run test:sandbox
```

`npm run contract:wasm` uses the installed official cargo-near builder, including
`--cfg near` and WASM optimization. Setup downloads pinned Sandbox 2.14.0 from
NEAR's official distribution and checks the recorded archive SHA-256. The hash
pins the bytes tested here; it is not an independent publisher signature.

This session used workspace-local Linux Node downloaded from nodejs.org and checked
against its official SHASUMS256.txt. The actual execution command from PowerShell:

```powershell
wsl -d Ubuntu -- bash -lc './.local/node-v24.13.0-linux-x64/bin/node --test tests/sandbox/authority.test.mjs'
```

The final command exited 0: nine scenarios passed, zero failed/skipped. Runtime
setup and each test create only disposable sandbox accounts. Each scenario has a
fresh contract. Teardown stops the node and removes its temporary chain directory.
The loopback wrapper is verified with `ss`; no public RPC endpoint is selected.
The runner checks the node version via RPC, not just the executable version.

## Artifacts and receipts

- Verified WASM: `target/near/night_authority/night_authority.wasm`, 161,390 bytes.
- SHA-256: `4aaeb60578bc3db7edbf9d84891fd6ce023d5517f0a5dc806dd1d03ea2d84bec`.
- [Final evidence](evidence/m1b-sandbox.json): runtime identity, WASM hash, nine
  scenario results, 62 transaction outcomes with all returned receipt outcomes,
  gas burned, logs, status, block hashes and before/after contract storage usage.
- 48 recorded transactions succeeded; 14 intentionally rejected. Setup account
  creation transactions are not included in this count.
- Successful descendant entry transaction:
  `8USGqi3N834CGqcDRo2QSuGqvxFa6QNerz1Ucd19Nnpj`;
  receipt `DvTrnjt2tg8fLBQjXAGwmKSX2e9XxzjmxB2HxssYVEd2`.
- Rejected entry after revocation transaction:
  `HSsxPCH7a2hUiEonUf64qQ2LuW1XCkGgbyQawsMmjVxd`;
  receipt `DGEQ25rnX1sVoE3XAVbXkGTuj21TWWbuBHFA4Ab3g29N` reports `access denied`.

These are local receipts, not explorer links. Evidence contains execution outcomes,
not private keys or a complete archival chain. Each run replaces the final report.

## Gas and storage observed

Gas is total transaction plus returned receipt gas, in Tgas (10^12 gas).

| Operation | Successful range | Rejected range |
|---|---:|---:|
| Deploy | 12.107 | — |
| Initialize | 1.563–1.568 | — |
| Grant | 1.807–1.852 | 1.558–1.579 |
| Enter | 1.691–1.747 | 1.527–1.546 |
| Revoke | 1.703–1.742 | 1.525–1.561 |
| Advance night | 1.633 | — |

No storage-related failures. Contract storage was 182 bytes before deployment,
161,572 after deployment, 161,757 after initialization, and at most 162,031 in
these fixtures. All 14 rejected calls left storage usage unchanged. These funded,
small fixtures do not test underfunded accounts or maximum-capacity storage/gas.

## Failures, correction and limits

- Initial restricted WSL access failed with `E_ACCESSDENIED`; approved unrestricted
  execution reached the already installed Ubuntu WSL2. No reinstall was needed.
- Workspaces' transitive downloader defaulted to obsolete Sandbox 2.6.2, which
  rejected WASM with `PrepareError: Deserialization`. Its environment handling
  overwrites BINARY_PATH unless BIN_PATH is also set. The runner now sets both,
  pins the binary, and asserts RPC version 2.14.0. Historical receipts are in
  [2.6.2 failure evidence](evidence/m1b-sandbox-2.6.2-failure.json).
- Original M1 WASM (331,624 bytes, SHA-256
  `0ca9738dda0a53b007280380d886660f9aabeb61309ef1d1b47b1cd49cd64096`)
  executed on 2.14.0, but negative calls produced generic `unreachable` traps.
  Two scenarios passed; seven failed precise-reason assertions. This was not an
  observed authority bypass. Build-only correction: use cargo-near with on-chain
  SDK configuration and optimization. Rust contract source remains unchanged.
- Final full Sandbox run passed after that correction. Regression checks also
  PASS: eight contract unit tests, one native bridge test, TypeScript/Vite build,
  test-script syntax and shell-script syntax. No required Sandbox case remains
  unexecuted. Diagnostic cargo-near compilation passed.
- npm audit initially reported 15 findings including high/critical tar issues.
  Pinned tar 7.5.22 override leaves 13 low findings through elliptic in dev tooling;
  zero moderate/high/critical findings. No production signing dependency added.
- No permission bypass discovered. Existing storage subsidy, executor timing and
  upgrade-key trust risks remain. Public networks, wallets, worst-case gas/storage,
  initialization races, capacity stress and a full security audit remain unverified.

Official references: [Workspaces](https://github.com/near/near-workspaces-js),
[Sandbox](https://github.com/near/near-sandbox-js),
[cargo-near](https://github.com/near/cargo-near).
M1B stops here; no economy, agent, frontend redesign or next milestone work.

Pass 1 regression (2026-11-08): all nine authority scenarios passed against the rebuilt WASM with the read-only grant-validity view. See docs/PASS1.md for the current artifact hash and evidence; earlier measurements above remain historical.
