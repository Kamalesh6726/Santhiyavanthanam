import React from 'react';
import { Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionCardProps {
  title: string;
  icon: string;
  isCompleted: boolean;
  completedAt?: string;
  onComplete: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  icon,
  isCompleted,
  completedAt,
  onComplete,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-orange-100/90 shadow-[0_4px_24px_rgba(255,107,0,0.04)] flex flex-col space-y-3.5 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-xl border border-orange-100 shrink-0 shadow-sm">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-extrabold text-[#191815] text-base leading-tight">{title}</h3>
            <p className="text-[11px] text-gray-400 font-medium">Daily Sandhyā Ritual</p>
          </div>
        </div>
        <div className="text-xs font-bold shrink-0">
          {isCompleted ? (
            <span className="flex items-center text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <Check size={13} className="mr-1 text-orange-600" /> முடிந்தது
            </span>
          ) : (
            <span className="flex items-center text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
              <Clock size={13} className="mr-1 text-gray-400" /> Pending
            </span>
          )}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="action"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onComplete}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all touch-manipulation min-h-[46px]"
            >
              அனுஷ்டானம் முடிந்தது (Mark Completed)
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs font-semibold text-orange-700 bg-orange-50/70 rounded-2xl py-2 px-3 text-center border border-orange-100"
          >
            ✓ Completed at {completedAt ? format(new Date(completedAt), 'h:mm a') : 'today'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
