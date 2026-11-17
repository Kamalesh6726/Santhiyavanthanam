import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useUserData } from '../hooks/useFirebaseData';
import { updateUserProfile } from '../lib/db';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon, BookOpen, ChevronRight, Edit3, Flame, Trophy,
  MapPin, Check, Copy, X, ArrowRight
} from 'lucide-react';

// ─── Language Type ─────────────────────────────────────────────────────────────
type Language = 'ta' | 'en' | 'sa';

const PROFILE_STRINGS = {
  ta: {
    title: 'விவரக்குறிப்பு',
    subtitle: 'சாதகர் விவரங்கள்',
    badge: 'சாதகர்',
    currentStreak: 'Current Streak',
    totalSessions: 'Total Sessions',
    days: 'நாட்கள்',
    done: 'முடிந்தது',
    basicInfoTitle: 'அடிப்படை ஆன்மீக விவரங்கள் (Basic Info)',
    editBtn: 'திருத்துக',
    vedaLabel: 'வேத சாகை (Veda)',
    sutraLabel: 'ஸூத்ரம் (Sutra)',
    gotraLabel: 'கோத்ரம் (Gotra)',
    pravaraLabel: 'ப்ரவரம் (Pravara)',
    locationLabel: 'இருப்பிடம் (Location)',
    targetLabel: 'தினசரி இலக்கு (Daily Target)',
    sessionsPerDay: 'வேளை / நாள்',
    notSet: 'குறிப்பிடப்படவில்லை',
    abhivadanamTitle: 'உங்கள் அபிவாதனம் (Your Abhivādaye)',
    abhivadanamSub: 'உங்கள் கோத்ரம், ப்ரவரம் மற்றும் ஸூத்ரத்தின் அடிப்படையில் உருவானது.',
    wisdomCardTitle: 'சந்தியா ஞானம்',
    wisdomCardSub: 'ஆராய்ச்சி நன்மைகள் & மந்திர விளக்கம் (3 மொழிகளில்)',
    modalTitle: 'அடிப்படை விவரங்களை உள்ளிடுக',
    saveBtn: 'சேமிக்க (Save)',
    savingBtn: 'சேமிக்கிறது...',
    cancelBtn: 'ரத்து செய்க'
  },
  en: {
    title: 'Profile',
    subtitle: 'Practitioner Profile',
    badge: 'Practitioner',
    currentStreak: 'Current Streak',
    totalSessions: 'Total Sessions',
    days: 'days',
    done: 'done',
    basicInfoTitle: 'Basic Vedic Information',
    editBtn: 'Edit',
    vedaLabel: 'Veda Shakha',
    sutraLabel: 'Sutra',
    gotraLabel: 'Gotra',
    pravaraLabel: 'Pravara Lineage',
    locationLabel: 'City / Location',
    targetLabel: 'Daily Target',
    sessionsPerDay: 'sessions / day',
    notSet: 'Not set yet',
    abhivadanamTitle: 'Your Abhivādaye Chant',
    abhivadanamSub: 'Auto-synthesized from your Gotra, Pravara, Sutra, and Veda.',
    wisdomCardTitle: 'Sandhyā Jñānam',
    wisdomCardSub: 'Scientific Research & Mantras (3 Languages)',
    modalTitle: 'Edit Basic Information',
    saveBtn: 'Save Profile',
    savingBtn: 'Saving...',
    cancelBtn: 'Cancel'
  },
  sa: {
    title: 'व्यक्तिविवरणम्',
    subtitle: 'साधक विवरणम्',
    badge: 'साधकः',
    currentStreak: 'नैरन्तर्यम् (Streak)',
    totalSessions: 'सम्पूर्ण सत्राणि',
    days: 'दिनानि',
    done: 'सम्पन्नम्',
    basicInfoTitle: 'वैदिक मूलविवरणम्',
    editBtn: 'संशोधयतु',
    vedaLabel: 'वेदशाखा',
    sutraLabel: 'सूत्रम्',
    gotraLabel: 'गोत्रम्',
    pravaraLabel: 'प्रवरः',
    locationLabel: 'स्थानम् / नगरम्',
    targetLabel: 'नित्यलक्ष्यम्',
    sessionsPerDay: 'सत्राणि / दिने',
    notSet: 'अनिरूपितम्',
    abhivadanamTitle: 'भवतः अभिवादनम्',
    abhivadanamSub: 'स्वगोत्र-प्रवर-सूत्रानुसारेण स्वयमेव सङ्कलितम्।',
    wisdomCardTitle: 'सन्ध्या ज्ञानम्',
    wisdomCardSub: 'वैज्ञानिकप्रभावाः & मन्त्राः (त्रिभाषासु)',
    modalTitle: 'मूलविवरणं परिवर्तयतु',
    saveBtn: 'संरक्षतु (Save)',
    savingBtn: 'संरक्षति...',
    cancelBtn: 'निरस्यतु'
  }
};

