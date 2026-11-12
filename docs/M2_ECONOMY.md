# M2 — The First Economic Betrayal

Implemented and verified locally, 2026-11-07 (receipts extend into November 8
UTC). Same Rust contract and M1B infrastructure; no added dependency, public
deployment, or publishing.

## Reproduce

From the repository root with README prerequisites installed:

```powershell
$env:AWS_LC_SYS_PREBUILT_NASM='1'
npm ci --ignore-scripts
npm run contract:wasm
cargo test --lib --locked
cargo build --features local-demo --bin local-demo --locked
npm test
npm run build
wsl -d Ubuntu -- bash scripts/setup-sandbox.sh
wsl -d Ubuntu -- bash -lc 'export PATH="$PWD/.local/node-v24.13.0-linux-x64/bin:$PATH"; node --test --test-concurrency=1 tests/sandbox/*.test.mjs'
npm run dev
```

Linux/WSL needs Node 24 on PATH or the workspace-local Node path above. Skip
Sandbox setup if its pinned binary is already installed. On Linux, use
`npm run test:sandbox` after setup/build; `npm run test:economy` runs just M2.
This environment required approved host execution for WSL; restricted execution
returns E_ACCESSDENIED. Credentials are generated for disposable Sandbox only.

Open http://127.0.0.1:5187. Inspect Seraphine's offer, accept, face Vesper's response,
attempt Crypt entry, enter Lounge and Library, collect rent, reload. Reject is
available before acceptance. Browser reload reads the running chain; server
restart or New Game creates a fresh disposable chain. No simulated fallback.

## Economic and authority rules

- Finite genesis funding: player 0.25 NEAR, NPCs/keeper 1 NEAR each, contract
  5 NEAR. These are valueless local Sandbox funds, not minted game tokens.
- Rent is **0.02 NEAR = 20000000000000000000000 yoctoNEAR**. Exact attached
  deposit is mandatory. Wallet gas/storage reserve and contract escrow differ.
- Owner offers buyer-specific entry/use rights for three authoritative nights;
  this offer expires at night two. No permanent ownership transfer, income,
  subletting, or withdrawable internal currency exists.
- Accepted rent is nonrefundable and vested immediately to seller, held in
  escrow until seller claims. Expiry does not erase the debt. Only unaccepted
  offers can be cancelled by owner or rejected by buyer.
- Claim marks pending before native transfer. Private callback settles on
  success; transfer failure restores claimability. Nonces/status/pending flags
  prevent duplicate acceptance, settlement and callback effects.
- Maximum 64 retained lease records, seven-night duration/offer window, 0.1
  NEAR rent. Capacity exhaustion prevents new offers. Existing bounded property
  and grant rules remain; contract subsidizes storage.
- Keeper alone advances nights; browser has no advancement route. Active lease
  acceptance excludes overlap. Ownership, grants and leases remain independent.
  Vesper controls her Crypt grant, not the Library or Seraphine's lease.
- Runner phases: offered/rejected/retaliation_pending/independent/expired.
  Finalized acceptance precedes Vesper's signed revocation. Failed retaliation
  can be retried without paying again. Fixed actors and contract nonces are
  selected server-side; browser supplies neither keys nor claimed identities.
- This trusted local signer is not a production wallet service; keep it on
  loopback. No deployed-state migration; fresh initialization only.

## Actual verification

**PASS:** 12 economy scenarios (13 Node test entries including parent), zero
failures/skips. They cover owner/unauthorized offers, buyer authentication,
under/overpayment refunds, insufficient wallet funds, acceptance, duplicate/replay
protection, independent rights, authorized revocation, forbidden Library/lease
revocation, seller-only settlement, duplicate payout/private callback protection,
overlap, expiry, cancellation and rejection. Failed calls are followed by state
comparisons. Insufficient wallet funds reject before execution, without a receipt.

**PASS:** nine M1B scenarios against extended WASM; nine Rust unit tests; native
bridge integration; native binary, TypeScript/Vite and optimized WASM builds.
Unit tests additionally cover failed-transfer recovery and pending/callback guards.

**PASS, manual browser:** inspect terms; keyboard accept; payment and retaliation;
Crypt entry shows actual execution failure; Lounge/Library entry succeed; collect
rent clears escrow; reload preserves rights, settlement and history. Browser
checks are manual, not automated UI tests. The correction below additionally tests
browser rejection/reset. Full accessibility/mobile audit and injected RPC failures
remain unverified.

Initial failures exposed insufficient upfront gas reservation in a 0.05 NEAR
fixture and balance assertions before gas refunds. Funding is now bounded at
0.25 NEAR and the runner awaits RPC `FINAL`, including refunds, before reading
balances or displaying success. No authorization defect was discovered.

## Transaction evidence, gas and storage

[Evidence JSON](evidence/m2-sandbox.json) records 37 finalized transactions,
transaction outcomes, receipt outcomes/actions, statuses, balances, storage and
case results. Actual 195478-byte WASM ran on Sandbox 2.14.0/protocol 88, SHA-256
`c48796d4db493f1403b14a52a9ae55f16ba6a569e581c8ce2c33e9d14315421f`.
These are local-chain hashes, not public explorer links:

