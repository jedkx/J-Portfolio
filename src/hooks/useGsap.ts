// ============================================
// CUSTOM HOOKS - GSAP Animations
// ============================================

import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_CONFIG, GSAP_DEFAULTS } from '@/constants/config';

gsap.registerPlugin(ScrollTrigger);

interface UseGsapOptions {
  trigger?: RefObject<HTMLElement>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
}

export const useGsapContext = (callback: (ctx: gsap.Context) => void, deps: unknown[] = []) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(callback, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};

export const useFadeIn = <T extends HTMLElement>(
  options: UseGsapOptions = {}
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const { start = 'top 85%', toggleActions = 'play none none reverse' } = options;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: ANIMATION_CONFIG.section.slideUpDistance,
      },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.section.fadeInDuration,
        ease: GSAP_DEFAULTS.ease,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [options]);

  return ref;
};

export const useStaggerFadeIn = <T extends HTMLElement>(
  selector: string,
  options: UseGsapOptions = {}
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(selector);
    const { start = 'top 85%', toggleActions = 'play none none reverse' } = options;

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: ANIMATION_CONFIG.section.slideUpDistance,
      },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.section.fadeInDuration,
        stagger: ANIMATION_CONFIG.section.stagger,
        ease: GSAP_DEFAULTS.ease,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, options]);

  return ref;
};

export const useParallax = <T extends HTMLElement>(
  speed: number = 0.5
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed]);

  return ref;
};

export const useTypewriter = (
  texts: string[],
  options: { speed?: number; pauseTime?: number; loop?: boolean } = {}
) => {
  const { speed = 50, pauseTime = 2000, loop = true } = options;
  const textRef = useRef<string>('');
  const indexRef = useRef<number>(0);
  const charIndexRef = useRef<number>(0);
  const isTypingRef = useRef<boolean>(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentText = texts[indexRef.current];

      if (isTypingRef.current) {
        if (charIndexRef.current < currentText.length) {
          textRef.current = currentText.slice(0, charIndexRef.current + 1);
          charIndexRef.current++;
          timeoutId = setTimeout(type, speed);
        } else {
          isTypingRef.current = false;
          timeoutId = setTimeout(type, pauseTime);
        }
      } else {
        if (charIndexRef.current > 0) {
          textRef.current = currentText.slice(0, charIndexRef.current - 1);
          charIndexRef.current--;
          timeoutId = setTimeout(type, speed / 2);
        } else {
          isTypingRef.current = true;
          indexRef.current = loop
            ? (indexRef.current + 1) % texts.length
            : Math.min(indexRef.current + 1, texts.length - 1);
          timeoutId = setTimeout(type, speed);
        }
      }
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [texts, speed, pauseTime, loop]);

  return textRef;
};

export const useSmoothScroll = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href) return;
        
        const element = document.querySelector(href);
        if (element) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: element, offsetY: 80 },
            ease: 'power3.inOut',
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
};

export const useMousePosition = () => {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};
