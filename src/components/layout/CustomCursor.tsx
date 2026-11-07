import { useEffect, useState } from 'react';
import TargetCursor from '@/components/react-bits/TargetCursor';

export const CustomCursor = () => {
  const [keyHovered, setKeyHovered] = useState(false);
  useEffect(() => {
    let x = -1;
    let y = -1;
    const sync = () => {
      const node = document.elementFromPoint(x, y);
      const active =
        document.body.dataset.secretWordHover === 'true' ||
        Boolean(node?.closest('[data-key-cursor="true"]'));
      document.body.classList.toggle('key-hover', active);
      setKeyHovered(active);
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      sync();
    };
    const reset = () => {
      document.body.classList.remove('key-hover');
      setKeyHovered(false);
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-key-cursor', 'data-secret-word-hover'],
    });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', sync, { passive: true, capture: true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('pointerleave', reset);
    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', sync, { capture: true });
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
      reset();
    };
  }, []);
  return (
    <TargetCursor
      targetSelector={
        'a, button:not(:disabled), input, textarea, summary, [role="button"], [data-key-cursor="true"]'
      }
      cursorColorOnTarget="var(--theme-accent)"
      showLabel={false}
      blendMode="normal"
      size={keyHovered ? 72 : 36}
      padding={keyHovered ? 12 : 6}
      cornerSize={keyHovered ? 14 : 9}
      thickness={1.5}
      hoverDuration={0.25}
    />
  );
};
