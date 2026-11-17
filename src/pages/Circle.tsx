import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, X, Copy, Check, Crown, Flame, Trophy,
  RotateCcw, Sparkles, MessageCircle
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useMyCircle, useCircleDailyProgress, useCircleActivity } from '../hooks/useFirebaseData';
import { createCircle, previewCircle, validateAndJoinCircle, sendReaction, resetCircleData } from '../lib/db';
import { Card } from '../components/ui/Card';
import { safeFormat } from '../lib/utils';

// ─── Language Type ─────────────────────────────────────────────────────────────
type Language = 'ta' | 'en' | 'sa';

const CIRCLE_STRINGS = {
  ta: {
    title: 'என் வட்டம்',
    tag: 'சந்தியா வட்டம்',
    subtitle: 'ஒருமித்த சாதனை • தினசரி தொடர்ச்சி',
    codeLabel: 'வட்டத்தின் குறியீடு (Code)',
    members: 'உறுப்பினர்கள்',
    activeToday: 'இன்று செயல்பாட்டில்',
    sessionsToday: 'இன்றைய அமர்வுகள்',
    todaysCircle: 'இன்றைய வட்டம்',
    activityTitle: 'வட்டத்தின் நிகழ்வுகள்',
    noActivity: 'இதுவரை நிகழ்வுகள் இல்லை. புதியதாகத் தொடங்குங்கள்!',
    inviteBtn: 'அழைக்க (Invite)',
    joinBtn: 'இணைய (Join)',
    resetBtn: 'புதியதாகத் தொடங்க (Reset Data)',
    resetConfirm: 'நிச்சயமாக வட்டத்தின் பழைய செயல்பாடுகள் மற்றும் பதிவுகளை நீக்கிவிட்டு புதியதாகத் தொடங்க விரும்புகிறீர்களா?',
    resetSuccess: 'வட்டத்தின் தரவுகள் யாவும் அழிக்கப்பட்டு புதியதாகத் தொடங்கப்பட்டது! ✨',
    youTag: 'நீங்கள்',
    todayScore: 'இன்று',
    shareTitle: 'நண்பர்களை அழைக்கவும்',
    shareDesc: 'உங்கள் நண்பர்களுடன் 6726 குறியீட்டைப் பகிரவும்',
    copyCode: 'குறியீட்டை நகலெடுக்க',
    copyFull: 'முழு அழைப்பை நகலெடுக்க',
    copied: 'நகலெடுக்கப்பட்டது!',
    waShare: 'வாட்ஸ்அப் (WhatsApp)',
    joinTitle: 'வட்டத்தில் இணைய',
    joinDesc: 'உங்கள் 4-இலக்க குறியீட்டை உள்ளிடவும்',
    circleFound: 'வட்டம் கண்டறியப்பட்டது',
    beFirst: 'முதல் உறுப்பினராக இணையுங்கள்',
    continueBtn: 'தொடரவும்',
    joining: 'இணைகிறது...',
    joined: 'வெற்றிகரமாக இணைந்தீர்கள்! 🙏'
  },
  en: {
    title: 'My Circle',
    tag: 'Sandhyā Circle',
    subtitle: 'Shared Commitment • Daily Discipline',
    codeLabel: 'Circle Code',
    members: 'members',
    activeToday: 'Active Today',
    sessionsToday: 'Sessions Today',
    todaysCircle: "Today's Circle",
    activityTitle: 'Circle Activity',
    noActivity: 'No activity yet. Be the first to complete Sandhyāvandanam!',
    inviteBtn: 'Invite',
    joinBtn: 'Join',
    resetBtn: 'Start Fresh (Reset Data)',
    resetConfirm: 'Are you sure you want to clear all test records and start this Circle completely fresh?',
    resetSuccess: 'Circle data has been reset to a clean slate! ✨',
    youTag: 'You',
    todayScore: 'today',
    shareTitle: 'Invite Friends',
    shareDesc: 'Share code 6726 with your friends anywhere',
    copyCode: 'Copy Code (6726)',
    copyFull: 'Copy Full Invite',
    copied: 'Copied!',
    waShare: 'WhatsApp',
    joinTitle: 'Join a Circle',
    joinDesc: 'Enter your 4-digit Circle code',
    circleFound: 'Circle Found',
    beFirst: 'Be the first member',
    continueBtn: 'Continue',
    joining: 'Joining...',
    joined: "You're in! Welcome to the Circle 🙏"
  },
  sa: {
    title: 'मम मण्डलम्',
    tag: 'सन्ध्या मण्डलम्',
    subtitle: 'सङ्घशक्तिः कलियुगे • नित्यसाधना',
    codeLabel: 'मण्डल सङ्केतः (Code)',
    members: 'सदस्याः',
    activeToday: 'अद्य क्रियाशीलाः',
    sessionsToday: 'अद्यतन सत्राणि',
    todaysCircle: 'अद्यतन मण्डलम्',
    activityTitle: 'मण्डलस्य गतिविधयः',
    noActivity: 'अद्यापि कापि प्रवृत्तिः नास्ति। नूतनतया आरभ्यताम्!',
    inviteBtn: 'आमन्त्रयन्तु',
    joinBtn: 'सम्मिलन्तु',
    resetBtn: 'नूतनारम्भः (Reset)',
    resetConfirm: 'किं भवान् पुरातनप्रवृत्तीः प्रमार्ज्य नूतनं मण्डलम् इच्छति?',
    resetSuccess: 'मण्डलदत्तांशाः विशोधिताः! नूतनारम्भः सिद्धः। ✨',
    youTag: 'भवान्',
    todayScore: 'अद्य',
    shareTitle: 'मित्राणि आमन्त्रयन्तु',
    shareDesc: 'स्वमित्रैः सह ६७२६ सङ्केतं संविभजन्तु',
    copyCode: 'सङ्केतं प्रतिलिखन्तु',
    copyFull: 'पूर्णसन्देशं प्रतिलिखन्तु',
    copied: 'प्रतिलिखितम्!',
    waShare: 'वाट्स्याप् (WhatsApp)',
    joinTitle: 'मण्डले सम्मिलन्तु',
    joinDesc: 'चतुरङ्क-सङ्केतं प्रविशन्तु',
    circleFound: 'मण्डलं प्राप्तम्',
    beFirst: 'प्रथमः सदस्यः भवतु',
    continueBtn: 'अग्रे सरतु',
    joining: 'सम्मिलति...',
    joined: 'साधु स्वागतम्! 🙏'
  }
};

