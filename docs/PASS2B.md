# Pass 2B — bounded provider, political negotiation and visual prototype

## Delivery status

IMPLEMENTED: real configurable Responses API adapter, strict decision validation,
labelled fallback, one enforceable political proposal, persisted outcomes, and
interim gothic presentation. Live AI verification: NOT RUN (no configured key or
model). Automated provider responses are mocked and are not genuine LLM evidence.
The final live-AI acceptance standard therefore remains unverified.

## Audit and reuse

Read root instructions, project/hackathon requirements, progress, README, Pass 2A,
canon/rules, architecture/security, agent/game/UI/runner/persistence code and tests.
Initial baseline passed: 18 Node tests, nine Rust tests, production build.
No nested instructions or Git metadata were found in the earlier inventory.
Reused the existing validator, restricted signers, lease, transaction reconciliation,
serialized dawn journal and seven-night mechanics. Rust and key permissions did
not change. Seraphine actually owns Lounge in `new_economy`; no Marius account,
property, succession capability or genealogy was fabricated.

## Pipeline and provider configuration

`observeAgent` supplies detached public records, own memory/relationships,
actor-specific access, known agreements and deterministically available proposals.
No player discoveries/resources, other private memories, filesystem or secrets
are passed to the model. `src/decision-provider.ts` uses server-side fetch to the
fixed OpenAI Responses endpoint, no tools, `store:false`, strict JSON schema.
Reference: [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).

The server runner loads ignored `.env`; use `.env.example` placeholders:

```dotenv
NIGHT_LLM_ENABLED=1
NIGHT_LLM_MODEL=<a Responses structured-output model available to your account>
OPENAI_API_KEY=<server-only key>
```

Default enable flag is 0; missing any required setting uses fallback without a
request. Never use VITE_ for these values. Restart the local server after changing
configuration. No funded access is assumed. Model choice affects cost; no default
paid model is silently selected. On Windows, use the ignored .env for credentials;
the bridge forwards only non-secret runner settings into WSL.

Limits: at most two HTTP attempts (one retry on HTTP 429/5xx), 12 seconds per
attempt including body reading, 512 output tokens, 16,000 UTF-8 bytes for the whole
request body, 32,768 response bytes. Oversized input falls back without truncating
authority facts. The input byte ceiling is a conservative text-token bound, not
an exact tokenizer count; API framing is additional. Each seven-night campaign
reserves at most 21 decisions, hence at most 42 generation requests. A persisted
reservation prevents another provider invocation for that turn after interruption.
Reset creates a new campaign/budget. No global billing quota is implemented.

A valid model can choose pass instead of the deterministic response. The model
returns actor, action, target, parameters, observation ID and bounded dialogue/
rationale. Provenance, attempts and model identity are attached by the trusted
adapter/runner, not accepted from model assertions. Schema validation is followed
by identity/target/term checks and the existing NPC permission validator. Fresh
contract state is checked again before execution. Invalid output falls back once.

## Supported actions and negotiation

- Vesper: revoke her original Crypt grant after accepted lease, or pass.
- Seraphine: present existing Lounge lease, collect vested rent, or pass.
- Lucien: pass; no invented property or voting rights.

`offer` presents the existing owner-signed lease 0; it does not generate new
on-chain terms. Exact terms: player recipient, Lounge entry, 0.02 Sandbox NEAR,
three nights, existing offer deadline (internal night 2). No ownership, delegated
rights, votes or reciprocal access is promised. Broader bargaining and NPC-to-NPC
negotiation remain deferred.

Reproduction: start a fresh game, perform a player action, then End night. Seraphine
may offer (fallback does so when available). On Night 2 inspect Political agreements.
Accept costs one major action and submits the existing player's `accept_lease`
with exact rent. Fresh owner, buyer, property, terms, deadline and balance checks
precede submission; nonce and postcondition confirm it. The next NPC phase can
revoke Crypt access and collect rent. Independent Library remains accessible.

Political rejection is local/free: resolves the proposal, signs nothing and makes
no relationship change. The existing standing-lease accept/reject controls remain
available for compatibility; legacy direct rejection still signs `reject_lease`
and spends an action. A declined political proposal is not offered again. Unanswered
proposals expire at the actual deadline. There are no automatic rejection penalties.

## Persistence and security

History records night/actor, decision ID, envelope, source, attempts/model where
available, validation, execution and outcome. Failed/uncertain transactions remain
journaled; a committed nonce plus verified postcondition reconciles lost acceptance
responses. NPC revoke/settlement uses the existing immutable-ID reconciliation.
No repeated transaction or relationship update was observed in the tested windows.

No model-selected signing account, method, gas, deposit or arbitrary target enters
the executor. Narrative text is untrusted and rendered as React text; fixed terms
are displayed separately. This limits prompt-injection consequences but is not a
claim that all model text is truthful. Missing facts cannot grant authority.
Issuer-based revocation and post-expiry rent semantics are unchanged.

