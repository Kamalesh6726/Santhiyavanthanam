import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, bestStreak }) => {
  return (
    <div className="p-6 sm:p-8 relative overflow-hidden bg-white rounded-3xl border-2 border-orange-100 shadow-[0_10px_35px_rgba(255,107,0,0.06)] w-full">
      {/* Subtle warm orange glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border border-orange-200/80 shadow-sm"
        >
          <Flame className="w-7 h-7 sm:w-8 sm:h-8 fill-orange-500 text-orange-500" />
        </motion.div>
        
        <div className="flex items-baseline space-x-2 mb-1">
          <span className="text-5xl sm:text-6xl font-display font-extrabold text-[#191815] tracking-tight">{currentStreak}</span>
        </div>
        <p className="text-xs font-extrabold tracking-widest text-orange-600 uppercase mb-5 sm:mb-6">
          Day Streak
        </p>

        <div className="w-full max-w-[240px] bg-orange-50/70 rounded-2xl p-2.5 sm:p-3 flex justify-between items-center border border-orange-100">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Best Streak</span>
            <span className="text-[#191815] font-bold flex items-center gap-1 text-xs">
              <Trophy className="w-3.5 h-3.5 text-orange-500" /> {bestStreak} days
            </span>
          </div>
          <div className="h-7 w-px bg-orange-200/80"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Today</span>
            <span className="text-orange-600 font-extrabold text-xs">+1 Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
