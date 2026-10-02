import React from 'react';
import { Card } from '../ui/Card';
import { Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, bestStreak }) => {
  return (
    <Card className="p-8 relative overflow-hidden bg-brand-primary dark:bg-brand-darkElevated border-0">
      {/* Premium subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-saffron/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-16 h-16 bg-brand-saffron/10 rounded-full flex items-center justify-center mb-4 border border-brand-saffron/20"
        >
          <Flame className="w-8 h-8 text-brand-saffron" />
        </motion.div>
        
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-6xl font-display font-bold text-white tracking-tight">{currentStreak}</span>
        </div>
        <p className="text-sm font-semibold tracking-widest text-brand-saffron uppercase mb-8">
          Day Streak
        </p>

        <div className="w-full max-w-[200px] bg-white/5 dark:bg-black/20 rounded-xl p-3 flex justify-between items-center border border-white/5">
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Best Streak</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-brand-gold" /> {bestStreak} days
            </span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Today</span>
            <span className="text-brand-green font-semibold">+1</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
