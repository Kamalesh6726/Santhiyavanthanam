import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
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
    <Card className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-display font-semibold text-lg">{title}</h3>
        </div>
        <div className="text-sm font-medium">
          {isCompleted ? (
            <span className="flex items-center text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">
              <Check size={16} className="mr-1" /> Completed
            </span>
          ) : (
            <span className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              <Clock size={16} className="mr-1" /> Pending
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
            <Button onClick={onComplete} className="w-full">
              Mark Complete
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="status"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-sm text-gray-500 dark:text-gray-400 text-center py-2"
          >
            Completed at {completedAt ? format(new Date(completedAt), 'h:mm a') : 'unknown time'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
