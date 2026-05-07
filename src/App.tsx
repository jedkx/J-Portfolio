// ============================================
// APP COMPONENT - DARK MATTER
// ============================================

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import {
  Navigation,
  CustomCursor,
  HeroSection,
  AboutSection,
  ProjectsSection,
  FooterSection,
  ErrorBoundary,
} from '@/components';
import { AtmosphereOverlays } from '@/components/layout/AtmosphereOverlays';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { initMagneticEffect } from '@/utils/magneticEffect';
import { initTextReveal } from '@/utils/textReveal';
import { usePrefersReducedMotion } from '@/hooks';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const DEFAULT_ACCENT = '#ff5555';

const hexToRgb = (hex: string): string => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `${r} ${g} ${b}`;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enableCustomCursor, setEnableCustomCursor] = useState(false);
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_ACCENT;
    return window.localStorage.getItem('theme-accent') ?? DEFAULT_ACCENT;
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    const updateCursorState = () => {
      const shouldEnableCursor =
        desktopQuery.matches && pointerQuery.matches && !prefersReducedMotion;

      setEnableCustomCursor(shouldEnableCursor);

      if (shouldEnableCursor) {
        document.body.classList.add('cursor-hidden');
      } else {
        document.body.classList.remove('cursor-hidden');
      }
    };

    updateCursorState();
    desktopQuery.addEventListener('change', updateCursorState);
    pointerQuery.addEventListener('change', updateCursorState);


    // Smooth scroll behavior with performance optimizations
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150,
    });

    // Initialize magnetic effect after content loads
    if (!isLoading && !prefersReducedMotion) {
      setTimeout(() => {
        initMagneticEffect();
        initTextReveal();
      }, 100);
    }

    return () => {
      desktopQuery.removeEventListener('change', updateCursorState);
      pointerQuery.removeEventListener('change', updateCursorState);
      document.body.classList.remove('cursor-hidden');
    };
  }, [isLoading, prefersReducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', accentColor);
    root.style.setProperty('--theme-accent-rgb', hexToRgb(accentColor));
    root.style.setProperty('--color-alert', accentColor);
    window.localStorage.setItem('theme-accent', accentColor);
  }, [accentColor]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <div className="bg-void min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* Loading Screen */}
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

        {/* Custom Cursor */}
        {enableCustomCursor && <CustomCursor />}

        {/* Atmosphere Overlays */}
        <AtmosphereOverlays />

        {/* Main Content */}
        <div className="relative">
          {/* Navigation */}
          <Navigation accentColor={accentColor} onAccentChange={setAccentColor} />

          {/* Main Sections */}
          <main id="main-content">
            <HeroSection />
            <AboutSection accentColor={accentColor} />
            <ProjectsSection />
          </main>

          {/* Footer */}
          <FooterSection />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
