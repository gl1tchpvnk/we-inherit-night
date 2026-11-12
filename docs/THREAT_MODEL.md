# Threat model — through Pass 2C

| Threat | Implemented mitigation / residual risk |
|---|---|
| Claimed actor / signer impersonation | Mutations use predecessor only; tests deliberately mismatch signer and predecessor. Local bridge impersonation is explicitly demo-only. |
| Unauthorized mint/revoke | Owner or valid delegable parent required; only original grantor revokes its grant. No global bypass. |
| Recursive grant / cycle | Immutable parent links, four-level cap, same scope/property, reject repeated accounts in ancestry of grant. |
| Stale UI authority | Views compute effective access; entry checks again; request failure clears visible authority. Finalized RPC trusted, not independently verified. |
| Revoked ancestor | Every effective check walks parents; no descendant cleanup or UI cache required. |
| Expired access | Contract night expiry; child cannot outlive parent. Executor can accelerate nights, a disclosed trust risk. |
| Replay | Per-actor sequential nonce; revoked IDs never reused; owner may intentionally create a new grant. No signed proposal expiry design yet. |
| Double spend / overspend | M2 exact attached rent, per-actor nonces, single acceptance, exclusive active lease; native wallet balance enforced by runtime. No generic agent budget implemented. |
| Malicious LLM / narrative | No LLM integrated. Structured proposals are validated; discoveries and narrative confer no rights. Future agent proposals cannot supply actor identity or keys. |
| Compromised function-call key | Local NPC keys have receiver/method restrictions and finite gas allowance; bootstrap full-access keys removed. No arbitrary NPC spending method. Future economic policies need separate contract limits. |
| Turn race | Serialized runner, campaign ID/revision, journaled dawn and contract expected-night checks; stale UI requests cannot spend twice. |
| Admin upgrade | No contract admin override; account full-access key could replace code. Key custody/removal policy unresolved. |
| Private keys | Disposable Sandbox credentials remain in ignored runner keystores; no browser/model access or logging; example contains configuration only. |
| Storage/gas exhaustion | Three fixed properties, four-level depth, 256 grants and 64 leases. Contract subsidizes bounded storage; production storage charging deferred. |
| Bootstrap theft | Private init and generated one-time init guard; deploy+init atomically after approval. Native tests do not prove generated export guard. |
| Property transfer | Not implemented. Epoch invalidation and lease treatment mandatory before transfers ship. |
| Local HTTP misuse | Loopback server with Host/Origin/JSON checks; fixed runner actors sign only in disposable Sandbox. No public-network credentials. Not a production backend. |
| Local failure rollback | Validate before mutation; M1B verifies real failed WASM receipts and unchanged game-state views. Recorded rejected calls have unchanged storage usage. |

M1B: nine scenarios pass on Sandbox 2.14.0/protocol 88; no authority bypass found.
Raw Cargo builds produce generic panic traps; use cargo-near for on-chain panic diagnostics.
The runner pins and RPC-checks the actual node version, and wraps wildcard listener
arguments to loopback (confirmed with `ss`). Workspaces' obsolete downloader path
handling otherwise silently selected 2.6.2. Runtime archive hash is pinned.
The dev-only dependency audit reports 13 low findings through elliptic; the tar
override removes high/critical findings. No production signing dependency added.
Capacity exhaustion, underfunded storage, maximum gas, upgrades and public-network
behavior are not proven by these small-fixture tests.

Evidence levels remain separate: SDK native tests are not Sandbox receipts or testnet proof.
No security audit claim. No mainnet or real funds supported.

M2 adds 12 real-WASM economy scenarios and finalized receipt/refund accounting.
Rent is prepaid/nonrefundable and vested on acceptance; accepted lease rights are
separate from revocable grants. Buyer, owner, nonce, expiry and exact-deposit checks
run before mutation. Claim marks payout pending before asynchronous transfer;
private callback either clears escrow or restores claimability. Pending/double
claim and spoofed callback are rejected. Transfer failure recovery is unit-tested;
real failed-transfer receipt injection and callback gas exhaustion are unverified.
The runner waits for `FINAL` before reading economic balances. Startup treasury is
finite and funded by disposable Sandbox genesis; no minted game resource/income.
Keeper may accelerate expiry and upgrade key may replace code: still trusted.
No public deployed-state migration. The local Sandbox database and versioned game
save now survive graceful restart; browser reload rereads both. No blanket production safety claim.

Usability correction: explicit player acceptance precedes a separate NPC response;
initialization has no player decisions. Local development signing is disclosed,
not wallet custody. Each actor signs as itself under existing contract authority.
New Game replaces only the play runner's worker; tabs share that session. Existing
test evidence is hash-checked unchanged by the reset regression. Room text confers
no rights; navigation/information now use fresh authoritative permission reads,
without signing narrative transactions. Consequential rights/payment mutations
still execute and validate in the contract.

