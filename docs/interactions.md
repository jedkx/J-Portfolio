# Current interaction guide — 22 October 2026

## Navigation and layout

- Reload resets the hash/scroll to Home. A fresh direct chapter URL is applied after loading.
- The full loading sequence plays each time; skip and reduced-motion behavior remain available. Its split-page visual copies receive the same progress updates. Blinking begins once the seam is open; the stolen D stays removed.
- Hero is a full-screen particle playground. About is the original neofetch terminal in normal document flow, with a brief entrance movement and no inner wheel trap.
- Projects use a separate sticky gallery below the persistent navbar: desktop visual/description columns, mobile vertical composition. Scroll settles on a project; indices, previous/next and left/right keyboard arrows provide direct selection. Reduced motion and short viewports use normal-flow project cards.
- The scrolling reference ribbon is between Projects and Contact, without hover pause or a pause button; reduced motion disables continuous animation.
- Contact contains email, copy, CV, local time and an interactive ping diagram. Who’s there? is a separate chapter. Copyright/back-to-top is last.

## Discovery game

- Five random keys are attached to words from readable content sections. Decorative transition text, linked controls and the puzzle UI cannot receive keys.
- Discovery automatically fills the matching slot and plays a short sound; no random inline popup or manual paste step.
- The receiver target changes between openings. Locking it unlocks sonar even with zero fragments. Sonar remains unlocked after detuning; decryption still requires a currently locked receiver and all five keys.
- Sonar maps viewport-relative word positions into its marked screen square. It excludes off-screen, clipped, covered, inert, hidden, transparent and already-collected targets. Scans run four times per second while expanded and the document is visible. It is minimizable and disappears at 5/5; it is hidden while the resident is open.
- Alternate access normalizes case, spaces and punctuation before comparing hashes. The return passphrase is displayed only after a successful reveal. This is a local game shortcut, not secure access control.
- Key and passphrase routes have different first greetings; repeat openings cycle through return greetings. The result panel is rendered only after the split-page resident closes, so it is not baked into the opening shutters.

## Particle timing regression

A pointer event can be newer than the next RAF callback's timestamp. Charge must be clamped to zero before fractional powers; otherwise negative charge can produce NaN velocity/heat and an invalid palette index. `particleCharge` enforces finite bounds and `particleColor` handles invalid heat or an uninitialized palette. Tests reproduce this timing order.

## Verification boundaries

Automated checks: TypeScript, ESLint, Node tests and production build. Recent browser checks covered desktop and a 390×844 viewport, normal About scroll, gallery buttons, and sonar-driven collection of all five keys. These are targeted checks, not comprehensive automated E2E coverage. Real-device Safari/Android, accessibility measurement, sustained thermal/performance profiling and deployment remain unverified. See the dated audit reports for earlier findings; their old scene thresholds and receiver values no longer describe the active UI.
