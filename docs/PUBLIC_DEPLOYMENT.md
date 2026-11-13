# Public Render deployment — in progress

Public gameplay is **NOT YET VERIFIED**. GitHub preparation and security review
precede the user-controlled Render payment and runtime-secret handoff.

## Pre-push security review

- Expanded `.gitignore` for encrypted DPAPI/age/GPG bundles, runtime credential
  exports, local deployment configurations, SQLite variants/sidecars and signed
  recovery payloads. Safe `.env.example`, public `NIGHT_CONFIG_JSON`, runtime-key
  documentation and public transaction receipts remain eligible for Git.
- Scanned candidate working files, the Git index, and Git objects reachable from
  all refs and reflogs, including commit messages. Fetched origin before final
  staging; local main and origin/main initially matched.
- Searched for PEM/OpenSSH private material, NEAR secrets, GitHub/provider/AWS/
  Render tokens, credential assignments and credential-bearing URLs. Checked
  tracked paths independently of ignore rules; no tracked ignored credential or
  database file was found.
- Long `ed25519:` values in public receipts/CLI evidence were classified as
  signatures only after confirming the signature field and checking that their
  seed/public-key halves do not form a valid Ed25519 secret key. Known unit-test
  placeholders and the documented private-key placeholder were reviewed.
- No real secret was identified. No history rewrite, deletion or credential
  rotation was performed. Scanner output contains filenames/categories/counts,
  never secret values. No automated scan is a mathematical guarantee of absence.
- Administrative keys remain in the OS keychain. The restricted runtime vault
  remains DPAPI-encrypted outside Git. `NIGHT_RUNTIME_KEYS` identifiers in code
  and documentation are expected; live credential values are not included.

Audit and build evidence is recorded under `evidence/public-deployment/`.

Local preflight PASS: walletless production TypeScript/Vite build on Windows,
the exact install/build commands in a fresh Linux Node 24 directory, and Linux
production startup with SQLite WAL, health response and static frontend. No live
credentials or chain calls were used for that smoke check. Frontend import audit
found no server signing/private-environment/provider code in emitted assets.
Dependency audit reports 13 low-severity transitive findings stemming from the
existing elliptic advisory; no moderate/high/critical findings. No automatic
dependency changes were made. Existing 141 Node, 24 Rust and five focused Sandbox
results are reused; the unchanged broad suites were not repeated. Raw historical
CLI evidence retains its original whitespace; it was not reformatted.

## Deployment configuration

Use repository `gl1tchpvnk/we-inherit-night`, branch `main`, Blueprint `render.yaml`:
one native Node 24 Starter Web Service, one instance, 1 GB persistent disk mounted
at `/var/data`; SQLite and its recovery/lock files use `/var/data/night`.

Build: `npm ci --include=dev --ignore-scripts && npm run build`

Start: `node --max-old-space-size=256 scripts/testnet/start.mjs`

Health endpoint: `/healthz`. Render supplies PORT, external HTTPS URL and restart
supervision. Automatic deploys remain off. Current Testnet contract capacity is
5; finite pool, gas allowances and storage controls remain enforced.

The user must explicitly approve paid service creation and runtime-secret upload.
Use public `evidence/runtime-keys/NIGHT_CONFIG_JSON.json` for NIGHT_CONFIG_JSON.
For NIGHT_RUNTIME_KEYS, follow `docs/RUNTIME_KEYS.md`: run the existing local
clipboard helper, paste only into Render's protected environment configuration,
clear the clipboard, hide secret values and return to Events before agent review.
Do not paste secrets into chat or use administrative keys on Render.

## Acceptance still required

Verified public HTTPS/startup, actual mounted-disk persistence and restart,
isolated walletless sessions, real prepaid payments and NPC transactions,
save/resume, seven-night completion, financial settlement/archive/reclaim/replay,
and observed hosted memory/funding. Local tests and funding verification do not
substitute for this hosted acceptance. No repeated broad regression suite is
required unless a deployment defect changes shared code.
