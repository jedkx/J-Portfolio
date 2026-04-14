import type { Project } from '@/types';

function getProjectIdentity(project: Project): string {
  const githubRef = (project.github || project.link).toLowerCase().trim();
  if (githubRef.includes('github.com/')) {
    let normalizedRef = githubRef;
    while (normalizedRef.endsWith('/')) {
      normalizedRef = normalizedRef.slice(0, -1);
    }

    return normalizedRef;
  }

  return project.title.toLowerCase().trim();
}

export function mergeProjects(staticProjects: Project[], githubProjects: Project[]): Project[] {
  const merged = [...staticProjects];
  const knownIdentities = new Set(staticProjects.map(getProjectIdentity));

  for (const githubProject of githubProjects) {
    const identity = getProjectIdentity(githubProject);
    if (!knownIdentities.has(identity)) {
      knownIdentities.add(identity);
      merged.push(githubProject);
    }
  }

  return merged;
}
