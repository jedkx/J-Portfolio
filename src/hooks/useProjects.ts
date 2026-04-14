import { useEffect, useState } from 'react';
import { PROJECTS } from '@/constants/data';
import { fetchPublicRepos, resolveRepoScreenshot } from '@/lib/github';
import { mergeProjects } from '@/lib/mergeProjects';
import { mapRepoToProject } from '@/lib/projectMapper';
import type { Project } from '@/types';

interface UseProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export function useProjects(): UseProjectsState {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
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
          setProjects(mergeProjects(PROJECTS, githubProjects));
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
