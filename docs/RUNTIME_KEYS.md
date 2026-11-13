# Restricted runtime key installation

Receiver for every new key: `night.we-inherit-night.testnet`. Network: **Testnet only**.

Current funding follow-up: the same keeper key now has **0.10 NEAR** allowance
and Seraphine's has **0.075 NEAR**; the other nine retain **0.05 NEAR**. Receiver,
method restrictions, public/private keypairs and Render secret configuration are
unchanged. See [finalized allowance changes](TESTNET_FUNDING.md). The installation
record below describes the original allowances.

Eleven independent Ed25519 keypairs were generated for the existing immutable
roster. Each installed public key has **FunctionCall permissions only**, the exact
methods below, and a **0.05 test NEAR** allowance (`50000000000000000000000`
yoctoNEAR). Existing administrative keys and Vesper's older restricted key remain.

## Public configuration and permissions

| Role / existing account | New public key | Exact methods |
|---|---|---|
| `provisioner.we-inherit-night.testnet` | `ed25519:8QdPoPsxMoF6i4fpKHnmw3dTKnHMZiT4ESmxuoVuxGgF` | `open_campaign` |
| `player.we-inherit-night.testnet` | `ed25519:7S7CZjHkHz91coykg7vSeRpaH6WCm81qryFGxnufHdNv` | `grant_access`, `revoke_grant`, `enter_room`, `accept_lease`, `reject_lease` |
| `vesper.we-inherit-night.testnet` | `ed25519:6f6KH1ub8739NakytBYzkubGX9RDWNNjeczdpdBMgiPj` | `revoke_grant` |
| `seraphine.we-inherit-night.testnet` | `ed25519:5yFPoCyzWFr9LiF72XGf9JsQS3QR6cJ2hxX8CvQN5Sxy` | `claim_rent` |
| `keeper.we-inherit-night.testnet` | `ed25519:7fJGW1whUCPU8aZQvkT7zdB7RCFSFf8sm2ztfjuGXXNU` | `advance_night`, `complete_campaign`, `settlement_dawn`, `archive_campaign`, `reclaim_campaign` |
| `marius.we-inherit-night.testnet` | `ed25519:GPKAXQC5bkdTpfM1wccmvUQJ9wCeKZ239C6K3wyesgw2` | `grant_access`, `revoke_grant` |
| `lucien.we-inherit-night.testnet` | `ed25519:8X8JpTLPgMVeM6jgiDfvnP4s4FD67EVHiaHrw79g9iNY` | `grant_access`, `offer_lease`, `claim_rent` |
| `mirelle.we-inherit-night.testnet` | `ed25519:GHYrTdxHv3szJLLwUPQ1iEMDq3h5gN7P5CPD2VW8a7NM` | `enter_room`, `grant_access` |
| `dorian.we-inherit-night.testnet` | `ed25519:CyZzDYyZTWCCcktGdyorvQTdTai3PhCEA7kLawzbbYfu` | `enter_room`, `grant_access` |
| `cassian.we-inherit-night.testnet` | `ed25519:7QiXrex5MbxoPsYm5mfeYbvCx8CcgzL52XZzoZobH8N2` | `enter_room`, `accept_funded_passage`, `refund_passage_budget` |
| `sabine.we-inherit-night.testnet` | `ed25519:4hEvFx5QpHBGeW3y2cyeM4A6bojnvkHjm8BA9qyi4xXa` | `grant_access` |

Exact `NIGHT_CONFIG_JSON`: [public configuration](../evidence/runtime-keys/NIGHT_CONFIG_JSON.json).
It contains only public account IDs and public keys, plus `lifecycle: true` and
the deployed contract ID. It is ready to copy into Render without substitutions.

Exact `NIGHT_RUNTIME_KEYS`: the encrypted vault below contains the complete JSON
array accepted by the existing signing adapter: eleven `{role, accountId, privateKey}`
records. No plaintext secret file is stored in the repository or evidence.

## Private storage and operator-controlled Render handoff

Private vault (Windows DPAPI CurrentUser encrypted):

```text
C:\Users\gauge\AppData\Local\WeInheritNight\Render-night-testnet\NIGHT_RUNTIME_KEYS.dpapi
```

The directory ACL allows only `MSI\gauge` and SYSTEM, with inherited access
disabled. Encryption/decryption roundtrip and the runtime adapter's exact
private-to-public-key matching were checked without printing keys or signing a
gameplay transaction. The vault is tied to this Windows user's DPAPI profile;
retain that profile and protect backups. Administrative credentials were never
exported or copied into this bundle.

Nothing has been uploaded to Render or copied onto the clipboard by this task.
After separately approving and creating the Render service:

1. Sign into Render as a trusted operator. Open the intended service's
   **Environment** editor. Copy the public configuration file into
   `NIGHT_CONFIG_JSON`.
