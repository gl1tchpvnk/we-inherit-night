# Pass 4A — Testnet accounts and funding

Status: **PASS — all 12 approved accounts created, funded and independently verified.** Contract deployment/initialization **NOT RUN**, awaiting separate approval.

## Verification

- Official near-cli-rs **0.31.1**, installed using the official Windows installer with `-NoModifyPath`; invoked from `%USERPROFILE%\.cargo\bin\near.exe`. Account command syntax checked using CLI help and release source.
- All names returned UNKNOWN_ACCOUNT before creation; each subaccount was checked again immediately before creation.
- CLI network explicitly `testnet`: archival-rpc.testnet.fastnear.com; faucet https://helper.nearprotocol.com/account. Independent verification used https://rpc.testnet.near.org with finalized account/key queries and FINAL transaction outcomes. No Mainnet requests.
- Parent received **10 Testnet NEAR** through the CLI faucet. It funded castle with 5 and ten actors with 0.25 each. Parent creation/subaccount creation deposits are actual transaction actions, not Sandbox balances.
- PASS: all transactions FINAL/SuccessValue, receipt outcomes contain no Failure, exact funding deposits and recipients match, each key matches its AddKey action, 12 distinct public keys, all code hashes indicate no deployed contract.
- Evidence timestamp: 2026-11-13T00:03:15.644467+00:00. Full public responses: [account and transaction evidence](evidence/pass4a-testnet-accounts.json).

## Accounts

Every account below is CREATED / VERIFIED. Balances include storage backing, not entirely spendable funds.

| Account | Confirmed Testnet NEAR | Creation + funding transaction |
| --- | ---: | --- |
| `we-inherit-night.testnet` | 2.4217351150875 | [CuTkwkEWbBAxq3yzAJhHzBHpiGmaXPG77XeCfaSCRDtw](https://explorer.testnet.near.org/transactions/CuTkwkEWbBAxq3yzAJhHzBHpiGmaXPG77XeCfaSCRDtw) |
| `castle.we-inherit-night.testnet` | 5 | [48wDcKHUR6f1g68zCYyV9XM3dvocxMCWp82w5y2VY7nq](https://explorer.testnet.near.org/transactions/48wDcKHUR6f1g68zCYyV9XM3dvocxMCWp82w5y2VY7nq) |
| `keeper.we-inherit-night.testnet` | 0.25 | [8n5Ri9HTvMCX2hw99emDjcVA8Xp7YifA5dmDsjf3sZqB](https://explorer.testnet.near.org/transactions/8n5Ri9HTvMCX2hw99emDjcVA8Xp7YifA5dmDsjf3sZqB) |
| `player.we-inherit-night.testnet` | 0.25 | [APKwiZPcapaFV1eVp84S8r2uwEqbtKo7ZpvkhzbdDEXm](https://explorer.testnet.near.org/transactions/APKwiZPcapaFV1eVp84S8r2uwEqbtKo7ZpvkhzbdDEXm) |
| `vesper.we-inherit-night.testnet` | 0.25 | [2RyYTXqmStbZf9RajWwtzzF5vpGxUoYFaHi4iem3Xuv5](https://explorer.testnet.near.org/transactions/2RyYTXqmStbZf9RajWwtzzF5vpGxUoYFaHi4iem3Xuv5) |
| `seraphine.we-inherit-night.testnet` | 0.25 | [GZzYDRR5AQGx7rfv76jkkiiQjWSseSR93MQD8kACJMAi](https://explorer.testnet.near.org/transactions/GZzYDRR5AQGx7rfv76jkkiiQjWSseSR93MQD8kACJMAi) |
| `marius.we-inherit-night.testnet` | 0.25 | [13NMhjbpDAjPs2YN9kxWUDQpjAacDf6LRLwvgTGz2GCv](https://explorer.testnet.near.org/transactions/13NMhjbpDAjPs2YN9kxWUDQpjAacDf6LRLwvgTGz2GCv) |
| `lucien.we-inherit-night.testnet` | 0.25 | [YgnsMcRUfRHsyyiuxdU5psrkRR3yziPEUG4FMxNzhbs](https://explorer.testnet.near.org/transactions/YgnsMcRUfRHsyyiuxdU5psrkRR3yziPEUG4FMxNzhbs) |
| `mirelle.we-inherit-night.testnet` | 0.25 | [F5CKfKdYyifiFeHA6TA3viuCFaytKeMibRkVSU5HbHyq](https://explorer.testnet.near.org/transactions/F5CKfKdYyifiFeHA6TA3viuCFaytKeMibRkVSU5HbHyq) |
| `dorian.we-inherit-night.testnet` | 0.25 | [8PLN2kGd4jVhpCDm6k4QQgV6NKJsWmgj4Lm9b7dBUoJs](https://explorer.testnet.near.org/transactions/8PLN2kGd4jVhpCDm6k4QQgV6NKJsWmgj4Lm9b7dBUoJs) |
| `cassian.we-inherit-night.testnet` | 0.25 | [FVg8w8Vcu2rzMpA56sMTDinRDd1TcuWhYSx463rdeYxR](https://explorer.testnet.near.org/transactions/FVg8w8Vcu2rzMpA56sMTDinRDd1TcuWhYSx463rdeYxR) |
| `sabine.we-inherit-night.testnet` | 0.25 | [2gp5xrRxJDuLWqLqi5DDYTomzv85fB5vQ9P1NNz8WDKu](https://explorer.testnet.near.org/transactions/2gp5xrRxJDuLWqLqi5DDYTomzv85fB5vQ9P1NNz8WDKu) |

## Credential and authority boundary

Each account has one independently generated Ed25519 **FullAccess provisioning key**, saved by `save-to-keychain` in the Windows OS keychain outside the repository. All CLI calls confirmed keychain storage; no legacy plaintext fallback occurred. No existing credentials were overwritten. No secret material was printed or recorded in project files. Public keys and signatures in RPC evidence are public data.

These are administrative provisioning credentials, **not NPC runtime wallets**. No autonomous executor is connected. Before runtime use, bootstrap legitimate owner operations and establish the existing receiver/method-limited NPC keys and custody boundaries; do not give the runner unrestricted provisioning credentials. No game rights, leases, budgets or initialization have been asserted by account creation.

## Funding limitations and deployment prerequisites

- No faucet restriction or failed account transaction occurred. No paid funding or real cryptocurrency purchase. Creation fees totaled 0.0782648849125 Testnet NEAR from the parent.
- Five NEAR is reserved in castle; the previously verified WASM-only storage floor was 2.15688 NEAR. Recheck current storage/gas and initialized-state headroom before deployment. Actor funds are finite verification budgets, not recurring income or fictional wealth.
- Separate approval is required before deploying the verified WASM, initializing, seeding authority and testing contract operations. Recheck artifact checksum and balances then.
- Final public multi-campaign architecture remains undecided. These accounts establish only the initial verification environment; no requirement for a separate contract per public campaign is implied.
- Vercel deployment, Testnet gameplay integration and restricted runtime signing remain NOT RUN.

## Checks and scope

PASS: real RPC/transaction assertions described above. A local evidence assertion initially failed because NEAR serializes CreateAccount as a string, not an object; corrected the assertion and checked the already fetched evidence without resending transactions. No network execution failure occurred.

NOT RUN: Node/Rust/build/browser regressions in this account-and-documentation-only task. Previous build/Rust evidence remains in [deployment preflight](TESTNET_DEPLOYMENT.md); no source, contract, gameplay, artwork, saves or Git history changed. No commit or push performed.
