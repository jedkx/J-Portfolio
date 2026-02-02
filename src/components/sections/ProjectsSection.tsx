// ============================================
// PROJECTS SECTION - DARK MATTER FILES
// ============================================

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';
import { PROJECTS } from '@/constants/data';

gsap.registerPlugin(ScrollTrigger);

export const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip all GSAP animations on mobile
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // No GSAP on mobile - just show content
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation - desktop only
      gsap.fromTo(
        '.projects-header',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Horizontal scroll for projects - desktop only
      if (scrollContainerRef.current) {
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;

        gsap.to(scrollContainerRef.current, {
          x: -(scrollWidth - viewportWidth + 100),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${scrollWidth * 0.6}`,
            scrub: 0.1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative bg-void scroll-mt-16 md:min-h-screen md:overflow-hidden md:snap-start md:snap-always">
      {/* Header - Mobile: relative, Desktop: absolute */}
      <div className="projects-header md:absolute md:top-20 md:left-8 relative pt-8 pb-4 px-4 md:p-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-alert animate-pulse" />
          <span className="font-mono text-[10px] text-terminal-dark tracking-[0.3em]">SELECTED WORK</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-terminal relative group">
          <span className="relative">
            FILES
            <span className="absolute inset-0 text-alert/20 translate-x-[2px] translate-y-[2px] -z-10">FILES</span>
          </span>
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-terminal/50 to-transparent mt-3" />
      </div>

      {/* Counter */}
      <div className="absolute top-8 right-4 md:right-8 z-10 text-right">
        <div className="font-mono text-2xl md:text-3xl text-terminal font-bold">
          {String(PROJECTS.length).padStart(2, '0')}
        </div>
        <span className="font-mono text-[10px] text-terminal-dark tracking-[0.2em]">
          PROJECTS
        </span>
      </div>

      {/* Desktop - Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="hidden md:flex items-center gap-8 px-8 h-screen"
        style={{ width: 'max-content', willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {/* Spacer for header visibility */}
        <div className="w-[30vw] flex-shrink-0" />

        {/* Project Cards */}
        {PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className="project-card-file group flex-shrink-0 w-[60vw] md:w-[45vw] lg:w-[35vw] h-[55vh] relative hoverable"
            style={{ willChange: 'transform', transform: 'translateZ(0)' }}
          >
            {/* File Label */}
            <div className="absolute -top-5 left-0 flex items-center gap-4">
              <span className="font-mono text-[10px] text-terminal-dark tracking-widest">
                FILE_{String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] text-alert">{project.category}</span>
            </div>

            {/* Card Content */}
            <div className="relative h-full border border-terminal/20 overflow-hidden group-hover:border-terminal/40 transition-colors duration-500">
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                  style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-void/70 group-hover:bg-void/50 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6">
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-display font-bold text-terminal mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-terminal-muted text-xs mb-4 max-w-md">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-mono text-terminal-dark border border-terminal/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-terminal hover:text-alert transition-colors"
                  >
                    <ExternalLink size={14} />
                    VIEW PROJECT
                  </a>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono text-terminal hover:text-alert transition-colors"
                    >
                      <Github size={14} />
                      SOURCE
                    </a>
                  )}
                </div>
              </div>

              {/* Corner marks */}
              <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-terminal/20" />
              <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-terminal/20" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-terminal/20" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-terminal/20" />
            </div>
          </article>
        ))}

        {/* End spacer */}
        <div className="w-[20vw] flex-shrink-0" />
      </div>

      {/* Mobile - Simple Vertical List */}
      <div className="md:hidden">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            className="mx-4 mb-4 border border-terminal/20 bg-void"
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover grayscale opacity-40"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <span className="font-mono text-[9px] text-terminal-dark bg-void/80 px-2 py-1">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[9px] text-alert bg-void/80 px-2 py-1">
                  {project.category}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-display font-bold text-terminal mb-1">
                {project.title}
              </h3>
              <p className="text-terminal-muted text-[11px] mb-3">
                {project.description}
              </p>
              <div className="flex gap-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-terminal flex items-center gap-1"
                >
                  <ExternalLink size={10} /> VIEW
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-terminal flex items-center gap-1"
                  >
                    <Github size={10} /> CODE
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Scroll hint */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-terminal/40" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-terminal-dark tracking-[0.3em]">SCROLL</span>
          <svg className="w-4 h-4 text-terminal-dark animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-terminal/40" />
      </div>
    </section>
  );
};
