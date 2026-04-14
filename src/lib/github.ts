import type { GitHubRepo } from '@/types';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_USERNAME = 'jedkx';

export async function fetchPublicRepos(): Promise<GitHubRepo[]> {
  const endpoint = `${GITHUB_API_BASE_URL}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  const repositories = (await response.json()) as GitHubRepo[];
  return repositories.filter((repo) => !repo.private);
}

const SCREENSHOT_CANDIDATES = [
  'screenshot.png',
  'screenshot.jpg',
  'screenshot.jpeg',
  'preview.png',
  'preview.jpg',
  'cover.png',
  'cover.jpg',
  'demo.png',
  'demo.jpg',
  'docs/screenshot.png',
  'docs/preview.png',
  'assets/screenshot.png',
  'assets/preview.png',
  'public/screenshot.png',
  'public/preview.png',
  'screenshots/preview.png',
  'screenshots/screenshot.png',
];

function buildRawAssetUrl(repo: GitHubRepo, assetPath: string): string {
  return `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/${repo.default_branch}/${assetPath}`;
}

function toAbsoluteReadmeImageUrl(repo: GitHubRepo, imagePath: string): string {
  const trimmedPath = imagePath.trim();

  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }

  const normalizedPath = trimmedPath.replace(/^\.?\//, '');
  return buildRawAssetUrl(repo, normalizedPath);
}

function extractReadmeImageCandidates(content: string): string[] {
  const candidates: string[] = [];
  const markdownImageRegex = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/gi;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;

  let markdownMatch: RegExpExecArray | null = markdownImageRegex.exec(content);
  while (markdownMatch) {
    if (markdownMatch[1]) {
      candidates.push(markdownMatch[1]);
    }
    markdownMatch = markdownImageRegex.exec(content);
  }

  let htmlMatch: RegExpExecArray | null = htmlImageRegex.exec(content);
  while (htmlMatch) {
    if (htmlMatch[1]) {
      candidates.push(htmlMatch[1]);
    }
    htmlMatch = htmlImageRegex.exec(content);
  }

  return candidates;
}

function scoreImageCandidate(candidate: string): number {
  const value = candidate.toLowerCase();
  let score = 0;

  if (value.includes('preview')) score += 50;
  if (value.includes('screenshot')) score += 50;
  if (value.includes('screen')) score += 30;
  if (value.includes('cover')) score += 30;
  if (value.includes('demo')) score += 20;
  if (value.includes('hero')) score += 20;
  if (value.includes('docs/')) score += 10;
  if (value.includes('screenshots/')) score += 20;

  if (value.includes('badge')) score -= 80;
  if (value.includes('shields.io')) score -= 80;
  if (value.includes('icon')) score -= 50;
  if (value.includes('logo')) score -= 40;
  if (value.includes('avatar')) score -= 40;

  return score;
}

async function resolveReadmeScreenshot(repo: GitHubRepo): Promise<string | null> {
  const readmeCandidates = ['README.md', 'readme.md'];

  for (const candidate of readmeCandidates) {
    const readmeUrl = buildRawAssetUrl(repo, candidate);
    try {
      const response = await fetch(readmeUrl);
      if (!response.ok) {
        continue;
      }

      const content = await response.text();
      const imagePaths = extractReadmeImageCandidates(content);
      if (imagePaths.length === 0) {
        continue;
      }

      const rankedCandidates = [...new Set(imagePaths)].sort(
        (a, b) => scoreImageCandidate(b) - scoreImageCandidate(a)
      );

      for (const imagePath of rankedCandidates) {
        const resolvedImageUrl = toAbsoluteReadmeImageUrl(repo, imagePath);
        const imageResponse = await fetch(resolvedImageUrl, { method: 'HEAD' });
        if (imageResponse.ok) {
          return resolvedImageUrl;
        }
      }
    } catch {
      // Continue with next README candidate.
    }
  }

  return null;
}

export async function resolveRepoScreenshot(repo: GitHubRepo): Promise<string | null> {
  const readmeScreenshot = await resolveReadmeScreenshot(repo);
  if (readmeScreenshot) {
    return readmeScreenshot;
  }

  for (const candidate of SCREENSHOT_CANDIDATES) {
    const assetUrl = buildRawAssetUrl(repo, candidate);
    try {
      const response = await fetch(assetUrl, { method: 'HEAD' });
      if (response.ok) {
        return assetUrl;
      }
    } catch {
      // Keep probing candidates; network failures should not break the entire repo mapping flow.
    }
  }

  return null;
}
