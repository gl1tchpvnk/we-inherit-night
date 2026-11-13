# Stuck Marius campaign — read-only investigation

2026-11-13. **BLOCKED: no recovery mutation, Quit, settlement, archive or reclaim performed.**

## Affected session and checkpoint

Authenticated `/api/save` identified `visitor-53e191e8-ac11-4440-8cbc-702164237aef`, night 0, valid session, neither closing nor closed. Render SQLite opened with `DatabaseSync(...,{readOnly:true})` confirmed one owning session, revision 1, playing, pending dawn index 8, no pending NPC intent. All eight NPC steps are recorded; Marius's appointment is confirmed. `pending.after` is already computed for night 1. No keeper transaction exists for this campaign yet.

Its two transaction records are final:

- Provisioning: `ELjsrYrfyRbmA1rwF9HRt2T36ziGRKwobufXKJJHxA3g`.
- Marius `grant_access`: `8R5i1gZVPwedRrwM5xw5AwYAKHaLsNGuN1acMUg5Bc2b`.

Independent FastNEAR and dRPC responses confirm both FINAL with SuccessValue and no receipt failures. The Marius transaction grants non-delegable court entry to the player, no expiry, for this exact campaign. Current finalized world retains grant 4 and remains at night 0. The Marius action did not fail on chain.

## Shared keeper blocker

The only nonterminal transaction found in the read-only journal inventory belongs to `visitor-4abbbeae-11dc-407f-ade2-70afb2f9c584`:

- Hash: `6hkB5yoBQhkGiAeEEuEQufqYLR8n4njxiihnNR1fJncF`.
- Actor: `keeper.we-inherit-night.testnet`.
- Journal phase: `broadcast`.
- Method: `advance_night`, expected_night 1.
- Signed access-key nonce: 277474189000034; finalized key nonce: 277474189000033.
- Signed block: `C6YtBE5FubucvKLTWvWzeTD9uWpPuzjP4xPiHHfBW3An`, height 277493845.
- Checked finalized heights: 277557707 and 277557710. Reference age 63862/63865 blocks; validity period 86400 blocks.

Both providers return UNKNOWN_TRANSACTION with `wait_until:NONE`. A preliminary FINAL-wait status query timed out; no broadcast was made. The old campaign still has world night 1. These observations do **not** establish permanent non-executability: the nonce is not obsolete and the signed block is not expired. No failed receipt exists in the retrieved evidence. Classification: **unresolved/uncertain, not safe to replace or mark terminal**.

## Root cause and minimum correction

`scripts/testnet/scenario.mjs` reconciles only `store.transactions(config.campaignId)`, then `call()` rejects if `store.pendingForActor(actor.accountId)` finds any unresolved transaction. Thus the new campaign cannot reconcile the other campaign's keeper journal, but that journal prevents its next `advance_night`. `scripts/sandbox/campaign.mjs` retains the pending dawn; the Quit endpoint correctly refuses pending gameplay. This shared-account recovery gap can block other players' keeper-dependent progression and lifecycle cleanup.

The original transport/submission failure in the older campaign is not established by available evidence. UNKNOWN_TRANSACTION alone does not prove rejection, insufficient funding or non-inclusion forever. Do not attribute this incident to Marius's grant, the narrative changes, gas shortage or a failed contract call.

Smallest durable correction: owner-aware shared-actor reconciliation using existing journal identities and finality verification, under the existing writer/queue discipline, before admitting another campaign's transaction. Reconcile the blocking record in its owning campaign context; preserve all histories and prevent concurrent replacement signing. Unknown outcomes must remain blocking; terminal classification requires method-specific proof, not absence alone. Add a focused two-campaign regression. No contract or funding change is indicated by this finding.

Resolving the blocker may advance the older campaign, which is outside this request's permission to alter unrelated campaigns. No manual journal edit, resubmission, lifecycle bypass or workaround was attempted. Report and approval of a correction are required before deployment.

## Capacity and obligations

Both finalized RPC snapshots agree: capacity 5, active 2, **3 unoccupied slots**. These are storage capacity, not proof that new games can progress while the keeper is blocked.

Affected campaign: active; 0.04 Testnet NEAR reserved treasury; both player leases still offered with zero escrow, no pending payout and no accepted lease payment. No refund has been executed. Global contract accounting remains 0.02 NEAR liabilities, 0.08 NEAR campaign treasuries and 0.98 NEAR gameplay pool. Global liabilities have not been waived or treated as belonging to this campaign.

No slot was released and no settlement was finalized by this investigation. No transaction was signed or submitted, so this investigation introduced no duplicate payment/refund/settlement. Original SQLite records remain untouched.

## Evidence

- [Independent RPC receipts, finalized worlds and keeper key/block evidence](rpc-readonly.json).
- [Capacity and accounting snapshots](../quit-campaign/stuck-marius-before.json).
- SQLite observations above came from the live Render Web Shell using read-only connections; session tokens, credential values and signed payloads were not exported.

No source changes, credentials, funding, infrastructure, deployment, commit or push. Existing local narrative work remains unchanged. **Submission-critical blocker remains unresolved.**