Limits: trusted local saves and operator, single writer, RPC trust, upgrade key,
subsidized storage and callback risks persist. A permanently invalid pending chain
intent can pause dawn and needs operator reconciliation/reset; no fabricated
success is emitted. No public authentication, production custody, global provider
quota, generic exactly-once protocol or multi-user deployment is implemented.

## Tests and evidence

- PASS: 28 Node tests, including ten new adapter/negotiation cases: valid structured
  HTTP response, malformed/refused/oversized/error output, schema/actor/target/method
  injection, timeout, retries/input bounds, invalid terms/authority/expiry, accept/
  reject/failure/lost response, pending reload and durable provider reservation.
- PASS: nine Rust unit tests at baseline and final audit; production TypeScript/Vite build.
  No Rust changes; the existing verified WASM was used. WASM rebuild NOT RUN.
- Existing Sandbox suite: initially 25/26 passed; seven-night reload comparison
  caught undefined optional audit fields disappearing during JSON serialization.
  Fixed by omitting absent fields; focused seven-night rerun PASS.
- New real Sandbox negotiation: rejection PASS; acceptance initially stopped at
  restricted-key deposit rejection before the contract. The negative test now uses
  the existing test root to reach the contract's wrong-buyer check. Acceptance
  rerun PASS, including lost committed response, restart, duplicate acceptance,
  rent settlement, revocation and preserved independent Library.
- Final audit: all 26 existing Sandbox entries plus two negotiation cases passed
  in one clean 28-case run (zero failures/skips, 726.94 seconds). Node 28/28,
  Rust 9/9 and production build also passed again. See `PASS2B_AUDIT.md`.
- Evidence: `docs/evidence/pass2b-accept.json`, `pass2b-reject.json`; these explicitly
  label provider HTTP as mocked and contain real local Sandbox transaction results.
- Live provider smoke: NOT RUN, no configured credentials. Public testnet: NOT RUN.
  No claim of model-generated real-chain proof. No paid test requests were made.

Commands: `npm test`, `npm run build`, `cargo test --lib --locked`;
Linux/WSL Node 24: `node --test --test-concurrency=1 tests/sandbox/*.test.mjs`.
Gameplay bridge tests explicitly disable LLM usage even with local configuration.

## Visual prototype and local preview

Monochrome architecture SVGs distinguish Crypt, Library and Lounge; crimson focus/
selection, a compact resource bar, anchor navigation and encounter presentation
replace the previous purple dashboard styling. Reusable Portrait/RoomArt components
keep assets replaceable. Native buttons, focus rings, responsive rules and reduced
motion remain. Seraphine uses the user's supplied artwork through CSS framing;
Vesper/Lucien are labelled symbolic placeholders, not canonical physical designs.

The supplied castle/bloodline mockups guide style only. No Coin, Influence, extra
rooms, eight-character genealogy or unverified rights were imported. The one
recorded Vesper/player sire link and independent married House Volari relationship
are shown separately; the expandable rights inspector remains.

Visual browser/mobile QA: NOT RUN after the user stopped Computer Use. The build
passes; visual acceptance remains unverified. Local HTTP diagnostics and Vercel
blockers are in `VERCEL_PREVIEW.md`. No deployment occurred.

## Canon and Pass 3

Pass 2B user instructions establish the Volari marriage/co-rule of centuries,
Seraphine's seniority/independent ancestral rights, and Marius's castle/succession
domains. Canon documents distinguish those domains from absent contract records.
TBD: exact sires/descendants, Marius personality/voice/motivation, House membership
beyond supplied facts, succession rules and ancestral-right implementation.

Pass 3 needs eight seat identities, eligibility and enforceable voting rights,
opposition/tie/abstention rules and the final five-supporter Night 7 outcome.
Current local legacy seats and relationship scores grant no vote. Before claiming
Pass 2B's live acceptance standard, configure a provider and record one genuine
model proposal through validated acceptance on the existing local Sandbox.

Changed implementation: src/agents.ts, game.ts, decision-provider.ts, main.tsx,
visuals.tsx, style.css, chain.ts; scripts/bridge.mjs, sandbox/campaign.mjs and
sandbox/play.mjs; vite.config.mjs; .env.example; public/art/seraphine-reference.png.
Tests: decisions.test.mjs, sandbox/negotiation.test.mjs and gameplay test isolation.
Documentation: canon/rules, requirements, architecture/security, README, PROGRESS,
this report and Vercel readiness. Hackathon requirements reviewed, unchanged.

Final local preview: HTTP 200 and real near-sandbox world confirmed at
http://127.0.0.1:5187/, night 0, no error; provider disabled. Original save preserved.
