// ============================================
// LOADING SCREEN - DARK MATTER BOOT
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks';

interface LoadingScreenProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  '> INITIALIZING VOID PROTOCOL...',
  '> ESTABLISHING NEURAL LINK...',
  '> LOADING SYSTEM CORE...',
  '> CALIBRATING SENSORS...',
  '> SYSTEM READY.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentLine(BOOT_LINES.length);
      setProgress(100);
      const timeout = setTimeout(onComplete, 200);
      return () => clearTimeout(timeout);
    }

    const tl = gsap.timeline();

    // Show boot lines one by one (slower)
    BOOT_LINES.forEach((_, index) => {
      tl.call(() => setCurrentLine(index + 1), [], index * 0.6);
    });

    // Progress counter (slower)
    tl.to(
      {},
      {
        duration: 3.0,
        onUpdate: function () {
          setProgress(Math.round(this.progress() * 100));
        },
      },
      0
    );

    // Hold on 100% for a moment
    tl.to({}, { duration: 0.8 });

    // Fade out
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete,
      }
    );

    return () => {
      tl.kill();
    };
  }, [onComplete, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-void flex items-center justify-center"
    >
      <div className="text-center">
        {/* Logo - Bigger and with glow */}
        <div className="text-terminal text-6xl md:text-7xl font-display font-black tracking-tighter mb-12 animate-pulse">
          HELLO <span className="text-alert">FRIEND</span>
        </div>

        {/* Boot Lines */}
        <div className="text-center font-mono text-xs space-y-1 mb-8 min-h-[120px]">
          {BOOT_LINES.map((line, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ${
                index < currentLine
                  ? 'opacity-100 text-terminal-muted'
                  : 'opacity-0'
              } ${index === currentLine - 1 ? 'text-terminal' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 font-mono text-xs text-terminal-muted">
          <div className="w-32 h-px bg-terminal-dark relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-terminal transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
