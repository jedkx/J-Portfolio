# Product readiness — 2026-11-07

Status: local fixes verified; cross-browser/device sign-off remains incomplete.
This report records local verification. Release and deployment status is tracked
separately in Git history and GitHub Actions.

## Closed issues

- Removed Dark Matter/Nostromo branding from active source, loading copy and package identity. Browser title, CC favicon, Apple icon and social preview identify Caner Coşkun.
- Fonts are local, licensed assets. Optional GitHub, game and ribbon code loads near view rather than during the initial hero.
- Hero particle work degrades only after sustained pressure: bounded particle counts, DPR caps, and reduced halos. The lowest setting restores the native cursor and removes expensive decoration/filter work. It does not detect or change the user's GPU settings.
- Animation frame subscribers stop offscreen/hidden; sonar avoids DOM scans in hidden tabs. Pointer and animation cleanup remains scoped to component lifetime.
- Navigation records browser history and handles Back/Forward. Lazy content height changes refresh gallery geometry; mobile screens that cannot fit a card fall back to normal document flow.
- Signal Run is confined to Who’s There. Contact has no game. Physics, particles and difficulty are bounded; 100 points unlock radar without ending the run. Keys, Decrypt and the passphrase input share one compact console.
- Optional game failure has a local recovery path. Unavailable SHA-256 does not crash the five-key route. Production error UI does not print internal exception messages.
- Node 24 and pinned official Actions releases replace deprecated Node 20 actions. CI checks published base paths, local fonts, icons and social assets before Pages upload.

## Evidence

- 30 Node regression tests passed, covering untrusted API/cache data, cancellation/timeouts, gallery geometry, resident animations, particle color bounds, sustained render pressure and endless game physics.
- TypeScript and ESLint passed. Production build and `check:dist` passed.
- Chromium in-app browser: desktop navigation and Back, Play/Pause/Resume (including focus restoration), no Contact canvas, and compact controls checked. The production preview also passed mobile-menu navigation, terminal/gallery navigation and one-step Next project selection. No errors attributed to the preview origin were captured. Desktop CSS viewport 1297×810 and narrow 351×760 showed no horizontal overflow. Mobile viewport emulation is not a physical phone test.
- Current main application chunk is approximately 136 KB gzip; deferred chunks still download later. This is not a total page-weight, FPS or Lighthouse result.
- Full `npm audit` returned zero reported vulnerabilities after a targeted override of vulnerable minimatch 7–10 to patched 11.0.1. The affected dependency is development-only; runtime library versions remain unchanged. A clean `npm ci --ignore-scripts` and the quality checks passed with the override.
- Existing historical console errors from live module replacement are not evidence of a clean production run; fresh-load browser verification should be used for release sign-off.

## Hardware and browser findings

The active site uses DOM/CSS/SVG and Canvas 2D, with no WebGL requirement.
Hardware acceleration can still affect animation speed: disabling GPU use can
increase CPU load. Canvas resolution, blur and per-frame drawing remain costs
even when the browser provides software rendering. The quality reduction limits
these costs; it cannot guarantee a frame rate on every device.

Sources: [Mozilla performance settings](https://support.mozilla.org/en-US/kb/performance-settings),
[MDN canvas optimization](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas),
[MDN backdrop-filter compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter).

Dependency advisory: [minimatch pattern amplification](https://github.com/advisories/GHSA-g3hv-75wg-m249).

## Remaining release checks

- Physical iOS Safari and Android Chrome; Firefox and standalone Edge desktop.
- GPU acceleration disabled, prolonged thermal/battery use, reduced-motion preference and slow/offline first visit.
- New CI execution and Pages deployment after an explicitly authorized push.
- Independent accessibility and lab performance measurement. Lighthouse execution was rejected by automatic approval review, so no new Lighthouse score is claimed.

The intentionally long character intro remains skippable; its duration was not
shortened. Older CSS layers and compatibility components remain documented
maintenance debt, not a reason to perform another visual redesign in this pass.
