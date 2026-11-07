# Current interaction guide — 22 October 2026

## Navigation and layout

- Reload resets the hash/scroll to Home. A fresh direct chapter URL is applied after loading.
- The full loading sequence plays each time; skip and reduced-motion behavior remain available. Its split-page visual copies receive the same progress updates. Blinking begins once the seam is open; the stolen D stays removed.
- Hero is a full-screen particle playground. About is the original neofetch terminal in normal document flow, with a brief entrance movement and no inner wheel trap.
- Projects use a separate sticky gallery below the persistent navbar: desktop visual/description columns, mobile vertical composition. Scroll settles on a project; indices, previous/next and left/right keyboard arrows provide direct selection. Reduced motion and short viewports use normal-flow project cards.
- The scrolling reference ribbon is between Projects and Contact, without hover pause or a pause button; reduced motion disables continuous animation.
- Contact contains email, copy, CV, local time and social links. Who’s There is a separate chapter with Signal Run. Copyright/back-to-top is last.

## Discovery game

- Who’s there? includes an always-visible three-step “How to play” panel beside the receiver (above it on mobile). The former “Where do I start?” button is removed; navbar “?” help remains available. Instructions explain actions without revealing the character.

- Five random keys are attached to words from readable content sections. Decorative transition text, linked controls and the puzzle UI cannot receive keys.
- Discovery automatically fills the matching slot and plays a short sound; no random inline popup or manual paste step.
- A pull-and-release puck game unlocks sonar after three receiver hits, even with zero fragments. Targets move after each hit; walls and a central bumper allow bank shots. The channel remains connected during further play; decryption also requires all five keys.
- Sonar maps viewport-relative word positions into its marked screen square. It excludes off-screen, clipped, covered, inert, hidden, transparent and already-collected targets. Scans run four times per second while expanded and the document is visible. It is minimizable and disappears at 5/5; it is hidden while the resident is open.
- Alternate access normalizes case, spaces and punctuation before comparing hashes. The return passphrase is displayed only after a successful reveal. This is a local game shortcut, not secure access control.
- Key and passphrase routes have different first greetings; repeat openings cycle through return greetings. The result panel is rendered only after the split-page resident closes, so it is not baked into the opening shutters.

## Resident animation — 23 October 2026

- Aseprite source and approved exports live only in `art/resident`; no GIFs or experiments.
- The active renderer uses separate PNG+JSON eye/mouth atlases, named clips and authored frame durations. `scripts/export-resident.mjs` rebuilds the 16-column atlases and tag metadata using installed Aseprite.
- The 68×40 proportion is preserved. Canvas remains transparent, uses nearest-neighbor sampling and alpha-cut pupil tracking; closed lids are never overwritten by mouse tracking.
- Mouth speech follows text typing independently from blinks/gaze, with punctuation pauses. Hover, greetings, eating/recovery and departure select meaningful clips rather than running a continuous emotion reel.
- Loading uses a single GSAP clock for page shutters, letter travel and explicit Aseprite face/eye poses. `residentIntro.ts` owns timing; the cameo's independent clip scheduler is bypassed. No pointer tracking; reduced motion skips the staged intro.
- The mouth is open before the letter arrives at 4.65s. Letter shrink completes before chewing at 4.85s, at 0.85× authored speed. Recovery completes before shutters close at 7.1s. The letter target matches the 68×40 mouth center. Progress continues until 9.9s; final reveal completes around 11.45s.
- During eating frames 26–38, the renderer keeps both eye layers on the approved neutral pose while the authored mouth continues. This avoids pupil-size changes and alternating closed-eye silhouettes on each chew; explicit blink overrides remain separate.
- Only the revealed resident gets contextual ambient clips: notice on reveal/wake, sleepy after 22s without pointer movement, search after 6.5s, curious after resting at an edge, startle on face click or fast nearby pointer movement. Automatic clips have a 14s cooldown and do not start during speech. Critical actions retain priority.
- Sleepy/search/curious/startle/surprised and waking have two short English lines each, alternating on repeat events. Messages only change on reaction transitions, never each animation frame.
- Sleep stops on closed eyes instead of playing the asset's automatic wake-up tail. It stays asleep indefinitely: pointer wake requires at least 6s of closed-eye rest and 80px displacement; an intentional face tap can wake it after 1.8s. Tiny motion and early taps do nothing. Wake plays the gradual half-open-to-open tail; sleeping/shy faces never mouth the text.
- Face action priority is sleep → departure → eat → preparation → recovery → shy → greeting → idle. Changing lower-priority inputs cannot restart the active clip. Hover transitions are deduplicated; speech is suppressed outside idle.
- A face click/tap triggers a brief startled reaction and matching line, even while hover has made it shy. Repeated/double clicks cannot stack clips. Pending focus/hover timers are canceled; eating/recovery/departure remain protected. Sleeping clicks retain the deliberate wake behavior.
- Idle blinks use frog-like overlapping eye-layer timing: the second lid starts before the first finishes opening, without both eyes fully closing together. Text acting selects one mouth shape from the current complete word, closes on spaces/punctuation and never cycles randomly while shy.

