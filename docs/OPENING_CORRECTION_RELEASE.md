# Opening correction and release audit — 2026-11-13

## Scope and implementation

The existing V2 build was the starting point. No stale-build/GitHub investigation was used as an explanation for the reported experience.

- **Prologue writing: PROPOSAL ONLY.** `docs/narrative-audit/PROLOGUE_V3_PROPOSAL.md` contains the current four panels, proposed sequence, dramatic rationale and continuity notes. It remains unapproved, unimplemented and excluded from the release commit. Runtime `src/entry.ts` retains approved V2 prose.
- **Controls: IMPLEMENTED.** In `GameEntry.tsx` the shared Continue/Skip region is outside the text section. `style.css` anchors it to the same lower-right coordinates (full-width inset region on phones), reserving space in the existing scrolling text section. The panel-two text/portrait column swap previously moved Continue from x=936 to x=72 at 1440×900. Artwork sources, crop/object-position, portrait grid and animation rules are unchanged. No new scroll container or dependencies.
- **Vesper: IMPLEMENTED.** `applyLivingCourt` replaced character choices with its two questions without a route back to court; its early discovery contact list also omitted Vesper. The question responses already returned correctly. Added a free Return to court exploration to Vesper and a visible Speak with Vesper entry to the opening decision. Existing discovery aliases, question IDs/responses, read history and authoritative actions are preserved. Information was not mechanically exclusive; the missing return paths made it appear so.
- **Startup: unchanged.** `GameEntry.open`, `loadEntryCampaign`, save inspection and the existing runtime continue to own startup. The prologue runs while rights initialize; Skip finishes only narrative progress. A confirmed result is required before gameplay. Replacement is confirmed and revision checked. No contract, provisioning, signing, funding or lifecycle code was changed.

## Verification actually performed

### Automated
- **PASS:** all 192 tests, `node --test --test-concurrency=1 tests/*.test.mjs`.
- **PASS:** final focused 23 entry/encounter-flow/Pass3A tests, including all four panel control regions and both Vesper navigation orders.
- **PASS:** TypeScript/Vite production build, including the Render Testnet frontend configuration. Assets: `index-BKnmvBXt.js`, `index-uY1jNpcs.css`.
- **PASS:** diff whitespace check; production artwork unchanged.
- An initial menu-count assertion required updating for the restored Vesper entry. An isolated preview initially occupied port 5199, reserved by an existing HTTP regression fixture, causing a Node native assertion. Moving only the disposable preview to 5297 resolved it; no test or application safeguard was disabled.

### Local browser, actual Chromium through existing Playwright
No ChatGPT Computer Use, desktop Chrome control, new browser installation or public campaign was used for these checks.

- **PASS:** all four panels at 1440×900, 820×1180, 390×844 and 320×568. Continue and Skip retain identical x/y coordinates across transitions at each viewport. Keyboard Tab/Enter, Skip, image loading and all text reachable above controls were checked. Only the pre-existing text section scrolls.
- **PASS:** real disposable Sandbox startup. First observed fresh prologue: **1.17 s**; opening playable encounter: **12.18 s**, including cold Windows runner bundling and final chain verification. This is an observed sample, not a latency guarantee or a sub-three-second claim.
- **PASS:** real replacement confirmation/cancel; cancelling sent no game command. Confirming used the existing view/reset sequence. Verified initial Night 1/index 0, Blood 8, independent Library ownership/access, Crypt invitation, no premature NPC turns and ten successful FINAL bootstrap transactions.
- **PASS:** Route A (ultimatum → Vesper → both questions → court) and Route B (ultimatum → court → Vesper → question → court), reviewed questions and reload/resume. Free navigation changed no campaign/world/transaction state and sent no gameplay command.
- **PASS:** a single fresh disposable Sandbox campaign completed seven nights via actual UI commitments: title filing, sanctuary, Feed, Mirelle authorization, Feed, withdrawal, final counterproposal. **29 confirmed transactions**, **56 unique NPC turns**, **The Unbound**, paid sanctuary still effective. The rejected counter caused Marius's own protection to be withdrawn; independent sanctuary survived. Personal reply led to the factual results.
- **PASS (simulated HTTP, not chain evidence):** held initialization response blocks gameplay even after Skip; explicit initialization error returns to title; Continue recovers; no reset on ordinary reload. Actual components and browser were used with labeled intercepted responses.

Reproduction/evidence scripts, disposable saves, raw state and screenshots remain ignored under `.local/opening-evidence/`; no preview route or test command is included in the production entrypoint. Representative public-safe evidence is under `evidence/opening-correction/`.

### Limits

Abruptly terminating a Windows dev-server process can leave its disposable Sandbox writer lock; that existing operator-restart limitation is not a browser reload failure and was not changed. No possibly live lock was removed and the user's normal 5187 save/preview was not replaced. This is **VALUABLE BUT DEFERRABLE** for local developer operation, not demonstrated hosted breakage.

Creative approval of the V3 opening is **VALUABLE BUT DEFERRABLE**; it does not block publishing the approved V2 text.

Latest-commit Render deployment and live public seven-night acceptance are **SUBMISSION-CRITICAL** until verified. Local Sandbox and fixture results do not establish live Testnet acceptance.

## Intended release contents

Audit baseline: existing `main`, remote `https://github.com/gl1tchpvnk/we-inherit-night.git`; fetched origin and found **no unpushed commits**, no staged changes. Existing local modifications were preserved.

