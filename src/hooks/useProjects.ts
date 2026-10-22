import { useEffect, useState } from 'react';
import { fetchReadmePreview, fetchRepositories, type GitHubProject } from '@/lib/github';

import {
  PROJECT_CACHE_KEY as CACHE_KEY,
  PROJECT_CACHE_TTL as CACHE_TTL,
  parseProjectCache,
} from '@/lib/projectCache';
function readCache() {
  try {
    return parseProjectCache(JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null'));
  } catch {
    return null;
  }
}
function writeCache(projects: GitHubProject[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ projects, savedAt: Date.now() }));
  } catch {
    /* Storage is optional. */
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'cached' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    let disposed = false;
    const cache = readCache();
    if (cache) {
      setProjects(cache.projects);
      setStatus('cached');
    } else setStatus('loading');

    const run = async () => {
      if (attempt === 0 && cache && Date.now() - cache.savedAt < CACHE_TTL) {
        setStatus('ready');
        return;
      }
      try {
        let next = await fetchRepositories(controller.signal);
        if (disposed) return;
        setProjects(next);
        setStatus('ready');
        writeCache(next);
        // Preview requests use raw README files, not extra REST API calls per repository.
        const queue = [...next];
        await Promise.allSettled(
          Array.from({ length: Math.min(4, queue.length) }, async () => {
            while (queue.length && !disposed && !controller.signal.aborted) {
              const project = queue.shift()!;
              try {
                const imageUrl = await fetchReadmePreview(project, controller.signal);
                if (!imageUrl || disposed) continue;
                next = next.map((item) => (item.id === project.id ? { ...item, imageUrl } : item));
                setProjects(next);
              } catch {
                /* One README failure must not stop other previews. */
              }
            }
          })
        );
        if (!disposed) writeCache(next);
      } catch {
        if (!disposed) setStatus(cache ? 'cached' : 'error');
      }
    };
    void run().finally(() => window.clearTimeout(timeout));
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt]);

  return { projects, status, retry: () => setAttempt((value) => value + 1) };
}
