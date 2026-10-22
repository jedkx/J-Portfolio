# Runtime architecture

The site's personal terminal/space identity is deliberate. Architecture work must not replace that identity with a generic portfolio template.

## Active boundaries

| Responsibility                                     | Owner                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
| Boot, theme, application providers                 | `src/App.tsx`                                                                   |
| Content and accessible scene markup                | `src/components/sections/PortfolioExperience.tsx`                               |
| Reversible GSAP scene lifecycle                    | `src/features/portfolio/usePortfolioScene.ts`                                   |
| Gallery index, navbar offset and scroll geometry   | `src/features/portfolio/scene.ts`                                               |
| Real README previews / explicit abstract fallbacks | `src/features/portfolio/RepositoryVisual.tsx`                                   |
| Original terminal layout                           | `src/components/sections/NeofetchTerminal.tsx`                                  |
| GitHub transport and mapping                       | `src/lib/github.ts`                                                             |
| Validated optional browser cache                   | `src/lib/projectCache.ts`                                                       |
| Fetch orchestration and four-worker preview queue  | `src/hooks/useProjects.ts`                                                      |
| Cancellable, timed profile/contribution requests   | `src/lib/request.ts`                                                            |
| Untrusted contribution data validation             | `src/lib/contributions.ts`                                                      |
| Optional discovery game and resident               | `src/components/game/`                                                          |
| Visible-key sonar                                  | `src/components/game/FragmentSonar.tsx`, target measurement in `SecretGame.tsx` |
| Particle charge bounds and safe color lookup       | `src/lib/particleColor.ts`                                                      |

## Invariants

- GSAP owns animated transforms, opacity and masks; React owns selected content, accessibility and expanded-preview state.
- Each scene uses a scoped GSAP context and reverts it on teardown. Media-query changes restore normal flow on short screens and for reduced motion.
- Hero and About are independent normal-flow sections. About has no inner scrollbar or wheel handler. Only the repository gallery is sticky; its selected index follows the scrubbed playhead.
- Scroll geometry lives in `scene.ts`; tests cover index clamping and gallery distance including one exit step. `portfolio-chapters.css` uses matching viewport/step bounds and the project-count custom property. Refresh must restore selection and playhead together.
- Repository metadata, cache data and contribution responses are untrusted. Validate at the boundary, never insert remote HTML, and allow only HTTPS preview URLs.
- Fetches must be cancellable. Optional APIs have a timeout and an offline state; contact links never depend on the game or GitHub.
- No GitHub token is shipped. Browser SHA-256 is a local puzzle shortcut, **not authentication**.
- Hidden scene panels are inert and excluded from assistive technology; navigation and real repository links remain keyboard reachable.
- A repository without a screenshot gets abstract cover art, not a fabricated product screenshot.

## Styles and remaining debt

`main.css` supplies the base; `editorial.css` and `quiet.css` contain earlier design layers. `experience.css` still contains old scene rules alongside active rules. Do not append another global redesign layer to override them.

Active scoped owners include `terminal-original.css`, `navigation.css`, `reference-ribbon.css`, `secret-game.css`, `contact-station.css`, `portfolio-chapters.css` and `components/game/fragment-sonar.css`. `refinement.css` is an accumulated compatibility layer and remains consolidation debt. Consolidate legacy selectors feature by feature only with desktop/mobile visual checks, including reverse scroll, expansion, dialogs and reduced motion. Retired section components remain as compatibility code; the active application imports modules directly rather than their legacy barrel.

## Verification

Use Node 22.12+ (`.nvmrc` pins the CI/Docker major), then:

```sh
npm ci
npm run lint
npm run type-check
npm test
npm run build
npm audit --omit=dev
```

PR quality gates do not deploy. The separate Pages workflow deploys only when pushed to `main` or explicitly dispatched. Nothing was committed, pushed or deployed during the audit.

Unit tests cover production parsers, request failures/cancellation, gallery geometry, block-eye boundaries, negative particle timestamps and safe palette lookup. They are not a replacement for browser/device coverage, user testing, accessibility measurement or performance profiling.
