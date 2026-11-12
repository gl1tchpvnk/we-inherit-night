# Vercel preview readiness — 2026-11-11

## Verdict

Frontend build: READY. Playable hosted game: NOT READY without backend work.
No deployment was performed. Keep the current local mode intact.

## Localhost diagnosis and evidence

- Vite initially reported ready on 127.0.0.1:5187 inside restricted execution.
  Restricted HTTP requests failed with socket access denial; host curl/HTTP
  requests timed out despite an existing loopback listener.
- Restarting only that task's Vite process outside restricted execution, with
  the same port/address and unchanged application code, made `/`, `/src/main.tsx`
  and `/art/seraphine-reference.png` return HTTP 200. This isolates the original
  timeout to the process execution boundary, not Vite's port or static frontend.
- `/api/demo` separately returned HTTP 503, `Contract runtime stopped`.
  Direct runner startup reported the existing `.local/night-play/play.lock`
  was owned; a running play process was observed. It was not killed and the
  lock/save were not deleted. This was an actual backend startup failure.
- A separate `.local/pass2b-preview` session was started with LLM calls disabled.
  Windows-to-WSL forwarding of non-secret save/disable settings was made explicit
  in the existing bridge. Credentials are never forwarded through command args.
- No firewall, network/security settings, public listener or port change was made.
  The in-app browser was not retried after the user prohibited Computer Use;
  no installed Chrome access was used. Browser-specific isolation remains
  unverified after fixing the server execution boundary.
- Initial final API check was blocked by automatic approval review's usage limit;
  final follow-up result is recorded separately below if available.

## Build and recommended configuration

| Setting | Recommendation |
|---|---|
| Framework | Vite (React SPA) |
| Project root | Repository root |
| Install | `npm ci --ignore-scripts` (existing pinned lockfile) |
| Build | `npm run build` (`tsc --noEmit && vite build`) |
| Output | `dist` (includes `public/art` assets) |
| Node | Match tested Node 24; verify platform runtime selection before deployment |
| Environment | Preview only; no production promotion |
| Routes | Current navigation uses hashes, so no SPA deep-link rewrite is needed |

These are proposed settings, not a deployed configuration. Do not deploy the
current default `VITE_MODE=sandbox` bundle as a functional game: `/api/demo`
exists only in Vite's `configureServer` plugin, which does not run in `dist`.
Vercel's [Vite integration](https://vercel.com/docs/frameworks/frontend/vite)
can serve the frontend; it does not turn this dev-only middleware into a backend.

## Current dependencies and failures if uploaded unchanged

| Component | Current implementation | Hosted consequence |
|---|---|---|
| Browser API | Same-origin POST `/api/demo` | No production handler; responses fail/404 |
| Dev middleware | Loopback Host/Origin checks, fixed port 5187 | Rejects deployed hosts if copied verbatim |
| Runner | Child process, JSON lines, serialized queue | No deployed service/lifecycle/authentication |
| NEAR execution | Linux/WSL native Sandbox and ignored WASM artifact | Not provisioned by frontend build |
| State | Local database, keystore, atomic JSON, file lock | No durable shared state or distributed lock |
| AI | Server-only provider inside runner | No hosted endpoint; UI cannot call provider safely |
| Testnet mode | Direct finality-final RPC views only | Requires real deployed contract; all signing disabled |

The app cannot treat a serverless invocation's memory/file lock as a persistent
single-writer game executor. Vercel Functions scale and have bounded invocation
lifetimes ([limits](https://vercel.com/docs/functions/limitations)). A long-lived
Sandbox database, child process and local keystore need an explicitly designed
runtime and durable storage; this assessment does not claim all Vercel products
are incapable of that, only that this Vite project has no such deployment.

## NEAR communication after deployment

Existing read-only mode sends `get_world` directly to
`https://rpc.testnet.near.org`, using public contract/view-account IDs and finality
`final`. It is not a signing integration, and no public contract is currently
configured. `account_id` in a view is not authentication.

For a playable preview, retain the deterministic validator and journal in one
server-side executor with durable storage, authenticated campaign/player binding,
restricted NPC credentials, idempotency and fresh contract reads. Player mutations
need a testnet wallet flow or a deliberately reviewed test-only account model.
Deploying/configuring the contract requires separate authorization. Do not expose
localhost/WSL or its keys through a tunnel as a substitute.

## LLM endpoint and secrets

A hosted provider requires server-side execution. Prefer placing it in the same
authenticated game command endpoint, so observations are built from authoritative
state and provider results cannot bypass validation. Do not add a general model
proxy or a new framework merely to host the frontend. Apply per-session cost/rate
limits and persist request reservations before model calls.

Public build variables: `VITE_MODE`, `VITE_NETWORK`, `VITE_RPC_URL`,
`VITE_CONTRACT_ID`, `VITE_VIEW_ACCOUNT_ID`, and reserved `VITE_WALLET_CONNECTOR`.
Only real public metadata belongs there. [Vite exposes VITE-prefixed variables](https://vite.dev/guide/env-and-mode)
in the frontend bundle.

Server-only: `OPENAI_API_KEY`, `NIGHT_LLM_ENABLED`, `NIGHT_LLM_MODEL`, runner save
configuration, signer credentials, future database/auth secrets. Never prefix
secrets with `VITE_`, include `.env`/keystores in `dist`, or ship `.local`/`target`.
No provider key is needed for a frontend-only preview. Model calls are disabled
in the isolated local preview; no live credentials were configured in this run.

## Smallest next step

Keep the verified local playable prototype. If a hosted visual review is needed
first, add an explicitly labelled, non-signing presentation mode or configure
read-only testnet mode after an actual testnet deployment; neither should claim
playable AI/NEAR negotiation. For a playable Vercel frontend, the minimum next
architecture task is a single authenticated persistent executor and its browser
adapter, with approved testnet connectivity. Avoid a database/service mesh or
multiple agent services; this small game does not justify them.

## Final local preview check

After the earlier processes stopped, the preview lock was verified stale (no play
or Sandbox process running). Only `.local/pass2b-preview/play.lock` was removed;
the original save and preview data were preserved. A hidden host Vite process was
started on the same loopback address. Final read-only API check: HTTP 200,
`proof: near-sandbox`, world present, night 0, no error. The local preview is
http://127.0.0.1:5187/ with model calls disabled. No browser automation was used.
Vercel work was set aside at the user's request; this remains an assessment only.