## Particle timing regression

A pointer event can be newer than the next RAF callback's timestamp. Charge must be clamped to zero before fractional powers; otherwise negative charge can produce NaN velocity/heat and an invalid palette index. `particleCharge` enforces finite bounds and `particleColor` handles invalid heat or an uninitialized palette. Tests reproduce this timing order.

## Verification boundaries

### Playful signal controls — 2026-11-07

The hero cursor now reads charge and heat from the actual particle simulation via
inherited CSS variables. Release dispatches a single particle-burst event for its
short cursor wave; blur, cancellation, hidden/paused physics and unmount clear
the feedback. No React state updates are added to the particle frame loop.

Contact contains contact links only, with no game. Who’s There hosts Signal Run,
an endless paddle-and-obstacle game. Click/tap the board or press Enter to start;
there is no separate Play button. Pointer/touch or held arrow keys move the
paddle; Space pauses and tapping the paused board resumes. Difficulty grows continuously: faster ball,
narrower paddle, moving and armored obstacles, wide/shield/slow bonuses.
Reaching 100 points unlocks sonar without ending the run. Retry preserves the
radar and best score. Physics use capped time and substeps; trails and sparks
are bounded. The board pauses offscreen/hidden and is loaded only near view.

The Who’s There heading uses deferred React Bits FuzzyText with subtle idle distortion and stronger hover/tap feedback,
with a plain-text reduced-motion fallback. This chapter uses content height instead
of forcing a full-screen minimum.
The discovery introduction and How to play sit on the left. A compact game sits
at the top right, with five key slots, Decrypt and the always-visible passphrase
input directly underneath. Mobile follows the same reading order in one column.
One status line replaces redundant receiver labels. If the optional canvas fails, a local recovery button
opens the radar; email and the portfolio remain independent of the game.

The hero ring changes diameter rather than using individual CSS scale, preserving
its pointer coordinates while charging. Navbar Who's There is accent-colored;
the decorative dots are removed.

### Performance follow-up — 2026-11-07

Hero physics remain paused until the boot overlay completes. The reference ribbon
loads its Motion-based implementation within 400px of the viewport; its RAF
subscription stops offscreen, in hidden tabs and for reduced motion. GitHub code
and requests are deferred until the terminal activity area approaches view.
About height changes refresh gallery geometry; menu navigation follows late
layout shifts until fresh user input, with a 20-second cleanup bound.

The cursor settles on stationary targets and wakes on pointer, scroll, resize or
target geometry changes. Narrow galleries that cannot fit a full project release
into the existing static document layout instead of adding an inner scroller.
Fonts retain their families/weights but are served from public/fonts with their
OFL licenses. HTML includes a boot greeting and an email recovery link if the
bundle fails. Refresh fonts explicitly with node scripts/sync-fonts.mjs.

Main application chunk fell from 178.02 to about 136 KB gzip; deferred chunks
still download when needed. This is a bundle measurement, not an FPS or Lighthouse
score. Lighthouse execution was rejected by automatic approval review; no new
lab score is claimed. Real-device profiling remains outstanding.

Automated checks: TypeScript, ESLint, Node tests and production build. Recent browser checks covered desktop and a 390×844 viewport, normal About scroll, gallery buttons, and sonar-driven collection of all five keys. These are targeted checks, not comprehensive automated E2E coverage. Real-device Safari/Android, accessibility measurement, sustained thermal/performance profiling and deployment remain unverified. See the dated audit reports for earlier findings; their old scene thresholds and receiver values no longer describe the active UI.
