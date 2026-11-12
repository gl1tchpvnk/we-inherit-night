# Pass 2I — The graphic novel overhaul

Status: presentation implemented and rendered locally; **final-art acceptance remains partial**. All eight NPCs and the player now have creator-supplied portraits; the three generated room interiors remain provisional. No engine, Rust semantics, agent policy, signing, save format or action-routing changes. No public deployment or runtime LLM activation.

## 1. Visual system

[VISUAL_CANON.md](../VISUAL_CANON.md) defines approved sources, monochrome ink, selective crimson, local serif typography, framing, motion, responsive behaviour and replacement conventions. Replaced the accumulated stylesheet with one coherent set of tokens and screen styles. Removed repeated borders, glow, gradients and card treatments. One illustration and one interaction area dominate each page; essential resources and secondary records remain accessible.

## 2. Redesigned screens

- Cover: exact supplied landing composition with transparent native New Game/Continue controls aligned to the painted buttons. The original BEGIN THE NIGHT lettering remains visible. Mobile preserves and letterboxes the full artwork. Read-only save detection and revision-checked replacement remain intact.
- Prologue: four short provisional fictional panels, large supplied portraits, numbered folios, Continue/Skip and unchanged browser progress storage. No invented player history or authority exposition.
- Encounters: full-height portrait compositions, integrated black dialogue margin, unboxed responses, visible material consequences and discreet Inspect terms. The original director and validated commands remain the only execution route.
- Castle: one supplied castle illustration with the three existing room controls; current objective and essential resources. Restricted access still uses the existing denial logic.
- Library, Crypt and Lounge: distinct new environmental studies, contacts and contextual actions. No new rooms, economics or inferred physical NPC locations.
- Reckoning/night transition: current recorded speaker drives the portrait, narrator-only scenes use provisional environment art, Roman chapter folios and immediate advance/skip. New-night incidents show their actual night number.
- Bloodline: white branching connectors group actual sire records, selectable names show recorded ownership, and House/independent-lineage explanation remains separate. No invented ancestry.
- Rights: property disclosures contain individually expandable grants with source, scope, parent, expiry, status, delegation and revocation explanation. Technical records remain secondary.
- Conclusion: large outcome type and supplied portrait, actual engine reason, surviving rights/obligations and optional evidence. No ending calculation in presentation code.

## 3. Artwork retained

Landing.png was copied unchanged to `public/art/landing-reference.png`. The newly supplied Seraphine.png was copied unchanged to `seraphine-portrait.png` and is now the active portrait. The older full-layout `seraphine-reference.png` remains intact; its painted dialogue controls made it unsuitable for the new portrait crop. Vesper, Marius and Dorian PNGs remain unchanged. No recolouring, mirroring, redrawing or distorted scaling of approved characters.

## 4. Temporary assets and remaining artwork

The former Mirelle, Cassian, Lucien and Sabine placeholders have been replaced by the current creator-supplied portraits. `library-provisional.png`, `crypt-provisional.png` and `lounge-provisional.png` were generated with the built-in image-generation tool during development, inspected and labelled in the game. They are empty environmental studies, not established architectural canon or creator-approved final illustrations. Runtime NPC/provider configuration remains disabled and unchanged.

Needed: approval or replacement of the three interior studies. The creator has now supplied the complete portrait set and a clean interior castle cutaway. No procedural artwork is claimed as finished. `PORTRAIT_ASSETS` and `ROOM_ASSETS` centralize source replacement without changing identity or authority.

## 5. Motion comic

React scene/line identity triggers finite CSS effects: short fade from black, panel reveal, 1.025× introductory pan/zoom, controlled dialogue opacity and crimson chapter consequence reveal. Reckoning dialogue changes use hard cuts. No animation libraries, loops, flattened-image parallax, typewriter waits or animation-dependent commits. Choices remain usable throughout. Reduced-motion CSS disables animations/transitions globally.

## 6. Character compositions

Seraphine fills the left page with a close portrait; Vesper uses a confrontational crop. Marius moves to the right page without mirroring. Dorian uses a narrower plate and adjusted object position to retain his face and book. Phone layouts put the art above a contained scrolling script. All characters now use the current supplied portraits.

## 7. Pass 2H consequences

