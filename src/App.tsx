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
} from '@/components';
import { AtmosphereOverlays } from '@/components/layout/AtmosphereOverlays';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { initMagneticEffect } from '@/utils/magneticEffect';
import { initTextReveal } from '@/utils/textReveal';
import { usePrefersReducedMotion } from '@/hooks';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enableCustomCursor, setEnableCustomCursor] = useState(false);
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

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
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
        <Navigation />

        {/* Main Sections */}
        <main id="main-content">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
        </main>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
};

export default App;
