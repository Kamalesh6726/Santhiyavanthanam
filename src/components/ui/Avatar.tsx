import React from 'react';
import { cn } from '../../lib/utils';


interface AvatarProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div className={cn('relative flex items-center justify-center rounded-full overflow-hidden bg-brand-cream dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-sm', sizes[size], className)}>
      {src ? (
        <img src={src} alt={fallback} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-brand-charcoal dark:text-gray-300 uppercase">
          {fallback.substring(0, 2)}
        </span>
      )}
    </div>
  );
};
