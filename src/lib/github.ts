export const GITHUB_USERNAME = 'jedkx';

export interface GitHubProject {
  id: number;
  name: string;
  description: string;
  language: string | null;
  topics: string[];
  branch: string;
  imageUrl?: string;
}

export function mapRepository(value: unknown): GitHubProject | null {
  if (!value || typeof value !== 'object') return null;
  const repo = value as Record<string, unknown>;
  if (typeof repo.id !== 'number' || typeof repo.name !== 'string' || !/^[\w.-]+$/.test(repo.name))
    return null;
  // Employer case studies are intentionally excluded from the public project feed.
  if (/belsis/i.test(`${repo.name} ${repo.description ?? ''}`)) return null;
  return {
    id: repo.id,
    name: repo.name,
    description: typeof repo.description === 'string' ? repo.description : '',
    language: typeof repo.language === 'string' ? repo.language : null,
    topics: Array.isArray(repo.topics)
      ? repo.topics.filter((topic): topic is string => typeof topic === 'string')
      : [],
    branch: typeof repo.default_branch === 'string' ? repo.default_branch : 'main',
  };
}

export async function fetchRepositories(signal: AbortSignal): Promise<GitHubProject[]> {
  const projects: GitHubProject[] = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
      {
        signal,
        headers: { Accept: 'application/vnd.github+json' },
      }
    );
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected GitHub response');
    projects.push(
      ...data.map(mapRepository).filter((project): project is GitHubProject => project !== null)
    );
    if (data.length < 100) break;
  }
  return Array.from(new Map(projects.map((project) => [project.id, project])).values());
}

export function findReadmePreview(readme: string, project: GitHubProject): string | undefined {
  const images = [
    ...Array.from(
      readme.matchAll(/!\[([^\]]*)\]\(<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\)/g),
      (match) => ({ alt: match[1], src: match[2] })
    ),
    ...Array.from(readme.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi), (match) => ({
      alt: match[0],
      src: match[1],
    })),
  ];
  for (const image of images) {
    if (!/screenshot|preview|portfolio|screen-shot|cover|demo/i.test(`${image.alt} ${image.src}`))
      continue;
    if (/shields\.io|badge|\.svg(?:\?|$)|\.gif(?:\?|$)/i.test(image.src)) continue;
    try {
      const source =
        image.src.startsWith('/') && !image.src.startsWith('//') ? image.src.slice(1) : image.src;
      let url = new URL(
        source,
        `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${project.name}/${encodeURIComponent(project.branch)}/`
      );
      if (url.hostname === 'github.com' && url.pathname.includes('/blob/')) {
        url = new URL(`https://raw.githubusercontent.com${url.pathname.replace('/blob/', '/')}`);
      }
      if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
    } catch {
      /* A malformed README image must not break the project list. */
    }
  }
  return undefined;
}

export async function fetchReadmePreview(
  project: GitHubProject,
  signal: AbortSignal
): Promise<string | undefined> {
  const response = await fetch(
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${project.name}/${encodeURIComponent(project.branch)}/README.md`,
    { signal }
  );
  if (!response.ok) return undefined;
  return findReadmePreview(await response.text(), project);
}
