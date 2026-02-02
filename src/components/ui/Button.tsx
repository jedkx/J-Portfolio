// ============================================
// BUTTON COMPONENT - Reusable Button with Variants
// ============================================

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-mono text-sm font-medium uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-background hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]',
        secondary:
          'bg-surface border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary',
        ghost:
          'border border-border text-text-muted hover:text-text hover:border-text/50 hover:bg-white/5',
        outline:
          'border-2 border-primary text-primary hover:bg-primary hover:text-background',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      loading = false,
      icon,
      iconPosition = 'right',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Hover effect overlay */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          {icon && iconPosition === 'left' && (
            <span className="transition-transform group-hover:-translate-x-1">
              {icon}
            </span>
          )}
          
          {loading ? (
            <span className="animate-pulse">LOADING...</span>
          ) : (
            children
          )}
          
          {icon && iconPosition === 'right' && (
            <span className="transition-transform group-hover:translate-x-1">
              {icon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
