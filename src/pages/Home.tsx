import React, { useState } from 'react';
import { useUserData, useTodaySessions, useNotifications } from '../hooks/useFirebaseData';
import { useAuth } from '../store/AuthContext';
import { recordSession } from '../lib/db';
import { StreakCard } from '../components/shared/StreakCard';
import { ProgressRing } from '../components/shared/ProgressRing';
import { SessionCard } from '../components/shared/SessionCard';
import { WeeklyTracker } from '../components/shared/WeeklyTracker';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const navigate = useNavigate();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const { sessions, loading: sessionsLoading } = useTodaySessions(todayStr);
  const { notifications } = useNotifications();

  const [showCelebration, setShowCelebration] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);

  if (!currentUser) return null;

  const getSession = (type: 'pratah' | 'madhyahnika' | 'sayam') => {
    return sessions.find(s => s.type === type);
  };

  const pratah = getSession('pratah');
  const madhyahnika = getSession('madhyahnika');
  const sayam = getSession('sayam');
  
  const segments = [
    pratah?.completed ?? false,
    madhyahnika?.completed ?? false,
    sayam?.completed ?? false
  ];

  const completedCount = sessions.filter(s => s.completed).length;
  const isPerfectDay = completedCount === 3;

  const handleComplete = async (type: 'pratah' | 'madhyahnika' | 'sayam') => {
    if (marking || getSession(type)?.completed) return;
    
    setMarking(type);
    try {
      await recordSession(currentUser.uid, type, todayStr);
      
      if (completedCount === 2) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header */}
      <header className="pt-4 pb-2 space-y-2">
        <p className="text-sm font-semibold tracking-widest text-brand-saffron uppercase">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
        {userLoading || !userData ? (
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 animate-pulse"></div>
        ) : (
          <h1 className="text-4xl font-display font-bold text-brand-primary dark:text-brand-darkPrimaryText tracking-tight">
            Good morning, <br className="md:hidden" />
            <span className="text-brand-saffron">{userData.name?.split(' ')[0] || 'Friend'}.</span>
          </h1>
        )}
      </header>

      {/* Hero Streak Card */}
      <section>
        {userLoading ? (
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-md w-full animate-pulse"></div>
        ) : (
          <StreakCard 
            currentStreak={userData?.currentStreak || 0} 
            bestStreak={userData?.bestStreak || 0} 
          />
        )}
      </section>

      {/* Weekly Tracker */}
      <section>
        <h2 className="text-xl font-display font-semibold mb-4 tracking-tight">This Week</h2>
        <WeeklyTracker />
      </section>

      {/* Today's Progress */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold tracking-tight">Today's Progress</h2>
        </div>
        
        {sessionsLoading ? (
           <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-md w-full animate-pulse"></div>
        ) : (
          <Card className="p-6 flex items-center bg-white dark:bg-brand-darkElevated border-0">
            <ProgressRing completedSegments={segments} size={80} strokeWidth={8}>
              <span className="font-display font-bold text-xl">{completedCount}/3</span>
            </ProgressRing>
            <div className="ml-6">
              <h3 className="font-semibold text-lg text-brand-primary dark:text-brand-darkPrimaryText">
                {isPerfectDay ? 'Perfect Day ✨' : `${3 - completedCount} sessions remaining`}
              </h3>
              <p className="text-sm text-gray-500 dark:text-brand-darkMutedText mt-1">
                {isPerfectDay 
                  ? 'Your consistency is growing.' 
                  : 'Complete your daily practice.'}
              </p>
            </div>
          </Card>
        )}
      </section>

      {/* Sessions */}
      <section className="space-y-3">
        {sessionsLoading ? (
          <>
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-md w-full animate-pulse"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-md w-full animate-pulse"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-md w-full animate-pulse"></div>
          </>
        ) : (
          <>
            <SessionCard 
              title="Prātaḥ" 
              icon="🌅" 
              isCompleted={pratah?.completed ?? false} 
              completedAt={pratah?.completedAt}
              onComplete={() => handleComplete('pratah')}
            />
            <SessionCard 
              title="Mādhyāhnika" 
              icon="☀️" 
              isCompleted={madhyahnika?.completed ?? false} 
              completedAt={madhyahnika?.completedAt}
              onComplete={() => handleComplete('madhyahnika')}
            />
            <SessionCard 
              title="Sāyam" 
              icon="🌆" 
              isCompleted={sayam?.completed ?? false} 
              completedAt={sayam?.completedAt}
              onComplete={() => handleComplete('sayam')}
            />
          </>
        )}
      </section>

      {/* Daily Wisdom Card */}
      <section className="pt-2">
        <button
          onClick={() => navigate('/wisdom')}
          className="w-full text-left group"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#E9DFCF]/60 dark:border-gray-800 bg-gradient-to-br from-[#FDF8F0] to-[#F5EED8] dark:from-[#1A1810] dark:to-[#151210] p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            {/* Decorative quote mark */}
            <div className="absolute top-2 left-3 text-[#D8AD62]/15 font-serif text-7xl leading-none select-none">"</div>
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-brand-saffron uppercase flex items-center gap-1.5">
                🌅 சந்தியா ஞானம் · இன்று சிந்திக்க
              </span>
              <p className="text-base font-medium text-brand-charcoal dark:text-gray-100 leading-relaxed">
                "இன்றைய கடமை, இன்றே நிறைவேறட்டும்."
              </p>
              <p className="text-xs text-brand-saffron/80 font-semibold">— ஆன்மீக சிந்தனை</p>
              <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-brand-saffron transition-colors pt-1">
                Read Today's Wisdom <ArrowRight size={13} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
          </div>
        </button>
      </section>

      {/* Recent Activity / Notifications */}
      {notifications.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-display font-semibold tracking-tight">Activity</h2>
          <Card className="p-2 border-0 bg-transparent shadow-none dark:bg-transparent">
            {notifications.slice(0, 3).map(notif => (
              <div key={notif.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white dark:hover:bg-brand-darkElevated transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-background dark:bg-brand-darkElevated flex items-center justify-center text-xl shrink-0 shadow-sm border border-gray-100 dark:border-gray-800">
                  {notif.type === 'encouragement' ? '🔥' : '👋'}
                </div>
                <div className="flex-1 mt-0.5">
                  <p className="text-sm text-brand-primary dark:text-brand-darkPrimaryText font-medium">
                    {notif.message}
                  </p>
                  <p className="text-xs text-brand-green/80 mt-1 font-medium">
                    {notif.createdAt ? format(notif.createdAt.toDate(), 'h:mm a') : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white dark:bg-brand-darkElevated rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-sand dark:bg-brand-darkBg text-brand-saffron rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2 text-brand-primary dark:text-brand-darkPrimaryText">Perfect Day ✨</h2>
              <p className="text-brand-green dark:text-brand-green text-lg mb-8 font-medium">
                3 / 3 completed
              </p>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '100%' }} 
                  transition={{ duration: 4 }} 
                  className="h-full bg-brand-saffron"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
