// ============================================
// SECTION COMPONENT - Layout Wrapper
// ============================================

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
  fullHeight?: boolean;
  container?: boolean;
  className?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, id, fullHeight = false, container = true, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'relative py-20 md:py-32',
          fullHeight && 'min-h-screen flex flex-col justify-center',
          className
        )}
        {...props}
      >
        {container ? (
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = 'Section';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'left',
  className,
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={cn('max-w-2xl mb-12 md:mb-16', alignClasses[align], className)}>
      {badge && (
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary tracking-wider uppercase">
            {badge}
          </span>
        </div>
      )}
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text mb-4">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-lg text-text-muted leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};
