import type { GitHubRepo, Project } from '@/types';

const DEFAULT_PROJECT_IMAGE =
  'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1600&auto=format&fit=crop';

function getCategory(repo: GitHubRepo): string {
  if (repo.topics.some((topic) => topic.toLowerCase().includes('game'))) {
    return 'GAME_DEV';
  }

  if (repo.topics.some((topic) => topic.toLowerCase().includes('portfolio'))) {
    return 'PORTFOLIO';
  }

  if (repo.language) {
    return repo.language.toUpperCase().replace(/\s+/g, '_');
  }

  return 'OPEN_SOURCE';
}

function getTags(repo: GitHubRepo): string[] {
  const topicTags = repo.topics.slice(0, 4);
  if (repo.language && !topicTags.includes(repo.language)) {
    return [repo.language, ...topicTags];
  }

  return topicTags.length > 0 ? topicTags : ['GitHub'];
}

export function mapRepoToProject(repo: GitHubRepo, screenshotUrl?: string | null): Project {
  return {
    id: `github-${repo.id}`,
    title: repo.name,
    category: getCategory(repo),
    description: repo.description ?? 'Public GitHub repository maintained by jedkx.',
    imageUrl: screenshotUrl || DEFAULT_PROJECT_IMAGE,
    tags: getTags(repo),
    link: repo.homepage?.trim() ? repo.homepage : repo.html_url,
    github: repo.html_url,
    source: 'github',
    updatedAt: repo.pushed_at,
  };
}
