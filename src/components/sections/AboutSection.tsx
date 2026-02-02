// ============================================
// ABOUT/MANIFESTO SECTION - DARK MATTER
// ============================================

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Marquee } from '@/components/ui/Marquee';
import { PERSONAL_INFO, MANIFESTO_QUOTE, MANIFESTO_ITEMS } from '@/constants/data';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate quote
      gsap.fromTo(
        '.manifesto-quote',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate content boxes
      gsap.fromTo(
        '.content-box',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.content-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative min-h-screen flex flex-col justify-center py-8 md:py-12 overflow-hidden">
      {/* Marquee - Top - More prominent and fits screen */}
      <div className="absolute top-0 left-0 right-0 border-y border-terminal/20 py-2 -rotate-1 scale-105 opacity-80">
        <div className="text-xs md:text-sm">
          <Marquee items={MANIFESTO_ITEMS} />
        </div>
      </div>

      {/* Main Quote */}
      <div className="container mx-auto px-4 mb-6 md:mb-8 mt-6 md:mt-8">
        <blockquote className="manifesto-quote text-center max-w-3xl mx-auto">
          <p className="text-[clamp(1rem,4vw,2.5rem)] font-display font-black leading-tight text-terminal text-reveal">
            "{MANIFESTO_QUOTE}"
          </p>
          <footer className="mt-3 md:mt-4 font-mono text-[10px] md:text-xs text-terminal-dark tracking-widest uppercase">
            — Caner Coşkun
          </footer>
        </blockquote>
      </div>

      {/* Content Grid */}
      <div className="content-grid container mx-auto px-4 grid md:grid-cols-2 gap-4 max-w-4xl">
        {/* Left Box - About */}
        <div className="content-box border border-terminal/20 p-4 md:p-6 group hover:border-terminal/40 transition-colors duration-500">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="font-mono text-xs md:text-sm text-terminal tracking-widest">ABOUT</span>
            <span className="font-mono text-xs md:text-sm text-terminal">01</span>
          </div>
          <p className="text-terminal leading-relaxed text-sm md:text-base">
            {PERSONAL_INFO.title} at {PERSONAL_INFO.university}. {PERSONAL_INFO.currentRole}. {PERSONAL_INFO.experience}
          </p>
        </div>

        {/* Right Box - Analysis */}
        <div className="content-box border border-terminal/20 p-4 md:p-6 group hover:border-terminal/40 transition-colors duration-500">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="font-mono text-xs md:text-sm text-terminal tracking-widest">ANALYSIS</span>
            <span className="font-mono text-xs md:text-sm text-terminal">02</span>
          </div>
          <div className="font-mono text-xs md:text-sm space-y-2 text-terminal">
            <div className="flex justify-between">
              <span>LOCATION</span>
              <span className="text-terminal font-bold">{PERSONAL_INFO.location.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>GRADUATION</span>
              <span className="text-terminal font-bold">{PERSONAL_INFO.graduationYear}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS</span>
              <span className={`font-bold text-xs ${
                PERSONAL_INFO.isAvailable ? 'text-alert' : 'text-terminal'
              }`}>
                {PERSONAL_INFO.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Box - Skills */}
        <div className="content-box md:col-span-2 border border-terminal/20 p-4 md:p-6 group hover:border-terminal/40 transition-colors duration-500">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="font-mono text-xs md:text-sm text-terminal tracking-widest">CAPABILITIES</span>
            <span className="font-mono text-xs md:text-sm text-terminal">03</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', '.NET', 'C#', 'Python', 'Premiere Pro', 'After Effects', 'Git'].map((skill) => (
              <span
                key={skill}
                className="px-3 md:px-4 py-1.5 md:py-2 border border-terminal/20 text-terminal font-mono text-xs md:text-sm hover:border-terminal hover:text-terminal transition-all duration-300 hoverable"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-y border-terminal/10 py-2 rotate-1 scale-105">
        <Marquee items={MANIFESTO_ITEMS} reverse />
      </div>
    </section>
  );
};