// ─── Vedic Defaults & Options ──────────────────────────────────────────────────
const VEDA_OPTIONS = [
  'யஜுர் வேதம் (கிருஷ்ண யஜுர்) - Krishna Yajurveda',
  'யஜுர் வேதம் (சுக்ல யஜுர்) - Shukla Yajurveda',
  'ரிக் வேதம் - Rigveda',
  'சாம வேதம் - Samaveda',
  'அதர்வண வேதம் - Atharvaveda'
];

const SUTRA_OPTIONS = [
  'ஆபஸ்தம்ப ஸூத்ரம் (Apastamba)',
  'போதாயன ஸூத்ரம் (Bodhayana)',
  'ஆச்வலாயன ஸூத்ரம் (Ashvalayana)',
  'காத்யாயன ஸூத்ரம் (Katyayana)',
  'த்ராஹ்யாயண ஸூத்ரம் (Drahyayana)',
  'சத்யாஷாட ஸூத்ரம் (Satyashadha)'
];

const GOTRA_PRESETS: Record<string, { gotra: string; pravara: string }> = {
  'காச்யப (Kashyapa)': {
    gotra: 'காச்யப (Kashyapa)',
    pravara: 'காச்யப, அவத்ஸார, நைத்ருவ த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'பாரத்வாஜ (Bharadvaja)': {
    gotra: 'பாரத்வாஜ (Bharadvaja)',
    pravara: 'ஆங்கீரஸ, பார்ஹஸ்பத்ய, பாரத்வாஜ த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'கௌசிக (Kaushika)': {
    gotra: 'கௌசிக (Kaushika)',
    pravara: 'வைச்வாமித்ர, ஆphaseமரஷண, கௌசிக த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'வாதுல (Vadhula)': {
    gotra: 'வாதுல (Vadhula)',
    pravara: 'பார்கவ, வைதஹவ்ய, ஸாவேதஸ த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'ஹரித (Harita)': {
    gotra: 'ஹரித (Harita)',
    pravara: 'ஆங்கீரஸ, ஆம்பரீஷ, யௌவனாச்வ த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'ஆத்ரேய (Atreya)': {
    gotra: 'ஆத்ரேய (Atreya)',
    pravara: 'ஆத்ரேய, ஆர்ச்சநானஸ, சியாவாச்வ த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'கௌதம (Gautama)': {
    gotra: 'கௌதம (Gautama)',
    pravara: 'ஆங்கீரஸ, ஆயாஸ்ய, கௌதம த்ரயார்ஷேய ப்ரவரான்வித'
  },
  'சாண்டில்ய (Sandilya)': {
    gotra: 'சாண்டில்ய (Sandilya)',
    pravara: 'காச்யப, தைவல, அசித த்ரயார்ஷேய ப்ரவரான்வித'
  }
};

