> Current status: **Pass 4D PARTIAL**. Sustainable WASM deployed and verified at `night.we-inherit-night.testnet`; registry and bounded pool initialized. Runtime identity/signing and live gameplay acceptance remain blocked. Old castle is preserved. See [PASS4D](PASS4D.md) and `evidence/pass4d/final-verification.json`. Earlier sections are historical evidence.

# NEAR Testnet deployment



Current status: **Pass 4B.2 PASS — approved multi-campaign WASM deployed and two Testnet campaigns verified; restricted signing resolved using exact-key offline signing and pre-broadcast verification.** See [Pass 4B.2](PASS4B2.md). No public hosting or Pass 4C work.



The sections below preserve the **historical initial preflight**, including superseded account-approval status and single-world artifact details. Do not deploy that old artifact; use the checksum in Pass 4B.2.



## Tooling and build



| Check | Result |

| --- | --- |

| Rust / Cargo | PASS: 1.99.0 / 1.99.0 |

| cargo-near | PASS: 0.22.0 |

| Node / npm | PASS: v24.13.0 / 11.6.2 |

| near-cli-rs | PASS: near-cli-rs 0.31.1, official Windows installer; OS keychain storage |

| Rust tests | PASS: 13; `AWS_LC_SYS_PREBUILT_NASM=1`, `cargo test --manifest-path contract/Cargo.toml --lib` |

| Contract build | PASS: `cargo near build non-reproducible-wasm --locked --no-abi --manifest-path contract/Cargo.toml` |

| Testnet read-only RPC | PASS: account existence and protocol configuration queried |



Fresh artifact: `target/near/night_authority/night_authority.wasm`, 215,688 bytes.

SHA-256: `660fc1c0a0cc1ad66daff30ecda9a7c41303bf8369b12f0c36594ba3de0c0812`.