Include the completed V2 narrative rewrite; investigation finding/personal finale; Dorian's bounded shelter-aware policy with its validator unchanged; circular-flow/read-version/Feed repairs; current Blood and ending clarity; existing motion-comic/layout refinements; this opening navigation/control correction; focused/Sandbox tests and associated documentation/evidence. Previous deployment, recovery and Quit improvements already exist in the main history. No Render configuration, contract, account, credential or funding change is needed for this release.

Exclude **PROLOGUE_V3_PROPOSAL.md** pending approval, `.local/` fixtures/previews/browser sessions/raw saves, generated `dist/`, dependencies and all ignored secret/runtime artifacts. No unrelated source change was found among the reviewed modified files.

Secret review covered index, worktree and reachable history/reflogs. The only scanner findings were 69 public block-approval signatures in `evidence/stuck-marius/rpc-readonly.json` (reported twice across history/worktree); JSON paths are `block/approvals` and `originalBlock/approvals`, and all fail Ed25519 secret-key validation. Other transaction signatures were independently classified by field and key validation. No credential/session token was found in the candidate evidence. No secret values were printed, rotated or changed.

Publishing status is recorded separately below; a push is not a deployment.

Actual reload-during-initialization check: **PASS**. After the single reset request
was submitted, the browser reloaded while the Sandbox initialized. Verified fresh
metadata was ready in **5.47 s** (warm runner); Continue recovered Night 1 with ten
FINAL bootstrap transactions and no NPC turns or duplicate reset. Reloading before
reset submission preserved the old campaign instead of manufacturing a new one.

## Published source and remaining deployment gate

- **GitHub PASS:** implementation commit `1a818df14f8c78766470ab6ed8ab47b90980bb8f`
  committed and pushed to the existing `main`; `git ls-remote` confirmed that exact
  remote SHA. Staged index secret scan PASS (682 paths, reviewed public signatures).
- **Public health PASS:** HTTPS `/healthz` returned 200 and `{"ok":true}`.
- **Latest Render deployment BLOCKED:** at 2026-11-13 22:37 UTC public JS was still
  `/assets/index-Crv75b_Z.js`, not verified release `/assets/index-BKnmvBXt.js`.
  `render.yaml` and the existing deployment record specify manual deployment.
  This session has no authenticated Render CLI/API or browser-automation session.
  The user has been asked to choose Manual Deploy → Deploy latest commit on the
  existing service. No infrastructure, credential or auto-deploy setting was changed.
- **Live public gameplay acceptance NOT RUN for this release:** no new public
  campaign or transaction was created. A prepared browser acceptance runner is
  gated on the public asset matching the verified build, before it can create a
  real campaign. Prior public checkpoints are not substituted for this release.
- **SUBMISSION-CRITICAL remaining action:** deploy the pushed main branch, then
  verify matching assets and one real public seven-night campaign/reload/replay.
  No further gameplay development is required by the local acceptance results.

## Public deployment and acceptance — PASS (supersedes the gate above)

The user triggered the existing manual Render deployment. At 2026-11-13 22:39 UTC,
HTTPS health returned 200 and the served `index-BKnmvBXt.js` matched the verified
Testnet build byte-for-byte (SHA-256
`2b211b77002212b7d5ddcf590e994a9f6739a67b522c6a4e10064feb9e62a0c0`).
The implementation is commit `1a818df14f8c78766470ab6ed8ab47b90980bb8f`;
`main` was at documentation commit `10204066644cc617bc4a677208316db1a1751fc6`
when deployment was triggered. The public assets establish deployed runtime parity;
a Render dashboard deployment ID/commit metadata was not available in this session.

**Live Testnet browser acceptance PASS**, using a fresh isolated browser session,
actual public UI and existing funded game runtime, with no mocks or supplied wallet:

- Fresh campaign `visitor-145e73dd-cd1b-467c-a93f-b2cc9fa62f71` opened in **5.10 s**;
  its prologue appeared in **0.20 s**. Approved V2 dialogue and corrected navigation
  were visible. No new V3 prose was published.
- Title filing → paid sanctuary → Feed → authorize Mirelle → Feed → withdraw the
  Library invitation → final counter. All seven commitments returned authoritative
  confirmed results. There were 56 unique NPC turns and the final result was
  **The Unbound**. Independent paid sanctuary survived Marius's withdrawal.
- Midcampaign reload preserved the exact campaign, rights and transaction record.
  Reload after an expressive personal reply resumed the reply; continuing showed
  factual results. Chronicle review did not reopen commitments or advance the night.
- Financial settlement/archive completed and enabled replay. Replay created a
  different campaign, `visitor-9b772b44-d84e-472d-8dbc-f7a638fe1585`, at Night 1.
  That verification campaign was then closed using the normal confirmed Quit UI.
- Independent dRPC verification found all **21 recorded original-campaign
  transactions FINAL-success**, with successful receipts, the correct contract and
  campaign arguments, and zero attached deposits (existing prepaid payments).
  Replay creation was independently FINAL-success too.
- Finalized `campaign_resources` reads show **both campaigns reclaimed**, with
  commitments matching their respective archived UI records. No active acceptance
  campaign was left behind. Lifecycle calls are evidenced by finalized resource
  records; they are not falsely counted as part of the 21 UI-recorded transactions.

[Public-safe evidence](../evidence/opening-correction/public/) includes timings,
action summaries, deployed asset digest, independently verified transaction hashes,
finalized lifecycle records and screenshots. Session cookies/browser storage and
raw runtime state remain ignored locally; no credentials were published.

**Submission readiness:** no submission-critical defect remains from this scoped
opening/release acceptance. Creative approval of V3 and abrupt local dev-process
lock recovery remain valuable but deferrable. This is one complete public paid
route, not a claim of exhaustive hosted branch/load testing or completion of the
hackathon submission itself. No new feature pass is initiated.