// ─── Bottom Sheet Modal ────────────────────────────────────────────────────────
const BottomSheet = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full sm:max-w-md bg-white dark:bg-brand-darkElevated rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 pb-10 sm:pb-6 border border-orange-100 dark:border-gray-800"
        >
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 sm:hidden" />
          <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X className="w-5 h-5" />
          </button>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── Invite Sheet ─────────────────────────────────────────────────────────────
const InviteSheet = ({ lang }: { lang: Language }) => {
  const [copied, setCopied] = useState(false);
  const code = '6726';
  const t = CIRCLE_STRINGS[lang];
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteMessage = `Join my SANDHYĀ Circle!\n\n1. Open: ${appUrl}\n2. Go to Circle -> Join Circle\n3. Enter Code: ${code}\n\nLet's stay consistent in Sandhyāvandanam together! 🙏`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteMessage).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-5 pt-1">
      <div className="text-center">
        <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-orange-200/60">
          <UserPlus className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white">{t.shareTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">{t.shareDesc}</p>
      </div>

      <div className="bg-orange-50/50 dark:bg-orange-950/20 border-2 border-orange-200/80 dark:border-orange-900/50 rounded-3xl p-5 text-center shadow-inner">
        <p className="text-[10px] font-extrabold tracking-widest text-orange-600 uppercase mb-1">{t.codeLabel}</p>
        <p className="text-5xl font-mono font-bold tracking-[0.3em] text-[#191815] dark:text-white">{code}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs shadow-md active:scale-95 transition-all">
          <MessageCircle className="w-4 h-4" /> {t.waShare}
        </button>
        <button onClick={handleCopyCode} className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t.copied : t.copyCode}
        </button>
      </div>

      <button onClick={handleCopyInvite} className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-xs active:scale-95 transition-all">
        {t.copyFull}
      </button>
    </div>
  );
};

