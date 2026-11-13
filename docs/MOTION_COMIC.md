# Seraphine motion-comic prototype — local only

## Deferred until after the hackathon

This prototype is preserved on `feature/motion-comic`, based on stable `main` commit `307f377b2461b1679450399a191809a4d5f462aa`. It is not approved for public deployment. Resume by switching to this branch after protecting any current work; do not merge it into the submission build by accident.

The reviewed, simulated preview is now versioned at `previews/motion-comic/index.html` and `previews/motion-comic/comic-preview.tsx`. Run `npm run dev -- --port 5187` and open <http://127.0.0.1:5187/previews/motion-comic/index.html>. Choose Preview success/pending/failure. These fixtures send no API requests and use only synthetic campaign state. Their browser storage key is `night-scenes:v1:comic-preview`; they do not reset real campaigns. Existing ignored `.local/comic-preview.*` originals and build/test logs remain local. The versioned fixture reproduces the preview on a fresh checkout without those files.

Approved artwork is already tracked under `public/art/`; this branch adds no replacement artwork. All cinematic screenshots, tests, title-composition work and encounter-presentation changes are preserved here. Unrelated hosted deployment notes/evidence are deliberately excluded from this preservation commit. Gameplay, Blood, encounter feeding, finale and Quit Campaign already exist in the stable base.

## Current immersive / decision presentation

Seraphine alone now has two explicit presentation states. The 4.5-second entrance and 2.2-second sanctuary-terms dialogue beat occupy the available game viewport under the persistent Blood strip and Continue / Skip control. The ordinary action rail is hidden from rendering, keyboard navigation and accessibility during motion. No browser Fullscreen API is used. Duplicate foreground/portrait panels were removed; the two different lease parties remain.

Timed completion or Continue / Skip restores the compact interactive composition, original dialogue, Feed and essential terms. Focus moves from the skip control to the encounter heading. Existing browser-only seen-scene memory prevents replay on return; skips apply to that scene only, so skipping an entrance does not suppress the later confirmed reveal. Reduced motion bypasses immersive playback completely. Pausing resets between scenes.

The unchanged accepted-lease guard alone allows the immersive consequence; afterward the compact response/inspection view returns. Pending and failed fixtures stay non-immersive with no authority visual. No signing, gameplay or lifecycle changes.

PASS: 24 focused tests and production build. Extended SSR coverage checks hidden action rail and previously seen entrance bypass. Desktop 1280×800 and mobile 390×844 review checks viewport coverage, keyboard skip, visible decisions/Feed, automatic dialogue return, non-replaying entrance, reduced-motion emulation and unsuccessful outcomes. Evidence: `evidence/motion-comic-immersive/`. Preview remains simulated and local; no commit/push/deployment. Expanded details or long dialogue may still require scrolling.

## Prior cinematic and encounter UX refinement

The entrance is now 4.5 seconds: Lounge (650 ms), hand/ring detail (1.35 s), eyes-to-portrait reveal (2.5 s), then a stable decision. Optional Seraphine questions go straight to dialogue. Playback controls disappear at the decision and settled consequence. Full dialogue sits beside the artwork in a black panel; exact short excerpts remain in motion shots.

Desktop keeps balanced art/text columns. Mobile uses a 180 px cinematic crop (160 px ordinary encounter portraits), with one dialog scroll container. The tested Seraphine opening shows every primary choice and Feed in the first viewport. Feed now belongs to the shared choice list, including during multi-line dialogue. Essential commitment terms and fatal Blood warnings remain before irreversible choices; optional inspection sits after actions. Long passages, expanded details and smaller screens may still require scrolling.

The confirmed climax retains the two parties, forming crimson connection and SANCTUARY GRANTED / Paid lease · fixed term. Original character response follows, with detailed confirmed agreement information in Inspect terms. Confirmation guards, gameplay and transaction code are unchanged.

PASS: 24 focused tests, production build, desktop 1280×800, tablet 820×900 and mobile 390×844 review. Verified keyboard Skip, automatic completion/removal of controls, emulated reduced motion (zero animation names), visible choices/Feed, readable commitment terms and pending/failed fixtures producing no authority reveal. Evidence: `evidence/motion-comic-ux/`. This is simulated visual verification, not new live Testnet evidence. No commit, push or deployment.

## Prior final polish (superseded by encounter UX refinement)

