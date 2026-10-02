import React from 'react';
import { Card } from '../components/ui/Card';

export const Calendar: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Journey</h1>
        <p className="text-gray-500 text-sm mt-1">Your consistency over time</p>
      </header>

      <Card className="p-8 text-center text-gray-500">
        <p>Calendar view coming soon. Keep up your daily practice!</p>
      </Card>
    </div>
  );
};