// ─── Join Sheet ───────────────────────────────────────────────────────────────
const JoinSheet = ({ lang, onClose }: { lang: Language; onClose: () => void }) => {
  const { currentUser } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; name: string; memberCount: number } | null>(null);
  const [success, setSuccess] = useState(false);
  const t = CIRCLE_STRINGS[lang];

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;
    setLoading(true); setError(null);
    try {
      const data = await previewCircle(code);
      setPreview(data);
    } catch (err: any) {
      setError(err.message === 'invalid_code' ? 'Invalid code. Use code 6726.' : 'Could not find Circle. Try again.');
    } finally { setLoading(false); }
  };

  const handleJoin = async () => {
    if (!currentUser || !preview) return;
    setLoading(true); setError(null);
    try {
      await validateAndJoinCircle(code, currentUser.uid);
      setSuccess(true);
      setTimeout(onClose, 1800);
    } catch (err: any) {
      if (err.message === 'already_member') setError("You're already a member.");
      else setError('Failed to join. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="py-8 text-center space-y-3">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
        <Check className="w-8 h-8" strokeWidth={3} />
      </div>
      <h2 className="text-xl font-display font-extrabold">{t.joined}</h2>
    </div>
  );

  if (preview) {
    const isNew = preview.id === '__new__';
    return (
      <div className="space-y-5 pt-1">
        <div className="text-center">
          <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <p className="text-[10px] font-extrabold tracking-widest text-orange-600 uppercase mb-1">{isNew ? 'Create & Join' : t.circleFound}</p>
          <h2 className="text-2xl font-display font-extrabold">{preview.name}</h2>
          <p className="text-gray-500 text-xs mt-1">{isNew ? t.beFirst : `${preview.memberCount} ${t.members}`}</p>
        </div>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <button onClick={handleJoin} disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base active:scale-95 transition-all shadow-md shadow-orange-500/25 disabled:opacity-60">
          {loading ? t.joining : isNew ? 'Create & Join Circle' : 'Join Circle'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleContinue} className="space-y-5 pt-1">
      <div className="text-center">
        <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Users className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-display font-extrabold">{t.joinTitle}</h2>
        <p className="text-gray-500 text-xs mt-1">{t.joinDesc}</p>
      </div>
      <div className="space-y-2">
        <input type="text" inputMode="numeric" value={code}
          onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(null); }}
          placeholder="6726"
          className="w-full h-16 text-center text-4xl font-mono font-bold tracking-[0.35em] rounded-3xl border-2 border-orange-200/80 bg-gray-50 dark:bg-gray-800/50 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
          autoFocus />
        <p className="text-xs text-gray-400 text-center">Circle Code: <strong>6726</strong></p>
      </div>
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <button type="submit" disabled={code.length !== 4 || loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base active:scale-95 transition-all shadow-md shadow-orange-500/25 disabled:opacity-40">
        {loading ? 'Checking...' : t.continueBtn}
      </button>
    </form>
  );
};

// ─── Session Indicator Dots ───────────────────────────────────────────────────
const SessionDots = ({ pratah, madhyahnika, sayam }: { pratah: boolean; madhyahnika: boolean; sayam: boolean }) => (
  <div className="flex gap-1.5 items-center">
    {[pratah, madhyahnika, sayam].map((done, i) => (
      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${done ? 'bg-orange-500 shadow-sm shadow-orange-500/50' : 'bg-gray-200 dark:bg-gray-700'}`} />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Circle = () => {
  const { currentUser } = useAuth();
  const { circle, members, loading, error } = useMyCircle();
  const today = new Date().toISOString().split('T')[0];
  const { progress: dailyProgress } = useCircleDailyProgress(circle?.id ?? null, today);
  const { activities } = useCircleActivity(circle?.id ?? null);
  
  const [lang, setLang] = useState<Language>('ta');
  const [sheet, setSheet] = useState<'invite' | 'join' | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const t = CIRCLE_STRINGS[lang];

  const handleCreate = async () => {
    if (!currentUser) return;
    setCreating(true); setCreateError(null);
    try { await createCircle(currentUser.uid, 'Sandhyā Circle'); }
    catch (e: any) { setCreateError('Failed to create. Please try again.'); }
    setCreating(false);
  };

  const handleReaction = async (toMember: any, emoji: string) => {
    if (!currentUser || !circle) return;
    try {
      await sendReaction(circle.id, currentUser.uid, currentUser.displayName || 'A member', toMember.uid, toMember.name || 'Member', emoji);
    } catch (e) { console.error(e); }
  };

  // Reset circle data to start completely fresh
  const handleResetData = async () => {
    if (!circle) return;
    setResetting(true);
    try {
      await resetCircleData(circle.id);
      setShowResetConfirm(false);
      setResetNotice(t.resetSuccess);
      setTimeout(() => setResetNotice(null), 4000);
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse p-4 md:p-8 max-w-xl mx-auto">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl w-1/2" />
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
    </div>
  );

  if (error) return (
    <div className="p-4 md:p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-display font-bold text-[#191815]">{t.title}</h1>
      <Card className="p-8 text-center space-y-4 rounded-3xl">
        <p className="text-gray-500">Couldn't load Circle data.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-2xl bg-orange-500 text-white font-bold">Try Again</button>
      </Card>
    </div>
  );

  // ── No Circle State ──
  if (!circle) return (
    <div className="space-y-6 p-4 md:p-8 max-w-xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{t.tag}</span>
          <h1 className="text-3xl font-display font-extrabold text-[#191815] dark:text-white">{t.title}</h1>
        </div>
        {/* Language Switcher Capsule */}
        <div className="inline-flex p-1 bg-white dark:bg-brand-darkElevated rounded-2xl shadow-sm border border-orange-100">
          {(['ta', 'en', 'sa'] as Language[]).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${lang === l ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>
              {l === 'ta' ? 'தமிழ்' : l === 'en' ? 'EN' : 'संस्कृतम्'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-brand-darkCard p-8 text-center space-y-6 rounded-3xl border border-orange-100 shadow-sm">
        <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/40 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-display font-extrabold text-[#191815] dark:text-white mb-2">No Circle Joined Yet</h3>
          <p className="text-gray-500 text-xs max-w-xs mx-auto">Create a Circle and share code <strong>6726</strong> with friends anywhere.</p>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={handleCreate} disabled={creating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all">
            {creating ? 'Creating...' : '✦ Create My Circle'}
          </button>
          {createError && <p className="text-red-500 text-xs text-center">{createError}</p>}
          <button onClick={() => setSheet('join')}
            className="w-full py-3.5 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200/80 font-bold active:scale-95 transition-all">
            Enter Code 6726 to Join
          </button>
        </div>
      </div>
      <BottomSheet isOpen={sheet === 'join'} onClose={() => setSheet(null)}>
        <JoinSheet lang={lang} onClose={() => setSheet(null)} />
      </BottomSheet>
    </div>
  );

  // ── Has Circle ──
  const sortedMembers = [...members].sort((a, b) =>
    ((b.todayCompleted || 0) * 10 + (b.currentStreak || 0)) -
    ((a.todayCompleted || 0) * 10 + (a.currentStreak || 0))
  );

  const activeToday = members.filter(m => (m.todayCompleted || 0) > 0).length;
  const REACTIONS = ['🔥', '👏', '💪', '✨', '🙏'];

  return (
    <div className="space-y-6 pb-28 p-4 md:p-8 max-w-xl mx-auto font-sans">
      
      {/* ── Top Bar with Language Selector ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-extrabold tracking-wider uppercase mb-1 border border-orange-200/60">
            <Sparkles className="w-3 h-3" /> {t.tag}
          </div>
          <h1 className="text-2xl font-display font-extrabold text-[#191815] dark:text-white tracking-tight">{circle.name}</h1>
          <p className="text-xs text-gray-400">{members.length} {t.members}</p>
        </div>

        {/* Language Capsule */}
        <div className="inline-flex p-1 bg-white dark:bg-brand-darkElevated rounded-2xl shadow-sm border border-orange-100">
          {(['ta', 'en', 'sa'] as Language[]).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${lang === l ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500'}`}>
              {l === 'ta' ? 'தமிழ்' : l === 'en' ? 'EN' : 'संस्कृतम्'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Action Buttons & Reset Capsule ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button onClick={() => setSheet('join')}
            className="flex items-center gap-1.5 py-2 px-4 rounded-2xl bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm active:scale-95 transition-all">
            <Users className="w-3.5 h-3.5" /> {t.joinBtn}
          </button>
          <button onClick={() => setSheet('invite')}
            className="flex items-center gap-1.5 py-2 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all">
            <UserPlus className="w-3.5 h-3.5" /> {t.inviteBtn}
          </button>
        </div>

        {/* Start Fresh / Reset Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.resetBtn}</span>
        </button>
      </div>

      {/* Notice Alert if Reset */}
      {resetNotice && (
        <div className="p-3.5 rounded-2xl bg-green-50 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          <span>{resetNotice}</span>
        </div>
      )}

      {/* ── Stats Row (Pure White Cards with Orange Badges) ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-orange-100/80 dark:border-gray-800 shadow-[0_4px_24px_rgba(255,107,0,0.05)]">
          <h3 className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider mb-1">{t.activeToday}</h3>
          <p className="text-3xl font-display font-extrabold text-[#191815] dark:text-white">
            {activeToday}
            <span className="text-sm font-normal text-gray-400 ml-1">/ {members.length}</span>
          </p>
        </div>
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-orange-100/80 dark:border-gray-800 shadow-[0_4px_24px_rgba(255,107,0,0.05)]">
          <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">{t.sessionsToday}</h3>
          <p className="text-3xl font-display font-extrabold text-[#191815] dark:text-white">
            {members.reduce((a, m) => a + (m.todayCompleted || 0), 0)}
            <span className="text-sm font-normal text-gray-400 ml-1">/ {members.length * 3}</span>
          </p>
        </div>
      </div>

      {/* ── Today's Circle Members List ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <h2 className="text-base font-display font-extrabold text-[#191815] dark:text-white">
            {t.todaysCircle}
          </h2>
        </div>

        <div className="space-y-2.5">
          {members.length === 0 ? (
            <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 text-center text-gray-400 text-xs border border-orange-100">
              {t.noActivity}
            </div>
          ) : sortedMembers.map((member, i) => {
            const dp = dailyProgress.find((d: any) => d.uid === member.uid);
            const isMe = member.uid === currentUser?.uid;
            return (
              <motion.div key={member.uid} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-4 border border-orange-100/80 dark:border-gray-800 shadow-sm flex items-center justify-between gap-3 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                      i === 0
                        ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-orange-500/20'
                        : 'bg-orange-50 dark:bg-gray-800 text-orange-600 dark:text-gray-300'
                    }`}>
                      {i === 0 ? <Crown className="w-4 h-4 text-white" /> : i + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-[#191815] dark:text-white truncate">
                          {member.name || 'Member'}
                        </p>
                        {isMe && (
                          <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60 uppercase">
                            {t.youTag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 mt-1">
                        <SessionDots
                          pratah={dp?.pratahCompleted ?? false}
                          madhyahnika={dp?.madhyahnikaCompleted ?? false}
                          sayam={dp?.sayamCompleted ?? false}
                        />
                        <span className="text-[11px] text-gray-500 font-medium">
                          {dp?.completedCount || 0}/3 {t.todayScore}
                        </span>
                        <div className="flex items-center gap-0.5 text-[11px] font-bold text-orange-600">
                          <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                          <span>{member.currentStreak || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isMe && (
                    <div className="flex items-center gap-1 shrink-0">
                      {REACTIONS.slice(0, 3).map(emoji => (
                        <button key={emoji} onClick={() => handleReaction(member, emoji)}
                          className="w-8 h-8 rounded-full bg-orange-50/60 dark:bg-gray-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform text-sm border border-orange-100/60">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Circle Activity Feed ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <h2 className="text-base font-display font-extrabold text-[#191815] dark:text-white">
            {t.activityTitle}
          </h2>
        </div>

        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-2 border border-orange-100/80 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
          {activities.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              {t.noActivity}
            </div>
          ) : (
            activities.slice(0, 8).map((act: any) => (
              <div key={act.id} className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-base shrink-0">
                  {act.type === 'reaction' ? act.emoji : '🔥'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-200">
                    <strong className="font-bold text-[#191815] dark:text-white">{act.name}</strong> {act.message}
                  </p>
                  {act.createdAt && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{safeFormat(act.createdAt, 'h:mm a')}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Confirmation Modal: Reset Circle Data ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-brand-darkCard rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-orange-100 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-7 h-7" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-[#191815]">
              {t.resetBtn}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t.resetConfirm}
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                disabled={resetting}
                className="py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Sheets ── */}
      <BottomSheet isOpen={sheet === 'invite'} onClose={() => setSheet(null)}>
        <InviteSheet lang={lang} />
      </BottomSheet>
      <BottomSheet isOpen={sheet === 'join'} onClose={() => setSheet(null)}>
        <JoinSheet lang={lang} onClose={() => setSheet(null)} />
      </BottomSheet>

    </div>
  );
};