The opening now alternates a 1.3-second Lounge establishing shot, a 2.4-second hand/ring detail against architecture, a 3.6-second eyes-to-face reveal, and a 2.6-second lips/environment confrontation before a stable decision view. The 9.9-second sequence uses distinct holds rather than uniform slowing. Approved images remain unchanged; cropped details retain their original proportions.

Motion captions use exact excerpts from the existing dialogue. Full dialogue is optionally readable during motion and shown normally at the decision; no extra mandatory clicks or rewritten lines. Existing choices, terms, Blood and Feed remain available.

After the unchanged confirmation guard, a 350 ms black cut leads to a 3.8-second two-party lease reveal: Seraphine as lessor, player as tenant, a forming crimson connection, SANCTUARY GRANTED and Paid lease · fixed term. This composition remains after the animation; full dialogue and agreement details appear beside/below it. No permanent ownership or ancestry is implied.

PASS: 24 focused motion-comic, encounter and Blood tests; production build; diff whitespace check. Browser review at 1280×800 and 390×844 covered crop quality/readability, all opening compositions, automatic timing, authority reveal and court return, keyboard Skip, pause/advance, and emulated reduced motion (zero active animation names, no horizontal overflow). Pending and failed fixture results created no authority reveal. Guard unit tests retain expired, wrong actor, replay and unrelated-campaign coverage.

Evidence: `evidence/motion-comic-polish/`. Preview is explicitly simulated, with no API/signing or campaign changes. No live transactions, full campaign replay, commit, push or deployment. Visual acceptance remains with the user; Lounge artwork retains its existing provisional-study label.

## Prior layered treatment (superseded timing and climax)

The high-impact revision adds visible motion *within* the existing shots: a separately moving architectural foreground, a black mask sweeping off the portrait, independently moving portrait/environment/close-up panels, and hard cuts keyed to the existing “What is the catch?” and “And Marius is content with that?” answers. Source images are not edited, recoloured, skewed or replaced. These are graphic panel composites, not extracted character rigging or reconstructed 3D layers.

The opening runs 5.7 seconds (1.6 / 1.9 / 2.2), with optional dialogue cuts lasting 2.2 seconds before decision stillness. All choices are immediately usable. Pause holds camera motion and progression; Next shot shows the completed composition for storyboard review; Play resumes motion. Skip moves to the controls, and reduced motion bypasses timed cuts.

Only the unchanged accepted-lease confirmation guard can create the new authority sequence: 450 ms of black in the illustration area, then 2.3 seconds of independently arriving Seraphine/player panels and a drawing crimson connection. It explicitly labels **lessor**, **tenant**, **paid lease · fixed term**, **shelter, not ownership**, and **no bloodline bond**. It resolves into the existing consequence page; the actual lease terms remain readable in the interaction rail throughout. No ancestry, ownership transfer or permanent sanctuary is implied. The existing reaction ID and transaction safeguards are preserved.

PASS: 23 focused tests and production build. Desktop 1280×800 and mobile 390×844 browser checks covered independent changing transforms, panel masks, dialogue cuts, authority sequence, return to court without duplicate announcement, pause/advance, keyboard skip, no horizontal overflow, sticky Blood and emulated reduced-motion preference. Pending and failed fixture responses mounted neither authority nor verdict visuals and submitted one callback. Rejected/expired/unrelated/replayed confirmations are covered by focused tests. No live transaction or real recovery operation was performed; fixtures remain explicitly simulated. OS motion settings were not changed.

Evidence: `evidence/motion-comic-impact/`. No commit, push or deployment. The Lounge study still carries its existing provisional label. Visual acceptance remains with the user; no game-wide rollout.

## Prior staging and implementation context

One representative sequence is implemented around the existing sanctuary bargain: Seraphine's eligible conversation and optional questions, the commitment inspection, and a newly confirmed sanctuary consequence. Other encounters retain their existing presentation.

The corrected staging replaces the original subtle-motion treatment with five distinct compositions:

1. Crimson Lounge wide shot, architectural pan and location lettering (1.6 seconds). The existing environment retains its provisional-study label.
2. Hard cut to Seraphine's face; eyes-to-face camera reveal (2 seconds).
3. Diagonal portrait/environment confrontation with dialogue printed inside the illustrated panel (2.4 seconds).
4. Stable portrait and readable decision rail. All choices are available from the first frame; choosing early bypasses the remaining introductory shots.
5. Only after confirmation: a hard cut to a paper-white outcome page, black verdict lettering, crimson rule and a distinct portrait crop. No success is inferred from elapsed time.

