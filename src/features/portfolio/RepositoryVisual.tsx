import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { GitHubProject } from '@/lib/github';

// Abstract cover art, not a fabricated screenshot of the repository.
const RepositoryArtifact: React.FC<{ project: GitHubProject; index: number }> = ({
  project,
  index,
}) => (
  <svg
    className={`repository-artifact artifact-${index % 4}`}
    viewBox="0 0 800 600"
    fill="none"
    aria-hidden="true"
  >
    <g className="artifact-orbits" transform="translate(400 300)">
      {/clicker/i.test(project.name) ? (
        <>
          {[55, 105, 155].map((radius) => (
            <circle key={radius} cx="-45" cy="-25" r={radius} opacity={0.35} />
          ))}
          <path
            className="cover-cursor"
            d="M-45 -130V100L10 44 62 140 108 114 55 20 130 7Z"
            fill="currentColor"
            stroke="none"
          />
          <text x="0" y="215" textAnchor="middle">
            INPUT / CLICK / REPEAT
          </text>
        </>
      ) : /relay/i.test(project.name) ? (
        <>
          <path
            className="cover-flow"
            d="M-225 0H-85L75 -110H225M-85 0 75 110H225"
            strokeWidth="3"
          />
          {[
            [-225, 0],
            [-85, 0],
            [75, -110],
            [75, 110],
            [225, -110],
            [225, 110],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="17" fill="#171717" strokeWidth="2" />
          ))}
          <text x="-225" y="55" textAnchor="middle">
            WEBHOOK
          </text>
          <text x="-85" y="55" textAnchor="middle">
            QUEUE
          </text>
          <text x="225" y="-65" textAnchor="middle">
            WORKER
          </text>
          <text x="225" y="165" textAnchor="middle">
            RETRY
          </text>
        </>
      ) : /sentinel/i.test(project.name) ? (
        <>
          <rect
            x="-200"
            y="-150"
            width="400"
            height="300"
            rx="8"
            fill="currentColor"
            opacity=".08"
          />
          <rect x="-175" y="-125" width="350" height="250" rx="3" />
          <text x="-145" y="-80">
            SENTINEL / RASPBERRY PI
          </text>
          {[0, 1, 2].map((row) => (
            <g key={row} transform={`translate(-145 ${row * 55 - 20})`}>
              <text>{['CPU', 'MEM', 'NET'][row]}</text>
              <path d="M70 -5H280" opacity=".2" />
              <path d={`M70 -5H${140 + row * 35}`} strokeWidth="9" />
            </g>
          ))}
        </>
      ) : /wttg|report|openground/i.test(project.name) ? (
        <>
          <rect x="-260" y="-130" width="520" height="260" rx="6" />
          <path d="M-260 -75H260M-90 -75V130" />
          <text x="-235" y="-96">
            {/wttg/i.test(project.name)
              ? 'WTTG / ASSISTANT'
              : /report/i.test(project.name)
                ? 'REPORT / REVIEW'
                : 'TELEMETRY / SANDBOX'}
          </text>
          {(/wttg/i.test(project.name)
            ? ['UPTIME', 'KEYS', 'WIKI']
            : /report/i.test(project.name)
              ? ['CHANGES', 'REVIEW', 'APPROVE']
              : ['STREAM', 'SIGNAL', 'HISTORY']
          ).map((label, row) => (
            <g key={label} transform={`translate(0 ${row * 60})`}>
              <text x="-235" y="-30">
                {label}
              </text>
              <path d="M-60 -35H220" opacity=".2" />
              <path d={`M-60 -35H${70 + row * 55}`} strokeWidth="4" />
            </g>
          ))}
        </>
      ) : index % 4 === 0 ? (
        <>
          {Array.from({ length: 12 }, (_, ring) => (
            <ellipse
              key={ring}
              rx={90 + ring * 12}
              ry={210 - ring * 7}
              transform={`rotate(${ring * 12})`}
            />
          ))}
        </>
      ) : null}
      {!/sentinel|wttg|report|openground|clicker|relay/i.test(project.name) &&
        index % 4 === 1 &&
        Array.from({ length: 12 }, (_, layer) => (
          <path
            key={layer}
            d="M0 -140 190 -30 0 80 -190 -30Z"
            transform={`translate(0 ${layer * 15 - 65}) scale(${1 - layer * 0.035})`}
          />
        ))}
      {!/sentinel|wttg|report|openground|clicker|relay/i.test(project.name) &&
        index % 4 === 2 &&
        Array.from({ length: 9 }, (_, route) => (
          <g key={route} transform={`rotate(${route * 40})`}>
            <path d="M0 0H75L130 -55H215" />
            <circle cx="215" cy="-55" r="6" />
            <circle cx="75" cy="0" r="3" />
          </g>
        ))}
      {!/sentinel|wttg|report|openground|clicker|relay/i.test(project.name) &&
        index % 4 === 3 &&
        Array.from({ length: 17 }, (_, contour) => (
          <path
            key={contour}
            d="M-230 80C-180 80 -180 -100 -80 -100S0 100 90 30 170 -100 230 -80"
            transform={`translate(0 ${contour * 11 - 88})`}
          />
        ))}
    </g>
    <path className="artifact-axis" d="M70 300H730M400 50V550" />
    <circle cx="400" cy="300" r="5" className="artifact-core" />
  </svg>
);

export const RepositoryVisual: React.FC<{ project: GitHubProject; index: number }> = ({
  project,
  index,
}) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [project.imageUrl]);
  return (
    <div className={`repository-visual repository-tone-${index % 4}`}>
      <div className="repository-visual-inner">
        <div className="repository-depth">
          {project.imageUrl && !failed ? (
            <img
              src={project.imageUrl}
              alt={`${project.name} preview from its README`}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              width={1200}
              height={800}
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="repository-poster" aria-hidden="true">
              <RepositoryArtifact project={project} index={index} />
              <i>CONCEPT DIAGRAM / {project.language ?? 'OPEN SOURCE'}</i>
            </div>
          )}
        </div>
        <span className="repository-media-label">
          {project.imageUrl && !failed ? 'README PREVIEW' : 'CONCEPT DIAGRAM'}
        </span>
      </div>
      <span className="repository-visit" aria-hidden="true">
        <ArrowUpRight size={24} />
      </span>
    </div>
  );
};
