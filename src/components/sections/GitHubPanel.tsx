// ============================================
// GITHUB PANEL - Profile stats, pinned repos, contribution graph
// ============================================

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS } from '@/constants/data';
import { ContributionGraph } from './ContributionGraph';
import { requestJson } from '@/lib/request';

const GITHUB_USER =
  SOCIAL_LINKS.find((l) => l.label === 'GitHub')
    ?.url.split('/')
    .pop() ?? 'jedkx';

interface GitHubUser {
  followers: number;
  following: number;
  public_repos: number;
}

interface GitHubPanelProps {
  accentColor: string;
}

const PINNED_REPOS = [
  {
    name: 'DxReportReview',
    lang: 'C#',
    desc: 'DevExpress reporting with git-style approve/reject flow.',
  },
  { name: 'openground', lang: 'Python', desc: 'FastAPI + WebSocket + Open MCT telemetry sandbox.' },
  { name: 'sentinel', lang: 'C++', desc: 'RPi Waveshare e-paper monitor with scrolling log.' },
  { name: 'Relay', lang: 'Go', desc: 'Webhook persister to Postgres with async retries.' },
];

export const GitHubPanel: React.FC<GitHubPanelProps> = ({ accentColor }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();

    requestJson(`https://api.github.com/users/${GITHUB_USER}`, ctrl.signal)
      .then((value) => {
        const data = value as GitHubUser | null;
        if (
          !data ||
          ![data.followers, data.following, data.public_repos].every(
            (item) => typeof item === 'number' && Number.isSafeInteger(item) && item >= 0
          )
        )
          throw new Error('Invalid GitHub profile');
        if (!ctrl.signal.aborted) setUser(data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setFailed(true);
      });

    return () => ctrl.abort();
  }, []);

  return (
    <div className="font-mono text-[13px] md:text-sm space-y-4 min-w-0 rounded-sm border border-terminal/15 bg-white/[0.015] p-3.5 md:p-4">
      <div className="nf-line flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] md:text-sm">
        <span className="font-bold text-sm md:text-base" style={{ color: accentColor }}>
          {GITHUB_USER}
        </span>
        {user ? (
          <>
            <span className="text-terminal-dark/35">·</span>
            <span className="text-terminal-dark">{user.followers} followers</span>
            <span className="text-terminal-dark/35">·</span>
            <span className="text-terminal-dark">{user.following} following</span>
            <span className="text-terminal-dark/35">·</span>
            <span className="text-terminal-dark">{user.public_repos} public repos</span>
          </>
        ) : (
          <span className="text-terminal-dark" role="status">
            {failed ? 'profile offline · repositories below' : 'fetching profile...'}
          </span>
        )}
        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hoverable ml-auto flex items-center gap-1.5 font-mono text-[10px] md:text-xs tracking-widest text-terminal-dark hover:text-terminal transition-colors duration-200"
        >
          GITHUB
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="nf-line text-terminal-dark/55 text-[11px] md:text-xs tracking-[0.24em] uppercase select-none">
        --- pinned repositories ----------------
      </div>

      <div className="space-y-2.5">
        {PINNED_REPOS.map((repo) => (
          <a
            key={repo.name}
            href={`https://github.com/${GITHUB_USER}/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nf-line hoverable block border border-terminal/10 bg-white/[0.015] px-3 py-2 hover:border-terminal/30 hover:bg-white/[0.03] transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[13px] md:text-sm" style={{ color: accentColor }}>
                &gt;
              </span>
              <span className="text-terminal font-bold text-sm md:text-base">{repo.name}</span>
              <span className="text-terminal-dark/55 text-[11px] md:text-xs ml-auto tracking-[0.2em] uppercase">
                {repo.lang}
              </span>
            </div>
            <div className="text-terminal-dark/75 text-[12px] md:text-[13px] mt-1 leading-relaxed">
              {repo.desc}
            </div>
          </a>
        ))}
      </div>

      <div className="nf-line text-terminal-dark/55 text-[11px] md:text-xs tracking-[0.24em] uppercase select-none">
        --- contributions ----------------------
      </div>

      <div className="nf-line overflow-x-auto pb-1">
        <ContributionGraph accentColor={accentColor} />
      </div>
    </div>
  );
};
