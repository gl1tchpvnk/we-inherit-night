# We Inherit Night — visual canon

Pass 2I. Presentation never establishes rights, publishes research, or computes an ending.

## Approved references
- `public/art/landing-reference.png`: supplied Landing.png, unchanged. Cover lettering and castle define the world. Transparent native buttons align with its painted buttons and provide keyboard focus and accessible New Game/Continue names. Preserve all original artwork, lettering and placement.
- `public/art/castle-cutaway.png`: current creator-supplied castle, copied unchanged. Navigation uses this interior cutaway, never the landing image. Only the existing Lounge, Library and Crypt are interactive; other illustrated spaces add no locations.
- `public/art/*-current.png`: current creator-supplied portraits for Seraphine, Vesper, Marius, Dorian, Mirelle, Cassian, Lucien, Sabine and Player. Previous approved files remain retained. No recolouring, mirroring or redrawing. Finished portraits have no artwork-credit or placeholder badges.
- The three `*-provisional.png` room interiors remain labelled generated studies awaiting creator approval.

## Ink, type and framing
Black #050505, paper #f5f1e8, crimson #c70019, muted paper #b8b3aa. Solid black shadows; no coloured lighting, ornamental gradients or glow. Crimson identifies a commitment or consequential recorded change, never implies authority itself.
Georgia/Times provide locally available editorial serif lettering; system sans is reserved for small labels and receipts. The cover uses the supplied lettering. No remote font dependency. Uppercase chapter/name display, sentence-case dialogue and choices. At least 16px body dialogue on phones; no text baked into new controls.
One dominant scene and one interaction area. Use unboxed choices, broad negative space, occasional white panel cuts. No repeated card grids or decorative red borders. Technical records live in disclosures.

## Compositions
Cover: retain the exact supplied composition, including the brushstroke and painted BEGIN THE NIGHT label (the New Game action). Scale the whole cover proportionally and letterbox it; never crop or recompose it for mobile. Loading/errors and save-replacement confirmation are separate functional overlays. Portrait phones consequently show a small landscape cover.
Prologue: four authored, provisional narrative panels; retain the existing progress and skip storage. Large portrait and short caption, numbered folio. No technical exposition.
Encounters: art occupies the majority of the scene; readable black dialogue margin, name and immediate responses. Seraphine is a close portrait; Marius uses the opposite page; Dorian uses a narrower off-centre plate; Vesper remains confrontational. Never mirror or distort artwork. Temporary figures must visibly say placeholder.
Exploration: the supplied cutaway has three labelled entry points anchored to the actual illustrated rooms. The artwork and hotspots share one proportional frame at every width. Hide the repeated game title; retain a small Main menu control. The Library shelves/open book, Crypt tomb/arches and Lounge window/glass have distinct compositions but remain clearly provisional. One objective beside the art, secondary court records beneath essential resources.
Reckoning: the current recorded speaker drives the portrait, one line per panel. Chapter numerals and crimson outcome accents use existing scene data only. Conclusions retain the engine's outcome and reasons.
Bloodline: white connectors from actual sire records only; House membership and independent authority explicitly separate. Expand rights individually for scope, expiry and evidence.

## Motion and interaction
CSS-only vocabulary: hard cut on scene identity; short fade from black; 1.025x introductory pan/zoom; panel reveal; crimson reveal for recorded consequences; controlled dialogue opacity on line identity. No fabricated parallax, loops, typewriter waits or blocked choices. Motion is decorative and never changes campaign state.
`prefers-reduced-motion: reduce` removes all transforms, animations and transitions. Native buttons, dialogs and disclosures retain keyboard use and visible focus. Scene headings receive focus; closing inspection returns it. Dialog content scrolls when needed. Minimum 44px interactive targets.
Desktop and tablet encounters above 640px use 44% artwork and 56% dialogue, retaining character-specific left/right composition. Phones use a controlled 26dvh portrait crop followed immediately by the black dialogue panel. The dialog is the sole vertical scroll container; the script and stage do not scroll independently. Preserve native proportions, focus and visible material terms. Long agreements may require scrolling. See docs/ENCOUNTER_LAYOUT.md for rendered evidence.

The encounter layout correction supersedes Pass 3C’s full 4:3 mobile portraits: compact controlled crops prioritize dialogue and choices while retaining approved artwork. Desktop compositions remain distinct. Castle navigation occupies less desktop space than the situation/choices; Court records is a single disclosure, while Blood, Exposure, actions and night remain visible. Consequence facts appear immediately; epilogues explain the route actually taken.

## Replacement convention

Local motion-comic prototype (2026-11-13): Seraphine's eligible sanctuary bargain alone uses an overlapping paper dialogue panel, finite portrait cuts and an accepted-lease consequence reveal. See docs/MOTION_COMIC.md. The cover remains intact but is vertically centred with save status/expiration copy below, superseding the top-pinned title layout. No art replacement, recolouring or game-wide cinematic rollout.

The subsequent local high-impact treatment permits temporary masking and independently moving cropped comic panels from these same assets. It does not claim true reconstructed depth or character animation. Its crimson authority connection explicitly represents a paid fixed-term lease between lessor and tenant, never a bloodline or ownership transfer; it appears only after the existing confirmation guard. Reduced motion skips timed staging. See docs/MOTION_COMIC.md for current timings and limitations.
Replace only the relevant source in `PORTRAIT_ASSETS` or `ROOM_ASSETS` when approved artwork arrives. Keep actor IDs, scene IDs, policies and saved data unchanged. Supply separate interior/castle art with clean negative space, no painted UI. Never call procedural plates or symbolic figures finished artwork. Future layered art may enable parallax; flattened references do not.
