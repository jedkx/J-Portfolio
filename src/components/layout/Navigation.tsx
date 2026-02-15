// ============================================
// NAVIGATION - DARK MATTER MINIMAL
// ============================================

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, PERSONAL_INFO } from '@/constants/data';
import { useScrollPosition } from '@/hooks';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollY, scrollDirection } = useScrollPosition();

  const isScrolled = scrollY > 50;
  const isHidden = scrollDirection === 'down' && scrollY > 200;

  // Update active section based on scroll position
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => item.href.replace('#', ''));
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-void/80 backdrop-blur-md' : 'bg-transparent'
        } ${isHidden ? '-translate-y-full' : ''}`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center h-20" aria-label="Primary">
            {/* Logo */}
            <a
              href="#hero"
              className="font-display text-xl font-bold text-terminal hover:text-terminal-muted transition-colors hoverable magnetic flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
            >
              JED<span className="text-terminal-muted">KX</span>
            </a>

            {/* Desktop Navigation - Centered */}
            <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`font-mono text-xs tracking-widest uppercase transition-colors hoverable ${
                        isActive ? 'text-alert' : 'text-terminal-muted hover:text-alert'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Status Indicator - Right */}
            <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
              <span className="pulse-dot" style={{ backgroundColor: 'white' }} />
              <span className="font-mono text-xs text-terminal-muted tracking-widest uppercase whitespace-nowrap">
                {PERSONAL_INFO.status}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-terminal-muted hover:text-terminal transition-colors hoverable ml-auto"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Bottom border line */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-terminal/10 transition-opacity ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
      </header>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-black backdrop-blur-md transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8" aria-label="Mobile">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`font-mono text-2xl tracking-widest transition-all duration-300 ${
                  isActive ? 'text-terminal' : 'text-terminal-muted'
                } ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-terminal-dark mr-3">{String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-terminal/20" />
        <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-terminal/20" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-terminal/20" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-terminal/20" />
      </div>
    </>
  );
};
