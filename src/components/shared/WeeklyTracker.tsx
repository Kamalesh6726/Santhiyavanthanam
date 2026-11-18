import React, { useMemo } from 'react';
import { startOfWeek, addDays, format, isSameDay, isFuture } from 'date-fns';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeeklySessions } from '../../hooks/useFirebaseData';

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
    <div className="p-4 sm:p-6 bg-white rounded-3xl border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] w-full">
      <div className="flex justify-between items-center relative z-10">
        {weekDays.map((date, index) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const perfect = !loading && isPerfectDay(dateStr);
          const future = isFuture(date);
          const isToday = isSameDay(date, today);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <span className={`text-[11px] font-extrabold mb-2 ${isToday ? 'text-orange-600 font-black' : 'text-gray-400'}`}>
                {format(date, 'EEEEE')}
              </span>
              
              <div className="relative flex items-center justify-center">
                {/* Connection Line */}
                {index !== 0 && (
                  <div className="absolute top-1/2 -left-full w-full h-0.5 bg-orange-100 -z-10 -translate-y-1/2"></div>
                )}
                
                {loading ? (
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-orange-50 animate-pulse"></div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                      perfect 
                        ? 'bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30' 
                        : isToday 
                          ? 'bg-orange-50/60 border-2 border-orange-500 text-orange-600 font-black'
                          : future
                            ? 'bg-transparent border border-dashed border-gray-200 text-transparent'
                            : 'bg-orange-50/60 border border-orange-100 text-transparent'
                    }`}
                  >
                    {perfect && <Check size={14} strokeWidth={3} className="sm:w-4 sm:h-4" />}
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
