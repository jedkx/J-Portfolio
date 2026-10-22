import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks';
import '@/styles/reference-ribbon.css';

interface ReferenceItem {
  text: string;
  reference?: string;
  href?: string;
  title?: string;
  color?: string;
  gradient?: string;
  textShadow?: string;
  font?: string;
  fontWeight?: string;
  letterSpacing?: string;
  fontSize?: string;
}
interface MarqueeProps {
  items: Array<string | ReferenceItem>;
  reverse?: boolean;
  className?: string;
}
export const Marquee: React.FC<MarqueeProps> = ({ items, reverse = false, className }) => {
  const root = useRef<HTMLDivElement>(null);
  const [fontReady, setFontReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => {
      if (live) setFontReady(true);
    });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (reduced || !root.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle('is-arriving', entry.isIntersecting)
        );
      },
      { root: root.current, threshold: 0.8 }
    );
    root.current
      .querySelectorAll('[data-reference="hacker"]')
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items, reduced]);

  return (
    <div ref={root} className={cn('reference-ribbon', reverse && 'reference-reverse', className)}>
      <div
        className="reference-track"
        style={{ animationPlayState: !fontReady ? 'paused' : 'running' }}
      >
        {[0, 1].map((copy) => (
          <div className="reference-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((raw, index) => {
              const item: ReferenceItem = typeof raw === 'string' ? { text: raw } : raw;
              const style: React.CSSProperties = {
                color: item.color,
                fontFamily: item.font,
                fontWeight: item.fontWeight,
                letterSpacing: item.letterSpacing,
                fontSize: item.fontSize,
                textShadow: item.textShadow,
              };
              return (
                <span
                  className="reference-item"
                  data-reference={item.reference}
                  key={index}
                  style={style}
                >
                  <span className="reference-quote">{item.text}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
