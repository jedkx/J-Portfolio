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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable default cursor on desktop
    if (window.innerWidth >= 1024) {
      document.body.style.cursor = 'none';
    }

    // Smooth scroll behavior with performance optimizations
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 150,
    });

    // Initialize magnetic effect after content loads
    if (!isLoading) {
      setTimeout(() => {
        initMagneticEffect();
        initTextReveal();
      }, 100);
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="bg-void min-h-screen">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Atmosphere Overlays */}
      <AtmosphereOverlays />

      {/* Main Content */}
      <div className="relative">
        {/* Navigation */}
        <Navigation />

        {/* Main Sections */}
        <main>
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
