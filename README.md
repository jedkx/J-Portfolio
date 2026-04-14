# J-Portfolio

Professional portfolio application built with React, TypeScript, and GSAP.  
The Projects section uses a hybrid model: static curated projects stay intact, and public GitHub repositories are fetched automatically and merged in.

## Why this exists

Most portfolio repositories look polished on the surface but fail to explain engineering decisions.  
This project is intentionally structured as a hiring-facing artifact: visual quality + explicit architecture + predictable runtime behavior.

The key design intent is simple:

- Preserve manually curated, high-signal project entries.
- Auto-include public GitHub work so the portfolio stays fresh without manual updates.
- Fail safely: if GitHub API is unavailable, the page still renders stable static content.

## Live Demo

[View Portfolio](https://jedkx.github.io/J-Portfolio/)

## Tech Stack

- React 19
- TypeScript
- Vite 5
- GSAP + ScrollTrigger
- Tailwind CSS
- Lucide React

## Key Features

- Hybrid project sourcing (static curated + live GitHub public repos)
- Deterministic merge logic with duplicate protection
- Repository screenshot detection (uses repo preview assets when available)
- Safe fallback to static data on GitHub API failures/rate limits
- Desktop horizontal project showcase with mobile-optimized cards
- GitHub Pages deployment pipeline

## Architecture Overview

Projects flow:

1. Static projects are loaded from `src/constants/data.ts`.
2. Public repositories are fetched from `https://api.github.com/users/jedkx/repos`.
3. Repositories are mapped into the local `Project` type.
4. Static and dynamic lists are merged with static-first priority.
5. UI renders the merged list; if API fails, static list remains visible.

Detailed technical documentation:

- `docs/architecture.md`
- `docs/github-project-sync.md`

Core implementation files:

- `src/hooks/useProjects.ts`
- `src/lib/github.ts`
- `src/lib/projectMapper.ts`
- `src/lib/mergeProjects.ts`
- `src/components/sections/ProjectsSection.tsx`

## Local Development (Docker-first)

Prerequisites:

- Docker Desktop (or Docker Engine + Compose)

Run with Docker Compose:

```bash
docker compose up --build
```

Application URL:

- http://localhost:3000

Stop:

```bash
docker compose down
```

## Local Development (Optional: Node.js)

If you prefer running without Docker:

- Node.js 20+
- npm 10+

Install and run:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Quality checks:

```bash
npm run lint
npm run type-check
npm run build
```

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`) runs:

- `npm ci`
- `npm run lint`
- `npm run type-check`
- `npm run build`
- GitHub Pages deploy on `main`

## Operational Notes

- GitHub API integration is unauthenticated by default and may hit rate limits under heavy traffic.
- Current fallback behavior is static-only rendering when remote sync fails.
- Docker setup is optimized for local development parity, not production container hosting.

## Future Hardening

- Add authenticated GitHub API mode via environment variable token for higher rate limits.
- Add tests for mapper and merge rules.
- Add repository whitelist/blacklist controls to tune auto-import behavior.
- Add CI workflow for pull requests (quality gates without deployment).

## Project Structure

```text
src/
├── components/          # UI composition and sections
├── constants/           # Static content and app constants
├── hooks/               # React hooks (including project sync hook)
├── lib/                 # Data fetch/mapping/merge utilities
├── styles/              # Global styles
├── types/               # TypeScript models
└── utils/               # Shared helpers
```

## License

MIT