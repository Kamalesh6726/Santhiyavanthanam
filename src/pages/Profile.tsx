import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useUserData } from '../hooks/useFirebaseData';
import { updateUserProfile } from '../lib/db';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon, BookOpen, ChevronRight, Edit3, Flame, Trophy,
  MapPin, Check, Copy, X, ArrowRight
} from 'lucide-react';

// ─── Vedic Defaults & Options ──────────────────────────────────────────────────
const VEDA_OPTIONS = [
  'யஜுர் வேதம் (கிருஷ்ண யஜுர்) - Yajurveda (Krishna)',
  'யஜுர் வேதம் (சுக்ல யஜுர்) - Yajurveda (Shukla)',
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
                சாதகர்
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
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-display font-extrabold text-[#191815] dark:text-white">
              {userData.currentStreak || 0} <span className="text-xs text-orange-600 font-normal">days</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-orange-100/80 dark:border-gray-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Sessions</p>
            <p className="text-2xl font-display font-extrabold text-[#191815] dark:text-white">
              {userData.totalSessions || 0} <span className="text-xs text-orange-600 font-normal">done</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Basic Spiritual Information Section (Asked & Displayed) ── */}
      <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-orange-100/80 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-base font-display font-extrabold text-[#191815] dark:text-white">
              அடிப்படை விவரங்கள் (Basic Information)
            </h3>
          </div>
          <button
            onClick={openEditModal}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>திருத்துக</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">வேதம் (Veda Shakha)</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.veda || 'குறிப்பிடப்படவில்லை (Not set)'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">ஸூத்ரம் (Sutra)</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.sutra || 'குறிப்பிடப்படவில்லை (Not set)'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">கோத்ரம் (Gotra)</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.gotra || 'குறிப்பிடப்படவில்லை (Not set)'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">ப்ரவரம் (Pravara)</span>
            <span className="font-bold text-[#191815] dark:text-white text-right truncate max-w-[220px]">
              {userData.pravara || 'குறிப்பிடப்படவில்லை (Not set)'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">இருப்பிடம் (City / Location)</span>
            <span className="font-bold text-[#191815] dark:text-white text-right">
              {userData.location || 'சென்னை (Chennai)'}
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">தினசரி இலக்கு (Daily Target)</span>
            <span className="font-bold text-orange-600 text-right">
              {userData.dailyGoal || 3} வேளை (Sessions / Day)
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
              உங்கள் அபிவாதனம் (Your Abhivādaye Chant)
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
          உங்கள் கோத்ரம், ப்ரவரம் மற்றும் ஸூத்ரத்தின் அடிப்படையில் தானாக உருவாக்கப்பட்டது.
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
            <h4 className="font-display font-extrabold text-base tracking-tight">சந்தியா ஞானம்</h4>
            <p className="text-xs text-orange-100">ஆராய்ச்சி நன்மைகள் & மந்திர விளக்கம் (3 Languages)</p>
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
                  விவரங்களை உள்ளிடுக
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
                  தினசரி இலக்கு (Daily Target)
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
                      {num} வேளை ({num}/day)
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
                  ரத்து செய்க
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                >
                  {saving ? 'சேமிக்கிறது...' : 'சேமிக்க (Save)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