The approved source portrait is unchanged. Pause holds the camera and shot progression; Next shot appears while paused for review. Skip cinematic goes directly to the decision controls. Reduced-motion preference bypasses timed compositions and disables CSS motion; changes to the preference are observed. No loops, typewriter waits, flashes, framework or new service. Blood remains sticky and the dialog remains the sole mobile scroll container. This correction does not change the title composition or expand the treatment beyond Seraphine.

`motionComic.ts` projects the consequence only after the existing action handler returns a non-pending, non-error result with the same campaign, a newly accepted sanctuary lease for the player from Seraphine, an active expiry and effective sanctuary access. It does not sign or validate transactions independently: the existing backend/chain adapter remains authoritative. The reveal uses the existing accepted-lease reaction ID, so dismissing it marks that presentation as viewed rather than immediately repeating it. No campaign progression, financial or NPC code changed.

The cover now sits in a proportional frame centred with the save/loading status and expiration note underneath. Artwork, baked lettering/tagline and control alignment remain intact. Portrait screens retain intentional letterboxing rather than cropped logos or distorted artwork.

## Preview

- Existing local Vite server: <http://127.0.0.1:5187/>. The real sequence is available through Seraphine once the existing sanctuary-bargain requirements are met (file the Library claim or obtain the dossier before the offer expires).
- Safe visual preview: <http://127.0.0.1:5187/.local/comic-preview.html>. Choose **Preview success**, watch the 4.5-second opening (or pause and use Next shot), hear the questions, choose **I want a refuge of my own**, then commit to see the simulated consequence. Reload for **Preview pending**, **Preview failure**, **Preview title** or emulated reduced motion.
- This ignored local fixture sends no API requests, changes no campaigns and signs no transactions. Its simulated state is labelled on screen. It is not part of the production build. Existing local Night Seven and public campaigns were not reset or advanced.
- If the preview server has stopped, use the existing Sandbox configuration with `npm run dev`; do not replace the save to view this fixture.

## Verification and limits

### Staging correction

- PASS: 23 focused motion-comic/encounter/Blood tests and production build. Tests cover bounded shot progression, skip/reduced-motion projection and unchanged confirmation guards.
- Browser reviewed at 1280×800 and 390×844. Distinct lounge, face close-up, diagonal confrontation, decision and white outcome compositions recorded under `evidence/motion-comic-correction/`. Corrected mobile outcome word wrapping during review; no horizontal overflow remained.
- Confirmed pause/next-shot, mobile skip-to-controls, sticky Blood, direct early interaction, and simulated success/pending/failure behavior. Pending and failed results produced no verdict or consequence shot and submitted one fixture callback.
- Emulated reduced-motion preference in the ignored fixture exercised both the preference-dependent decision-frame selection and still CSS. OS settings were not changed. No real chain transaction or saved campaign was altered.
- Creative acceptance remains for the user's visual review; no commit, push or deployment.

### Original prototype evidence (superseded visual direction)

- PASS: 35 focused tests (`motion-comic`, `encounters`, `entry`, `blood`, `final-court`) and production build.
- PASS: browser desktop encounter at 1280×720, mobile at 390×844, title at 390×844, 1024×1366 and 1440×1000; no mobile horizontal overflow after adjustment; dialogue, terms, navigation and Feed accessible.
- PASS: simulated success yields the reveal; pending/failure do not; one callback per commitment; busy controls locked; optional dialogue preserved; Skip motion produces `animation-name: none`; forced-still fixture remains readable.
- Reduced-motion CSS is implemented and the equivalent still presentation was checked in-browser. The operating-system motion preference itself was not toggled in this pass.
- Initial review found mobile panel overflow and duplicate sanctuary announcements; corrected before final checks. A temporary JSX edit error during the title adjustment was corrected; final build passes.
- No live Testnet or fresh Sandbox transaction run for this presentation-only pass. Existing finality/settlement/authority tests and infrastructure are unchanged. Interrupted/reloaded commitments still recover through existing gameplay; the cinematic itself is ephemeral, while the existing recorded reaction remains available.
- No commit, push or deployment. Evidence screenshots: `evidence/motion-comic/`.
