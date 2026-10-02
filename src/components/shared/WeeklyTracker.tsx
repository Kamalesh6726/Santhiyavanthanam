import React, { useMemo } from 'react';
import { startOfWeek, addDays, format, isSameDay, isFuture } from 'date-fns';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeeklySessions } from '../../hooks/useFirebaseData';
import { Card } from '../ui/Card';

export const WeeklyTracker: React.FC = () => {
  const today = new Date();
  
  // Generate the current week (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(today, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  }, [today]);
  
  const weekDatesStr = useMemo(() => weekDays.map(d => format(d, 'yyyy-MM-dd')), [weekDays]);

  const { sessions, loading } = useWeeklySessions(weekDatesStr);

  const isPerfectDay = (dateStr: string) => {
    const daySessions = sessions.filter(s => s.date === dateStr && s.completed);
    return daySessions.length === 3;
  };

  return (
    <Card className="p-6 bg-white dark:bg-brand-darkCard border-0">
      <div className="flex justify-between relative z-10">
        {weekDays.map((date, index) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const perfect = !loading && isPerfectDay(dateStr);
          const future = isFuture(date);
          const isToday = isSameDay(date, today);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-400 mb-3">
                {format(date, 'EEEEE')}
              </span>
              
              <div className="relative">
                {/* Connection Line */}
                {index !== 0 && (
                  <div className="absolute top-1/2 -left-full w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10 -translate-y-1/2"></div>
                )}
                
                {loading ? (
                  <div className="w-[36px] h-[36px] rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all ${
                      perfect 
                        ? 'bg-brand-saffron text-white shadow-sm' 
                        : isToday 
                          ? 'bg-transparent border-2 border-brand-saffron text-brand-saffron'
                          : future
                            ? 'bg-transparent border border-dashed border-gray-200 dark:border-gray-800 text-transparent'
                            : 'bg-brand-sand/30 dark:bg-gray-800/50 text-transparent'
                    }`}
                  >
                    {perfect && <Check size={18} strokeWidth={3} />}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
