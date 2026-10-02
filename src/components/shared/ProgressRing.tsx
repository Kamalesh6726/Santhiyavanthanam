import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  completedSegments: boolean[]; // Array of 3 booleans [pratah, madhyahnika, sayam]
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  completedSegments = [false, false, false], 
  size = 120, 
  strokeWidth = 10,
  className,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // We want 3 segments with gaps between them.
  // A gap of 10% of the circle per segment.
  const gapPercentage = 0.05;
  const segmentPercentage = (1 - gapPercentage * 3) / 3;
  
  const segmentLength = circumference * segmentPercentage;
  const gapLength = circumference * gapPercentage;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {[0, 1, 2].map((index) => {
          const offset = index * (segmentLength + gapLength);
          const isCompleted = completedSegments[index];
          
          return (
            <React.Fragment key={index}>
              {/* Background track segment */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                className="text-gray-100 dark:text-gray-800"
                strokeLinecap="round"
              />
              
              {/* Active track segment */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                initial={{ strokeDashoffset: -offset + segmentLength }}
                animate={{ strokeDashoffset: isCompleted ? -offset : -offset + segmentLength }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                className="text-brand-saffron"
                strokeLinecap="round"
                opacity={isCompleted ? 1 : 0}
              />
            </React.Fragment>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
