import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Trophy, Users } from 'lucide-react';
import type { Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const navigate = useNavigate();
  
  // Calculate day based on start date
  const start = new Date(challenge.startDate).getTime();
  const today = new Date().getTime();
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const currentDay = diffDays > challenge.duration ? challenge.duration : diffDays;
  const progressPercent = (currentDay / challenge.duration) * 100;

  return (
    <Card className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold tracking-wider text-brand-saffron uppercase mb-1 block">
            Friends Challenge
          </span>
          <h3 className="font-display font-semibold text-lg">{challenge.name}</h3>
        </div>
        <div className="bg-brand-cream dark:bg-gray-800 p-2 rounded-xl text-brand-saffron">
          <Trophy size={24} />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-brand-charcoal dark:text-gray-200">
            Day {currentDay} of {challenge.duration}
          </span>
          <span className="text-gray-500 dark:text-gray-400 flex items-center">
            <Users size={14} className="mr-1" /> 4 participants
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-saffron rounded-full transition-all duration-1000" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Button variant="secondary" onClick={() => navigate('/challenge')}>
        View Challenge
      </Button>
    </Card>
  );
};
