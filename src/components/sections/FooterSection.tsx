// ============================================
// FOOTER SECTION - MOTION TRACKER
// ============================================

import React, { useState } from 'react';
import { MotionTracker } from '@/components/ui/MotionTracker';
import { NAV_ITEMS, SOCIAL_LINKS } from '@/constants/data';

export const FooterSection: React.FC = () => {
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative py-16 md:py-32 overflow-hidden">
      {/* Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terminal/30 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-16 mb-12 md:mb-20">
          {/* Left - Contact CTA */}
          <div className="lg:col-span-2">
            <span className="font-mono text-xs text-terminal-dark tracking-widest mb-4 block">
              GET IN TOUCH
            </span>
            <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-display font-black text-terminal leading-none mb-8">
              LET'S<br />
              <span className="text-terminal-muted">WORK</span>
            </h2>
            <a
              href="mailto:ccoskun742@gmail.com"
              className="inline-flex items-center gap-4 text-terminal hover:text-alert transition-colors duration-300 group hoverable magnetic"
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              <span className="font-mono text-lg tracking-wider">ccoskun742@gmail.com</span>
              <span className="w-8 h-px bg-terminal group-hover:w-16 transition-all duration-300" />
            </a>
          </div>

          {/* Right - Motion Tracker */}
          <div className="hidden lg:flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
            <MotionTracker 
              forceAlert={isLinkHovered}
            />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-3 gap-8 py-12 border-y border-terminal/10">
          {/* Navigation */}
          <div>
            <span className="font-mono text-xs text-terminal-dark tracking-widest mb-4 block">
              NAVIGATION
            </span>
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-mono text-sm text-terminal-muted hover:text-terminal transition-colors hoverable"
                  onMouseEnter={() => setIsLinkHovered(true)}
                  onMouseLeave={() => setIsLinkHovered(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <span className="font-mono text-xs text-terminal-dark tracking-widest mb-4 block">
              CONNECT
            </span>
            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-terminal-muted hover:text-terminal transition-colors hoverable"
                  onMouseEnter={() => setIsLinkHovered(true)}
                  onMouseLeave={() => setIsLinkHovered(false)}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <span className="font-mono text-xs text-terminal-dark tracking-widest mb-4 block">
              LOCATION
            </span>
            <p className="font-mono text-sm text-terminal-muted">
              Ankara, Turkey<br />
              <span className="text-terminal-dark">39.9334° N, 32.8597° E</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="font-mono text-xs text-terminal-dark">
            © {new Date().getFullYear()} JEDKX. ALL RIGHTS RESERVED.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 font-mono text-xs text-terminal-muted hover:text-terminal transition-colors hoverable magnetic"
            onMouseEnter={() => setIsLinkHovered(true)}
            onMouseLeave={() => setIsLinkHovered(false)}
          >
            <span>BACK TO TOP</span>
            <span className="w-4 h-4 border border-terminal/30 flex items-center justify-center group-hover:border-terminal transition-colors">
              ↑
            </span>
          </button>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(204,204,204,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(204,204,204,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
    </footer>
  );
};
