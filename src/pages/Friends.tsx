import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Flame, Plus, Users, UserPlus, X, Copy, Check } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useMyCircle } from '../hooks/useFirebaseData';
import { sendEncouragement, createCircle, previewCircle, validateAndJoinCircle } from '../lib/db';
import { Card } from '../components/ui/Card';

// ─── Invite Modal ─────────────────────────────────────────────────────────────
const InviteSheet = () => {
  const [copied, setCopied] = useState(false);
  const code = '6726';

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join my Sandhyā Circle', text: `Join my Sandhyā Circle using code: ${code}` });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="text-center">
        <div className="w-14 h-14 bg-brand-saffron/10 text-brand-saffron rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">Invite Friends</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Share this code with your friends</p>
      </div>

      <div className="bg-brand-saffron/5 dark:bg-brand-saffron/10 border-2 border-brand-saffron/20 rounded-2xl p-6 text-center">
        <p className="text-xs font-semibold tracking-widest text-brand-saffron uppercase mb-3">Circle Code</p>
        <p className="text-5xl font-mono font-bold tracking-[0.3em] text-brand-charcoal dark:text-gray-100">
          {code}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-saffron text-white font-semibold text-sm active:scale-95 transition-transform"
        >
          <UserPlus className="w-4 h-4" /> Share Code
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-brand-charcoal dark:text-gray-100 font-semibold text-sm active:scale-95 transition-transform"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
};

