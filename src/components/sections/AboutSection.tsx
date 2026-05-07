// ============================================
// ABOUT SECTION - neofetch terminal
// ============================================

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { Marquee } from '@/components/ui/Marquee';
import { CV_DRIVE_FILE_ID } from '@/constants/config';
import { CONTACT_EMAIL, EDUCATION, EXPERIENCE, MANIFESTO_ITEMS, PERSONAL_INFO } from '@/constants/data';
import { GitHubPanel } from './GitHubPanel';

gsap.registerPlugin(ScrollTrigger);

const PDF_URL = `https://drive.google.com/file/d/${CV_DRIVE_FILE_ID}/view`;

const INFO_LINES: { key: string; value: string }[] = [
  { key: 'user',     value: PERSONAL_INFO.name.toLowerCase() },
  { key: 'role',     value: 'full-stack developer' },
  { key: 'org',      value: `${EXPERIENCE[0].company.toLowerCase()} · ${EXPERIENCE[0].period.toLowerCase()}` },
  { key: 'mission',  value: 'enterprise apps · 200+ municipalities' },
  { key: '',         value: '' },
  { key: 'langs',    value: 'c# · typescript · python · c' },
  { key: 'backend',  value: 'asp.net core 8 / ef core / mvc' },
  { key: 'tooling',  value: 'devexpress · docker · sql server' },
  { key: '',         value: '' },
  { key: 'degree',   value: EDUCATION[0].degree.toLowerCase() },
  { key: 'school',   value: `${EDUCATION[0].school.toLowerCase()} · ankara` },
  { key: 'grad',     value: `${EDUCATION[0].note?.toLowerCase() ?? EDUCATION[0].period}` },
  { key: '',         value: '' },
  { key: 'creative', value: 'video editing · 6+ years' },
  { key: 'hobby',    value: 'gamedev (godot) · embedded (rpi)' },
  { key: 'interest', value: 'cybersecurity · ai/ml · open src' },
  { key: '',         value: '' },
  { key: 'mail',     value: CONTACT_EMAIL },
  { key: 'web',      value: 'github.com/jedkx' },
];

const ASCII_ART = String.raw`

   _____    _____
  / ____|  / ____|
 | |      | |
 | |      | |
 | |____  | |____
  \_____|  \_____|


`;

interface AboutSectionProps {
  accentColor: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ accentColor }) => {
  const sectionRef  = useRef<HTMLElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const cursorRef   = useRef<HTMLSpanElement>(null);

  const username = PERSONAL_INFO.name.toLowerCase().replace(/\s+/g, '');
  const separator = '─'.repeat(`${username}@jedkx`.length);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // scanline sweeps down as lines appear
      tl.fromTo(
        scanlineRef.current,
        { top: '0%', opacity: 1 },
        { top: '100%', opacity: 0.1, duration: 1.2, ease: 'none' },
        0
      );

      // lines appear fast like a real terminal render
      tl.fromTo(
        '.about-nf-line',
        { opacity: 0 },
        { opacity: 1, duration: 0.25, stagger: 0.035, ease: 'none' },
        0.05
      );

      // cursor blinks in after all lines
      tl.fromTo(
        cursorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        '>-0.05'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative min-h-screen flex flex-col md:justify-center md:py-12 md:overflow-hidden">
      {/* Mobile: in-flow at top. Desktop: absolute pinned to edge */}
      <div className="md:absolute md:top-0 md:left-0 md:right-0 border-y border-terminal/20 py-2 opacity-80">
        <div className="text-xs md:text-sm">
          <Marquee items={MANIFESTO_ITEMS} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-6 md:py-0 md:pb-20">
        <div className="w-full">

          {/* Terminal title bar */}
          <div className="flex items-center justify-between px-3 py-2 border border-b-0 border-terminal/25 bg-[#0d0d0d]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#28ca41' }} />
              </div>
              <span className="font-mono text-[10px] md:text-xs text-terminal-dark/60 tracking-widest truncate select-none">
                {username}@jedkx — zsh
              </span>
            </div>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hoverable flex items-center gap-1.5 font-mono text-[10px] md:text-xs tracking-widest text-terminal-dark/60 hover:text-terminal transition-colors duration-200"
            >
              CV PDF
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Terminal body */}
          <div className="border border-terminal/20 font-mono text-[12px] md:text-[13px] leading-relaxed relative overflow-hidden bg-[#0a0a0c]">
            <div
              ref={scanlineRef}
              className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-terminal/30 to-transparent pointer-events-none z-20"
              style={{ top: 0 }}
            />

            {/* Shell prompt line */}
            <div className="px-4 pt-3 pb-1 text-terminal-dark/50 select-none about-nf-line">
              <span style={{ color: accentColor }}>~</span>
              <span className="text-terminal-dark/40"> $ </span>
              <span className="text-terminal/70">neofetch</span>
            </div>

            {/* Neofetch content grid */}
            <div className="grid gap-x-4 gap-y-4 lg:gap-x-6 items-start p-4 pt-2 md:p-5 md:pt-2 xl:p-6 xl:pt-2
              lg:grid-cols-[160px_minmax(0,1fr)_minmax(320px,0.95fr)]
              xl:grid-cols-[180px_minmax(0,1.1fr)_minmax(340px,1fr)]">

              {/* Col 1 — ASCII art */}
              <div className="about-nf-line flex-shrink-0 text-center lg:text-left">
                <pre
                  className="ascii-glow-pulse text-[11px] md:text-[13px] leading-[1.12] select-none inline-block text-left whitespace-pre"
                  style={{
                    color: accentColor,
                    ['--ascii-glow-color' as string]: accentColor,
                    ['--ascii-glow-color-soft' as string]: `${accentColor}44`,
                  }}
                >
                  {ASCII_ART}
                </pre>
              </div>

              {/* Col 2 — info lines */}
              <div className="min-w-0 space-y-[1px]">
                {/* neofetch header: user@host + separator */}
                <div className="about-nf-line">
                  <span className="font-bold" style={{ color: accentColor }}>{username}</span>
                  <span className="text-terminal/80">@jedkx</span>
                </div>
                <div className="about-nf-line text-terminal-dark/40 tracking-[0] select-none mb-1">
                  {separator}
                </div>

                {/* key-value lines */}
                {INFO_LINES.map(({ key, value }, i) =>
                  key === '' ? (
                    <div key={i} className="about-nf-line h-[6px]" />
                  ) : (
                    <div
                      key={i}
                      className="about-nf-line grid gap-x-2 items-start"
                      style={{ gridTemplateColumns: '76px 8px minmax(0,1fr)' }}
                    >
                      <span className="font-semibold truncate" style={{ color: accentColor }}>{key}</span>
                      <span className="text-terminal-dark/50">:</span>
                      <span className="text-terminal/80 break-words">{value}</span>
                    </div>
                  )
                )}

                {/* blinking cursor */}
                <div className="about-nf-line mt-1 h-4 flex items-center">
                  <span
                    ref={cursorRef}
                    className="terminal-cursor inline-block w-[8px] h-[14px] opacity-0"
                    style={{ background: accentColor }}
                  />
                </div>
              </div>

              {/* Col 3 — GitHub panel */}
              <div className="min-w-0 lg:pl-1 about-nf-line self-start">
                <GitHubPanel accentColor={accentColor} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile: in-flow at bottom. Desktop: absolute pinned to edge */}
      <div className="md:absolute md:bottom-0 md:left-0 md:right-0 border-y border-terminal/10 py-2">
        <Marquee items={MANIFESTO_ITEMS} reverse />
      </div>
    </section>
  );
};
