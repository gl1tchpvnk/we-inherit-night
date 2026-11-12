# Pass 2B implementation audit — 2026-11-11

Scope: read the current implementation and finish regressions. No new gameplay,
provider configuration, live paid requests, deployment, or browser automation.

## Findings

| Question | Finding and evidence level |
|---|---|
| Real provider integrated/callable? | IMPLEMENTED: `src/decision-provider.ts` makes a server-side OpenAI Responses API request using native fetch. TESTED WITH MOCKS: request/response adapter and downstream validation. Actual service call NOT LIVE VERIFIED. |
| Provider-driven NPC decisions? | IMPLEMENTED: the dawn runner awaits the provider and validates its structured proposal; it does not substitute fallback when a valid model proposal is returned. TESTED WITH MOCKS only. Current gameplay uses deterministic fallback. |
| Provider/model configured? | Provider endpoint is OpenAI Responses. No model is configured; there is deliberately no default. Audit configuration check: enabled false, key absent, model null. No secret values were printed. |
| Credentials/infrastructure available? | Local server/WSL Sandbox infrastructure exists and has executed transactions. No configured API key or model; account funding/model access and live provider connectivity remain unverified. No hosted executor exists. |
| NPC negotiations? | IMPLEMENTED and TESTED WITH MOCKS: Seraphine can choose to offer existing Lounge lease 0 or pass. This presents fixed, already contract-backed terms; it does not autonomously mint or bargain over new terms. Genuine model choice NOT LIVE VERIFIED. |
| Player acceptance/rejection? | IMPLEMENTED: explicit UI controls and backend commands. Real local Sandbox execution tested; browser interaction NOT LIVE VERIFIED. Political rejection is local, free and penalty-free. |
| Authorized NEAR execution? | LIVE VERIFIED on local NEAR Sandbox, not public testnet: player acceptance invokes `accept_lease`, checks nonce/postconditions, and updates effective Lounge access. Wrong-buyer rejection, later issuer revocation, rent settlement and independent Library rights are tested. |
| Persistence? | IMPLEMENTED; mock and real local Sandbox tests cover pending proposals, accepted/rejected outcomes, lost committed responses, reload, replay prevention and one NPC decision per night. This is trusted local single-writer persistence, not production distributed exactly-once execution. |
| Fallback? | IMPLEMENTED and TESTED WITH MOCKS for missing configuration, malformed responses, provider errors and timeout. Real Sandbox regression gameplay uses deterministic policies. Fallback is not autonomous AI. |

## Boundaries and gaps

- Model output cannot select methods, signers, gas, deposits or arbitrary targets.
  Strict parsing and fresh deterministic authority validation precede restricted
  execution. Observations exclude private player discoveries, other private NPC
  memories and credentials. Injection tests exercise rejection/bounds, not a live
  model's resistance to manipulation or the truthfulness of dialogue.
- Supported NPC actions remain Vesper revoke/pass, Seraphine offer/collect/pass,
  Lucien pass. There is no broad political bargaining or NPC-to-NPC conversation.
- Seraphine's actual bootstrap ownership supports the lease scenario. No Marius
  wallet, authority or actions were created. Missing genealogy, succession rules
  and ancestral-right implementation remain TBD in the canon documentation.
- The provider is bounded per request and per campaign; no global billing quota,
  hosted authentication, production custody or distributed persistence exists.
  A permanently invalid pending transaction can pause dawn pending operator
  reconciliation. Live crash/network failures outside tested windows are unverified.
- Minor copy remains stale: the dawn UI says "scripted contract consequences";
  Lucien's profile says negotiation is unavailable, while Seraphine now supports
  the narrow lease proposal. No implementation edits were made during this audit.

## Visual and deployment readiness

IMPLEMENTED visual prototype: black/white/red styling, SVG room architecture,
replaceable portrait component, supplied Seraphine image, negotiation encounter,
responsive/focus/reduced-motion CSS and retained rights inspector. Vesper/Lucien
portraits remain symbolic placeholders. The supplied castle/bloodline layouts
are references, not fully reproduced assets or invented eight-character canon.
Browser, mobile and keyboard visual QA remain NOT RUN; visual acceptance is partial.

The frontend builds with `npm run build` into `dist`. Vercel can serve that static
output, but the current application is NOT READY as a playable Vercel preview:
`/api/demo` only exists in Vite dev middleware, execution requires the native/WSL
Sandbox runner, and saves/keys/locks are local. Testnet mode is read-only and has
no wallet signing. A playable deployment needs an authenticated persistent game
executor with durable state and approved NEAR connectivity. The LLM must remain
server-side; API/signing keys must never enter Vite variables or the bundle.
See `VERCEL_PREVIEW.md` for the existing assessment. Nothing was deployed.

## Regression evidence

| Check | Final result |
|---|---|
| `npm test` | PASS: 28/28, zero failures |
| `cargo test --lib --locked` | PASS: 9/9, zero failures; Windows bundled NASM setting used |
| `npm run build` | PASS: TypeScript and Vite production output in `dist` |
| WSL Node 24 complete Sandbox suite, concurrency 1 | PASS: 28/28 entries in one clean run, zero failures/skips, 726.94 seconds |
| Existing local preview HTTP | PASS: frontend HTTP 200 at `http://127.0.0.1:5187/`; no browser automation |
| Live LLM / public testnet / browser-mobile QA / WASM rebuild | NOT RUN |

Logs: `.local/pass2b-audit-node.log`, `pass2b-audit-rust.log`,
`pass2b-audit-build.log`, `pass2b-audit-sandbox.log`. Contract source is unchanged.
The Sandbox run covers observation isolation, lost NPC responses, authority,
expiry/revocation, independent rights, seven nights, economy, reset and both
negotiation outcomes. Provider timeout/schema/failure/budget tests use mocked HTTP.

Refreshed `docs/evidence/pass2b-accept.json` and `pass2b-reject.json` explicitly
identify mocked provider responses and contain real local Sandbox receipts.
Successful acceptance transaction: `83Lx6ETxSstqAuJtpzXmv8u3ubtD57924NQMfcZjUMEn`.
The wrong-buyer transaction failed as expected. Acceptance survived a lost response
and reload without a second payment; rejection executed no acceptance transaction.
These ephemeral Sandbox hashes are not public explorer/testnet evidence.

The Pass 2B live-AI acceptance standard is still outstanding: one genuine model
response must traverse validation, player acceptance and verified NEAR execution.
Mocked provider responses cannot satisfy that standard.
