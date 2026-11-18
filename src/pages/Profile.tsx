import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useUserData } from '../hooks/useFirebaseData';
import { updateUserProfile } from '../lib/db';
import { logOut } from '../lib/firebase';
import {
  Edit3, Flame, Trophy,
  MapPin, Check, Copy, Sparkles, CheckCircle2, AlertCircle, LogOut
} from 'lucide-react';

// ─── Language Type ─────────────────────────────────────────────────────────────
type Language = 'ta' | 'en' | 'sa';

const PROFILE_STRINGS = {
  ta: {
    title: 'விவரக்குறிப்பு',
    subtitle: 'சாதகர் சுயவிவரம் & வேத மரபு',
    badge: 'சாதகர்',
    currentStreak: 'தொடர் நாட்கள் (Streak)',
    totalSessions: 'மொத்த அனுஷ்டானங்கள்',
    days: 'நாட்கள்',
    done: 'முடிந்தது',
    basicInfoTitle: 'அடிப்படை ஆன்மீக விவரங்கள் (Basic Vedic Info)',
    basicInfoSub: 'உங்கள் சந்தி மற்றும் அபிவாதனத்திற்கான அடிப்படை தகவல்கள்',
    formTab: 'விவரங்களை உள்ளிடுக (Fill / Edit Form)',
    summaryTab: 'சுருக்கப் பார்வை (Summary Card)',
    vedaLabel: 'வேத சாகை (Veda Shakha)',
    sutraLabel: 'ஸூத்ரம் (Sutra)',
    gotraLabel: 'கோத்ரம் (Gotra)',
    pravaraLabel: 'ப்ரவரம் (Pravara Lineage)',
    locationLabel: 'இருப்பிடம் / ஊர் (City / Location)',
    targetLabel: 'தினசரி அனுஷ்டான இலக்கு (Daily Goal)',
    phoneLabel: 'தொலைபேசி எண் (Phone - Optional)',
    sessionsPerDay: 'வேளை / நாள்',
    notSet: 'இன்னும் நிரப்பப்படவில்லை',
    abhivadanamTitle: 'உங்கள் அபிவாதனம் (Your Abhivādaye)',
    abhivadanamSub: 'உங்கள் கோத்ரம், ப்ரவரம் மற்றும் ஸூத்ரத்தின் அடிப்படையில் உருவானது.',
    saveBtn: 'அடிப்படை விவரங்களைச் சேமிக்க (Save)',
    savingBtn: 'சேமிக்கிறது...',
    successMsg: 'அடிப்படை விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!',
    incompleteNotice: 'அடிப்படை விவரங்கள் முழுமையாக நிரப்பப்படவில்லை. கீழே உள்ள படிவத்தைப் பூர்த்தி செய்யவும்.',
    completeNotice: 'அனைத்து அடிப்படை விவரங்களும் சரியாகப் பூர்த்தி செய்யப்பட்டுள்ளன.'
  },
  en: {
    title: 'Profile',
    subtitle: 'Practitioner Profile & Vedic Lineage',
    badge: 'Practitioner',
    currentStreak: 'Current Streak',
    totalSessions: 'Total Sessions',
    days: 'days',
    done: 'done',
    basicInfoTitle: 'Basic Vedic Information',
    basicInfoSub: 'Essential details for your Sandhya times & Abhivādaye chant',
    formTab: 'Fill / Edit Form',
    summaryTab: 'Summary Card',
    vedaLabel: 'Veda Shakha',
    sutraLabel: 'Sutra',
    gotraLabel: 'Gotra',
    pravaraLabel: 'Pravara Lineage',
    locationLabel: 'City / Location',
    targetLabel: 'Daily Target',
    phoneLabel: 'Phone Number (Optional)',
    sessionsPerDay: 'sessions / day',
    notSet: 'Not set yet',
    abhivadanamTitle: 'Your Abhivādaye Chant',
    abhivadanamSub: 'Auto-synthesized from your Gotra, Pravara, Sutra, and Veda.',
    saveBtn: 'Save Basic Information',
    savingBtn: 'Saving...',
    successMsg: 'Basic information successfully saved!',
    incompleteNotice: 'Your Vedic profile is incomplete. Please fill out the form below.',
    completeNotice: 'All basic Vedic information is complete.'
  },
  sa: {
    title: 'व्यक्तिविवरणम्',
    subtitle: 'साधक विवरणम् एवं वैदिकपरम्परा',
    badge: 'साधकः',
    currentStreak: 'नैरन्तर्यम् (Streak)',
    totalSessions: 'सम्पूर्ण सत्राणि',
    days: 'दिनानि',
    done: 'सम्पन्नम्',
    basicInfoTitle: 'वैदिक मूलविवरणम् (Basic Vedic Info)',
    basicInfoSub: 'सन्ध्याकाल-अभिवादनार्थं मूलविवरणम्',
    formTab: 'विवरणं लिखतु (Edit Form)',
    summaryTab: 'सङ्क्षेप विवरणम् (Summary)',
    vedaLabel: 'वेदशाखा (Veda Shakha)',
    sutraLabel: 'सूत्रम् (Sutra)',
    gotraLabel: 'गोत्रम् (Gotra)',
    pravaraLabel: 'प्रवरः (Pravara)',
    locationLabel: 'स्थानम् / नगरम् (City)',
    targetLabel: 'नित्यलक्ष्यम् (Daily Goal)',
    phoneLabel: 'दूरवाणी (Phone - Optional)',
    sessionsPerDay: 'सत्राणि / दिने',
    notSet: 'अनिरूपितम्',
    abhivadanamTitle: 'भवतः अभिवादनम्',
    abhivadanamSub: 'स्वगोत्र-प्रवर-सूत्रानुसारेण स्वयमेव सङ्कलितम्।',
    saveBtn: 'संरक्षतु (Save Details)',
    savingBtn: 'संरक्षति...',
    successMsg: 'मूलविवरणं सफलतया संरक्षितम्!',
    incompleteNotice: 'भवतः मूलविवरणं अपूर्णम् अस्ति। कृपया अधस्तनं पत्रं पूरयतु।',
    completeNotice: 'सर्वाणि मूलविवरणानि सम्पूर्णाणि।'
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

  const [lang, setLang] = useState<Language>('ta');
  const [activeTab, setActiveTab] = useState<'form' | 'summary'>('form');
  const [copiedChant, setCopiedChant] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [veda, setVeda] = useState(VEDA_OPTIONS[0]);
  const [sutra, setSutra] = useState(SUTRA_OPTIONS[0]);
  const [gotra, setGotra] = useState(Object.keys(GOTRA_PRESETS)[0]);
  const [pravara, setPravara] = useState(GOTRA_PRESETS[Object.keys(GOTRA_PRESETS)[0]].pravara);
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [dailyGoal, setDailyGoal] = useState<number>(3);
  const [phone, setPhone] = useState('');

  const t = PROFILE_STRINGS[lang];

  // Sync state with Firestore data
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setVeda(userData.veda || VEDA_OPTIONS[0]);
      setSutra(userData.sutra || SUTRA_OPTIONS[0]);
      setGotra(userData.gotra || Object.keys(GOTRA_PRESETS)[0]);
      setPravara(userData.pravara || GOTRA_PRESETS[Object.keys(GOTRA_PRESETS)[0]].pravara);
      setLocation(userData.location || 'Chennai, Tamil Nadu');
      setDailyGoal(userData.dailyGoal || 3);
      if (userData.phone) setPhone(userData.phone);

      // If user has all fields populated, default to summary tab, otherwise form tab
      if (userData.veda && userData.gotra && userData.sutra) {
        setActiveTab('summary');
      } else {
        setActiveTab('form');
      }
    }
  }, [userData]);

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
    setSaveSuccess(false);
    try {
      await updateUserProfile(currentUser.uid, {
        name: name.trim(),
        veda,
        sutra,
        gotra,
        pravara,
        location: location.trim(),
        dailyGoal,
        phone: phone.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveTab('summary');
      }, 1500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  // Generate Abhivadanam Chant dynamically
  const currentName = userData?.name || name || 'கமலேஷ்';
  const currentPravara = userData?.pravara || pravara || 'காச்யப, அவத்ஸார, நைத்ருவ த்ரயார்ஷேய ப்ரவரான்வித';
  const currentGotra = (userData?.gotra || gotra)?.split(' ')[0] || 'காச்யப';
  const currentSutra = (userData?.sutra || sutra)?.split(' ')[0] || 'ஆபஸ்தம்ப';
  const currentVedaRaw = userData?.veda || veda || '';
  const currentVeda = currentVedaRaw.includes('ரிக்') ? 'ரிக்' : currentVedaRaw.includes('சாம') ? 'சாம' : 'யஜுஸ்';

  const generatedAbhivadanam = `அபிவாதயே ${currentPravara} ${currentGotra} கோத்ர: ${currentSutra} ஸூத்ர: ${currentVeda} சாகாத்யாயீ ${currentName} சர்மா நாம அஹம்போ அபிவாதயே ||`;

  const copyAbhivadanam = () => {
    navigator.clipboard.writeText(generatedAbhivadanam);
    setCopiedChant(true);
    setTimeout(() => setCopiedChant(false), 2000);
  };

  // Check completeness
  const isProfileComplete = Boolean(userData?.name && userData?.veda && userData?.gotra && userData?.sutra);

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="h-24 bg-orange-50/70 rounded-3xl border border-orange-100" />
        <div className="h-64 bg-white rounded-3xl border border-orange-100" />
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-28 font-sans">
      
      {/* ── Top Bar: Title & 3-Way Language Capsule ── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-extrabold uppercase tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.subtitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#191815] tracking-tight">
            {t.title}
          </h1>
        </div>

        {/* Language Capsule */}
        <div className="inline-flex p-1 bg-white rounded-2xl shadow-sm border border-orange-200 shrink-0">
          {(['ta', 'en', 'sa'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                lang === l
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/25'
                  : 'text-gray-500 hover:text-orange-600'
              }`}
            >
              {l === 'ta' ? 'தமிழ்' : l === 'en' ? 'EN' : 'संस्कृतम्'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Profile Header Card (Pure White with Orange Accents) ── */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-4 sm:p-6 border-2 border-orange-100 shadow-[0_10px_35px_rgba(255,107,0,0.06)] space-y-3.5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center text-xl sm:text-2xl font-bold font-display shadow-md shadow-orange-500/30 shrink-0">
              {userData?.name ? userData.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-[#191815] truncate">
                  {userData?.name || 'சாதகர்'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-extrabold border border-orange-200 shrink-0">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {currentUser.email}
              </p>
              {userData?.location && (
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1 font-semibold truncate">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">{userData.location}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'form' ? 'summary' : 'form')}
            className={`p-2 sm:p-2.5 rounded-2xl border transition-all active:scale-95 shrink-0 ml-2 ${
              activeTab === 'form'
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
            }`}
            title="Edit Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Completeness Pill */}
        <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
          isProfileComplete
            ? 'bg-orange-50/60 border-orange-200 text-orange-700'
            : 'bg-orange-50 border-orange-200 text-orange-800'
        }`}>
          <div className="flex items-center gap-2">
            {isProfileComplete ? (
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 animate-bounce" />
            )}
            <span className="font-semibold">
              {isProfileComplete ? t.completeNotice : t.incompleteNotice}
            </span>
          </div>
          {!isProfileComplete && (
            <button
              onClick={() => setActiveTab('form')}
              className="text-xs font-extrabold text-orange-600 underline shrink-0 ml-2"
            >
              நிரப்புக
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.currentStreak}</p>
            <p className="text-2xl font-display font-extrabold text-[#191815]">
              {userData?.currentStreak || 0} <span className="text-xs text-orange-600 font-normal">{t.days}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
            <Trophy className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{t.totalSessions}</p>
            <p className="text-2xl font-display font-extrabold text-[#191815]">
              {userData?.totalSessions || 0} <span className="text-xs text-orange-600 font-normal">{t.done}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION: ASKING BASIC VEDIC INFORMATIONS ── */}
      <div className="bg-white rounded-3xl p-6 border-2 border-orange-100 shadow-[0_10px_35px_rgba(255,107,0,0.06)] space-y-5">
        
        {/* Section Header & View/Edit Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <h3 className="text-base font-display font-extrabold text-[#191815]">
                {t.basicInfoTitle}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.basicInfoSub}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-orange-50/80 rounded-2xl border border-orange-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'form'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {t.formTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'summary'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {t.summaryTab}
            </button>
          </div>
        </div>

        {/* ── TAB 1: INTERACTIVE FORM (ASKING QUESTIONS DIRECTLY) ── */}
        {activeTab === 'form' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-orange-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/25 animate-fade-in">
                <Check className="w-4 h-4 text-white" />
                <span>{t.successMsg}</span>
              </div>
            )}

            {/* 1. Full / Spiritual Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                1. முழுப் பெயர் / சர்மா (Full or Spiritual Name) <span className="text-orange-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா. கமலேஷ் சர்மா (Kamalesh Sharma)"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-sm text-[#191815] font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* 2. Veda Shakha */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                2. {t.vedaLabel} <span className="text-orange-600">*</span>
              </label>
              <select
                value={veda}
                onChange={(e) => setVeda(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-xs text-[#191815] font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              >
                {VEDA_OPTIONS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* 3. Sutra */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                3. {t.sutraLabel} <span className="text-orange-600">*</span>
              </label>
              <select
                value={sutra}
                onChange={(e) => setSutra(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-xs text-[#191815] font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              >
                {SUTRA_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 4. Gotra */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                4. {t.gotraLabel} <span className="text-orange-600">*</span>
              </label>
              <select
                value={gotra}
                onChange={(e) => handleGotraChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-xs text-[#191815] font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              >
                {Object.keys(GOTRA_PRESETS).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* 5. Pravara Lineage (Auto-updated & editable) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                5. {t.pravaraLabel} <span className="text-[10px] text-orange-600 font-normal">(கோத்ரத்திற்கு ஏற்ப தானாக நிரப்பப்படும்)</span>
              </label>
              <input
                type="text"
                value={pravara}
                onChange={(e) => setPravara(e.target.value)}
                placeholder="ரிஷி ப்ரவரம்"
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-xs text-[#191815] font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>

            {/* 6. City / Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                6. {t.locationLabel} <span className="text-orange-600">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="எ.கா. Chennai, Coimbatore, Madurai"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-xs text-[#191815] font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>

            {/* 7. Daily Target */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                7. {t.targetLabel}
              </label>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1, 2, 3].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setDailyGoal(num)}
                    className={`py-2.5 rounded-2xl font-extrabold text-xs border transition-all ${
                      dailyGoal === num
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25 scale-[1.02]'
                        : 'bg-[#FAFAFA] text-gray-700 border-orange-100 hover:border-orange-300'
                    }`}
                  >
                    {num} {t.sessionsPerDay}
                  </button>
                ))}
              </div>
            </div>

            {/* 8. Phone Number (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-[#191815]">
                8. {t.phoneLabel}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFAFA] border border-orange-200/80 text-xs text-[#191815] font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-extrabold shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-white" />
                <span>{saving ? t.savingBtn : t.saveBtn}</span>
              </button>
            </div>

          </form>
        )}

        {/* ── TAB 2: SUMMARY VIEW OF BASIC DETAILS ── */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="divide-y divide-orange-100 text-xs">
              
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">முழுப் பெயர் (Name)</span>
                <span className="font-extrabold text-[#191815] text-right">
                  {userData?.name || t.notSet}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">{t.vedaLabel}</span>
                <span className="font-bold text-[#191815] text-right max-w-[220px] truncate">
                  {userData?.veda || t.notSet}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">{t.sutraLabel}</span>
                <span className="font-bold text-[#191815] text-right">
                  {userData?.sutra || t.notSet}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">{t.gotraLabel}</span>
                <span className="font-bold text-[#191815] text-right">
                  {userData?.gotra || t.notSet}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">{t.pravaraLabel}</span>
                <span className="font-bold text-[#191815] text-right max-w-[220px] truncate">
                  {userData?.pravara || t.notSet}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">{t.locationLabel}</span>
                <span className="font-bold text-[#191815] text-right">
                  {userData?.location || 'Chennai'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-gray-500 font-medium">{t.targetLabel}</span>
                <span className="font-extrabold text-orange-600 text-right">
                  {userData?.dailyGoal || 3} {t.sessionsPerDay}
                </span>
              </div>

            </div>

            <button
              onClick={() => setActiveTab('form')}
              className="w-full py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 border border-orange-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>விவரங்களை மாற்ற / உள்ளிட (Edit Information)</span>
            </button>
          </div>
        )}

      </div>

      {/* ── Generated Abhivadanam Card (Sacred Chant) ── */}
      <div className="bg-gradient-to-br from-white via-orange-50/20 to-orange-100/30 rounded-3xl p-4 sm:p-6 border-2 border-orange-200 shadow-sm space-y-3.5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📿</span>
            <h3 className="font-display font-extrabold text-sm text-[#191815]">
              {t.abhivadanamTitle}
            </h3>
          </div>
          <button
            onClick={copyAbhivadanam}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold transition-all active:scale-95 shadow-sm shadow-orange-500/25"
          >
            {copiedChant ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
            <span>{copiedChant ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-200 text-center shadow-inner">
          <p className="font-serif text-sm font-extrabold text-orange-800 leading-relaxed">
            "{generatedAbhivadanam}"
          </p>
        </div>
        
        <p className="text-[11px] text-gray-500 text-center">
          {t.abhivadanamSub}
        </p>
      </div>

      {/* ── Sign Out Button ── */}
      <button
        onClick={() => logOut()}
        className="w-full py-3.5 rounded-3xl bg-white hover:bg-red-50 text-red-600 font-extrabold text-xs border border-red-200 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span>கணக்கிலிருந்து வெளியேறு (Sign Out)</span>
      </button>

    </div>
  );
};
