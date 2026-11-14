# Nightly choice and narrative UI correction — IMPLEMENTED locally

## Scope
- Shared strategic choices retain source order, reviewed state, conditions and original commands; political/conversation choices precede a Nightly actions section containing existing Feed then Wait entries.
- Optional entries retain explicit labels; reviewed conversations stay in their existing disclosure. Existing feeding consequence text is visible before opening its confirmation. Wait uses a neutral secondary treatment with visible hover/focus.
- Removed Action counter from both HUD renderers. Playable encounters, including room introductions, share Night/Blood/survival information; the HUD stays visible while scrolling.
- Feed toolbar is confined to strategic decisions, deduplicated against existing Feed choices. Character responses contain no Feed/Wait utilities. Explicit feeding confirmation remains intact.
- Existing GameEntry prologue/arrival boundary already suppresses gameplay HUD and actions. It is unchanged, as are Continue/Skip and all narrative text.
- Removed strategic location heading; existing cinematic label removals, artwork, navigation, scene data and handlers are preserved.

## Verification
PASS: 35 targeted tests (scene presentation, encounter flow, Blood, room introductions, entry); full regression 221/221; production frontend build.
PASS: 10 local Chrome scenarios with mocked API responses at 1672×941, 390×844 and 844×390. Checked order/deduplication, reachable final controls, no horizontal overflow, keyboard focus, exact existing Feed/Wait request envelopes, conversation reload, Back/Tonight’s choices/Castle map, entry Continue/Skip, and Lounge/Library intro HUD.
Narrative/navigation cases issued only view requests. Feed/Wait request tests used simulated responses, not blockchain execution. Existing engine cost/availability tests remain intact.
NOT RUN: live Testnet, Sandbox transaction suites, hosted verification, full campaign walkthrough; no relevant authoritative code changed.
No remaining functional issue found in exercised states. Long strategic lists use ordinary scrolling. Existing flattened portraits and provisional environments are unchanged. No commit, push or deployment.

## Files in this correction
`src/VampireEncounter.tsx`, `src/scenePresentation.ts`, `src/main.tsx`, `src/style.css`; rendering expectations in `tests/blood.test.mjs`, `tests/encounter-flow.test.mjs`; this report, README and PROGRESS.
Reviewed AGENTS, PROJECT_REQUIREMENTS and HACKATHON_REQUIREMENTS; no authority, product-mechanics or external-rule changes needed. Other working-tree changes predate this correction.

## Before / after evidence
Local mocked UI fixtures, matching viewport sizes. Images wait for decode and paint before capture. Scrolled images show reachable lower actions; initial images show composition and HUD. Pre-night images intentionally match: the existing entry boundary was already correct.

| State | Before | After |
|---|---|---|
| Desktop strategic choices | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-1672.png>) |
| Desktop nightly actions (scrolled) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-bottom-1672.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-bottom-1672.png>) |
| Mobile strategic choices | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-390.png>) |
| Mobile nightly actions (scrolled) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/strategic-bottom-390.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/strategic-bottom-390.png>) |
| Pre-Night-1 narrative (HUD remains hidden) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/pre-night.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/pre-night.png>) |
| Playable Night 1 (HUD visible) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/playable-night-one.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/playable-night-one.png>) |
| Character dialogue (Feed removed) | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/dialogue.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/dialogue.png>) |
| Choices after leaving dialogue | [Before](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-before/after-dialogue.png>) | [After](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/after-dialogue.png>) |

[Feed available after leaving dialogue (scrolled)](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/after-dialogue-actions.png>) · [Short landscape verification](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/.local/nightly-ui-after/verified-nightly-844.png>).
