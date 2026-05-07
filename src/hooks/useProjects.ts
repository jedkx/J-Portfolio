import { useEffect, useState } from 'react';
import { PROJECTS } from '@/constants/data';
import { fetchPublicRepos, resolveRepoScreenshot } from '@/lib/github';
import { mergeProjects } from '@/lib/mergeProjects';
import { mapRepoToProject } from '@/lib/projectMapper';
import type { Project } from '@/types';

const CACHE_KEY = 'portfolio_projects_cache';
const CACHE_TTL_MS = 30 * 60 * 1000;

interface ProjectsCache {
  data: Project[];
  timestamp: number;
}

function readCache(): Project[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectsCache;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: Project[]): void {
  try {
    const entry: ProjectsCache = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

interface UseProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsState {
  const [projects, setProjects] = useState<Project[]>(() => readCache() ?? PROJECTS);
  const [isLoading, setIsLoading] = useState<boolean>(() => readCache() === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (readCache() !== null) {
      return;
    }

    let isActive = true;

    async function loadProjects(): Promise<void> {
      try {
        const repositories = await fetchPublicRepos();
        const activeRepositories = repositories.filter((repo) => !repo.fork && !repo.archived);
        const githubProjects = await Promise.all(
          activeRepositories.map(async (repo) => {
            const screenshotUrl = await resolveRepoScreenshot(repo);
            return mapRepoToProject(repo, screenshotUrl);
          })
        );

        if (isActive) {
          const merged = mergeProjects(PROJECTS, githubProjects);
          setProjects(merged);
          writeCache(merged);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load GitHub projects');
          setProjects(PROJECTS);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  return { projects, isLoading, error };
}
