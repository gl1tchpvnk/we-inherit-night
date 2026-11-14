# Focused Blood balance — local verification

`src/politics.ts` and `src/library.ts` set the four requested costs to 1 and describe them. `src/livingCourt.ts` updates confirmation terms. Existing `actionAvailability`, `playerAction`, commitment labels and `bloodWarning` read those costs; no parallel deduction or recovery logic was added. Starting Blood remains 8. A successful new authorization after withdrawal is a new commitment; retries of the same commitment are not. Existing committed save history is not repriced.

All other prices, action limits, deadlines, feeding, dawn upkeep, rights and contract methods remain unchanged. Questions, refusals and withdrawals acquire no Blood cost. The approved prologue and separate feeding/Crypt narration are untouched.

## Verification
- PASS: 24 focused Blood/politics/Living Court checks; all 198 automated tests; TypeScript and production Vite build; whitespace check.
- PASS: four fresh seven-night real disposable NEAR Sandbox campaigns with current dangerous/Living Court rules, restricted keys and existing execution flow. Each action is followed by session reload/state comparison and a transaction-count check. Local commitments reject stale retries without another deduction. Investigator cases inject a pre-submission failure (no Blood/action loss), then lose the response after a real successful grant; reload reconciles once, charging 1 Blood plus the existing 1 dawn upkeep.
- NOT RUN: new browser walkthrough or live Testnet/public acceptance. No UI layout changes in this task; browser evidence from the preceding opening task is not claimed as balance acceptance. Injected failures are controlled faults, not claims of live network failures.

| Route | Nights 1–7 | Ending | Final Blood |
|---|---|---|---|
| Sanctuary | File title; accept sanctuary; feed; feed; feed; feed; feed | Unbound | 11 |
| Marius | Appointment; feed; feed; fulfil service; feed; feed; accept final demand | Favoured | 10 |
| Lucien | Feed; commission passage; feed; authorize Dorian; feed; feed; feed | Favoured | 11 |
| Combined | Appointment; file title; accept sanctuary; authorize Mirelle; feed; feed; refuse final demand | Unbound | 6 |

No tested protection route became impossible. These are viable examples, not an exhaustive search of every action order. Temporary passage alone still expires and cannot win; that existing rule was not changed. The combined route has 1 Blood entering Night Five: feeding is now urgent, and another 1-Blood commitment would immediately exhaust Blood. Independent sanctuary survives the final refusal.

Tests: `tests/blood.test.mjs`, `tests/sandbox/blood-balance.test.mjs`. Local ignored logs: `.local/blood-focused.log`, `.local/blood-regression.log`, `.local/blood-sandbox.log`. No commit, push, deploy, credential changes or public transactions.
