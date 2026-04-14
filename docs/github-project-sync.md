# GitHub Project Sync

## Goal

Automatically ingest public repositories from `jedkx` while preserving curated static entries as the authoritative showcase.

## Integration Contract

- Endpoint: `GET https://api.github.com/users/jedkx/repos?per_page=100&sort=updated`
- Source file: `src/lib/github.ts`
- Response model: `GitHubRepo` (`src/types/index.ts`)

## Normalization Strategy

GitHub repositories are transformed into internal `Project` cards via `mapRepoToProject` in `src/lib/projectMapper.ts`.

Normalization rules:

- `title` <- repo name
- `description` <- repo description or fallback text
- `link` <- homepage if available, otherwise GitHub URL
- `github` <- GitHub URL
- `tags` <- language + topics with defensive defaults
- `category` <- inferred from topics/language, fallback `OPEN_SOURCE`

## Merge Rules

Implemented in `src/lib/mergeProjects.ts`.

1. Start with static curated list.
2. Build identity set from existing cards.
3. For each mapped GitHub project:
   - if identity already exists, skip
   - else append

Identity priority:

- `github` URL (or `link`) if it points to GitHub
- otherwise normalized `title`

## Runtime Behavior

`useProjects` (`src/hooks/useProjects.ts`) controls lifecycle:

- Initial render: static projects only
- Success: merged static + GitHub
- Failure: static-only + error state retained in hook

## Scope Choices

- Imports all public repositories.
- Excludes forks and archived repositories by default in hook filtering.
- Does not require backend/proxy for first version (client-side integration).

## Known Limits

- Unauthenticated GitHub requests are rate-limited.
- Project card image currently uses a generic default for auto-imported repos.
- No persistent cache layer yet.
