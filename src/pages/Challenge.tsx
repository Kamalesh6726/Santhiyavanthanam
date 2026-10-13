import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Target, CalendarDays, ArrowRight, X, Flame, Trophy, Clock } from 'lucide-react';
import { useChallenges, useMyCircle } from '../hooks/useFirebaseData';
import { useAuth } from '../store/AuthContext';
import { createChallenge } from '../lib/db';
import { differenceInDays } from 'date-fns';
import { toValidDate, safeFormat } from '../lib/utils';

// ─── Challenge Detail Sheet ───────────────────────────────────────────────────
const ChallengeDetail = ({
  challenge,
  onClose,
}: {
  challenge: any;
  onClose: () => void;
}) => {
  const startDate = toValidDate(challenge?.startDate);
  const endDate = toValidDate(challenge?.endDate, new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000));
  const today = new Date();
  const daysPassed = Math.max(1, Math.min(30, differenceInDays(today, startDate) + 1));
  const totalDays = challenge?.duration || 30;
  const daysLeft = Math.max(0, differenceInDays(endDate, today));
  const progress = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full sm:max-w-md bg-white dark:bg-brand-darkElevated rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-saffron to-brand-gold p-6 pb-8">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <span className="text-xs font-bold tracking-widest text-white/80 uppercase">Active Challenge</span>
            <h2 className="text-2xl font-display font-bold text-white mt-1">{challenge.name}</h2>
          </div>

          {/* Progress bar */}
          <div className="px-6 -mt-3">
            <div className="bg-white dark:bg-brand-darkCard rounded-2xl shadow-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Day {daysPassed} of {totalDays}</span>
                <span className="text-brand-saffron font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-brand-saffron to-brand-gold rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <Flame className="w-5 h-5 text-brand-saffron mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-charcoal dark:text-gray-100">{daysPassed}</p>
                <p className="text-xs text-gray-500">Day</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <Clock className="w-5 h-5 text-brand-saffron mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-charcoal dark:text-gray-100">{daysLeft}</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                <Trophy className="w-5 h-5 text-brand-saffron mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-charcoal dark:text-gray-100">{totalDays}</p>
                <p className="text-xs text-gray-500">Total Days</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4 text-brand-saffron" />
                  <span className="text-sm">Start Date</span>
                </div>
                <span className="text-sm font-semibold text-brand-charcoal dark:text-gray-100">
                  {safeFormat(startDate, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CalendarDays className="w-4 h-4 text-brand-saffron" />
                  <span className="text-sm">End Date</span>
                </div>
                <span className="text-sm font-semibold text-brand-charcoal dark:text-gray-100">
                  {safeFormat(endDate, 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="bg-brand-saffron/5 dark:bg-brand-saffron/10 border border-brand-saffron/20 rounded-2xl p-4 text-center">
              <p className="text-sm text-brand-charcoal dark:text-gray-200 font-medium">
                🙏 Complete all 3 sessions daily to maintain your streak throughout the challenge.
              </p>
            </div>
          </div>

          {/* Safe area for bottom */}
          <div className="h-6" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const Challenge = () => {
  const { currentUser } = useAuth();
  const { circle } = useMyCircle();
  const { challenges, loading } = useChallenges();
  const [creating, setCreating] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);

  const handleCreateChallenge = async () => {
    if (!currentUser || !circle) return;
    setCreating(true);
    try {
      await createChallenge(circle.id, currentUser.uid, '30-Day Sandhyā Challenge');
    } catch (e) {
      console.error(e);
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 md:p-0">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/2" />
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  const activeChallenge = challenges.length > 0 ? challenges[0] : null;

  return (
    <div className="space-y-6 pb-28 p-4 md:p-0">
      <header className="mb-4">
        <h1 className="text-3xl font-display font-bold text-brand-charcoal dark:text-gray-100">Challenges</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Push your limits, together.</p>
      </header>

      {activeChallenge ? (
        <Card className="p-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-saffron/5 rounded-bl-full -z-10" />

          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="inline-block px-3 py-1 bg-brand-saffron/10 text-brand-saffron rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Active
              </span>
              <h2 className="text-2xl font-bold font-display text-brand-charcoal dark:text-gray-100">
                {activeChallenge.name}
              </h2>
            </div>
            <div className="w-12 h-12 bg-brand-ivory dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-brand-saffron" />
            </div>
          </div>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
            <CalendarDays className="w-4 h-4 mr-2 text-brand-saffron" />
            Started {safeFormat(activeChallenge.startDate, 'MMM d, yyyy', 'today')}
          </div>

          {/* Progress bar preview */}
          {(() => {
            const start = toValidDate(activeChallenge.startDate);
            const passed = Math.max(1, Math.min(30, differenceInDays(new Date(), start) + 1));
            const total = activeChallenge.duration || 30;
            const pct = Math.min(100, Math.max(0, Math.round((passed / total) * 100)));
            return (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Day {passed} of {total}</span>
                  <span className="text-brand-saffron font-semibold">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-saffron to-brand-gold rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })()}

          <button
            onClick={() => setSelectedChallenge(activeChallenge)}
            className="w-full py-4 rounded-2xl bg-[#191815] hover:bg-[#2A2723] text-white dark:bg-white dark:text-[#191815] dark:hover:bg-gray-100 font-bold flex items-center justify-between px-6 shadow-md hover:shadow-lg active:scale-[0.98] transition-all group border border-transparent dark:border-gray-200"
          >
            <span className="text-sm tracking-wide font-medium">View Challenge Details</span>
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:bg-brand-saffron group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4 text-brand-saffron group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        </Card>
      ) : (
        <Card className="p-8 text-center space-y-6 border-2 border-dashed border-brand-saffron/30 bg-white dark:bg-brand-darkCard">
          <div className="w-16 h-16 bg-brand-saffron/10 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-brand-saffron" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-brand-charcoal dark:text-gray-100">No Active Challenge</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              {!circle
                ? 'Join or create a Circle first to start a challenge.'
                : 'Start a 30-day challenge and keep your Circle motivated.'}
            </p>
          </div>
          {circle && (
            <button
              onClick={handleCreateChallenge}
              disabled={creating}
              className="w-full py-4 rounded-2xl bg-brand-saffron text-white font-bold text-base active:scale-95 transition-transform disabled:opacity-60"
            >
              {creating ? 'Creating...' : '✦ Start 30-Day Challenge'}
            </button>
          )}
        </Card>
      )}

      {/* Challenge Detail Sheet */}
      {selectedChallenge && (
        <ChallengeDetail
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
};
