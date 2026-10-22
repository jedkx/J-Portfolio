import React from 'react';
import { GitHubPanel } from './GitHubPanel';
import { SecretWords } from '@/components/game/SecretGame';
import { CONTACT_EMAIL, EDUCATION, EXPERIENCE, PERSONAL_INFO } from '@/constants/data';
import '@/styles/terminal-original.css';

const lines = [
  ['user', PERSONAL_INFO.name.toLowerCase()],
  ['role', 'full-stack developer'],
  ['org', `${EXPERIENCE[0].company.toLowerCase()} · ${EXPERIENCE[0].period.toLowerCase()}`],
  ['mission', 'enterprise apps · 200+ municipalities'],
  ['', ''],
  ['langs', 'c# · typescript · python · c'],
  ['backend', 'asp.net core 8 / ef core / mvc'],
  ['tooling', 'devexpress · docker · sql server'],
  ['', ''],
  ['degree', EDUCATION[0].degree.toLowerCase()],
  ['school', `${EDUCATION[0].school.toLowerCase()} · ankara`],
  ['grad', EDUCATION[0].note?.toLowerCase() ?? EDUCATION[0].period],
  ['', ''],
  ['creative', 'video editing · 6+ years'],
  ['hobby', 'gamedev (godot) · embedded (rpi)'],
  ['interest', 'cybersecurity · ai/ml · open src'],
  ['', ''],
  ['mail', CONTACT_EMAIL],
  ['web', 'github.com/jedkx'],
];

const ASCII_ART = String.raw`
   _____    _____
  / ____|  / ____|
 | |      | |
 | |      | |
 | |____  | |____
  \_____|  \_____|
`;

// Original GitHub neofetch composition, without extra transcripts or disclosures.
export const NeofetchTerminal: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const username = PERSONAL_INFO.name.toLowerCase().replace(/\s+/g, '');
  return (
    <div className="neofetch-shell terminal-original">
      <div className="terminal-original-scan" aria-hidden="true" />
      <div className="terminal-original-prompt terminal-print">
        <span className="accent">~</span> <span>$</span> neofetch
      </div>
      <div className="terminal-original-grid">
        <div className="terminal-original-art terminal-print" aria-hidden="true">
          <pre style={{ color: accentColor }}>{ASCII_ART}</pre>
        </div>
        <div className="terminal-original-info">
          <div className="terminal-print">
            <strong className="accent">{username}</strong>@jedkx
          </div>
          <div className="terminal-original-separator terminal-print" aria-hidden="true">
            {'─'.repeat(`${username}@jedkx`.length)}
          </div>
          <dl>
            {lines.map(([key, value], index) =>
              key ? (
                <div className="terminal-original-line terminal-print" key={index}>
                  <dt>{key}</dt>
                  <dd>
                    <span aria-hidden="true">:</span>
                    {key === 'mail' ? (
                      <a className="hoverable" href={`mailto:${value}`}>
                        {value}
                      </a>
                    ) : key === 'web' ? (
                      <a
                        className="hoverable"
                        href="https://github.com/jedkx"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {value}
                      </a>
                    ) : (
                      <SecretWords id={key} text={value} />
                    )}
                  </dd>
                </div>
              ) : (
                <div className="terminal-original-spacer" key={index} aria-hidden="true" />
              )
            )}
          </dl>
          <div className="terminal-original-cursor terminal-print">
            <span className="terminal-caret" aria-hidden="true" />
          </div>
        </div>
        <div className="terminal-original-github terminal-print">
          <GitHubPanel accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
};
