import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  premium?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, premium = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-white dark:bg-brand-darkCard p-5',
          premium 
            ? 'card-premium' 
            : 'shadow-sm border border-gray-100 dark:border-gray-800',
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