Pass 1: action availability is computed server-side, then revalidated at execution.
Blood/action deductions and discovery completion commit together only on success.
Finite IDs prevent farming; signed relationships have no nonnegative resource rule.
`get_world.grant_validity` reuses the contract's existing ancestor/expiry checks.
Free local information effects cannot be atomic with an external chain transaction:
the runner rechecks `has_access` immediately before committing, under its single
writer. Unexpected external writes remain a trust/race boundary, not a claimed
fully decentralized simulation. Local save files are trusted development data,
not tamper-proof on-chain game resources. An operator with filesystem/upgrade-key
access can alter the simulation/code. Secrets remain only in ignored local saves.
Dawn recovery and compatible view upgrades are tested locally; power-loss
durability, hostile RPC, public custody and all crash interleavings remain unverified.

Pass 2A uses actor-specific contract views and explicitly projects observations;
copying the whole campaign to a policy is removed. Public chain records remain
public; this is input minimization, not ledger confidentiality. Exact proposal
shape rejects claimed actor/accounts/targets. The server selects identities and
retains existing method-restricted keys. Validation checks actual issuer/lessor,
night, payout pending and per-night completion; the contract remains decisive.
An expired grant can still be revoked by its issuer; vested rent survives expiry.

Structured outcomes commit after chain postconditions. Tests cover failure before
execution, an unconfirmed response and loss of a finalized NPC response followed
by reload. Reconciliation relies on immutable fixed grant/lease IDs and the
single-writer scenario; it is not generic exactly-once execution for arbitrary
future actions. External writes, hostile RPC, power-loss durability and malicious
local save modification remain unresolved. The one-action nightly limit is an
operator-enforced game rule, not a new on-chain scheduling guarantee. Invalid
selectors fall back once; no live provider, prompt sandbox or async timeout is
claimed. Pass 2B must add those controls before exposing model decisions.

## Pass 2B additions

Model output is untrusted JSON: exact fields, bound actor/observation ID, fixed
property/record/terms and existing permissions are validated before the executor.
No arbitrary method, gas, deposit, tool or account comes from model text. Public
agreement dialogue is untrusted data in subsequent observations and renders as
React text, separately from enforceable terms. Prompt instructions alone are not
an authorization boundary. NPC genealogy/House status never grants permission.

Provider access is server-only, disabled unless explicitly enabled with key/model.
Fixed endpoint, no redirects/tools, no provider errors/secrets logged. Limits and
request reservations bound usage per campaign; resets reset that budget, so this
is not a public-service billing/abuse defence. No credentials configured/live
provider test was run. Automated HTTP fixtures are not model-generated evidence.

JSON optional fields now omit undefined values to preserve exact reload state.
Lost accepted responses reconcile nonce AND postcondition; uncertain intent stays
pending. Fixed-ID recovery still assumes a trusted single writer/RPC and local
filesystem. Public deployment requires authentication, durable state/concurrency
control and reviewed testnet signing; never expose the dev bridge publicly.

## Pass 2C boundaries

The preserved provider is never invoked by gameplay, regardless of old environment
flags. New court actions share the existing validator; server-bound identities,
current issuer/owner/parent rights and immutable target records determine allowed
operations. Marius cannot revoke Seraphine's independently rooted rights. Restricted
keys add only grant_access/revoke_grant where required by the documented owner or
delegable grant. These keys are not a generic spending policy; no NPC rent payments
or arbitrary transfers are added. The player alone accepts exact prepaid sanctuary.

New private initializer only; no post-initialization administrative override or
state-layout change. New accounts/holdings are explicitly disposable gameplay
assignments, never production wallets or genealogical authority. Existing three-room
initializers remain unchanged. A rebuilt WASM and old regressions check compatibility.

One-action reckoning is journaled with committed decisions and reconciles lost
acceptance responses before dawn. Seeded competition/public opportunities and
endings are deterministic local simulation over verified rights; local files,
operator/keeper, upgrade key and RPC remain trusted. No distributed consensus over
service completion, private history or randomness is claimed. Capacity limits and
single-writer recovery remain bounded fixtures, not a production security audit.
Court outcomes commit only after grant/revoke/settlement postconditions. An external
writer or invalid pending intent may still require operator reconciliation.

## Pass 2D scenes
Scene storage is untrusted presentation state and carries no executable commands. Dialogue is escaped React text; only explicit typed choices reach the existing validator/executor. Skip, close, reload and inspection cannot sign. Pending/error snapshots suppress success/commit choices. Denied browser storage can repeat a vignette, not an authoritative transaction. This adds no production authentication or custody guarantees.

## Pass 2E read-only title
Save detection does not start NEAR or recover pending intents. The loopback-only metadata endpoint returns readiness/ID/night, never keys or private campaign contents. Its structural checks are not chain verification. Continue performs original recovery; stale IDs or unconfirmed recovery prevent replacement. Corrupt saves remain untouched. Explicit browser confirmation protects normal accidental replacement, not against the trusted local operator.
