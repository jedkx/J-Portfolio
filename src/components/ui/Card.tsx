// ============================================
// CARD COMPONENT - Reusable Card with Variants
// ============================================

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'gradient';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface',
      glass: 'bg-surface/50 backdrop-blur-md',
      bordered: 'bg-transparent border-2 border-border',
      gradient:
        'bg-gradient-to-br from-surface via-surface to-surface-light border border-border',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg overflow-hidden transition-all duration-300',
          variants[variant],
          hover && 'hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('px-6 py-4 border-b border-border', className)}
    {...props}
  >
    {children}
  </div>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('px-6 py-4 border-t border-border', className)}
    {...props}
  >
    {children}
  </div>
);
