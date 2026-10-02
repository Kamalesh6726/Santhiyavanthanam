import React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading = false, disabled, ...props }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'border-2 border-brand-charcoal text-brand-charcoal dark:border-brand-cream dark:text-brand-cream hover:bg-gray-50 dark:hover:bg-brand-darkCard rounded-xl font-medium transition-colors',
      ghost: 'bg-transparent text-brand-charcoal dark:text-brand-cream hover:bg-gray-100 dark:hover:bg-brand-darkCard rounded-xl font-medium transition-colors',
    };

    const sizes = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6 text-base',
      lg: 'py-4 px-8 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
