// ============================================
// MOTION TRACKER COMPONENT - Radar Style Footer
// ============================================

import React, { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks';

interface MotionTrackerProps {
  forceAlert?: boolean;
}

function normalizeAngle(angle: number): number {
  let n = angle % 360;
  if (n < 0) n += 360;
  return n;
}

export const MotionTracker: React.FC<MotionTrackerProps> = ({ forceAlert = false }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const scanRef       = useRef<HTMLDivElement>(null);
  const blipRef       = useRef<HTMLDivElement>(null);
  const forceAlertRef = useRef(forceAlert);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Keep forceAlert current inside the RAF without re-registering the effect
  forceAlertRef.current = forceAlert;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const RADAR_RADIUS = 135;

    const state = {
      isPressed:     false,
      blipX:         0,
      blipY:         0,
      blipAngle:     0,
      radarRotation: 0,
    };

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      state.radarRotation = (((Date.now() - startTime) / 4000) * 360) % 360;

      if (scanRef.current) {
        scanRef.current.style.transform = `rotate(${state.radarRotation}deg)`;
      }

      if (blipRef.current) {
        const radarAngle = normalizeAngle(state.radarRotation);
        const blipAngle  = normalizeAngle(state.blipAngle);
        let angleDiff = Math.abs(radarAngle - blipAngle);
        if (angleDiff > 180) angleDiff = 360 - angleDiff;

        const isRadarNear  = angleDiff < 20;
        const fadeDistance = Math.min(angleDiff / 20, 1);
        const alert        = forceAlertRef.current || state.isPressed;

        const opacity   = alert ? 1 : (isRadarNear ? 1 - fadeDistance * 0.5 : 0.2);
        const color     = alert ? '#ff3333' : '#ffffff';
        const glow      = alert
          ? '0 0 20px 5px rgba(255, 51, 51, 0.8)'
          : `0 0 ${8 + (1 - fadeDistance) * 12}px ${2 + (1 - fadeDistance) * 4}px rgba(255, 255, 255, ${0.3 + (1 - fadeDistance) * 0.4})`;

        const el = blipRef.current;
        el.style.transform  = `translate(${state.blipX}px, ${state.blipY}px)`;
        el.style.background = color;
        el.style.opacity    = String(opacity);
        el.style.boxShadow  = glow;
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const footer = containerRef.current?.closest('footer');
      if (!footer) return;

      const rect          = footer.getBoundingClientRect();
      const centerX       = rect.left + rect.width / 2;
      const centerY       = rect.top  + rect.height / 2;
      const scaleX        = RADAR_RADIUS / (rect.width / 2);
      const scaleY        = RADAR_RADIUS / (rect.height / 2);

      let bx = (e.clientX - centerX) * scaleX;
      let by = (e.clientY - centerY) * scaleY;

      const dist = Math.sqrt(bx * bx + by * by);
      if (dist > RADAR_RADIUS) { bx *= RADAR_RADIUS / dist; by *= RADAR_RADIUS / dist; }

      state.blipX     = bx;
      state.blipY     = by;
      state.blipAngle = Math.atan2(by, bx) * (180 / Math.PI);
    };

    const handleMouseDown = () => { state.isPressed = true; };
    const handleMouseUp   = () => { state.isPressed = false; };

    animationId = requestAnimationFrame(animate);
    window.addEventListener('mousemove',  handleMouseMove);
    window.addEventListener('mousedown',  handleMouseDown);
    window.addEventListener('mouseup',    handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove',  handleMouseMove);
      window.removeEventListener('mousedown',  handleMouseDown);
      window.removeEventListener('mouseup',    handleMouseUp);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="relative">
      <div ref={containerRef} className="tracker-ui">
        <div className="tracker-grid" />
        <div className="radar-wave" />
        <div className="radar-wave" />
        <div className="radar-wave" />
        <div className="radar-wave" />
        <div className="radar-wave" />

        <div
          ref={scanRef}
          className="tracker-scan"
          style={{ transition: 'none' }}
        />

        <div
          ref={blipRef}
          className="sensor-blip"
          style={{
            transform:  'translate(0px, 0px)',
            background: '#ffffff',
            opacity:    0.2,
            boxShadow:  '0 0 8px 2px rgba(255,255,255,0.3)',
            transition: 'opacity 0.3s ease, transform 0.15s ease-out, box-shadow 0.3s ease, background 0.3s ease',
          }}
        />
      </div>

      <div className="sensor-ring" />
    </div>
  );
};