// ─── Join Modal ───────────────────────────────────────────────────────────────
const JoinSheet = ({ onClose }: { onClose: () => void }) => {
  const { currentUser } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; name: string; memberCount: number } | null>(null);
  const [success, setSuccess] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;
    setLoading(true);
    setError(null);
    try {
      const data = await previewCircle(code);
      setPreview(data);
    } catch (err: any) {
      if (err.message === 'invalid_code') setError('Invalid code. The correct code is 6726.');
      else if (err.message === 'circle_not_configured') setError('No Circle has been created yet. Please create one first.');
      else setError('Could not find the Circle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!currentUser || !preview) return;
    setLoading(true);
    setError(null);
    try {
      await validateAndJoinCircle(code, currentUser.uid);
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (err: any) {
      if (err.message === 'already_member') setError("You're already a member of this Circle.");
      else setError('Failed to join. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-10 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">You're in!</h2>
        <p className="text-gray-500">Welcome to the Circle 🙏</p>
      </div>
    );
  }

  if (preview) {
    const isNew = preview.id === '__new__';
    return (
      <div className="space-y-6 pt-2">
        <div className="text-center">
          <div className="w-14 h-14 bg-brand-saffron/10 text-brand-saffron rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <p className="text-xs font-semibold tracking-widest text-brand-saffron uppercase mb-1">
            {isNew ? 'Create & Join' : 'Circle Found'}
          </p>
          <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">{preview.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isNew ? 'Be the first member — create this Circle now.' : `${preview.memberCount} member${preview.memberCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-brand-saffron text-white font-bold text-lg active:scale-95 transition-transform disabled:opacity-60"
        >
          {loading ? 'Joining...' : isNew ? 'Create & Join Circle' : 'Join Circle'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleContinue} className="space-y-6 pt-2">
      <div className="text-center">
        <div className="w-14 h-14 bg-brand-saffron/10 text-brand-saffron rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">Join a Circle</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Enter your Circle code</p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          inputMode="numeric"
          value={code}
          onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(null); }}
          placeholder="6726"
          className="w-full h-16 text-center text-4xl font-mono font-bold tracking-[0.35em] rounded-2xl border-2 border-brand-saffron/20 bg-gray-50 dark:bg-gray-800/50 focus:border-brand-saffron outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700"
          autoFocus
        />
        <p className="text-xs text-gray-400 text-center">Ask your friend for their 4-digit Circle code.</p>
      </div>

      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

      <button
        type="submit"
        disabled={code.length !== 4 || loading}
        className="w-full py-4 rounded-2xl bg-brand-saffron text-white font-bold text-lg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking...' : 'Continue'}
      </button>
    </form>
  );
};

// ─── Bottom Sheet Wrapper ─────────────────────────────────────────────────────
const BottomSheet = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full sm:max-w-sm bg-white dark:bg-brand-darkElevated rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 pb-10 sm:pb-6"
        >
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden" />
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Friends = () => {
  const { currentUser } = useAuth();
  const { circle, members, loading } = useMyCircle();
  const [sheet, setSheet] = useState<'invite' | 'join' | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateCircle = async () => {
    if (!currentUser) return;
    setCreating(true);
    setCreateError(null);
    try {
      await createCircle(currentUser.uid, 'Sandhyā Circle');
    } catch (e: any) {
      console.error('createCircle error:', e.message);
      setCreateError('Failed to create Circle. Please try again.');
    }
    setCreating(false);
  };

  const handleReaction = async (memberUid: string, emoji: string) => {
    if (!currentUser) return;
    try {
      await sendEncouragement(currentUser.uid, currentUser.displayName || 'A friend', memberUid, emoji);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-5 animate-pulse p-4 md:p-0">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/2" />
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  // ── No Circle ──
  if (!circle) {
    return (
      <div className="space-y-6 p-4 md:p-0">
        <header>
          <h1 className="text-3xl font-display font-bold text-brand-charcoal dark:text-gray-100">My Circle</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Consistency is easier together.</p>
        </header>

        <Card className="p-8 text-center space-y-6 border-2 border-dashed border-brand-saffron/30 bg-white dark:bg-brand-darkCard">
          <div className="w-16 h-16 bg-brand-saffron/10 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-brand-saffron" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-brand-charcoal dark:text-gray-100">No Circle Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
              Create a new Circle or join an existing one with code <strong>6726</strong>.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCreateCircle}
              disabled={creating}
              className="w-full py-4 rounded-2xl bg-brand-saffron text-white font-bold text-base active:scale-95 transition-transform disabled:opacity-60"
            >
              {creating ? 'Creating...' : '✦ Create My Circle'}
            </button>

            {createError && <p className="text-red-500 text-sm">{createError}</p>}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <button
              onClick={() => setSheet('join')}
              className="w-full py-4 rounded-2xl border-2 border-brand-saffron/30 text-brand-saffron font-bold text-base active:scale-95 transition-transform hover:bg-brand-saffron/5"
            >
              Enter Code to Join
            </button>
          </div>
        </Card>

        <BottomSheet isOpen={sheet === 'join'} onClose={() => setSheet(null)}>
          <JoinSheet onClose={() => setSheet(null)} />
        </BottomSheet>
      </div>
    );
  }

  // ── Has Circle ──
  const sorted = [...members].sort((a, b) =>
    ((b.todayCompleted || 0) * 10 + (b.currentStreak || 0)) -
    ((a.todayCompleted || 0) * 10 + (a.currentStreak || 0))
  );

  return (
    <div className="space-y-6 pb-28 p-4 md:p-0">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-charcoal dark:text-gray-100">{circle.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSheet('join')}
            className="flex items-center gap-1.5 py-2 px-4 rounded-full border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold text-brand-charcoal dark:text-gray-200 hover:border-brand-saffron/40 active:scale-95 transition-all bg-white dark:bg-brand-darkCard"
          >
            <Users className="w-4 h-4" /> Join
          </button>
          <button
            onClick={() => setSheet('invite')}
            className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-brand-saffron text-white text-sm font-semibold active:scale-95 transition-transform shadow-md shadow-brand-saffron/30"
          >
            <Plus className="w-4 h-4" /> Invite
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-br from-brand-saffron to-brand-gold text-white border-0 shadow-lg shadow-brand-saffron/20">
          <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider mb-1">Total Streak</h3>
          <p className="text-3xl font-bold font-display">
            {members.reduce((a, m) => a + (m.currentStreak || 0), 0)}
            <span className="text-base font-normal opacity-70 ml-1">days</span>
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Today</h3>
          <p className="text-3xl font-bold font-display text-brand-charcoal dark:text-gray-100">
            {members.reduce((a, m) => a + (m.todayCompleted || 0), 0)}
            <span className="text-base font-normal text-gray-400 ml-1">/ {members.length * 3}</span>
          </p>
        </Card>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-lg font-bold text-brand-charcoal dark:text-gray-100 mb-3">Leaderboard</h2>
        <div className="space-y-2">
          {sorted.map((member, i) => (
            <motion.div
              key={member.uid}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="p-4 flex items-center gap-3">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-500' :
                  i === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-brand-sand dark:bg-gray-800 text-brand-charcoal dark:text-gray-300'
                }`}>
                  {i === 0 ? <Crown className="w-4 h-4" /> : i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-brand-charcoal dark:text-gray-100 truncate">{member.name}</p>
                    {member.uid === currentUser?.uid && (
                      <span className="text-[10px] font-bold tracking-wider text-brand-saffron bg-brand-saffron/10 px-2 py-0.5 rounded-full uppercase">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                    <Flame className="w-3 h-3 text-brand-saffron" />
                    <span className="font-medium text-brand-charcoal dark:text-gray-300">{member.currentStreak || 0}</span>
                    <span>•</span>
                    <span>{member.todayCompleted || 0}/3 today</span>
                  </div>
                </div>

                {/* Reactions */}
                {member.uid !== currentUser?.uid && (
                  <div className="flex gap-1">
                    {['🔥', '👏'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(member.uid, emoji)}
                        className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Sheets */}
      <BottomSheet isOpen={sheet === 'invite'} onClose={() => setSheet(null)}>
        <InviteSheet />
      </BottomSheet>
      <BottomSheet isOpen={sheet === 'join'} onClose={() => setSheet(null)}>
        <JoinSheet onClose={() => setSheet(null)} />
      </BottomSheet>
    </div>
  );
};
