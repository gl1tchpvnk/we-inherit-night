# Pass 4B.2 — Testnet deployment and two-campaign verification



Status: **PASS — targeted Pass 4B.2 acceptance complete, including corrected restricted signing.** No Pass 4C work started. The earlier blocked run is retained below as historical evidence.



## Pass 4B.2-FIX — restricted signing resolved

**PASS.** Existing deployment, registry and campaigns were preserved. The fix added and revoked one minimal, nondelegable Crypt test grant to Sabine in verification-a (expiry night 1); original rights and Campaign B are unchanged.

### Root cause and corrected mechanism

The [official near-cli-rs v0.31.1 keychain signer source](https://github.com/near/near-cli-rs/blob/v0.31.1/src/transaction_signature_options/sign_with_keychain/mod.rs) branches on offline mode. Online mode filters available keys to FullAccess (unless gas-key mode is requested) and chooses the first retrievable credential; it does not use `scope.signer_public_key` for that selection. Offline mode instead looks up the exact account/public-key OS-keychain entry. Thus the earlier argument was not an online restricted-key selector.

Used supported `near --offline ... sign-with-keychain --signer-public-key <intended-public-key> --nonce <fresh-access-key-nonce+1> --block-hash <final-block-hash> --block-height <final-block-height> save-to-file <signed-transaction.json>`. The CLI accessed the existing Windows keychain entry directly; no private key was exported, printed, rotated or copied. A legacy-keychain fallback would abort verification.

Only the signed public transaction was saved under ignored `.local`. Before **every** broadcast, the existing near-api-js decoder and Node crypto verified signer, receiver, intended public key, nonce, exact action/arguments/deposit/gas (or approved WASM hash for the negative test) and Ed25519 signature over the serialized transaction hash. Any mismatch aborted before network submission. The transaction hash was journaled before a single RPC `send_tx` with `wait_until: FINAL`. Provisioning and restricted signatures were explicitly distinguished. No dependencies, contract, gameplay or production backend code changed.

The 50 Tgas attempt was deterministically rejected before inclusion with `NotEnoughAllowance`: required 0.0509193347384685 NEAR exceeded the existing 0.05 allowance. It was not an unknown-finality transaction. A distinct 10 Tgas transaction then succeeded without changing the key or allowance. The restricted key's remaining allowance is **0.0497363527785161 NEAR**. Initial local decoder type mismatches aborted before any broadcast; corrected to the installed library's decoded byte/enum representation.

### Transaction and rejection evidence

| Operation | Result | Transaction hash / locally computed rejected hash |
| --- | --- | --- |
| Minimal legitimate grant, explicit provisioning key verified before broadcast | FINAL success | `DqxgmQ9q51JJcSvYPH7nLmD3wACgMPvwwmNbqRt44if7` |
| Restricted revocation, 50 Tgas reservation | Pre-inclusion `NotEnoughAllowance` | `CSYj2x1LExNG7u1iBYbNuT5QvzCLRQMbAjPsGHRqf7jU` |
| Restricted revocation, 10 Tgas | FINAL success | `Hd2YJ6KY7so6AAfWgSLD6hqkphrkreWJdmBiuhreeagm` |
| Restricted `advance_night` | Pre-inclusion `MethodNameMismatch` | `FKG7Lt3PgUVobF9G7ns7fi4Pwo5CjkUqKBPQP6G8pC21` |
| Restricted DeployContract attempt | Pre-inclusion `RequiresFullAccess` | `BbgGmsh5sDgRuFABDeXTLCRQnnHPzAH53DuGj816d6Fi` |

[Successful restricted transaction](https://explorer.testnet.near.org/transactions/Hd2YJ6KY7so6AAfWgSLD6hqkphrkreWJdmBiuhreeagm). Independent subsequent RPC queries confirm FINAL success, no failed receipts and transaction public key **`ed25519:4npGof7CY5hWbtx1PfFGswyNR3dxp2qCsH23nwdW25GD`**. The rejected hashes identify signed requests, **not included transactions**; access-key validation rejects them before execution, so no finalized receipts exist or are claimed for those requests. RPC errors are preserved verbatim and final access-key nonce proves neither negative test executed. RequiresFullAccess rejects the administrative action before contract code can run; no redeployment occurred.

Public machine-readable evidence: `evidence/pass4b2/fix-*-submission.json` contains pre-broadcast verification audits; `fix-*-response.json` contains RPC results/errors; `fix-grant-final.json` and `fix-revoke10-final.json` contain independent finalized receipt queries; [final state comparison](../evidence/pass4b2/fix-final-state.json) and [fix summary](../evidence/pass4b2/fix-summary.json).

### Final checks and limits

- PASS: new test grant revoked; original A grants, access, ancestry, properties, night, leases and player nonce unchanged. B's entire player world view unchanged, including accepted sanctuary and finances.
- PASS: contract code hash unchanged; no new campaigns/initialization. Storage now **496323 bytes** from the extra revoked test record. Castle balance **11.1357778046366181 NEAR**, unchanged by these zero-deposit tests.
- PASS: existing provisioning and restricted keys both remain. Restricted nonce equals the successful revocation's nonce; rejected operations did not consume it. FullAccess credentials never entered the restricted-signing process.
- PASS: two finalized transactions and three deterministic pre-inclusion rejections in this fix. No uncertain transaction was retried.
- NOT REPEATED: Rust, Node gameplay, Sandbox and production-build regressions; only operational verification scripts, evidence and documentation changed, not application/source/WASM. Existing Pass 4B.1 evidence remains applicable.

This is a verified local operational signing method, not a production runtime or public custody solution. Keep online CLI keychain auto-selection out of restricted execution. Future signing must preserve exact-key offline lookup and pre-broadcast checks; never use a signed transaction file as a reusable action template. Pass 4C still needs visitor authentication, isolated custody/session authorization, durable execution/recovery, frontend integration and hosting. **Stop after this fix; no Pass 4C implementation.**

## Earlier deployment run and resolved blocker (historical)

## Current deployment



- Contract: `castle.we-inherit-night.testnet`, NEAR Testnet only; one successful deployment, no upgrade or second contract.

- Deploy: `663TFjUduJwkjuRiHiw3pMg34yLcxioJ5Aejvi3EHqtL`.

- Registry initialization: `H7yMcS72iDg7GyrrktyrtLacKq1v4q6DJnj9FbTYcZg8`.

- Approved WASM: 492306 bytes, SHA-256 `a96adbe06a90e92a6a92a4c82da1165273c6e054c3cf1c55e6a15861bd0e92a5`.

- RPC `view_code` bytes exactly match the local approved artifact. On-chain code hash: `CQLQdiyR7RwaocGCAXypqpiC5ALAjXuFPjwDKC8kyjYg`.

- Registry state was queried after initialization. Both campaign views subsequently prove registry/campaign usability.

- Current storage: **496223 bytes**, versus 492488 immediately after deployment. Storage price: 0.00001 NEAR/byte. Two 3 NEAR campaign reserves remain backing, not gameplay income.



## Campaigns and targeted results



Both use the complete political configuration, existing Crypt grant, Lounge/sanctuary offers, Mirelle Library grant, Sabine court grant, Lounge invitation and Cassian's 0.01 NEAR passage budget. No narrative or contract code changed.



| Check | Result / finalized transaction |

| --- | --- |

| Create verification-a | PASS — `EUMJpZfiRjxm5XGAi1b5ZERUtEwZHVC1brsss7GjXLcJ` |

| Create verification-b | PASS — `CrnDxMK8N1Ra5PAem9gMyrKkpJvD3zBsDQEyQxKuWEw1` |

| A Crypt grant | PASS — `4iPrXu1Jzse4urEem7K2uKuDsYtWY6pqnJGKiwnxZV87` |

| A successful entry | PASS — `8G2FCJ5FCXAxfVKpHHTvXKd7zAxN8unHtiu1GqLeY3qR` |

| A revocation | PASS authority, **not restricted signing** — `6UmYh27yM6hgV17ue53im1KWarqMTSW2KUrhsBkr2hMk` |

| A denied entry | PASS expected finalized `access denied`; unchanged state — `A9KPpLkCKinAVGPdqFowYDLh9YPRD7uZmTXmGY7LTedJ` |

| Independent Library entry | PASS — `2Rjtwdxa3FZ4CgQqgKmYAU1xLvwHX4rAme6aqQWuWZTa` |

| A player attempts B Library grant | PASS expected finalized `owner required`; unchanged B state — `3cUUoCEGcidme2nqLegbt5PXXFY3ZP8Kjmo3rY9nqZqv` |

| B sanctuary payment | PASS — `7iLD814gQUxn3LEfjyD7Tq7mZ9xh8bctSWuZXtXurukq`, exact 0.02 NEAR deposit, accepted lease/end night 7, escrow and effective sanctuary access verified |

| Cross-campaign comparisons | PASS — B unchanged throughout A tests; A unchanged by B payment |

| Restricted NPC signing | BLOCKED — key installed correctly, but CLI signed using existing FullAccess key |



A player is `player.we-inherit-night.testnet`; B player is `win-funding-20261112-a.testnet`, the existing funding account. Eight NPCs and keeper are shared approved accounts. Each world assigns their roles independently, but a shared identity authorized in both has legitimate signing power in both. Function-call keys do not restrict campaign arguments. This is not public visitor authentication or custody isolation.



Final worlds both remain at night **0** (smoke checks, not seven-night Testnet playthroughs). A Crypt grant is revoked; its Library ownership remains effective and sanctuary offer remains unaccepted. B Crypt grant remains active; B sanctuary lease is accepted with 0.02 NEAR escrow. Each world retains its separate 0.01 NEAR Cassian mandate. Initial/bootstrapped/final states and actor rosters are saved in `evidence/pass4b2/`.



## Restricted signing blocker — do not treat these tests as PASS



Vesper's new key was added successfully in transaction `CihWZZgkW2XGZ3BoJjV4kzif6kjBqCk86UXwnMnzFFef` and saved to Windows OS keychain. Existing provisioning credentials were preserved.



- Restricted public key: `ed25519:4npGof7CY5hWbtx1PfFGswyNR3dxp2qCsH23nwdW25GD`.

- RPC permission: receiver castle, methods exactly `revoke_grant`, allowance 0.05 NEAR. Its nonce and allowance remained unchanged, confirming it was not used.

- near-cli-rs 0.31.1 was invoked with `sign-with-keychain --signer-public-key` naming that restricted key. Actual transaction public keys instead identify the existing FullAccess key `ed25519:7SDc1pJ4Xu8J8NbEnbRTfLwYnkq9Udfy845kyAXfSEjo`.

- This affects the successful revocation as well as the negative tests. Earlier progress wording describing a restricted-key revocation was incorrect; the final RPC audit corrected that attribution.

- Unauthorized `advance_night`: `GWTm8Juhwm15h9UoURvJJMkWXLESXzUjBcso3bokMZ3m`, finalized failure `executor required`.

- Attempted DeployContract: `9YDZKF4QnohqbZFcmttSTnybxwwJon1ajSFoYGGhVnwh`, finalized failure `ActorNoPermission`; code and world state unchanged. This was a rejected signing test, not another successful deployment.

- Both are contract/protocol authorization rejections using a provisioning key, **not access-key method/full-access restriction evidence**. No unauthorized state change succeeded. The test harness's initial error-text categorization was insufficient; saved evidence now contains the actual finalized receipts.



All further signing stopped. Required next fix: a supported signing path that selects only the intended OS-keychain runtime credential, verifies the signed transaction's public key **before broadcast**, and cannot fall back to provisioning credentials. Diagnose without exposing or replacing existing secrets. Then perform one allowed restricted operation and actual access-key-level method/deployment rejections. Do not redeploy or recreate these campaigns. This is the remaining Pass 4B.2 blocker, before Pass 4C.



## Verification and evidence



All included transactions were queried separately with `wait_until: FINAL`, checking receipt failures and relevant state postconditions. Expected contract failures are retained as real receipts. The first entry's verification hit HTTP 429 on rpc.testnet.near.org; signing paused, one read-only recovery attempt after cooldown was also rate-limited. Its existing hash was then resolved FINAL through `https://test.rpc.fastnear.com`, a public endpoint listed in [NEAR RPC documentation](https://docs.near.org/api/rpc/providers). No transaction was resubmitted. Subsequent queries were paced. CLI responses alone were not treated as proof.



Finalized transaction audit: **27 unique transactions, 23 successful and 4 expected rejections**. The two signing-negative rejections do not satisfy restricted-key acceptance. [Machine-readable summary](../evidence/pass4b2/summary.json).

Full public receipts, code verification, key permissions, snapshots and balances: [evidence directory](../evidence/pass4b2/). Transaction links use `https://explorer.testnet.near.org/transactions/<hash>`; [deployment](https://explorer.testnet.near.org/transactions/663TFjUduJwkjuRiHiw3pMg34yLcxioJ5Aejvi3EHqtL). CLI output and submission markers are retained to prevent accidental replay; they contain public arguments/keys/signatures, not private keys. Helpers remain under ignored `.local`; no production executor was introduced.



Previously verified and NOT REPEATED: Rust 19/19, Node 92/92, Sandbox 52/52, two full seven-night Sandbox campaigns and production build. Source/WASM unchanged. These remain local regression evidence, not Testnet gameplay evidence. No Rust, game logic, UI, artwork, save or Git-history changes.



## Final balances and capacity



| Account | Testnet NEAR |

| --- | ---: |

| `castle.we-inherit-night.testnet` | 11.1357778046366181 |

| `we-inherit-night.testnet` | 2.4217351150875 |

| `vesper.we-inherit-night.testnet` | 0.2433823532892089 |

| `player.we-inherit-night.testnet` | 0.2487825078122579 |

| `seraphine.we-inherit-night.testnet` | 0.2483849483314075 |

| `cassian.we-inherit-night.testnet` | 0.2295045298830115 |

| `win-funding-20261112-a.testnet` | 3.8844261538912693 |



Castle includes **0.04 NEAR of economic liabilities**: two 0.01 passage budgets and B's 0.02 sanctuary escrow. These are not free storage funds. Existing two-campaign reserves are backed; current funding does not cover another 3 NEAR campaign reserve. There is no permanent two-campaign limit: future creation needs additional unencumbered funding, not new WASM. No third campaign was attempted.



Pass 4C prerequisites remain: secure provisioning/runtime custody separation, walletless visitor sessions and authentication, durable public campaign storage and transaction recovery, backend execution, frontend integration, hosting and final end-to-end public gameplay verification. None was implemented in this pass.



## Historical funding/preflight record



The following records describe earlier stages, not the current deployment status.



Status: **PARTIAL â€” funding recovery PASS; deployment and contract smoke tests NOT RUN.** Castle now holds **11.1 Testnet NEAR**, independently verified after one authorized funding transfer. No deployment, initialization or campaign creation occurred. No Pass 4C work started. Earlier blocked attempts below are historical evidence.



## Successful funding recovery



The user explicitly authorized up to two normal official CLI faucet requests, accepting service-enforced restrictions and requiring a stop on rejection. One request succeeded; no second account was needed or created. No rate-limit bypass, alternate-route retry, paid service or Mainnet operation occurred. This establishes acceptance of this actual request, not a general claim about unpublished faucet limits.



- Created `win-funding-20261112-a.testnet` using near-cli-rs 0.31.1, `sponsor-by-faucet-service`, `autogenerate-new-keypair`, `save-to-keychain`, `network-config testnet create`.

- Independent FullAccess provisioning credential saved in the Windows OS keychain, confirmed by CLI. No existing credential changed; no secret exposed or stored in Git. This account is a funding account, not an NPC runtime signer.

- Creation/funding transaction: [FYoKJWgycnYDig2w467N3fctErpAvADz8u9xaG8hijCZ](https://explorer.testnet.near.org/transactions/FYoKJWgycnYDig2w467N3fctErpAvADz8u9xaG8hijCZ). RPC verifies FINAL success, CreateAccount, **10 NEAR** Transfer and the matching public AddKey. [Creation evidence](../evidence/pass4b2-funding-created.json).

- Transferred **6.095 NEAR** to castle: [36MS8cuw8sam4SC5H5NAAnK6n494rxtDrLM7T9hCdvRZ](https://explorer.testnet.near.org/transactions/36MS8cuw8sam4SC5H5NAAnK6n494rxtDrLM7T9hCdvRZ). Independent official RPC verifies FINAL success, no failed receipts, exact signer, recipient and attached transfer amount. [Transfer and balance evidence](../evidence/pass4b2-funding-transfer.json).



| Account | Initial NEAR | Final NEAR |

| --- | ---: | ---: |

| Funding account | 10 | 3.9049553634875 |

| castle.we-inherit-night.testnet | 5.005 | 11.1 |



Funding-account fee: **0.0000446365125 NEAR**. Both accounts retain 182 storage bytes; storage backing is 0.00182 NEAR each at the verified price. The unused funding balance is retained because the castle target was met, rather than transferring unnecessary excess. Castle still has no deployed code. Remaining shortfall against 11.1 NEAR: **0**. Current target covers the previously measured 10.92616 code/base/two-reserve backing plus gas/headroom; recheck at deployment.



PASS: real creation and transfer receipts, funded balance, public key, exact transfer and final balances. NOT RUN: contract deployment/initialization or game-contract tests, per this funding-only authorization. Source and WASM unchanged; existing regressions not repeated. Stop here pending deployment instructions.



## Newly verified



- PASS: near-cli-rs 0.31.1; network explicitly Testnet. All twelve approved accounts exist, each with its existing single FullAccess provisioning key. Runtime restricted keys have not been installed. Credentials remain in the OS keychain outside the repository.

- PASS: `target/near/night_authority/night_authority.wasm` is 492,306 bytes, SHA-256 `a96adbe06a90e92a6a92a4c82da1165273c6e054c3cf1c55e6a15861bd0e92a5`, exactly the approved Pass 4B.1 artifact.

- PASS: destination `castle.we-inherit-night.testnet` has no deployed code and empty state. Latest finalized state query: block 277439187. No existing deployment would be overwritten.

- PASS: interfaces inspected: private `new_registry`, private payable `create_campaign` with political configuration, explicit participants and 3 NEAR reserve per campaign. Old single-world constructors will not be used.

- Public RPC evidence: [preflight](../evidence/pass4b2-preflight.json), [funding follow-up](../evidence/pass4b2-funding-check.json). Queries use `https://rpc.testnet.near.org` and finality `final`.



## Funding



Final confirmed balances: castle **5 NEAR**, parent **2.4217351150875 NEAR**, each of keeper, player, Vesper, Seraphine, Marius, Lucien, Mirelle, Dorian, Cassian and Sabine **0.25 NEAR**. All accounts currently use 182 storage bytes. These balances include storage backing and are Testnet funds, not fictional wealth.



Measured storage price: 0.00001 NEAR/byte. Approved code plus account usage and the registry's 128-byte base allowance costs approximately **4.92616 NEAR**. Two independent 3 NEAR reserves bring the backing requirement to **10.92616 NEAR before gas**. At the queried gas price of 100,000,000 yoctoNEAR/gas, three 100 Tgas initialization/creation calls budget 0.03 NEAR; deployment additionally costs gas. A working target of **11.1 NEAR in castle** provides overhead. Recalculate at resumption.



Castle is **6.1 NEAR short of that target**. Using parent funds while retaining 0.1 NEAR there would still require **3.7782648849125 NEAR of additional funding**, before transfer gas. No funds were moved. Actor budgets were preserved. Current funding cannot safely support even one campaign alongside the approved code; no storage margins were reduced.



Additional funding confirmed: **0 NEAR**.



| Attempt | Result |

| --- | --- |

| near-faucet.io, existing castle, requested 2 NEAR | FAIL: finalized receipt rejects receiver: `Smart contract panicked: Invalid receiver_id!` |

| near-faucet.io, existing parent, requested 2 NEAR | Unresolved submission: UI displayed `There was an error.` with no transaction hash. Follow-up balances unchanged; no funding confirmed. Not retried. |

| Alternative Triangle faucet availability | BLOCKED: HTTP 503; no funding request submitted. |



Castle faucet transaction: [Fcfz6MiYzVR6wJ6r6YhrpheSUMEzuXRN9bvgDS5fiAL3](https://explorer.testnet.near.org/transactions/Fcfz6MiYzVR6wJ6r6YhrpheSUMEzuXRN9bvgDS5fiAL3). Independent RPC confirms `FINAL` and failed execution; [full response](../evidence/pass4b2-faucet-castle.json). This is a faucet failure, not a game-contract test or successful transfer. The parent attempt has no known transaction identifier; do not blindly resubmit it.



## Deferred verification



NOT RUN: deployment/code-hash comparison, `new_registry`, `verification-a` and `verification-b` creation, authority grant/entry/revocation/rejected entry, independent Library access, cross-campaign rejection/state comparison, economic transaction and restricted NPC signing. No deployment or campaign transaction hashes exist. Actor rosters and shared-identity implications must be recorded when campaigns are actually created. Public visitor authentication remains unsolved.



Previously verified, deliberately NOT REPEATED: Pass 4B.1 Rust 19/19, Node 92/92, Sandbox 52/52, two independent seven-night Sandbox campaigns and production build. Contract/source/artifact unchanged; these are local regression results, not Testnet transaction evidence. This pass changed documentation and public evidence only.



## Resume prerequisites



### Funding recovery follow-up â€” BLOCKED on faucet terms



The user authorized at most two additional official-faucet accounts, conditional on compliance with funding limits, and required stopping if applicable terms could not be established. The [official CLI documentation](https://docs.near.org/tools/cli) and [near-cli-rs guide](https://github.com/near/near-cli-rs/blob/main/docs/GUIDE.en.md) confirm sponsored Testnet account creation and OS-keychain storage. Neither inspected source establishes current per-user/IP/project limits or permission to create multiple accounts specifically to consolidate faucet funds. No assertion that this is prohibited is made; permission remains unverified. A GET to the helper root returned HTTP 404, which does not establish the availability of its POST account-creation endpoint. No account-creation request was submitted to probe its limits.



Stopped before generating credentials, creating either account or transferring funds. No new account IDs or transfer hashes exist. No deployment or initialization occurred.



Fresh finalized RPC evidence: [funding recovery](../evidence/pass4b2-funding-recovery.json), block 277440780. Castle balance is now **5.005 Testnet NEAR**, storage usage 182 bytes, no deployed code. The 0.005 NEAR increase is not attributed to a faucet without transaction evidence. Storage remains 0.00001 NEAR/byte, so the prior 11.1 NEAR working target remains appropriate; shortfall **6.095 NEAR**. Initial and final balance during this read-only recovery check are unchanged. Obtain an official policy or operator confirmation covering this use before creating faucet-funded donor accounts; alternatively request a direct authorized Testnet top-up. Existing regression evidence remains valid and tests were not repeated for this documentation-only follow-up.



Funding is now adequate for the working target. On explicit resumption of deployment, recheck balances/storage, verify destination still has no code/state and recheck the approved checksum. Then deploy once, initialize, create the two worlds and execute targeted smoke tests with finalized receipts and postconditions. No campaigns exist yet; funding is budgeted for two, not a permanent two-campaign cap.



Pass 4C remains unimplemented: production execution service, walletless visitor authentication, persistent public campaign state, restricted signing and durable transaction recovery, frontend integration, public hosting and final end-to-end gameplay verification. No claim of publicly playable readiness is made.

