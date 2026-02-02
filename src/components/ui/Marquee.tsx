// ============================================
// MARQUEE COMPONENT - Scrolling Text
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: Array<string | { text: string; color?: string; gradient?: string; textShadow?: string; font?: string; fontWeight?: string; letterSpacing?: string; fontSize?: string }>;
  reverse?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  reverse = false,
  className,
}) => {
  // Duplicate items 2x for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className={cn('marquee-wrapper', reverse && 'marquee-reverse', className)}>
      <div className="marquee-inner">
        {duplicatedItems.map((item, index) => {
          const text = typeof item === 'string' ? item : item.text;
          const color = typeof item === 'string' ? undefined : item.color;
          const gradient = typeof item === 'string' ? undefined : item.gradient;
          const textShadow = typeof item === 'string' ? undefined : item.textShadow;
          const font = typeof item === 'string' ? undefined : item.font;
          const fontWeight = typeof item === 'string' ? undefined : item.fontWeight;
          const letterSpacing = typeof item === 'string' ? undefined : item.letterSpacing;
          const fontSize = typeof item === 'string' ? undefined : item.fontSize;
          
          return (
            <span 
              key={index} 
              className="marquee-item"
              style={{
                ...(gradient ? {
                  background: gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                } : color ? { color } : {}),
                ...(textShadow && { textShadow }),
                ...(font && { fontFamily: font }),
                ...(fontWeight && { fontWeight }),
                ...(letterSpacing && { letterSpacing }),
                ...(fontSize && { fontSize })
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
