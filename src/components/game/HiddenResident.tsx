import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks';
import { ResidentMotionExport, residentFrames } from '@/assets/ResidentMotionExport';

export const HiddenResident: React.FC<{
  cameo?: boolean;
  awake?: boolean;
  eating?: boolean;
  anticipating?: boolean;
  onFaceHoverChange?: (hovered: boolean) => void;
}> = ({ cameo = false, awake = true, eating = false, anticipating = false, onFaceHoverChange }) => {
  const root = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [shy, setShy] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const [gaze, setGaze] = useState({ x: 0, y: 0, active: false });
  const greeted = useRef(0);
  const motionGreeted = useRef(0);
  const wasEating = useRef(false);
  const busy = useRef(eating);
  const hoverTimer = useRef(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // ASCII Motion supplies the expression frames. Clips react to the visitor,
  // rather than cycling every emotion in an unrelated continuous loop.
  useEffect(() => {
    const justAte = wasEating.current && !eating;
    const greetingChanged = greeted.current !== greeting;
    wasEating.current = eating;
    greeted.current = greeting;
    busy.current = eating || anticipating;
    if (!awake) {
      setFrame(0);
      return;
    }
    if (reduced) {
      setFrame(eating || anticipating ? 9 : shy ? 8 : 0);
      return;
    }
    let timer = 0;
    let disposed = false;
    const play = (clip: number[], done: () => void, step = 0) => {
      if (disposed) return;
      const index = clip[step];
      setFrame(index);
      timer = window.setTimeout(
        () => {
          if (step + 1 < clip.length) play(clip, done, step + 1);
          else if (!disposed) done();
        },
        residentFrames[index].duration * (cameo && [1, 2, 3].includes(index) ? 3.5 : 1)
      );
    };
    const idle = () => {
      setFrame(0);
      timer = window.setTimeout(
        () => {
          if (document.hidden) {
            idle();
            return;
          }
          const direction = Math.random() < 0.5 ? 5 : 6;
          const clip = !cameo && Math.random() < 0.35 ? [direction, 0, 1, 2, 3] : [1, 2, 3];
          play(clip, idle);
        },
        cameo ? 1600 : 1800 + Math.random() * 2600
      );
    };
    if (eating) setFrame(10);
    else if (anticipating) setFrame(9);
    else if (justAte) play([11, 12], idle);
    else if (greetingChanged) play([7, 1, 12, 13], () => (shy ? setFrame(8) : idle()));
    else if (shy) play([1, 2, 8], () => setFrame(8));
    else if (cameo) play([1, 2, 3], idle);
    else idle();
    return () => {
      disposed = true;
      window.clearTimeout(timer);
    };
  }, [eating, anticipating, shy, greeting, reduced, cameo, awake]);

  useLayoutEffect(() => {
    if (reduced || cameo || !root.current) return;
    const element = root.current;
    let visible = true;
    let restTimer = 0;
    let follow: (event: PointerEvent) => void = () => {};
    let sync: () => void = () => {};
    const ctx = gsap.context(() => {
      const breath = gsap.to('.resident-breath', {
        y: -1.5,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      const look = { x: 0, y: 0 };
      const paint = () =>
        setGaze((previous) => {
          const next = {
            x: Math.round(look.x * 8) / 8,
            y: Math.round(look.y * 8) / 8,
            active: true,
          };
          return previous.active && previous.x === next.x && previous.y === next.y
            ? previous
            : next;
        });
      const x = gsap.quickTo(look, 'x', { duration: 0.3, ease: 'power2.out', onUpdate: paint });
      const y = gsap.quickTo(look, 'y', { duration: 0.4, ease: 'power2.out', onUpdate: paint });
      follow = (event) => {
        if (!visible || document.hidden || busy.current) return;
        const rect = element.querySelector('.resident-motion-stage')!.getBoundingClientRect();
        const dx = gsap.utils.clamp(
          -1,
          1,
          (event.clientX - rect.left - rect.width / 2) / (innerWidth * 0.28)
        );
        const dy = gsap.utils.clamp(
          -1,
          1,
          (event.clientY - rect.top - rect.height / 2) / (innerHeight * 0.3)
        );
        x(dx);
        y(dy);
        window.clearTimeout(restTimer);
        restTimer = window.setTimeout(
          () => setGaze((previous) => ({ ...previous, active: false })),
          2800
        );
      };
      sync = () => {
        breath.paused(!visible || document.hidden);
      };
    }, root);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    window.addEventListener('pointermove', follow, { passive: true });
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      window.clearTimeout(restTimer);
      window.removeEventListener('pointermove', follow);
      document.removeEventListener('visibilitychange', sync);
      ctx.revert();
    };
  }, [reduced, cameo]);

  useLayoutEffect(() => {
    const newGreeting = motionGreeted.current !== greeting;
    motionGreeted.current = greeting;
    if (reduced) return;
    const ctx = gsap.context(() => {
      const rig = '.resident-rig';
      gsap.to(rig, { rotation: shy ? -1.2 : 0, y: 0, scale: 1, scaleY: 1, duration: 0.35 });
      if (newGreeting && !eating && !anticipating) {
        gsap
          .timeline({ delay: 0.35 })
          .to(rig, { scale: 1.025, rotation: 1.2, duration: 0.35, ease: 'power2.out' })
          .to(rig, { scale: 1, rotation: 0, duration: 0.65, ease: 'sine.inOut' });
      }
    }, root);
    return () => ctx.kill(false);
  }, [eating, anticipating, shy, greeting, reduced]);

  const hover = (active: boolean) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(
      () => {
        setShy(active);
        onFaceHoverChange?.(active);
      },
      active ? 140 : 100
    );
  };
  return (
    <div
      ref={root}
      className={`hidden-resident resident-face resident-motion${cameo ? ' resident-cameo' : ''}`}
    >
      <span className="resident-motion-stage resident-breath">
        <span className="resident-rig">
          <span className="resident-attention">
            <ResidentMotionExport autoPlay={false} frameIndex={frame} gaze={gaze} />
            <span className="resident-mouth" aria-hidden="true" />
            {!cameo && (
              <button
                type="button"
                className="resident-touch resident-face-hit hoverable"
                onPointerEnter={() => hover(true)}
                onPointerLeave={() => hover(false)}
                onFocus={() => hover(true)}
                onBlur={() => hover(false)}
                onClick={() => setGreeting((value) => value + 1)}
                aria-label="Say hello to the hidden resident"
              />
            )}
          </span>
        </span>
      </span>
    </div>
  );
};
