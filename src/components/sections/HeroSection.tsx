// ============================================
// HERO SECTION - DARK MATTER VOID AESTHETIC
// ============================================

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ParticleBackground } from '@/components/layout/ParticleBackground';
import { Typewriter } from '@/components/ui/Typewriter';
import { TYPEWRITER_TEXTS, PERSONAL_INFO } from '@/constants/data';

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [coordinates, setCoordinates] = React.useState({ lat: 39.9334, lon: 32.8597 });

  useEffect(() => {
    // Simple entrance animation
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        titleRef.current?.querySelectorAll('.title-line') || [],
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power4.out',
        },
        '-=0.5'
      );

    return () => {
      tl.kill();
    };
  }, []);

  // Mouse glow effect with throttling
  useEffect(() => {
    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const glow = document.querySelector('.hero-glow') as HTMLElement;
          if (glow) {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
          }

          // Update coordinates based on mouse position
          const lat = 39.9334 + ((e.clientY / window.innerHeight) - 0.5) * 20;
          const lon = 32.8597 + ((e.clientX / window.innerWidth) - 0.5) * 30;
          
          setCoordinates({
            lat: Number(lat.toFixed(4)),
            lon: Number(lon.toFixed(4))
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void"
    >
      {/* Particle Background - only in Hero */}
      <ParticleBackground />

      {/* Hero Glow - follows mouse */}
      <div className="hero-glow" />

      {/* Space void gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,30,0.3)_0%,transparent_70%)]" />

      {/* Main Content */}
      <div ref={contentRef} className="container mx-auto px-4 relative z-[5] opacity-0">
        {/* Status Badge */}
        <div className="flex justify-center mb-8">
          <div className="status-badge hoverable magnetic">
            <span className="pulse-dot" style={{ backgroundColor: 'white' }} />
            <span className="text-xs font-mono tracking-widest uppercase">{PERSONAL_INFO.status}</span>
          </div>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-center"
          style={{ perspective: '1000px' }}
        >
          <span className="title-line block text-[clamp(2.5rem,12vw,10rem)] font-display font-black tracking-tighter leading-none text-terminal">
            CANER
          </span>
          <span className="title-line block text-[clamp(2.5rem,12vw,10rem)] font-display font-black tracking-tighter leading-none text-terminal">
            COŞKUN
          </span>
        </h1>

        {/* Subtitle with Typewriter */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="text-terminal-muted font-mono text-sm tracking-[0.2em] uppercase h-6">
            <Typewriter 
              texts={TYPEWRITER_TEXTS}
              speed={80}
              pauseTime={2500}
              loop={true}
            />
          </div>
          
          {/* Coordinates - Dynamic based on mouse */}
          <div className="flex items-center gap-8 text-terminal-dark font-mono text-xs">
            <span>{coordinates.lat.toFixed(4)}° N</span>
            <span className="w-px h-4 bg-terminal/20" />
            <span>{coordinates.lon.toFixed(4)}° E</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - fixed at bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <span className="text-terminal-dark font-mono text-xs tracking-widest">SCROLL</span>
        <div className="scroll-line" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-terminal/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-terminal/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-terminal/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-terminal/20" />
    </section>
  );
};
