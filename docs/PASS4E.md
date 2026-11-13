# Pass 4E — Render preparation

Status: **IMPLEMENTED locally; hosted gameplay NOT VERIFIED.** No Render service
was created or purchased, no live credentials were accessed/exported/installed,
no Testnet transaction was sent, and no contract or artwork was changed.
This supersedes the Windows-host recommendation in Pass 4D. The deployed
`night.we-inherit-night.testnet` contract is preserved.

## One-service configuration

Use the repository-root `render.yaml`. It creates only one native Node Web
Service, with a disk, health check and manual deployments.

| Setting | Exact value |
|---|---|
| Runtime | Node.js, pinned to locally verified `24.13.0` |
| Plan | Starter (also named `0.5c-512mb`), one instance |
| Build command | `npm ci --include=dev --ignore-scripts && npm run build` |
| Start command | `node --max-old-space-size=256 scripts/testnet/start.mjs` |
| Health check | `/healthz` |
| Persistent disk | `/var/data`, initially **1 GB** |
| Application data | `/var/data/night/game.sqlite` plus adjacent WAL, SHM and writer-lock SQLite files |
| Auto deploy | Off; manually deploy approved revisions |
| Listener | Render `PORT`, on `0.0.0.0` |
| HTTPS | Render terminates TLS; the backend requires its configured public HTTPS origin |

Keep development dependencies installed: the existing server uses the pinned
NEAR tooling and shares the engine's persistence module. `--ignore-scripts`
avoids installing/running a Sandbox during deployment. No Sandbox, Rust build,
Vite development server, CLI signer, PM2 cluster or second Node process runs on
the service. `dist` is served by the gameplay API process. Render builds on
separate compute; do not open the database in a build/pre-deploy command.

