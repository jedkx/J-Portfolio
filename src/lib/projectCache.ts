import type { GitHubProject } from './github';

export const PROJECT_CACHE_KEY = 'jedkx-projects-v1';
export const PROJECT_CACHE_TTL = 30 * 60 * 1000;

export function parseProjectCache(
  value: unknown,
  now = Date.now()
): { projects: GitHubProject[]; savedAt: number } | null {
  if (!value || typeof value !== 'object') return null;
  const cache = value as Record<string, unknown>;
  if (
    typeof cache.savedAt !== 'number' ||
    !Number.isFinite(cache.savedAt) ||
    cache.savedAt < 0 ||
    cache.savedAt > now ||
    !Array.isArray(cache.projects)
  )
    return null;
  const projects: GitHubProject[] = [];
  for (const value of cache.projects) {
    if (!value || typeof value !== 'object') return null;
    const item = value as Record<string, unknown>;
    if (
      !Number.isSafeInteger(item.id) ||
      typeof item.name !== 'string' ||
      !/^[\w.-]+$/.test(item.name) ||
      typeof item.description !== 'string' ||
      typeof item.branch !== 'string' ||
      !Array.isArray(item.topics) ||
      !item.topics.every((topic) => typeof topic === 'string') ||
      (item.language !== null && typeof item.language !== 'string')
    )
      return null;
    if (/belsis/i.test(`${item.name} ${item.description}`)) continue;
    let imageUrl: string | undefined;
    if (typeof item.imageUrl === 'string') {
      try {
        const url = new URL(item.imageUrl);
        if (url.protocol === 'https:' && !url.username && !url.password) imageUrl = url.href;
      } catch {
        /* Ignore an invalid preview, not the saved project. */
      }
    }
    projects.push({
      id: item.id as number,
      name: item.name,
      description: item.description,
      branch: item.branch,
      language: item.language as string | null,
      topics: item.topics as string[],
      ...(imageUrl ? { imageUrl } : {}),
    });
  }
  return {
    projects: [...new Map(projects.map((project) => [project.id, project])).values()],
    savedAt: cache.savedAt,
  };
}
