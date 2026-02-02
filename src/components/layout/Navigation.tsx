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
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => item.href.replace('#', ''));

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
          <nav className="flex items-center h-20">
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
        className={`fixed inset-0 z-40 bg-black backdrop-blur-md transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
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
