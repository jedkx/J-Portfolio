# Architecture

## Purpose

This document explains the runtime architecture of `J-Portfolio`, with focus on the Projects domain that combines static curation and live GitHub synchronization.

## System Boundaries

- **Frontend app:** React + TypeScript single-page application.
- **Data sources:**
  - Static source: `src/constants/data.ts`
  - Remote source: GitHub REST API (`/users/jedkx/repos`)
- **Runtime target:** Browser (GitHub Pages in production, Dockerized Vite in local development).

## High-Level Flow

1. `ProjectsSection` consumes `useProjects`.
2. `useProjects` initializes with static data (`PROJECTS`).
3. Hook asynchronously fetches GitHub public repositories.
4. Raw repo payload is normalized into internal `Project` shape.
5. Static and dynamic lists are merged by deterministic identity rules.
6. UI renders merged list; static list remains fallback on remote errors.

## Layered Structure

- **Presentation layer**
  - `src/components/sections/ProjectsSection.tsx`
- **State orchestration**
  - `src/hooks/useProjects.ts`
- **Integration/data layer**
  - `src/lib/github.ts`
  - `src/lib/projectMapper.ts`
  - `src/lib/mergeProjects.ts`
- **Domain model**
  - `src/types/index.ts`

## Design Decisions

### 1) Static-first initialization

The UI always has immediate content from static data before any network call finishes.

### 2) Deterministic merge behavior

Potential duplicates are detected by GitHub/link identity normalization.  
If a static item represents the same repo, static item wins.

### 3) Degrade-safe runtime

Any API failure falls back to static projects without crashing rendering path.

### 4) Small testable units

Fetch, mapping, and merge logic are split into separate files to keep responsibilities narrow.

## Failure Modes and Handling

- **GitHub rate limit / network error**
  - Behavior: return static-only list
  - User impact: no crash, no blank section
- **Unexpected repo data shape**
  - Behavior: mapper defaults are used (description/tags/category/link fallbacks)
- **Duplicate listing**
  - Behavior: merge identity rules prevent duplicate cards

## Local Development Runtime

- `docker-compose.yml` runs Vite dev server in container.
- Source code is mounted as volume for hot reload.
- Default URL: `http://localhost:3000`.
