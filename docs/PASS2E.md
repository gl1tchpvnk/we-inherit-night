# Pass 2E — Game entry and narrative

## Audit and scope

Reviewed AGENTS, requirements, canon, rules, architecture/security, Pass 2C/2D,
entry/bridge/runner persistence, encounters, tests and assets. Baseline Node 45/45
and Rust 11/11 passed. The previous entry mounted the castle and sent `view`
immediately; Vite eagerly spawned a runner that could bootstrap/recover a save.
A title overlay alone would therefore violate read-only entry.

## Implementation

- `GameEntry.tsx` gates the existing App with a dedicated title screen. Subtitle:
  **A political strategy game**. No Settings button because no settings exist.
- `GET /api/save` reads metadata via `scripts/save-status.mjs`; it never starts
  Sandbox, migrates, writes, or reconciles a journal. Vite creates the existing
  bridge lazily only when an explicit campaign request arrives. Metadata and runner
  use the same server-only NIGHT_SAVE_DIR, including .env configuration.
- Continue is enabled only for a supported, structurally readable persisted
  campaign with matching identifiers and required Sandbox files. This is a disk
  readiness check, not a claim that a stopped chain has been live-verified.
  Continue loads the existing `view`/journal-recovery path; failures remain visible.
- New Game with a save requires a visible replacement confirmation. Recheck the
  save before acting, verify the loaded ID, then call the original reset with its
  current revision. No new reset, migration, signing or contract implementation.
  Corrupt/unsupported saves are preserved and cannot be silently overwritten.
- `entry.ts` holds four prose passages and pure intro progression, separate from
  mechanics. They establish Vesper's granted Crypt shelter, the Volari domain,
  independent married founders, distinct authority and the three/seven-night
  predicament. Narrative is newly authored presentation grounded in canon and
  current rules, not new personal history or genealogy.
- New campaign -> prologue -> unchanged automatic Vesper ultimatum. Continue and
  Skip Intro only change browser presentation state, never submit a game action.
  Two free conversation leads from the ultimatum and the first-lead panel point to Seraphine and Marius with existing terms
  and availability. Castle/room navigation is unchanged.

## Persistence and security

`night-intro:v1:<campaign ID>` stores only line index and done flag. Continue
restores it after loading the actual campaign; existing Pass 2D scene storage
retains the active encounter/line and viewed events. Old campaigns without intro
metadata enter their supported gameplay presentation directly. Reload always opens
the title; choosing Continue resumes. No scene controls reroll encounters or sign.

The original revision/nonce/confirmation pipeline remains authoritative. A title
visit does not perform pending recovery; explicitly choosing Continue does. If
browser storage is disabled, intro progress can be lost, but campaign history and
rights are unaffected. If a new bootstrap response is lost before the browser
records intro progress, Continue still recovers the campaign and opening encounter;
the prose prologue may be omitted. Metadata checks disclose no credentials.

## Art and accessibility

Existing RoomArt forms the title illustration. Prologue uses existing symbolic
Vesper/Marius portraits and supplied Seraphine art. No new canonical appearances.
Native buttons, heading focus, visible focus outlines, responsive stacking and
existing reduced-motion rules; no animation or new graphics dependency. Exact
artwork replacement remains possible through existing asset references.

## Verification

- PASS: baseline Node 45/45; Rust 11/11.
- PASS: five added entry/SSR tests; full Node 50/50 after implementation.
- PASS: TypeScript/production build after implementation.
- PASS: final affected entry/scene tests 13/13 and final production build.
- PASS: in-app rendered desktop (1280×900) and narrow viewport (390×844) checks.
- PASS: local frontend and read-only metadata HTTP 200; campaign/transactions/index
  hashes unchanged and no runner lock created by title requests.
- PASS: full real NEAR Sandbox regression 32/32, zero failures/skips; 1223.22 seconds (.local/pass2e-sandbox.log). Includes reset, negotiation acceptance/rejection, recovery and all four political routes.

Tests distinguish absent/corrupt/legacy saves; read-only metadata with pending
journal; confirmation predicate; Continue with no reset; revision-checked New
Game; stale identity and unconfirmed recovery rejection; four-page progress,
skip/reload and automatic Vesper; native title/prologue controls via SSR. SSR is
not browser testing. Existing Sandbox tests exercise actual NEAR execution and
journal recovery; provider fixtures remain mocked, no live calls.

## Limitations and Pass 2F dependencies

Local Vite/WSL Sandbox and disk persistence are still required. Static hosting does
not provide `/api/save` or the existing executor. Save corruption requires operator
recovery; no new repair UI. Intro progress is browser-specific, not cross-device.
No gameplay, contract, agent, council, live LLM, room redesign or public deployment
changes. Pass 2F is not started or specified here; future entry/navigation work
must preserve title read-only behavior, safe replacement and existing scene IDs.

## Rendered acceptance evidence

Observed the exact subtitle, disabled Continue with no save, replacement warning
and cancellation, confirmed disposable replacement, four illustrated passages,
Tab/Return progression, reload to title, Continue restoring passage two, Skip Intro
to Vesper, normal fourth-page Continue to Vesper, immediate Marius/Seraphine leads,
Marius conversation and reload/Continue restoring that encounter. Completing/free
navigation left Night 1, Blood 8 and Actions 1/1 intact. Viewed ultimatum did not
reopen after following its lead. No installed Chrome access or network/security
changes. A Vite hot restart briefly interrupted a test tab; a fresh in-app tab
reconnected, and the persisted campaign recovered through the existing workflow.

Screenshots: .local/pass2e-title.jpg and .local/pass2e-prologue-mobile.jpg.
The preview uses .local/pass2e-preview; prior preview campaigns remain preserved.
Physical mobile devices, screen-reader hardware and public deployment were not
verified. The architecture and character artwork remain interim assets.

## Files changed

New: src/GameEntry.tsx, src/entry.ts, scripts/save-status.mjs,
tests/entry.test.mjs, docs/PASS2E.md. Updated: src/main.tsx, src/style.css,
src/encounters.ts, src/VampireEncounter.tsx, vite.config.mjs; README, requirements,
rules, canon register, AGENTS, architecture/security and progress documentation.
HACKATHON_REQUIREMENTS reviewed; no external submission rules changed.
