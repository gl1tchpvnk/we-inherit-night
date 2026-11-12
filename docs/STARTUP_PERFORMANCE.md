# New Game startup investigation — 2026-11-12

Status: IMPLEMENTED optimization; PARTIAL performance target. The prologue appears
within three seconds, but fully verified campaign readiness still exceeds three
seconds. No blockchain confirmation has been replaced by a presentation timer.

## Measured diagnosis

Windows Node 24.13.0, WSL Ubuntu, pinned NEAR Sandbox 2.14.0; repository and saves
on the Windows-mounted filesystem. Measurements use isolated `.local/startup-*`
campaigns, never the user's preview save. Times are single-run observations, not
percentiles or a guarantee under different machine load.

| Operation | Before | Optimized |
|---|---:|---:|
| First bridge / fresh verified campaign, wall time | 68.460 s | 5.654 s |
| New Game replacement, already-running bridge | 57.542 s | 4.548 s |
| Fresh Sandbox start (includes genesis/client/readiness) | 2.428 s | 1.987 s |
| Eleven account creations | 19.922 s | 1.342 s |
| Contract deployment, finalized | 3.024 s | 0.255 s |
| Six initial authority/offer calls, finalized | 21.154 s | 1.131 s |
| Nine NPC key restrictions | 10.437 s sequential | ~0.10 s concurrent critical path |
| Complete scenario initialization (inclusive) | 55.205 s | 2.960 s |
| Static campaign/NPC state creation and persistence | 0.015 s | 0.007 s |
| Final initial campaign read | 0.006 s | 0.003 s |
| Replacement: old Sandbox shutdown / directory cleanup | 0.067 / 0.411 s | 0.050 / 0.243 s |
| Scheduled NPC decisions at startup | 0 | 0 |
| AI provider calls at startup | 0, disabled | 0, disabled |

Substeps overlap or are included in parent spans; do not sum the entire table.
Baseline launcher/import overhead was ~10.8 s combined. Subsequent instrumentation
isolated **14.064 s** in unbundled dependency evaluation in another run; a fully
bundled runner measured **0.047 s** for that span. WSL startup/cache contention
varies. Those import samples are not claimed to be a controlled cold-cache pair.

The bottleneck was real transaction/block waiting plus filesystem-heavy runtime
imports, not NPC decisions or React rendering. The original chain used 600 ms
minimum block production; transactions required several blocks and were serial.
The save lock measured 2–4 ms in these runs, not the possible 30-second lock wait.
No live lock was removed or stolen.

## Changes and boundaries

- New disposable local chains use 25 ms minimum / 50 ms maximum block production,
  with 150 ms maximum wait. The pinned runtime requires GC capacity 40 blocks per
  step at that cadence; this is configured together. Existing chain configs and
  public network settings are untouched. Faster blocks can increase local CPU/I/O.
- Key restrictions run concurrently only across independent signing accounts.
  `allSettled` waits for every operation before returning or tearing down on error.
  Root-signed account creation, grant IDs, actor nonces and evidence writes remain
  ordered. World and wallet reads run concurrently.
- Windows-to-WSL launches bundle the existing runner with the existing Vite build
  dependency into ignored `.local/sandbox-runner/play.mjs`. No additional package,
  signing system or contract method. Bundling is code-only and cached per server
  process; restart the dev server after backend source changes, as before.
- Confirmed New Game shows the free prologue while initialization runs. Skip can
  skip narrative but cannot enter gameplay before verified state exists. Failure
  returns to the title with an error. Progress is persisted under the actual new
  campaign ID when ready; a reload before that ID exists can replay narrative.
- Continue uses the persisted chain and does not redeploy unchanged WASM. A true
  replacement still needs an isolated initialized chain: the contract has no safe
  in-place campaign reset. No preinitialized fake world or copied receipts are used.
- Existing confirmation, stale revision checks, pending journal recovery, current
  save publication, restricted keys and transaction `FINAL` checks remain intact.
  NPC decisions remain scheduled at reckoning; live providers remain disabled.

## Browser verification

Actual in-app browser, isolated save, replacement flow:

