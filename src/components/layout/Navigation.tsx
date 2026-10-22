// ============================================
// NAVIGATION - DARK MATTER MINIMAL
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Menu, Palette, X } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/data';
import { usePrefersReducedMotion, useScrollPosition } from '@/hooks';
import { SecretHintButton } from '@/components/game/SecretGame';
import { NAV_OFFSET } from '@/features/portfolio/scene';

interface NavigationProps {
  accentColor: string;
  onAccentChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#ff5555',
  '#55ffff',
  '#55ff55',
  '#ffaa33',
  '#ff55ff',
  '#7c8cff',
  '#ffffff',
  '#bbbbbb',
];

export const Navigation: React.FC<NavigationProps> = ({ accentColor, onAccentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const palettePanelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScrollPosition();
  const prefersReducedMotion = usePrefersReducedMotion();

  const isScrolled = scrollY > 50;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeAtDesktop = window.matchMedia('(min-width: 768px)');
    const closeMenu = () => setIsOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const panelItems = Array.from(
          mobilePanelRef.current?.querySelectorAll<HTMLElement>('a, input, button') ?? []
        );
        const items = [menuButtonRef.current, ...panelItems].filter((item): item is HTMLElement =>
          Boolean(item)
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    closeAtDesktop.addEventListener('change', closeMenu);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      closeAtDesktop.removeEventListener('change', closeMenu);
    };
  }, [isOpen]);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => item.href.replace('#', ''));
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    // Anchors may mark a chapter inside a persistent scroll scene rather than
    // a viewport-sized section. Intersection ratios cannot represent those.
    const current = elements
      .filter((element) => element.getBoundingClientRect().top <= NAV_OFFSET + 1)
      .at(-1);
    if (current) setActiveSection(current.id);
  }, [scrollY]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!palettePanelRef.current?.contains(event.target as Node)) {
        setIsPaletteOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPaletteOpen(false);
        palettePanelRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };

    if (isPaletteOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isPaletteOpen]);

  const handleNavClick = (href: string) => {
    if (isOpen) menuButtonRef.current?.focus({ preventScroll: true });
    flushSync(() => setIsOpen(false));
    setIsPaletteOpen(false);

    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);
    if (!target) return;

    setActiveSection(targetId);

    const navOffset = targetId === 'hero' ? 0 : NAV_OFFSET;
    const targetTop = window.scrollY + target.getBoundingClientRect().top - navOffset;

    window.history.replaceState(null, '', href);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <>
      <header
        className={`signal-nav fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-void/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center h-20" aria-label="Primary">
            <a
              href="#hero"
              className="nav-wordmark font-display text-xl font-bold text-terminal hover:text-terminal-muted transition-colors hoverable magnetic flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
            >
              JED<span className="text-terminal-muted">KX</span>
            </a>

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

            <div
              className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0 relative"
              ref={palettePanelRef}
            >
              <SecretHintButton />
              <button
                type="button"
                onClick={() => setIsPaletteOpen((value) => !value)}
                className="hoverable inline-flex items-center justify-center w-9 h-9 border-0 text-terminal-muted hover:text-terminal transition-colors relative"
                aria-label="Open theme palette"
                aria-expanded={isPaletteOpen}
              >
                <Palette size={15} />
                <span
                  className="absolute bottom-[5px] right-[5px] w-2 h-2 rounded-full border border-void"
                  style={{ backgroundColor: accentColor }}
                />
              </button>

              {isPaletteOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[248px] border border-terminal/20 bg-void/95 backdrop-blur-md p-3 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-terminal-dark">
                      Theme Accent
                    </span>
                    <span className="font-mono text-[10px] text-terminal-dark">{accentColor}</span>
                  </div>

                  <div className="grid grid-cols-8 gap-1.5 mb-3">
                    {PRESET_COLORS.map((color) => {
                      const isActive = color === accentColor;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => onAccentChange(color)}
                          aria-label={`Set theme accent to ${color}`}
                          className="h-5 w-full box-border rounded-[2px] border"
                          style={{
                            backgroundColor: color,
                            borderColor: isActive ? '#f5f5f5' : 'rgba(255,255,255,0.18)',
                            outline: isActive ? '1px solid rgba(245,245,245,0.92)' : 'none',
                            boxShadow: isActive
                              ? `0 0 0 1px rgba(245,245,245,0.85), 0 0 14px ${color}40`
                              : 'none',
                          }}
                        />
                      );
                    })}
                  </div>

                  <label className="flex items-center justify-between gap-3 border border-terminal/15 px-3 py-2">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-terminal-dark">
                      Custom
                    </span>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => onAccentChange(e.target.value)}
                      className="h-7 w-10 cursor-pointer border-0 bg-transparent p-0"
                    />
                  </label>
                </div>
              )}
            </div>

            <SecretHintButton className="secret-hint-mobile" />
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-terminal-muted hover:text-terminal transition-colors hoverable ml-2"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-terminal/10 transition-opacity ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        />
      </header>

      <div
        ref={mobilePanelRef}
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-black backdrop-blur-md transition-all duration-500 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        role="dialog"
        aria-modal={isOpen ? true : undefined}
        aria-label="Site navigation"
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8" aria-label="Mobile">
          <div className="flex items-center gap-3 border border-terminal/20 px-4 py-3">
            <span className="font-mono text-terminal-muted text-sm tracking-widest uppercase">
              Theme
            </span>
            <input
              type="color"
              value={accentColor}
              aria-label="Mobile theme accent"
              onChange={(e) => onAccentChange(e.target.value)}
              className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
            />
          </div>

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
                <span className="text-terminal-dark mr-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-terminal/20" />
        <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-terminal/20" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-terminal/20" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-terminal/20" />
      </div>
    </>
  );
};
