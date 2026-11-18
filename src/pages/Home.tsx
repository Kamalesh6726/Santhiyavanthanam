import React, { useState } from 'react';
import { useUserData, useTodaySessions, useNotifications } from '../hooks/useFirebaseData';
import { useAuth } from '../store/AuthContext';
import { recordSession } from '../lib/db';
import { StreakCard } from '../components/shared/StreakCard';
import { ProgressRing } from '../components/shared/ProgressRing';
import { SessionCard } from '../components/shared/SessionCard';
import { WeeklyTracker } from '../components/shared/WeeklyTracker';
import { format } from 'date-fns';
import { safeFormat } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  
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
    <div className="w-full max-w-xl mx-auto space-y-5 sm:space-y-6">
      {/* Header (Desktop greeting, simplified on mobile) */}
      <header className="hidden md:block pt-2 pb-1 space-y-1">
        <p className="text-xs font-extrabold tracking-widest text-orange-600 uppercase">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
        {userLoading || !userData ? (
          <div className="h-10 bg-orange-50 rounded-2xl w-3/4 animate-pulse"></div>
        ) : (
          <h1 className="text-3xl font-display font-extrabold text-[#191815] tracking-tight">
            Good morning, <span className="text-orange-600">{userData.name?.split(' ')[0] || 'Friend'}.</span>
          </h1>
        )}
      </header>

      {/* Hero Streak Card */}
      <section>
        {userLoading ? (
          <div className="h-44 bg-orange-50/60 rounded-3xl w-full animate-pulse border border-orange-100"></div>
        ) : (
          <StreakCard 
            currentStreak={userData?.currentStreak || 0} 
            bestStreak={userData?.bestStreak || 0} 
          />
        )}
      </section>

      {/* Weekly Tracker */}
      <section className="space-y-2.5">
        <h2 className="text-base sm:text-lg font-display font-extrabold text-[#191815] tracking-tight px-1">
          This Week • வாரக் கணக்கு
        </h2>
        <WeeklyTracker />
      </section>

      {/* Today's Progress */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-display font-extrabold text-[#191815] tracking-tight">
            Today's Progress • இன்றைய இலக்கு
          </h2>
        </div>
        
        {sessionsLoading ? (
           <div className="h-28 bg-orange-50/60 rounded-3xl w-full animate-pulse border border-orange-100"></div>
        ) : (
          <div className="p-4 sm:p-5 flex items-center bg-white rounded-3xl border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] w-full">
            <div className="shrink-0">
              <ProgressRing completedSegments={segments} size={72} strokeWidth={7}>
                <span className="font-display font-black text-lg text-orange-600">{completedCount}/3</span>
              </ProgressRing>
            </div>
            <div className="ml-4 sm:ml-5">
              <h3 className="font-display font-extrabold text-base text-[#191815] leading-tight">
                {isPerfectDay ? 'Perfect Day ✨' : `${3 - completedCount} sessions remaining`}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isPerfectDay 
                  ? 'அனைத்து 3 சந்தியாவந்தனங்களும் முடிந்தது! நன்று.' 
                  : 'Complete your 3 daily Sandhyā prayers.'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Sessions */}
      <section className="space-y-3 pt-1">
        <h2 className="text-base sm:text-lg font-display font-extrabold text-[#191815] tracking-tight px-1">
          Daily Sessions • தினசரி அனுஷ்டானம்
        </h2>
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
                    {notif.createdAt ? safeFormat(notif.createdAt, 'h:mm a', 'Just now') : 'Just now'}
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