export const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { userData, loading } = useUserData();
  const navigate = useNavigate();

  const [lang, setLang] = useState<Language>('ta');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedChant, setCopiedChant] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [veda, setVeda] = useState('');
  const [sutra, setSutra] = useState('');
  const [gotra, setGotra] = useState('');
  const [pravara, setPravara] = useState('');
  const [location, setLocation] = useState('');
  const [dailyGoal, setDailyGoal] = useState<number>(3);

  const t = PROFILE_STRINGS[lang];

  // Initialize form when opening modal
  const openEditModal = () => {
    if (userData) {
      setName(userData.name || '');
      setVeda(userData.veda || VEDA_OPTIONS[0]);
      setSutra(userData.sutra || SUTRA_OPTIONS[0]);
      setGotra(userData.gotra || Object.keys(GOTRA_PRESETS)[0]);
      setPravara(userData.pravara || GOTRA_PRESETS[Object.keys(GOTRA_PRESETS)[0]].pravara);
      setLocation(userData.location || 'Chennai, Tamil Nadu');
      setDailyGoal(userData.dailyGoal || 3);
    }
    setIsEditing(true);
  };

  const handleGotraChange = (selectedGotra: string) => {
    setGotra(selectedGotra);
    if (GOTRA_PRESETS[selectedGotra]) {
      setPravara(GOTRA_PRESETS[selectedGotra].pravara);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      await updateUserProfile(currentUser.uid, {
        name,
        veda,
        sutra,
        gotra,
        pravara,
        location,
        dailyGoal,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Generate Abhivadanam Chant
  const currentName = userData?.name || 'சாதகர்';
  const currentPravara = userData?.pravara || 'காச்யப, அவத்ஸார, நைத்ருவ த்ரயார்ஷேய ப்ரவரான்வித';
  const currentGotra = userData?.gotra?.split(' ')[0] || 'காச்யப';
  const currentSutra = userData?.sutra?.split(' ')[0] || 'ஆபஸ்தம்ப';
  const currentVeda = userData?.veda?.includes('ரிக்') ? 'ரிக்' : userData?.veda?.includes('சாம') ? 'சாம' : 'யஜுஸ்';

  const generatedAbhivadanam = `அபிவாதயே ${currentPravara} ${currentGotra} கோத்ர: ${currentSutra} ஸூத்ர: ${currentVeda} சாகாத்யாயீ ${currentName} சர்மா நாம அஹம்போ அபிவாதயே ||`;

  const copyAbhivadanam = () => {
    navigator.clipboard.writeText(generatedAbhivadanam);
    setCopiedChant(true);
    setTimeout(() => setCopiedChant(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      </div>
    );
  }

  if (!userData || !currentUser) return null;

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto space-y-6 pb-28 font-sans">
      
      {/* ── Top Bar with Language Selector ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-[#191815] dark:text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs text-gray-400">{t.subtitle}</p>
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

      {/* ── Profile Header Card (Orange & Crisp White) ── */}
      <div className="relative overflow-hidden bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-orange-100/80 dark:border-gray-800 shadow-[0_4px_24px_rgba(255,107,0,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center text-2xl font-bold font-display shadow-md shadow-orange-500/25">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-display font-bold text-[#191815] dark:text-white">
                {userData.name || 'Sandhyā Practitioner'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-bold border border-orange-200/60">
                {t.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {currentUser.email}
            </p>
            {userData.location && (
              <p className="text-[11px] text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3 h-3" />
                {userData.location}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={openEditModal}
          className="p-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 transition-all active:scale-95 border border-orange-200/60"
          aria-label="Edit Profile"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-orange-100/80 dark:border-gray-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.currentStreak}</p>
            <p className="text-2xl font-display font-extrabold text-[#191815] dark:text-white">
              {userData.currentStreak || 0} <span className="text-xs text-orange-600 font-normal">{t.days}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-orange-100/80 dark:border-gray-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.totalSessions}</p>
            <p className="text-2xl font-display font-extrabold text-[#191815] dark:text-white">
              {userData.totalSessions || 0} <span className="text-xs text-orange-600 font-normal">{t.done}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Basic Spiritual Information Section (Asked & Displayed) ── */}
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-orange-100/80 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-sm font-display font-extrabold text-[#191815] dark:text-white">
              {t.basicInfoTitle}
            </h3>
          </div>
          <button
            onClick={openEditModal}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>{t.editBtn}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t.vedaLabel}</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.veda || t.notSet}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t.sutraLabel}</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.sutra || t.notSet}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t.gotraLabel}</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.gotra || t.notSet}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t.pravaraLabel}</span>
            <span className="font-bold text-[#191815] dark:text-white text-right truncate max-w-[220px]">
              {userData.pravara || t.notSet}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t.locationLabel}</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.location || 'Chennai'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{t.targetLabel}</span>
            <span className="font-bold text-orange-600 text-right">
              {userData.dailyGoal || 3} {t.sessionsPerDay}
            </span>
          </div>
        </div>
      </div>

      {/* ── Generated Abhivadanam Card ── */}
      <div className="bg-gradient-to-br from-white to-orange-50/30 dark:from-brand-darkCard dark:to-brand-darkElevated rounded-3xl p-6 border border-orange-200/80 dark:border-orange-900/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📿</span>
            <h3 className="font-display font-extrabold text-sm text-[#191815] dark:text-white">
              {t.abhivadanamTitle}
            </h3>
          </div>
          <button
            onClick={copyAbhivadanam}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all active:scale-95 shadow-sm shadow-orange-500/20"
          >
            {copiedChant ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copiedChant ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-brand-darkCard border border-orange-100 dark:border-gray-800 text-center shadow-inner">
          <p className="font-serif text-sm font-bold text-orange-700 dark:text-orange-400 leading-relaxed">
            "{generatedAbhivadanam}"
          </p>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
          {t.abhivadanamSub}
        </p>
      </div>

      {/* ── Wisdom Link Card ── */}
      <button
        onClick={() => navigate('/wisdom')}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-5 shadow-lg shadow-orange-500/25 flex items-center justify-between text-left transition-all active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-base tracking-tight">{t.wisdomCardTitle}</h4>
            <p className="text-xs text-orange-100">{t.wisdomCardSub}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </button>

      {/* ── Edit Basic Information Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-brand-darkCard rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#191815] dark:text-white">
                  {t.modalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  பெயர் (Full / Spiritual Name)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="உதாரணம்: கமலேஷ் சர்மா"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                />
              </div>

              {/* Veda */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  வேத சாகை (Veda)
                </label>
                <select
                  value={veda}
                  onChange={(e) => setVeda(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                >
                  {VEDA_OPTIONS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Sutra */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  ஸூத்ரம் (Sutra)
                </label>
                <select
                  value={sutra}
                  onChange={(e) => setSutra(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                >
                  {SUTRA_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Gotra */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  கோத்ரம் (Gotra)
                </label>
                <select
                  value={gotra}
                  onChange={(e) => handleGotraChange(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                >
                  {Object.keys(GOTRA_PRESETS).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Pravara */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  ப்ரவரம் (Pravara Lineage)
                </label>
                <input
                  type="text"
                  value={pravara}
                  onChange={(e) => setPravara(e.target.value)}
                  placeholder="ரிஷி ப்ரவரம்"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  ஊர் / இருப்பிடம் (City / Location)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="உதாரணம்: Chennai, Coimbatore"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                />
              </div>

              {/* Daily Target */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">
                  {t.targetLabel}
                </label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[1, 2, 3].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setDailyGoal(num)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        dailyGoal === num
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : 'bg-white dark:bg-brand-darkElevated text-gray-600 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {num} {t.sessionsPerDay}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold active:scale-95 transition-all"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                >
                  {saving ? t.savingBtn : t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