All existing actions and projections remain. Visible Library terms now also explain the lack of scheduled expiry, withdrawal, publication irreversibility and the competing investigation's lost opportunity. No new penalties were added. The browser run showed Mirelle bringing Cassian, later publication, Marius's separate protection, player withdrawal and surviving independent rights. Seraphine's 0.02 Sandbox NEAR sanctuary transaction and actual Lounge invitation remain. New NPC-funded purchases/earnings remain deferred.

## 8. Browser evidence

Actual in-app browser at **1280×900** and **390×844**, not mockups or build-derived visual claims. Rendered inspection led to fixes for painted controls leaking into crops, Dorian's clipped face, mobile heading height, narrator-only scenes, and hover contrast. Some long mobile scripts/terms require contained scrolling.

| Surface | Screenshot |
|---|---|
| Cover | [Desktop](evidence/pass2i-landing-restored.jpg), [mobile](evidence/pass2i-landing-restored-mobile.jpg) |
| Prologue | [Desktop](evidence/pass2i-prologue.jpg), [mobile](evidence/pass2i-mobile-prologue.jpg) |
| Castle | [Desktop](evidence/pass2i-castle.jpg), [mobile](evidence/pass2i-mobile-castle.jpg) |
| Library | [Desktop](evidence/pass2i-library.jpg), [mobile](evidence/pass2i-mobile-library.jpg) |
| Crypt | [Desktop](evidence/pass2i-crypt.jpg), [mobile](evidence/pass2i-mobile-crypt.jpg) |
| Crimson Lounge | [Desktop](evidence/pass2i-lounge.jpg), [mobile](evidence/pass2i-mobile-lounge.jpg) |
| Encounters | [Seraphine](evidence/pass2i-seraphine.jpg), [Vesper](evidence/pass2i-vesper.jpg), [Dorian](evidence/pass2i-dorian.jpg), [mobile Dorian](evidence/pass2i-mobile-dorian.jpg) |
| Commitments / chapter | [Mobile Marius terms](evidence/pass2i-mobile-terms.jpg), [new chapter](evidence/pass2i-chapter.jpg) |
| Consequences | [Vesper revocation](evidence/pass2i-revocation.jpg), [NPC delegation](evidence/pass2i-delegation.jpg), [independent patron](evidence/pass2i-patron.jpg), [player withdrawal](evidence/pass2i-withdrawal.jpg) |
| Records | [Bloodline](evidence/pass2i-bloodline.jpg), [expanded authority](evidence/pass2i-rights.jpg) |
| Conclusion | [Desktop](evidence/pass2i-ending.jpg), [mobile](evidence/pass2i-mobile-ending.jpg) |

Seven-night route: title investigation → paid Sanctuary → feed / Vesper revocation → Mirelle grant / Cassian delegation → pass / research and Marius protection → Library withdrawal → pass → **The Unbound**. [Actual browser evidence](evidence/pass2i-browser.json): 25 unique transactions, 56 unique NPC turns, campaign and transaction hashes unchanged across ending reload. No duplicate payment or repeated turn was observed. A second isolated campaign checked mobile New Game, cancellation/replacement, Skip, all rooms and Marius commitment/chapter entry. The original preview save was not used for either walkthrough. Preview was restored to `.local/night-play` at http://127.0.0.1:5187/; the title visibly reports the original Night One save.

## 9. Accessibility

PASS: native keyboard room entry, Skip/Continue, replacement cancellation, Escape, initial scene-heading focus, inspection close returning focus to its trigger, readable phone dialogue, reachable scrolling terms/choices, and no horizontal page overflow in measured 390px encounter/ending views. Buttons retain 44px minimum height and visible keyboard focus. Material terms are outside technical disclosures.

Reduced-motion rule was inspected in the browser CSSOM: animations/transitions disabled under `prefers-reduced-motion: reduce`. The actual browser reported `reduce:false`; **live reduced-motion preference emulation was NOT RUN** because the available browser API exposes viewport control but no media-preference override. No physical phone, screen-reader audit or independent novice test was performed. These are acceptance limitations, not passing checks.

## 10. Automated verification

