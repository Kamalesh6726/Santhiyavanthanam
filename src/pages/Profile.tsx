import React from 'react';
import { useAuth } from '../store/AuthContext';
import { useUserData } from '../hooks/useFirebaseData';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { userData, loading } = useUserData();
  const navigate = useNavigate();

  if (loading) return <div className="p-6 md:p-10 animate-pulse">Loading...</div>;
  if (!userData || !currentUser) return null;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
      </header>
      
      {/* Wisdom Link Card */}
      <button 
        onClick={() => navigate('/wisdom')}
        className="w-full bg-[#FDFCF8] dark:bg-brand-darkCard rounded-xl p-5 border border-[#E9DFCF]/50 dark:border-gray-800 shadow-sm flex items-center justify-between text-left transition-transform active:scale-[0.98] hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-saffron/10 flex items-center justify-center text-brand-saffron">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-brand-primary dark:text-brand-darkPrimaryText">சந்தியா ஞானம்</h3>
            <p className="text-sm text-brand-primary/60 dark:text-brand-darkMutedText mt-0.5">Sandhyā Wisdom & Reflections</p>
          </div>
        </div>
        <ChevronRight className="text-gray-400" />
      </button>

      <Card className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-brand-saffron/10 text-brand-saffron flex items-center justify-center text-2xl font-bold">
          {userData.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{userData.name}</h2>
          <p className="text-gray-500">{currentUser.email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center py-6">
          <p className="text-sm text-gray-500 mb-1">Current Streak</p>
          <p className="text-3xl font-bold font-display">{userData.currentStreak}</p>
        </Card>
        <Card className="text-center py-6">
          <p className="text-sm text-gray-500 mb-1">Total Sessions</p>
          <p className="text-3xl font-bold font-display">{userData.totalSessions}</p>
        </Card>
      </div>
      
      <Card>
        <h3 className="font-semibold mb-4">Achievements</h3>
        <div className="flex space-x-4">
          <div className="opacity-50 text-center">
            <div className="text-3xl mb-2">🌱</div>
            <p className="text-xs">First Step</p>
          </div>
          <div className="opacity-50 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-xs">7 Days</p>
          </div>
          <div className="opacity-50 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-xs">Perfect Week</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
