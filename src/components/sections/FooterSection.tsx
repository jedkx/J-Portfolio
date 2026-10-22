import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/constants/data';
import { usePrefersReducedMotion } from '@/hooks';
import { SecretWords } from '@/components/game/SecretGame';
import { CV_DRIVE_FILE_ID } from '@/constants/config';

const localTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
const channelNotes: Record<string, string> = {
  GitHub: 'Code & experiments',
  LinkedIn: 'Experience & connections',
  Medium: 'Notes & perspectives',
};

export const FooterSection: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [time, setTime] = useState(localTime);
  const [ping, setPing] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(localTime()), 15000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const enter = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 84%', once: true },
      });
      enter
        .from('.contact-dock-rule', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 0.9,
          ease: 'expo.inOut',
        })
        .from(
          '.contact-dock-reveal',
          { yPercent: 105, rotation: 3, duration: 0.9, stagger: 0.09, ease: 'expo.out' },
          0.25
        )
        .from(
          '.contact-dock-panel',
          { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' },
          0.15
        )
        .from(
          '.contact-dock-route',
          { x: 24, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out' },
          0.65
        );
      enter.from(
        '.contact-context',
        { y: 16, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
        0.55
      );
      gsap.fromTo(
        '.contact-dock-glyph',
        { rotation: -35, scale: 0.6 },
        {
          rotation: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: 1 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  };

  return (
    <section ref={root} id="contact" className="contact-dock contact-station" aria-label="Contact">
      <div className="contact-dock-inner">
        <div className="contact-dock-register">
          <h2>CONTACT</h2>
          <span>
            <SecretWords id="contact-register" text="03 / OPEN A CHANNEL" />
          </span>
        </div>
        <div className="contact-dock-rule" />
        <div className="contact-dock-grid">
          <div className="contact-dock-identity">
            <div className="contact-dock-mask">
              <span className="contact-dock-reveal">CANER</span>
            </div>
            <div className="contact-dock-mask">
              <span className="contact-dock-reveal contact-dock-surname">COŞKUN</span>
            </div>
            <div className="contact-dock-signature">
              <span>
                <SecretWords id="contact-role" text="SOFTWARE DEVELOPER" />
              </span>
              <span>ANKARA, TR ↗</span>
            </div>
            <div className="contact-context contact-location">
              <button
                type="button"
                className="contact-routing-control hoverable"
                aria-label="Send a test signal"
                onClick={() => setPing((value) => value + 1)}
              >
                <svg
                  className="contact-routing"
                  viewBox="0 0 400 90"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M0 45H120L160 15H270M120 45H205L245 75H400M205 45H360" />
                  <path className="contact-routing-pulse" d="M0 45H120L160 15H270" />
                  <circle cx="120" cy="45" r="4" />
                  <circle cx="205" cy="45" r="4" />
                  <circle cx="270" cy="15" r="3" />
                  <circle cx="360" cy="45" r="3" />
                  <circle cx="400" cy="75" r="3" />
                  {ping > 0 && (
                    <g key={ping} className="contact-test-signal">
                      <circle cx="120" cy="45" r="12" />
                      <circle cx="270" cy="15" r="12" />
                      <circle cx="360" cy="45" r="12" />
                    </g>
                  )}
                </svg>
                <span className="contact-test-label">
                  {ping > 0 ? 'SIGNAL RETURNED ↗' : 'SEND A PING ↗'}
                </span>
              </button>
              <div className="contact-location-meta">
                <span>LOCAL TIME / UTC+03</span>
                <time>{time}</time>
              </div>
            </div>
          </div>
          <div className="contact-dock-panel">
            <a className="contact-dock-mail hoverable" href={`mailto:${CONTACT_EMAIL}`}>
              <span className="contact-dock-mail-top">
                <span>01 — DIRECT LINE</span>
                <span className="contact-dock-status" aria-hidden="true" />
              </span>
              <span className="contact-dock-action">
                <span>
                  Send an
                  <br />
                  email.
                </span>
                <ArrowUpRight className="contact-dock-glyph" aria-hidden="true" />
              </span>
              <span className="contact-dock-email">{CONTACT_EMAIL}</span>
            </a>
            <button className="contact-dock-copy hoverable" onClick={copyEmail} type="button">
              <span aria-live="polite">
                {copyFailed
                  ? 'Copy unavailable · use the email link'
                  : copied
                    ? 'Email address copied'
                    : 'Copy email address'}
              </span>
              {copied ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
            </button>
            <a
              className="contact-context contact-resume hoverable"
              href={`https://drive.google.com/file/d/${CV_DRIVE_FILE_ID}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <span className="contact-resume-label">A CLOSER LOOK</span>
                <strong>View résumé</strong>
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="contact-dock-links">
          <span className="contact-dock-links-label">
            <SecretWords id="elsewhere" text="ELSEWHERE" />
          </span>
          {SOCIAL_LINKS.filter((link) => link.label !== 'Email').map((link, index) => (
            <a
              className="contact-dock-route hoverable"
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-dock-route-number">0{index + 2}</span>
              <span className="contact-channel-copy">
                <span>{link.label}</span>
                <small>{channelNotes[link.label]}</small>
              </span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