2. Disable clipboard history/cloud sync and close third-party clipboard managers.
   Open a local PowerShell window as **gauge**, then run this local helper:

   ```powershell
   powershell.exe -NoProfile -STA -File "C:\Users\gauge\AppData\Local\WeInheritNight\Render-night-testnet\Copy-RuntimeKeysToClipboard.ps1"
   ```

3. The helper decrypts in memory and copies the exact JSON into the clipboard
   without printing it or writing plaintext to disk. It marks the clipboard item
   as excluded from Windows history/cloud capture. Paste **only** into
   `NIGHT_RUNTIME_KEYS` in the protected Render Environment editor; do not use a
   `VITE_` name, shell command, chat, log, document or frontend setting.
4. Save using the separately approved deployment procedure. Immediately return
   to the helper and press Enter: it clears the clipboard in its `finally` block.
   No automated browser operation or credential upload is part of this procedure.
5. Keep administrative FullAccess keys entirely off Render. Startup checks all
   eleven exact public keys against finalized RPC permissions before listening.

The public config and manual helper also reside alongside the encrypted vault.
The helper was syntax-checked but deliberately not executed, so it has not touched
your clipboard. Clipboard handoff and Render environment acceptance remain manual.

## Verification and evidence

**PASS: 11/11 installations FINAL; 11/11 exact permissions independently verified.**
Verified at `2026-11-13T04:42:11.147Z`. All eleven remaining allowances are exactly
`50000000000000000000000` yoctoNEAR (**0.05 test NEAR each**). The existing
production `verifyRuntimeRoster` check passes. All prior access keys remain,
and the deployed registry state is unchanged. Keys are ready for manual Render
configuration; there is no remaining key-installation blocker.

[Final public RPC evidence](../evidence/runtime-keys/verification.json).

- Before installation: both RPC endpoints verified all eleven existing accounts
  and their public access-key lists; the deployed immutable registry matched the
  earlier deployment evidence.
- Each transaction was constructed offline using the exact existing administrative
  key from Windows Credential Manager. The decoded transaction was checked to
  contain **one AddKey only**, addressed to that same existing actor account.
  New key, permissions, methods, receiver, allowance, nonce, block hash and
  Ed25519 signature were checked before the signed identity was recorded and sent.
- Installation used existing actor accounts only. No contract calls, transfers,
  new accounts, upgrades, deployments or key deletions were included.
- Public evidence is in [runtime-keys](../evidence/runtime-keys/): preflight,
  public manifest, per-role intents/verified hashes/FINAL outcomes and independent
  final verification. Signed transaction files contain public AddKey data only
  and stay in ignored `.local`; no secret keys enter evidence.
- NEAR initializes access-key nonces from the installation block; a new key need
  not report nonce zero. The provisioner transaction succeeded before an initial
  post-install assertion exposed this fact. The assertion was corrected, its
  installed key was independently rechecked, and the transaction was **not resent**.
- The first vault helper failed before writing secrets because a PowerShell
  encryption cmdlet was unavailable. Direct .NET DPAPI succeeded; failed in-memory
  candidates were never installed. Only the final eleven keys are persisted.

## Scoped production code safety check

The actual Testnet Vite production build was inspected in memory, and local
server imports were inventoried. [Audit evidence](../evidence/runtime-keys/production-safety.json).

| Module / path | Finding and disposition |
|---|---|
| `scripts/bridge.mjs` and Vite local API plugin | Build-configuration imports, but bridge creation is inside `configureServer`, which production build/runtime does not invoke. No frontend inclusion or public endpoint. Preserved. |
| `scripts/sandbox/persistence.mjs` / `near-workspaces` | Imported transitively by the shared campaign engine. Sandbox startup and filesystem keystore helpers are dormant in the production path, which supplies SQLite storage and a Testnet scenario. Potentially unnecessary server dependency weight; prior Linux startup/memory verification passed. No demonstrated deployment/security failure: preserved. |
| Windows `createKeychainSigner` | Shares a module with Linux signing. Render requires environment credentials and startup refuses fallback. Dormant on Render; preserved for development. |
| `src/decision-provider.ts` | Absent from the production frontend and server import graph; provider remains disabled. Preserved. |
| `scripts/testnet/register.mjs`, memory benchmark, ignored `.local` operational helpers | Not imported by production startup or served from `dist`; no administrative public API. Preserved. |
| Client-side deterministic rules/NPC definitions | Present because presentation uses them; they cannot sign or authorize contract rights. No change. |

No demonstrated unsafe or incompatible module required removal. No production
source, dependencies, gameplay, narrative, artwork or tests were changed. This
was a scoped import/build review, not a comprehensive dependency security audit.

## Remaining boundaries

Key installation does not establish live hosted gameplay. Render environment
entry, paid-service creation/deployment and real hosted two-session gameplay,
payment/recovery/lifecycle acceptance still require their separate approved pass.
No Render service was created or paid for, no secret uploaded, and no Git commit
or push was made. Finite gas balances, pool capacity and previously documented
abandoned-world/unknown-transaction limits remain. An access-key allowance is
a spending cap, not reserved account funds; monitor both allowance and balance.