Official CLI installation reference: [near/near-cli-rs](https://github.com/near/near-cli-rs#install). The documented Windows PowerShell installer or official npm `near-cli-rs` distribution can provide the Rust CLI. Release 0.31.1 and actual account-creation command syntax were verified before provisioning; deployment commands remain unexecuted. No unrelated tool installation or environment replacement.



## Proposed names â€” NOT APPROVED / NOT CREATED



All names below returned `UNKNOWN_ACCOUNT` from `https://rpc.testnet.near.org`, using `query/view_account`, `finality: final`, at 2026-11-12 23:29 UTC (16:29 America/Edmonton). Evidence: `docs/evidence/testnet-account-preflight.json`. Absence is not a reservation; recheck before creation. Subaccounts can be created only after controlling their parent.



| Proposed ID | Purpose |

| --- | --- |

| `we-inherit-night.testnet` | Dedicated provisioning/funding parent; no game-engine authority |

| `castle.we-inherit-night.testnet` | Sole deployed Rust contract; self-signed private initialization; permanent deployment address in documentation |

| `keeper.we-inherit-night.testnet` | Restricted executor; advances the contract night |

| `player.we-inherit-night.testnet` | Dedicated verification player; Library owner, payer and grant/revocation signer |

| `vesper.we-inherit-night.testnet` | Crypt owner; revocation signer |

| `seraphine.we-inherit-night.testnet` | Lounge/sanctuary owner; setup grants/offers, then rent settlement |

| `marius.we-inherit-night.testnet` | Court owner; grants/revocations |

| `lucien.we-inherit-night.testnet` | Passage owner; grants, passage offer and rent settlement |

| `mirelle.we-inherit-night.testnet` | Scoped research/assistant grant signer |

| `dorian.we-inherit-night.testnet` | Competing research/assistant grant signer |

| `cassian.we-inherit-night.testnet` | Research entry and bounded funded passage acceptance/refund |

| `sabine.we-inherit-night.testnet` | Scoped sponsorship signer |



The namespace is technical account organization, **not** genealogy or shared political authority. Existing founder independence is unchanged. No existing project Testnet IDs were configured; `.env.example` contract/view IDs are empty. Sandbox account names and credentials are not valid substitutes.



## Original single-world preflight (superseded by Pass 4B.1)



Historical preflight only; do not use the following constructor against the new registry. See docs/PASS4B1.md for the replacement API and fresh artifact. One contract: existing `night-authority` WASM. Actual constructor is private, one-time `new_political(vesper, player, seraphine, marius, lucien, executor)`. All six actor arguments must be distinct. Each uses the matching approved subaccount, with `executor` mapped to `keeper`. The contract account must be transaction predecessor for initialization; a parent account merely owning the namespace cannot directly satisfy that check. Use a fresh intended account and self-signed deploy/initialize sequence, preferably one supported CLI transaction. Initialization deposit is zero; gas must be checked against actual CLI syntax/protocol limits.



Seed the existing grants, offers and Cassian allowance with their legitimate owners, matching `scripts/sandbox/scenario.mjs`; do not invent an admin seeding override. Restrict NPC/executor keys after bootstrap to the existing receiver/method allowlists. Keep deployment/recovery authority distinct from runtime NPC keys. Never enable the Sandbox scriptâ€™s automatic `upgradeView` deployment behavior against an unrelated public-network account.



## Funding and credential boundary



PASS: Testnet protocol version 88 reports `storage_amount_per_byte=10000000000000000000` yoctoNEAR. The WASM alone therefore requires **2.15688 Testnet NEAR** storage backing. This is a lower bound, not a sufficient funding quote: account/access-key storage, initialized state, grants, leases, escrow and gas need additional funding. Current Sandbox provisioning uses 5 NEAR for the contract, 0.25 for the player and 1 for each of nine other actors (14.25 total), which is a test allocation, not a demonstrated minimum.



Pass 4A uses the official CLI faucet for the parent and bounded parent-funded subaccount creation; finalized balances and funding evidence are recorded separately. Reassess storage and gas headroom before deployment. Existing purchase amounts are 0.02 NEAR sanctuary rent and 0.01 NEAR Cassian mandate, distinct from gas/key allowances. No Mainnet funds or cryptocurrency purchase.



Planned custody: supported CLI secure local keychain/storage, never chat, source, frontend `VITE_` variables or command-output logs. Ignore rules already cover `.local`, `.near-credentials`, keys, wallets and environment secrets. Preflight generated no credentials; subsequent Pass 4A credentials use the OS keychain outside the repository.



## Network configuration and execution findings



- `src/chain.ts` already centralizes mode selection. `sandbox`/`local` uses the development bridge; `testnet` permits finalized read-only `get_world` through the official Testnet RPC.

- Public environment fields: `VITE_MODE`, `VITE_NETWORK`, `VITE_RPC_URL`, `VITE_CONTRACT_ID`, `VITE_VIEW_ACCOUNT_ID`. Preserve Sandbox defaults. Do not populate real IDs before approval/deployment verification.

- Testnet mode rejects state-changing actions and does not supply campaign state. Selecting it is **not** playable Testnet integration.

- `scripts/bridge.mjs` launches a local runner (WSL on Windows); `persistence.mjs` starts local Sandbox and reads its validator/actor keystore. `scenario.mjs` provisions and signs disposable accounts; `campaign.mjs` performs deterministic NPC phases and journals verified outcomes. This executor cannot be switched to Testnet merely by changing a frontend RPC URL.

- Local accounts, fixed initial balances, `castle`/actor subaccounts, local `rootAccount`, local keystore and automatic compatible code upgrade are Sandbox assumptions. A CLI verification script must target explicitly approved Testnet accounts and never invoke this bootstrap against public state.

- No application configuration or execution source changed during preflight. Prior Sandbox evidence remains valid; no unrelated full campaign rerun.



## Deployment and verification evidence



| Requirement | Status |

| --- | --- |

| Approved account names | PASS: explicitly approved for Pass 4A |

| Created/funded accounts, CLI authentication | See docs/PASS4A.md and finalized RPC evidence |

| Actual deployed address / deployment hash / block | NOT RUN â€” none |

| Initialization transaction | NOT RUN â€” none |

| Deployed code hash vs intended WASM | NOT RUN |

| Authority reads, authorized grant/revoke, rejected access | NOT RUN |

| Independent right survives unrelated revocation | NOT RUN |

| Safe expiry / replay / unauthorized operation checks | NOT RUN |

| Payment acceptance and verified settlement | NOT RUN |



Initial UNKNOWN_ACCOUNT responses established name absence only; Pass 4A separately records actual account balances and creation transactions. Real negative authorization tests will be distinguished from deployment failures. Record finalized transaction outcomes and remote code bytes/hash after deployment; do not substitute Sandbox evidence. Explorer links will use actual confirmed hashes only.



## Public Vercel hosting requirements



A static React deployment can serve artwork/UI, but cannot run the present campaign. The Vite-only `/api/demo` bridge, WSL Sandbox process, filesystem locks and private keystore are absent from a production frontend build and unsuitable for ordinary ephemeral serverless execution.



Smallest compatible plan (NOT IMPLEMENTED): a trusted persistent Node execution service behind an authenticated, rate-limited session API, reusing deterministic validation and recoverable journals; durable per-campaign storage/locking; isolated server-side actor keys with receiver/method limits; exact bounded spending and settlement verification. Browser accepts only existing validated commands, never actor credentials or arbitrary contract calls. Production origins and authorization must be designed explicitly; do not expose the current privileged loopback bridge unchanged.



The original single-world contract could not isolate concurrent visitors. The locked Pass 4B architecture is now one deployed contract with many independently isolated on-chain campaign worlds. Pass 4B.1 implements that boundary locally; see docs/PASS4B1.md. A trusted hosted session/transaction service and durable off-chain campaign journals are still required. The verification accounts are not a shared public visitor identity pool. No visitor cryptocurrency purchase is required by this architecture; walletless custody and funding controls remain to be implemented. Personal wallet support is not integrated.



This deployment task does not implement that backend, shared-state redesign or Vercel hosting.



## Current hosting preparation (Pass 4E)
The historical assessments above are superseded by the implemented persistent
Node/SQLite backend and Render preparation. The deployed contract remains
night.we-inherit-night.testnet (Pass 4D); no redeployment is needed for this pass.
Use [Pass 4E](PASS4E.md) for the current single-service configuration, protected
restricted-key setup, memory measurement and exact dashboard steps. Hosted
gameplay and credential installation remain unverified and separately authorized.