| Check | Result |
|---|---|
| Final Node suite | PASS 70/70, zero skipped; 13.068 s |
| TypeScript + production build | PASS |
| Existing real Living Court Sandbox regressions | PASS 3/3, zero skipped; 57.509 s: Mirelle, Dorian, revoke before publication |
| Full Sandbox suite | NOT RERUN in this presentation-only pass; prior Pass 2H full baseline remains documented separately |
| Rust | NOT RERUN; no contract/interface changes (prior recorded baseline 11/11) |
| Public network / live NPC LLM | NOT RUN; intentionally unchanged/disabled |

Logs: `.local/pass2i-node.log`, `.local/pass2i-sandbox.log`. The existing Living Court test writer refreshed `docs/evidence/pass2h-{mirelle,dorian,withdraw}.json` with actual receipts from this run. The initial build caught an editing-related encoding fault; fixed before the final passing build. No test failures are concealed by the final result.

## 11. Limits and review

Final art approval remains partial. The interior studies are deliberately provisional. Typography uses installed Georgia/Times rather than a commissioned display face. Full narrow-screen dialogue can require scrolling. The paid Sanctuary and Library commitments were executed on mobile, but every alternate branch/ending was not separately replayed at both sizes. Reduced-motion live preference and physical devices remain unverified. The trusted local operator/save/RPC model and production custody limitations are unchanged.

Reviewed AGENTS, PROJECT_REQUIREMENTS, HACKATHON_REQUIREMENTS, README and PROGRESS. Targeted updates: VISUAL_CANON, this report, README, project visual requirements, AGENTS continuity and PROGRESS. Hackathon rules were left unchanged. No Git metadata is present in this working directory, so no Git diff/commit claim is made.

## 12. Reproduce / next artwork task

Run `npm run dev`, open `http://127.0.0.1:5187/`, choose New Game (confirm replacement only for the campaign you intend to replace), advance or skip the prologue, and follow the seven-night route above. Use `NIGHT_SAVE_DIR` for an isolated local preview. Inspect terms never commits. Expand Rights to compare the revoked investigator root and ineffective assistant with separate Sanctuary/Court rights.

Next: obtain creator acceptance of the provisional room interiors and complete live reduced-motion/physical-phone checks.

## Landing correction — 2026-11-12

The user rejected the recomposed cover. Restored the original artwork, typography, brushstroke and placement without modifying the image. Removed mobile cropping/live title and replacement button styling. Native accessible controls preserve existing handlers and disabled states. Rendered desktop and mobile evidence above supersedes the earlier title screenshots. Browser checks confirmed visible keyboard focus and New Game replacement/cancellation; the original save was retained. Entry tests PASS 5/5; production build PASS. Portrait-phone artwork and hit areas are small because the original landscape composition is preserved; a separate mobile composition is not approved.

## Current castle and portrait update — 2026-11-12

Copied castle.png and all nine current portraits byte-for-byte (SHA-256 comparison PASS). Active portraits use `*-current.png`; earlier assets remain retained. Removed the symbolic SVG implementation and finished-art credit badges. Player artwork appears on the selected player Bloodline record; genealogy and authority data are unchanged.

The castle uses a proportional interior cutaway with Lounge, Library and Crypt controls over their depicted rooms. Removed the repeated in-game name and visible castle heading; retained an accessible scene heading and Main menu control. Medium widths stack the castle above guidance; mobile targets retain 44px height without overlap. No other illustrated rooms are interactive. Returning to the castle clears the stale room-entry message.

Rendered evidence: [desktop castle](evidence/castle-cutaway-desktop.jpg), [medium castle](evidence/castle-cutaway-medium.jpg), [mobile castle](evidence/castle-cutaway-mobile.jpg), [Mirelle](evidence/current-mirelle-desktop.jpg), [mobile Sabine](evidence/current-sabine-mobile.jpg), [player record](evidence/current-player-record.jpg). Verified browser Continue on the current Night Seven save, keyboard Library entry, restricted Crypt explanation, free encounters, and player image loading. No political commitment or save replacement performed. Portrait assets all match the supplied files; individual full encounters for every portrait were not re-walked.

PASS: production build; entry/navigation tests 11/11. Sandbox/Rust suites not rerun: action handlers and interfaces unchanged. Three room scene studies remain provisional. This section supersedes earlier castle and placeholder descriptions/screenshots.
