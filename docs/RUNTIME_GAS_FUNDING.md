# Runtime gas funding — verified

**PASS — all eleven runtime accounts reviewed; three transfers and eleven
finite allowance increases verified FINAL-success through FastNEAR and dRPC.**
This operational pass stops after funding verification. No gameplay was resumed.

## Corrected five-campaign budget

Live Testnet protocol version 88 reports block gas price 100,000,000 yoctoNEAR/gas
and `min_gas_purchase_price` 1,000,000,000. The earlier funding review used the
block price alone and missed the higher upfront purchase requirement. The hosted
50-Tgas provisioner call was rejected with an upfront cost of
0.0509193907729125 NEAR against a balance of 0.0499579391840732.

The [NEAR gas specification](https://near.github.io/nearcore/architecture/how/gas.html)
distinguishes upfront purchase from eventual burn. Unused gas and price-difference
refunds also replenish finite FunctionCall allowances under the
[allowance refund rules](https://github.com/near/nearcore/blob/master/docs/RuntimeSpec/Refunds.md).
An allowance is a cap, not additional account funds.

Each role's allowance covers a conservative five-game burn budget at **twice**
the observed block price, plus one fully prepaid next call, with **25%** further
headroom, rounded up to 0.025 NEAR. Each call includes a 2-Tgas fee reserve for
the existing bounded arguments. No gas limits or gameplay actions changed.

Per-campaign call envelopes (10-Tgas / 50-Tgas): provisioner 0/1; player 8/0;
Vesper 8/0; Seraphine 0/2; keeper 13/0; Marius 7/0; Lucien 7/1;
Mirelle 7/0; Dorian 7/0; Cassian 7/1; Sabine 7/0.
These preserve the earlier seven-night/settlement budgets and conservatively
include a player rejection, extra Vesper revocation, and Lucien/Cassian settlement.
Navigation is read-only. `accept_lease` remains 10 Tgas; only open/claim/refund
methods attach 50 Tgas. Thirteen keeper calls cover the clock and lifecycle work.

Formula: `round_up_0.025(1.25 * (five_game_gas_with_fees * 2 * block_price
+ largest_next_call_with_fees * max(2 * block_price, min_purchase_price)))`.
Account targets additionally retain storage stake and 0.02 NEAR for administrative
fees/headroom. Only balances below those targets were topped up. After fees,
every account still has its allowance plus storage stake and at least 0.01 NEAR.
This is a finite five-campaign operating envelope, not unlimited future gameplay
or a guarantee against arbitrary network price increases/retries.

## Scope and verification

- Reserve A transferred **0.20 Testnet NEAR**: provisioner 0.125, Lucien 0.025,
  Cassian 0.05. The other eight balances needed no transfers.
- Each allowance increase atomically deletes/re-adds the **same public key** with
  the exact existing receiver/method list and finite allowance. No new keypairs,
  accounts, faucet use, secret exports or runtime credential changes.
- All other keys and permissions, including administrative FullAccess keys,
  were preserved. Administrative signing stayed in the existing local Windows
  keychain; no administrative credentials were supplied to Render.
- Exact signed actions, amounts, public keys, nonces, signatures and transaction
  identities were verified before broadcast. All fourteen transactions and every
  receipt succeeded at FINAL through both RPC providers. Account balance changes
  reconcile exactly to transfers and receipt fees; no unexplained changes.
- Contract balance, code hash, entire stored state, pool, capacity and access keys
  remained unchanged. No application code, gameplay, Render configuration,
  build, deployment, commit or push was performed.
- Reserve A: **5.79982145395 NEAR**; reserve B: **10 NEAR**; total remaining
  reserve **15.79982145395 NEAR**. Total operation fees across reserve and runtime
  accounts: **0.0008055407963982 NEAR**.

Evidence: [final verification](../evidence/runtime-gas-funding/final-verification.json),
[reviewed budgets](../evidence/runtime-gas-funding/preflight.json), and per-operation
intents, signature-verification metadata and dual-provider FINAL receipts in the
same directory. Evidence contains public data only. No unrelated regression tests
were run because neither application nor contract code changed.

## Remaining hosted blocker

The previously journaled provisioning transaction
`9Dc5Gtrux5zwbAYZ56bdotq8kv4Rk7579SZwu2VykXLg` is still UNKNOWN_TRANSACTION on both
providers. Allowance replacement advances the runtime key nonce; the old signed
intent must be reconciled safely before hosted gameplay can continue. The hosted
journal was not altered and no replacement gameplay transaction was signed.
Funding verification does **not** establish that the existing pending request
will automatically recover. Public seven-night gameplay remains unverified.

## Final balances, allowances and receipts

All amounts below are Testnet NEAR; account names use the suffix
`.we-inherit-night.testnet`. Public keys and exact method lists are unchanged from
[the runtime key manifest](RUNTIME_KEYS.md).

| Account role | Final balance | Finite allowance | Top-up |
|---|---:|---:|---:|
| provisioner | 0.1748968890431464 | 0.15 | 0.125 |
| player | 0.2486793591189167 | 0.15 | 0 |
| vesper | 0.2427396450265105 | 0.15 | 0 |
| seraphine | 0.2482207906992229 | 0.2 | 0 |
| keeper | 0.2498357603487148 | 0.225 | 0 |
| marius | 0.2493592651772978 | 0.125 | 0 |
| lucien | 0.2748968721002336 | 0.25 | 0.025 |
| mirelle | 0.2498968813418224 | 0.125 | 0 |
| dorian | 0.2498968813418224 | 0.125 | 0 |
| cassian | 0.2794013873507295 | 0.25 | 0.05 |
| sabine | 0.2498968898132788 | 0.125 | 0 |

| Operation | FINAL transaction |
|---|---|
| transfer provisioner | [6Dk12gJ83kEXrdbSjhXYPdPRQeN3ArnndunH8RfVUApt](https://testnet.nearblocks.io/txns/6Dk12gJ83kEXrdbSjhXYPdPRQeN3ArnndunH8RfVUApt) |
| allowance provisioner | [7aAjFAmDQiFNW523Kr2m5GSZbAdZGZ71XcyeoHBuhjzT](https://testnet.nearblocks.io/txns/7aAjFAmDQiFNW523Kr2m5GSZbAdZGZ71XcyeoHBuhjzT) |
| allowance player | [6TUNQ8kyHAxeGUBABhjLGxHtocUeEV4kHD1gBnmavMno](https://testnet.nearblocks.io/txns/6TUNQ8kyHAxeGUBABhjLGxHtocUeEV4kHD1gBnmavMno) |
| allowance vesper | [CKr7cP8cSmNNizLeqomhWRuhrgefcidSebvCetmbZqQJ](https://testnet.nearblocks.io/txns/CKr7cP8cSmNNizLeqomhWRuhrgefcidSebvCetmbZqQJ) |
| allowance seraphine | [83Vs3Hwk2tr2zsdKXFJjqi5ruUoydCv6JZHfCPaqCQhK](https://testnet.nearblocks.io/txns/83Vs3Hwk2tr2zsdKXFJjqi5ruUoydCv6JZHfCPaqCQhK) |
| allowance keeper | [D7C1WascF1c6sfRaPEDGRLVjgTSJrgdZkvMJrwjxGyiY](https://testnet.nearblocks.io/txns/D7C1WascF1c6sfRaPEDGRLVjgTSJrgdZkvMJrwjxGyiY) |
| allowance marius | [CNzFJoZ1t1WUn3CZ1xRqCgLzExGwPFuLbrKCCJf9iaLy](https://testnet.nearblocks.io/txns/CNzFJoZ1t1WUn3CZ1xRqCgLzExGwPFuLbrKCCJf9iaLy) |
| transfer lucien | [5oqRjFMmtUTN542aXvictoyyZmbEf5oScdStpNfyJVw2](https://testnet.nearblocks.io/txns/5oqRjFMmtUTN542aXvictoyyZmbEf5oScdStpNfyJVw2) |
| allowance lucien | [752akFUUr3u9ZBvst2sxk8j9gd5tZo3Um9UjwKRVxruh](https://testnet.nearblocks.io/txns/752akFUUr3u9ZBvst2sxk8j9gd5tZo3Um9UjwKRVxruh) |
| allowance mirelle | [8dnWbtxL9W3Ef6wdPd1rzacRWWUSMeqiguDzUAsss9P9](https://testnet.nearblocks.io/txns/8dnWbtxL9W3Ef6wdPd1rzacRWWUSMeqiguDzUAsss9P9) |
| allowance dorian | [EU1RjPujF724QGhn9BJBp1jnaXUuf7zC1ptyBx99K1Qu](https://testnet.nearblocks.io/txns/EU1RjPujF724QGhn9BJBp1jnaXUuf7zC1ptyBx99K1Qu) |
| transfer cassian | [FkjZCeDZCu6Wngmb7dKAJdJzYXr8bUphhqvZyQafzE3W](https://testnet.nearblocks.io/txns/FkjZCeDZCu6Wngmb7dKAJdJzYXr8bUphhqvZyQafzE3W) |
| allowance cassian | [J6h9zcqY1cZLKg6xZZnkgswUwgyMDqhr9i7R3w62YgkK](https://testnet.nearblocks.io/txns/J6h9zcqY1cZLKg6xZZnkgswUwgyMDqhr9i7R3w62YgkK) |
| allowance sabine | [CyHVzPqH9RxdRZc1qadwGDhfypfSe8vQBUWjaqJ9Z3Ni](https://testnet.nearblocks.io/txns/CyHVzPqH9RxdRZc1qadwGDhfypfSe8vQBUWjaqJ9Z3Ni) |