| Action | Gas (Tgas) | Successful transaction |
|---|---:|---|
| Offer | 2.152–2.221 | See offer_lease evidence records |
| Accept/pay | 2.006 | GoZ5EmysT38XFALu9K3JJc6oJPCv1LGQgMhmHHqPuAGR |
| Revoke Crypt | 1.997 | 5QViH5ktnpnP87wUYZ2qQrGer4vZGrVcnBZtgv5y9oVW |
| Claim/settle | 4.716 | FWhTcg4cspUf6oY2thC3jWysugfATZN1rZiRbpCzgtWD |
| Allowed entry | 2.005 | See enter_room evidence records |
| WASM deployment | 14.763 | See deploy evidence record |

Acceptance storage grows from 196110 to 196139 bytes (+29); revocation/settlement
leave it unchanged. At 10^19 yoctoNEAR/byte this reserves 0.00029 NEAR from the
contract subsidy. Highest observed storage: 196475 bytes. No storage failure.
Player balance changes from 249678398474872400000000 to
229500083527133000000000 yoctoNEAR at acceptance: rent plus gas. Seller changes
from 999646765013506600000000 to 1019242087210973200000000 at claim: rent less gas.
Escrow becomes exactly rent on acceptance, zero on settlement. Transfer and
callback receipts are recorded separately.

## Remaining limits

No public-network verification, production custody or security audit. Trusted
keeper can accelerate expiry and upgrade key can replace code. Failed-transfer
recovery is unit-tested only; real failed-transfer injection and callback gas
exhaustion remain unverified. A failed callback could strand pending payout.
Worst-case storage/capacity is untested; storage charging is not production-ready.
Runner history lasts only for its process. M3 has not begun.

## Gameplay usability correction — 2026-11-07

No Rust/WASM changes. Initialization only deploys, seeds rights and offers a lease.
Accept now returns confirmed payment/state before any retaliation; Face Vesper's
response submits a separate Vesper-signed transaction. All player writes use the
disposable player, never the castle/admin account. Signing is explicitly disclosed
as development-only. No public wallet integration or public deployment exists.

Interaction audit and corrections:

| Control | Actual behavior / feedback |
|---|---|
| New Game, Start fresh game, Keep playing | Confirmation; fresh owned worker replaces this play session, or cancellation leaves it untouched |
| Refresh castle | Reads authoritative world without a gameplay decision |
| Enter room / Try locked door | Finalized entry opens distinct scene; rejection shows readable denial |
| Inscription / deed / leased seat | Revalidates access on-chain before showing contextual room discovery; no invented resource reward |
| Return to castle | Returns to map without an on-chain mutation |
| Inspect / Close agreement | Toggles cost, duration, owner, rights, signing mechanism and status |
| Accept and sign | Player-signed exact payment; active lease and pending NPC response |
| Reject agreement | Player-signed refusal; zero rent, no retaliation, Crypt preserved |
| Face Vesper's response | Separate NPC revocation after successful acceptance only |
| Ask Seraphine to collect paid rent | Owner-signed settlement; escrow clears, rights remain |
| Developer details | Expandable raw errors, actor, execution status and hash |
| Planned rooms | Plain unavailable text, no decorative controls |

Pending writes disable action buttons; completion has visible feedback. Transport
failure clears unconfirmed UI rights and offers refresh. Scene entry focuses its
heading. Original M1 simulation controls remain separate and clearly labeled.

**PASS this correction:** TypeScript/Vite build; native bridge regression; new
real-Sandbox play-runner regression, including refusal, separate acceptance and
retaliation, denied Crypt entry, surviving rooms, reload views and two resets.
It hash-checks M1B/M2 evidence unchanged. Run in Linux/WSL:
`node --test tests/sandbox/gameplay.test.mjs` (also included in test:sandbox).
[Gameplay regression evidence](evidence/m2-gameplay.json) records finalized
transaction summaries/state snapshots. Previous full contract suites were not
rerun for this UI/runner correction; their prior passing evidence is retained.

**PASS actual browser:** fresh offer with zero escrow and only four setup
transactions; Crypt entry and inscription; explicit Accept loading state;
confirmed payment with Crypt still open; separate Vesper response; readable
Crypt denial; Library/deed and Lounge/seat interactions; return controls;
settlement; reload preserving rights; reset cancellation and successful reset;
keyboard Reject; zero rent and preserved Crypt; refresh/reload preserving refusal.
Final preview reset to an unresolved offer. Example local browser hashes:

- Player accept: `B7TQhi3YHZvdw9avgkJ4bQegdavdMmToPDVmbaAezHLu`
- Vesper revocation: `F2VJ7mCwuz28PSZpL5gNWDz9TRm8y8NzKY7ZzezHnzgo`
- Denied Crypt entry: `6mzd1K2W153Txvpiyqd8iXZPWr7ZKzv6ru9kTG6KG9t4`
- Player rejection after reset: `ADDx421qenWKgCMhihfrRMF5ZnFEmv5KbkFgNNEKwbcV`

These came from browser-triggered Sandbox transactions, not preplayed fixtures.
[Rejection screenshot](evidence/m2-rejection.jpg). No new contract security issue
found. Shared local session across tabs and privileged development key custody
remain unsuitable for public gameplay. Interrupted reset recovery and injected
network failures were not tested. No M3 work.

Pass 1 regression (2026-11-08): all twelve economy scenarios and gameplay/reset checks passed against the rebuilt WASM. Current gameplay resolves scripted retaliation at dawn and uses free room permission reads. See docs/PASS1.md for current commands, evidence and limitations; the earlier walkthrough is historical.
