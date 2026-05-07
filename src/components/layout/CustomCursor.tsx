// ============================================
// CUSTOM CURSOR - DARK MATTER STYLE
// ============================================

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<{ x: number; y: number; scale: number }>>([]);
  const trailElements = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationId: number;

    // Initialize trail points
    const trailCount = 8;
    trailRefs.current = [];
    for (let i = 0; i < trailCount; i++) {
      trailRefs.current.push({ x: 0, y: 0, scale: 1 - i * 0.12 });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows immediately
      gsap.set(dot, {
        x: mouseX,
        y: mouseY,
      });
    };

    // Ring follows with delay (lerp)
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      gsap.set(ring, {
        x: ringX,
        y: ringY,
      });

      // Animate trail
      trailRefs.current.forEach((point, i) => {
        const leader = i === 0 ? { x: mouseX, y: mouseY } : trailRefs.current[i - 1];
        point.x += (leader.x - point.x) * (0.2 - i * 0.02);
        point.y += (leader.y - point.y) * (0.2 - i * 0.02);

        if (trailElements.current[i]) {
          gsap.set(trailElements.current[i], {
            x: point.x,
            y: point.y,
            scale: point.scale,
          });
        }
      });

      animationId = requestAnimationFrame(animateRing);
    };

    const onMouseEnterHoverable = () => {
      document.body.classList.add('hovering');
      gsap.to(ring, {
        scale: 2,
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        scale: 0.5,
        duration: 0.3,
      });
    };

    const onMouseLeaveHoverable = () => {
      document.body.classList.remove('hovering');
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
      });
    };

    const onMouseDown = () => {
      document.body.classList.add('holding');
      gsap.to(ring, {
        scale: 0.8,
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 1.5,
        duration: 0.2,
      });
    };

    const onMouseUp = () => {
      document.body.classList.remove('holding');
      gsap.to(ring, {
        scale: 1,
        duration: 0.2,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
      });
    };

    // Start animation loop
    animationId = requestAnimationFrame(animateRing);

    // Event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Event delegation — single listener on body handles all current and future interactive elements
    const HOVERABLE_SELECTOR = 'a, button, [role="button"], .hoverable, input, textarea';

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVERABLE_SELECTOR)) onMouseEnterHoverable();
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest(HOVERABLE_SELECTOR);
      if (target) {
        const related = e.relatedTarget as Element | null;
        if (!related || !target.contains(related)) onMouseLeaveHoverable();
      }
    };

    document.body.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseover', onMouseOver);
      document.body.removeEventListener('mouseout', onMouseOut);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Cursor Trail */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailElements.current[i] = el;
          }}
          className="cursor-trail"
          style={{
            opacity: 0.15 - i * 0.018,
            width: `${6 - i * 0.5}px`,
            height: `${6 - i * 0.5}px`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Cursor Dot */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      
      {/* Cursor Ring */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};
