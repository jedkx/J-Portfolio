// ============================================
// CUSTOM CURSOR - DARK MATTER STYLE
// ============================================

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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
    let keyHovered = false;
    let hoveredTarget: EventTarget | null = null;
    const updateKeyHover = (target: EventTarget | null) => {
      hoveredTarget = target;
      const next =
        document.body.dataset.secretWordHover === 'true' ||
        (target instanceof Element && !!target.closest('[data-key-cursor="true"]'));
      if (next !== keyHovered) {
        keyHovered = next;
        document.body.classList.toggle('key-hover', next);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateKeyHover(e.target);

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

      animationId = requestAnimationFrame(animateRing);
    };

    const onMouseEnterHoverable = () => {
      document.body.classList.add('hovering');
      gsap.to(ring, {
        scale: 1.25,
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
      updateKeyHover(e.target);
      if ((e.target as Element).closest(HOVERABLE_SELECTOR)) onMouseEnterHoverable();
    };

    const onMouseOut = (e: MouseEvent) => {
      updateKeyHover(e.relatedTarget);
      const target = (e.target as Element).closest(HOVERABLE_SELECTOR);
      if (target) {
        const related = e.relatedTarget as Element | null;
        if (!related || !target.contains(related)) onMouseLeaveHoverable();
      }
    };

    document.body.addEventListener('mouseover', onMouseOver);
    document.body.addEventListener('mouseout', onMouseOut);
    const keyObserver = new MutationObserver(() => updateKeyHover(hoveredTarget));
    keyObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-key-cursor', 'data-secret-word-hover'],
    });

    return () => {
      cancelAnimationFrame(animationId);
      keyObserver.disconnect();
      gsap.killTweensOf([dot, ring]);
      document.body.classList.remove('hovering', 'holding', 'key-hover');
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
      {/* Cursor Dot */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />

      {/* Cursor Ring */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};