[Render port binding](https://render.com/docs/web-services),
[Node version selection](https://render.com/docs/node-version),
[Blueprint fields](https://render.com/docs/blueprint-spec), and
[health/restart behavior](https://render.com/docs/health-checks) were checked
for this preparation. Disabling auto deploy does not disable crash recovery.

## Environment configuration

Set these in the service's Environment section. Never prefix private values with
`VITE_`, paste them into a shell command, commit them, or put them in build output.

| Variable | Value / purpose |
|---|---|
| `NODE_VERSION` | `24.13.0` |
| `NODE_ENV` | `production` |
| `NIGHT_DATA_DIR` | `/var/data/night` (required on Render) |
| `NIGHT_CONFIG_JSON` | Server configuration JSON described below; accounts/public keys only |
| `NIGHT_RUNTIME_KEYS` | Protected secret JSON array described below; runtime keys only |
| `NIGHT_LLM_ENABLED` | `0`; gameplay does not invoke the provider |
| `VITE_MODE` | `testnet` |
| `VITE_TESTNET_BACKEND` | `1` |
| `VITE_NETWORK` | `testnet` |
| `VITE_CONTRACT_ID` | `night.we-inherit-night.testnet` |
| `NIGHT_ORIGIN` | Optional: exact HTTPS origin for a custom domain, with no trailing slash/path |
| `PORT`, `RENDER`, `RENDER_EXTERNAL_URL` | Supplied by Render; do not override |

Without `NIGHT_ORIGIN`, the service uses `RENDER_EXTERNAL_URL`. If using a custom
domain, use only that origin for gameplay: requests through other hostnames are
rejected. No wallet, model API key, full-access account key or Windows keychain
configuration belongs on Render. Local Windows operation can still use the
existing `NIGHT_SERVER_CONFIG` and isolated keychain signer.

Use `docs/render-config.example.json` as the shape for `NIGHT_CONFIG_JSON`.
Replace every placeholder with the **existing deployed immutable roster account**
and its **new receiver-specific restricted public key**, not an administrative
public key. Preserve `lifecycle: true` and the deployed contract ID. No database
path from this JSON overrides `NIGHT_DATA_DIR` on Render.

## Restricted credentials — later operator setup, not performed here

1. In a separately authorized administrative session, generate **eleven new
   ed25519 runtime keypairs** in a trusted local credential environment: the ten
   existing campaign actors plus the distinct provisioner. Do not export existing
   administrative keys. The service requires distinct role account IDs matching
   the deployed provisioning policy; it does not create or rename accounts.
2. Install only each new **public** key on its corresponding existing Testnet
   account. Permission must be `FunctionCall`, receiver exactly
   `night.we-inherit-night.testnet`, finite nonzero allowance, and the exact role
   methods below. For example, 0.05 test NEAR is a finite initial gas allowance,
   not a measured guarantee of service lifetime. Installing keys and funding gas
   require a separate approval; do not run these operations as part of preparation.
3. Independently inspect `view_access_key` with `finality: final`, that account,
   and that exact public key. Confirm receiver, method set, finite allowance and
   account balance. Never upload a key reported as `FullAccess`, unrestricted
   methods, or an unlimited allowance. Keep administrative credentials off Render.
4. Place public accounts/keys into `NIGHT_CONFIG_JSON`. In Render's protected
   Environment editor, enter `NIGHT_RUNTIME_KEYS` as a JSON array with exactly
   one entry per role, using the following **placeholder-only** shape:

   ```json
   [{"role":"player","accountId":"REPLACE_WITH_EXISTING_PLAYER.testnet","privateKey":"ed25519:REPLACE_WITH_NEW_RESTRICTED_SECRET"}]
   ```

   Include all eleven roles; this one-entry example is deliberately incomplete.
   The public key derived from each secret must match that role's config key.
   Do not upload a wallet directory or an administrative credential file. Restrict
   dashboard access to trusted operators and never print this environment value.
5. On startup, the service independently verifies all eleven on-chain permissions
   before listening. Before every mutation it checks the selected exact key again.
   The signed bytes are decoded and signature/account/key/receiver/method/args/
   gas/zero-deposit checked before submission. Misconfiguration fails closed with
   a generic message; there is no FullAccess fallback.

| Role | Exact allowed methods |
|---|---|
| provisioner | `open_campaign` |
| player | `grant_access`, `revoke_grant`, `enter_room`, `accept_lease`, `reject_lease` |
| vesper | `revoke_grant` |
| seraphine | `claim_rent` |
| keeper | `advance_night`, `complete_campaign`, `settlement_dawn`, `archive_campaign`, `reclaim_campaign` |
| marius | `grant_access`, `revoke_grant` |
| lucien | `grant_access`, `offer_lease`, `claim_rent` |
| mirelle | `enter_room`, `grant_access` |
| dorian | `enter_room`, `grant_access` |
| cassian | `enter_room`, `accept_funded_passage`, `refund_passage_budget` |
| sabine | `grant_access` |

Function-call keys cannot restrict campaign arguments. The trusted backend still
binds sessions to campaigns; it never accepts actor IDs or arbitrary methods from
the browser. Gas is fixed at 10 Tgas, or 50 Tgas for open/claim/refund operations.
All public-runtime transactions attach zero deposit. Prepaid player spending and
Cassian's exact passage mandate remain contract-enforced.

## Persistent storage, restarts and recovery

Campaign states, sessions, creation quotas, action quotas, transaction intents,
signed transaction bytes, final outcomes and archive commitments are in the same
SQLite database on the disk. WAL and FULL synchronous durability are preserved.
A separate SQLite exclusive writer lock is held for the process lifetime and
released by the OS after a crash. The offline registration command takes the same
lock. A legacy `.writer` marker blocks upgrade until an operator has verified the
old process is stopped; never delete a live lock to force startup.

Startup checks Linux mount information for `/var/data`, refuses an absent disk,
and refuses a redirected data path. Deployments retain data. Render disk services
have a brief stop/start outage and cannot scale to multiple instances; see
[Render persistent disks](https://render.com/docs/disks). Keep one service with
one disk; do not start a second writer from a shell. Back up SQLite with its
online backup facility or stop the service and copy the complete database state;
do not copy only the main file while WAL writes are active. Restoring an old
backup requires transaction reconciliation before admitting gameplay.

Recovery distinguishes unsigned intent (safe to retry), durably signed but
unsubmitted bytes (submit that exact identity), and uncertain broadcast (query
that exact hash to FINAL, including receipts). An UNKNOWN_TRANSACTION response
permits resubmission of the exact stored signed bytes, never a new signature or
nonce. This recovers a crash between the broadcast marker and RPC submission;
NEAR rejects duplicate execution of the identical transaction. If the result
remains unknown, progress blocks. Expiry, nonce rejection or unavailable historical
RPC evidence requires operator investigation, not a replacement payment guessed
from an unchanged game nonce. Never delete a journal to unblock play.

Payment checks now use the prepaid campaign treasury, including agreement and
sanctuary choices. Sandbox/legacy non-prepaid campaigns retain account-balance
checks. Public snapshots and archived history exclude private NPC memory,
proposal/debug details, raw errors and signing journals. Confirmed public event
summaries remain available to the encounter director.

Durable fixed-window limits: **120 API requests/minute globally, 30/minute per
campaign, four creation attempts/minute globally, 24/day globally**. All cookies
share the global limits, so rotation or spoofed forwarding headers cannot bypass
them. The existing one-minute successful-provision cooldown and contract
capacity/treasury limits remain. Eight requests may be in flight; excess work is
rejected instead of building an unbounded queue. History returns the latest 20
archived campaigns; older committed history remains in SQLite. This is bounded
demo protection, not resistance to a distributed denial-of-service attack.

## Memory assessment before purchase

See `docs/evidence/pass4e-memory.json` and reproduce with:

```sh
node scripts/testnet/measure-memory.mjs
```

Linux/WSL Node 24.13.0, production HTTP server, actual campaign engine, SQLite and
actual NEAR offline signing with **disposable synthetic keys**, with no Testnet
RPC. Four campaign states, 4,000 synthetic 4-KiB journal records (about 18.1 MiB
SQLite), journal deserialization on each request, 80 successful campaign reads
and 80 streamed artwork responses. Each round ran four game reads and four
3,106,011-byte artwork downloads concurrently; the load driver was a separate
process and is excluded from server RSS.

Measured idle RSS **124.1 MiB**, peak RSS **220.9 MiB**, final JavaScript heap
**14.2 MiB**, with a **256 MiB V8 heap cap**. RSS includes native allocations;
the heap cap alone is not a total-memory cap. The initial less-complete benchmark
was superseded by this run including journal deserialization.

Starter provides 512 MB RAM / 0.5 CPU ([current plan specification](https://render.com/docs/compute-plans)).
These results support **Starter as a reasonable initial plan for this bounded
four-world demo**, with substantial observed memory headroom. They do not prove
Render container memory, CPU latency, prolonged traffic or live RPC receipt sizes.
The browser's React memory is on the visitor's device; build memory is separate.
Monitor Render memory after authorized launch, especially peak RSS/page cache and
long-running journal growth. Stop or resize if sustained use approaches 400 MB or
OOM restarts occur. No paid upgrade is justified by the measured local workload.

## Exact dashboard setup — execute only after separate service approval

1. Make the reviewed revision available in a connected Git repository through
   your normal approved commit/push process. This pass did neither. A private
   repo works; do not make it public just for Render.
2. In Render, select **New → Blueprint**, connect that repository, choose the
   reviewed branch and root `render.yaml`, and review the proposed resources.
   Confirm it contains **one Web Service and one attached disk**, no database,
   worker or extra service. Choose Starter / `0.5c-512mb`, your desired region,
   and one instance. Do not apply the paid Blueprint until you approve the charge.
3. Supply `NIGHT_CONFIG_JSON` and `NIGHT_RUNTIME_KEYS` when prompted, following
   the separate credential setup above. Verify all non-secret environment values
   from the table. For an initial `onrender.com` hostname, leave `NIGHT_ORIGIN`
   absent. Do not manually set `PORT` or `RENDER_EXTERNAL_URL`.
4. Confirm disk mount `/var/data`, size 1 GB, health path `/healthz`, auto-deploy
   **Off**, and the exact build/start commands above. Apply the Blueprint only
   as the separately approved deployment step. A disk is needed at first start.
5. After deployment, check the service **Events/Logs** for successful startup and
   `/healthz` for HTTP 200. Health confirms HTTP/SQLite availability; it does not
   claim a campaign or payment succeeded. Render automatically restarts failed
   service instances; no separate watchdog service is needed.
6. Before claiming public playability, authorize and verify live gameplay: two
   independent browser sessions, real prepaid payment, NPC actions, reload,
   service restart, seven-night ending, settlement/archive/reclaim and repeat
   creation. Inspect actual FINAL receipts and Render memory metrics. Never use
   synthetic test hashes as evidence. Keep the disk when deploying new revisions.

Manual alternative, if not using Blueprints: **New → Web Service**, connect the
same repo/branch, select **Node**, leave Root Directory empty, enter the exact
build/start commands, choose Starter, then **Advanced** → add the environment
values, disk and health-check path above. This creates the same single service;
do not also apply the Blueprint and accidentally create another one.

## Verification and remaining blockers

- PASS: full Windows Node regression suite, **123/123**.
- PASS: focused Linux backend/startup/session tests, **30/30**.
- PASS: production Testnet frontend TypeScript/Vite build.
- PASS: five affected real local Sandbox tests: prepaid lifecycle/settlement,
  campaign isolation, two complete independent seven-night campaigns and existing
  negotiation accept/reject. No public-network transactions.
- PASS: Linux memory workload above. No browser walkthrough repeated.
- Initial full Linux regression attempt: 94 passed / four failed because this
  checkout has Windows-only native Vite bindings and the Windows local-demo
  executable. The full suite passes with the installed Windows dependencies;
  focused Linux server tests pass. A fresh Linux `npm ci`/frontend build and actual
  Render mount/HTTPS routing remain hosted-environment checks, not claimed here.
- Existing Rust/contract security evidence is reused; no Rust changes/rebuild or
  contract deployment. No test or security assertion was removed.

Remaining prerequisites: restricted receiver-specific keys must be generated and
installed with separate authorization; their exact public config must be supplied;
paid service creation/deployment must be approved; live hosted acceptance remains.
Subsequent local capacity preparation supersedes the retention limitation below;
see [campaign capacity fix](CAMPAIGN_CAPACITY.md). It has not been deployed.

At Pass 4E completion, the existing finite pool/gas and four-active-world cap still applied. Abandoned or
early-defeat worlds are retained by design and can exhaust capacity; this pass
does not add an administrative bypass or automatic reclamation of unfinished
campaigns. Unresolvable broadcast outcomes require operator review. Render disk
snapshots are not a substitute for a reconciled restore procedure.

## Authorized restricted-key installation follow-up
The eleven receiver-specific runtime keys are now installed and independently
verified on the existing Testnet accounts. The installation was separately
authorized after Pass 4E; its historical no-credential/no-transaction scope above
is unchanged. Use [RUNTIME_KEYS.md](RUNTIME_KEYS.md) for the exact public config,
method/key table, remaining allowances and DPAPI-protected manual secret handoff.
All prior keys are preserved. No public application deployment has occurred.