| Browser span | Time |
|---|---:|
| Metadata recheck | 473.3 ms |
| Prologue visible after confirmation | 483.3 ms |
| Existing-state request | 492.0 ms |
| Verified replacement request | 5334.7 ms |
| State-ready to React commit | 8.1 ms |
| Confirmation to verified entry / subsequent paint callback | 6316.8 ms |

Observed the prologue during initialization, disabled continuation after early
Skip, then automatic Vesper encounter only after successful initialization.
Reload/Continue retained the campaign, seven bootstrap transactions, revision zero
and no NPC turns. One server-restart Continue sample took 8.984 s (including fresh
runner/chain recovery); it is not a warm-New-Game measurement. Baseline browser
paint was not measured; baseline backend wall times above were measured before
optimization. No claim of under-three-second verified gameplay readiness.

## Reproduction and evidence

`node scripts/sandbox/profile-startup.mjs .local/startup-<unique-name>` measures
fresh and replacement campaigns, prints named durations and saves measurements.
Use Windows Node for the Windows-to-WSL bundle path; standard Linux Sandbox tests
continue to run source directly. `NIGHT_STARTUP_PROFILE=1` on the Vite process adds
runner timing output and an ignored `startup-profile.json` in its save directory.
The browser's development console logs `[startup]` and `[startup-prologue]` spans;
the Performance API also records `night:*` measures. No credentials are recorded.

Local evidence: `startup-before/measurements.json`,
`startup-bundled-all/measurements.json`, `startup-verified-entry.png` under `.local`.
Intermediate experiments are retained there: the initial fast-block experiment
was rejected by Sandbox's GC configuration validator; the corrected configuration
passed. A bundled test initially run in WSL failed due to Windows-only installed
Vite native bindings; its Windows-to-WSL execution passed, without installing or
removing dependencies.

## Tests

- PASS: Node 63/63; focused entry controls 5/5 after adding waiting/skip assertions.
- PASS: production TypeScript/Vite build.
- PASS: existing real NEAR Sandbox suite 32/32, 530.56 seconds. Authority, economic,
  negotiation, seven-night routes, restrictions, expiry, revocation and recovery.
- PASS: additional Windows-to-WSL bundled startup test 1/1, 22.05 seconds: seven
  finalized bootstrap transactions, stable grant ordering, zero premature NPC
  turns, rejected stale reset, eight scheduled NPC turns and reload without replay.
  This platform-specific test skips in Linux; run it with Windows Node explicitly.
- NOT RERUN: unchanged Rust contract unit tests; last recorded baseline 11/11.
- No live LLM calls, public deployment, new campaign rules or authority changes.

Remaining: fully verified local readiness below three seconds is not achieved.
Further gains must address the remaining genuine chain initialization cost without
weakening finality or introducing a privileged reset. Pass 2H has not begun.

## Startup incident — 2026-11-12

The supplied screen recording showed New Game returning `Contract runtime stopped`.
Reproducing the runner directly identified an abandoned `.local/night-play/play.lock`.
No WSL play runner or Sandbox process remained. The bridge retained its failed child,
so further attempts failed until the preview was restarted. The prior handoff had
verified the title but had not opened this restored save.

Recovery: after checking that no writer or Sandbox owned this save, moved the stale
lock to `.local/night-play-stale-lock-20261112-1448` and restarted the identified
Vite process with WSL access. No campaign files were replaced. Continue reached the
playable original Night One castle in the in-app browser; evidence is
[evidence/start-recovery-castle.jpg](evidence/start-recovery-castle.jpg).

PASS: entry tests 5/5; isolated Windows-to-WSL real Sandbox startup regression 1/1
(17.29 s), including finalized fresh bootstrap, stale-reset rejection, scheduled
agents and reload without replay. New Game replacement was not executed against
the user's preserved save. No source changes; production build/Rust tests not
rerun for this operational recovery.

Operational limitation: abandoned locks still require manual diagnosis. Never
remove a live or uncertain lock. Check all play runners and Sandbox processes
before archiving a demonstrably abandoned lock; then restart the preview. A title
screen loading successfully is not proof that the runtime or saved campaign opens.
