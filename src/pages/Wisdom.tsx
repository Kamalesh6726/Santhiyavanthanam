import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWisdom, useMantras, useSavedWisdom } from '../hooks/useFirebaseData';
import { format } from 'date-fns';
import {
  Search, BookOpen, Heart, Copy, Share2, ChevronDown, ChevronUp,
  Sunrise, Sun, Sunset, MapPin, AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SandhyaTime {
  sunrise: string;
  sunset: string;
  pratah: string;
  madhyahnikam: string;
  sayam: string;
  location: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'அனைத்தும்', label: 'அனைத்தும்', emoji: '' },
  { id: 'பொன்மொழிகள்', label: 'பொன்மொழிகள்', emoji: '🌟' },
  { id: 'தத்துவம்', label: 'தத்துவம்', emoji: '🕉️' },
  { id: 'ஆன்மீக சிந்தனைகள்', label: 'ஆன்மீக சிந்தனைகள்', emoji: '🪔' },
  { id: 'மந்திரங்கள்', label: 'மந்திரங்கள்', emoji: '📿' },
  { id: 'பாரம்பரியம்', label: 'பாரம்பரியம்', emoji: '📖' },
  { id: 'சந்தியா நேரங்கள்', label: 'சந்தியா நேரங்கள்', emoji: '🌅' },
  { id: 'சூரிய உபாசனை', label: 'சூரிய உபாசனை', emoji: '☀️' },
  { id: 'ஒழுக்கம்', label: 'ஒழுக்கம் & மன ஒருமைப்பாடு', emoji: '🧘' },
  { id: 'கேள்வி & பதில்', label: 'கேள்வி & பதில்', emoji: '📚' },
];

const STATIC_QUOTES = [
  "தினசரி கடமை சிறியதாக இருந்தாலும், அதன் தொடர்ச்சி பெரிய மாற்றத்தை உருவாக்கும்.",
  "சந்தியா நேரம் வெளியில் ஒளி மாறும் நேரம் மட்டுமல்ல; உள்ளத்தில் சிந்தனை திரும்பும் நேரமும் ஆகும்.",
  "மந்திரத்தின் ஒலி மட்டும் அல்ல; அதன் பொருளை உணர்ந்து வாழ்வதே ஆன்மீகப் பயிற்சியின் நோக்கம்.",
  "ஒழுக்கத்துடன் செய்யப்படும் ஒரு சிறிய நித்ய கர்மம், வாழ்க்கையில் நிலைத்தன்மையை உருவாக்கும்.",
  "இன்றைய கடமையை நாளைக்கு தள்ளாமல் செய்வதே சாதனையின் முதல் படி.",
];

const PURPOSES = [
  { emoji: '🕉️', title: 'இறைநினைவு', desc: 'இறைநினைவை வளர்த்தல்.' },
  { emoji: '🧘', title: 'மன ஒருமைப்பாடு', desc: 'மனதை ஒருமுகப்படுத்துதல்.' },
  { emoji: '📿', title: 'மந்திர ஜபம்', desc: 'மந்திரப் பயிற்சியின் மூலம் ஆன்மீக கவனத்தை வளர்த்தல்.' },
  { emoji: '☀️', title: 'சூரிய உபாசனை', desc: 'சூரியனை தெய்வீக ஒளியின் அடையாளமாக வணங்குதல்.' },
  { emoji: '🔍', title: 'சுயபரிசோதனை', desc: 'தன்னுடைய செயல்களை ஆராய்தல்.' },
  { emoji: '🙏', title: 'நன்றியுணர்வு', desc: 'வாழ்க்கை, இயற்கை, ஒளி மற்றும் இறைநிலையை நினைவுகூருதல்.' },
  { emoji: '🧭', title: 'ஒழுக்கம்', desc: 'தினசரி வாழ்க்கையில் நியமத்தையும் தொடர்ச்சியையும் வளர்த்தல்.' },
];

const PARTS = [
  { num: '01', title: 'ஆச்சமனம்', desc: 'புனித நீரைப் பயன்படுத்தி செய்யப்படும் சுத்திகரிப்பு முறையின் ஒரு பகுதி.' },
  { num: '02', title: 'பிராணாயாமம்', desc: 'மூச்சைக் கட்டுப்படுத்தி மனதை ஒருமுகப்படுத்தும் பாரம்பரியப் பயிற்சி.' },
  { num: '03', title: 'சங்கல்பம்', desc: 'செய்யப்போகும் கர்மத்தை மனதில் உறுதியாக ஏற்றுக்கொள்ளுதல்.' },
  { num: '04', title: 'மார்ஜனம்', desc: 'நீர் மற்றும் மந்திரத்தின் மூலம் சுத்திகரிப்பை குறிக்கும் செயல்.' },
  { num: '05', title: 'அர்க்யம்', desc: 'சூரியனுக்கு நீரை அர்ப்பணித்தல்.' },
  { num: '06', title: 'காயத்ரி ஜபம்', desc: 'காயத்ரி மந்திரத்தை பக்தியுடனும் ஒருமுகத்துடனும் ஜபித்தல்.' },
  { num: '07', title: 'சூரிய உபாசனை', desc: 'சூரியனை தெய்வீக ஒளியின் அடையாளமாகக் கருதி வணங்குதல்.' },
  { num: '08', title: 'உபஸ்தானம்', desc: 'தெய்வீக சக்தியை நினைத்து வணங்கி நிறைவு செய்யும் பகுதிகள்.' },
  { num: '09', title: 'அபிவாதனம்', desc: 'சம்பிரதாயத்திற்கேற்ப குரு/ரிஷி பரம்பரையை நினைவுகூரும் பகுதி.' },
  { num: '10', title: 'சமர்ப்பணம்', desc: 'செய்த கர்மத்தை இறைவனுக்கு அர்ப்பணிக்கும் மனநிலை.' },
];

const BENEFITS = [
  { emoji: '🧘', num: '01', title: 'மன ஒருமைப்பாடு', desc: 'மந்திர ஜபம், மூச்சின் மீது கவனம் மற்றும் முறையான சடங்கு ஆகியவை மனதை ஒருமுகப்படுத்தும் ஆன்மீகப் பயிற்சியாகக் கருதப்படுகின்றன.' },
  { emoji: '🕯️', num: '02', title: 'ஒழுக்கமான வாழ்க்கை', desc: 'தினமும் குறிப்பிட்ட நேரத்தில் ஒரு நித்ய கர்மத்தைச் செய்வது நேர ஒழுக்கத்தையும் தொடர்ச்சியையும் வளர்க்க உதவும்.' },
  { emoji: '🙏', num: '03', title: 'இறைநினைவு', desc: 'நாளின் தொடக்கம் மற்றும் முடிவில் இறைநினைவுடன் இருப்பதற்கான வாய்ப்பை அளிக்கிறது.' },
  { emoji: '☀️', num: '04', title: 'சூரிய உபாசனை', desc: 'சூரியன் ஒளி, ஆற்றல் மற்றும் உயிரின் ஆதாரமாகக் கருதப்பட்டு, அவரை வணங்கும் பாரம்பரியம் இதில் முக்கியமானது.' },
  { emoji: '📿', num: '05', title: 'மந்திரப் பயிற்சி', desc: 'காயத்ரி போன்ற மந்திரங்களை முறையாக ஜபிப்பது வேத பாரம்பரியத்தில் முக்கியமான ஆன்மீகப் பயிற்சியாகக் கருதப்படுகிறது.' },
  { emoji: '🧘', num: '06', title: 'சுயக்கட்டுப்பாடு', desc: 'தினசரி கடமையை தவறாமல் செய்வது discipline / நியமம் என்ற எண்ணத்தை வலுப்படுத்துகிறது.' },
  { emoji: '🌱', num: '07', title: 'நன்றியுணர்வு', desc: 'இயற்கை, சூரியன், நீர், உயிர் மற்றும் இறைவன் ஆகியவற்றின் மீதான நன்றியுணர்வை வளர்க்கும் பாரம்பரிய வழிபாட்டு முறை.' },
  { emoji: '🪔', num: '08', title: 'சுயபரிசோதனை', desc: '"நான் இன்று எப்படி வாழ்ந்தேன்?" என்ற உள்ளார்ந்த சிந்தனைக்கு ஒரு வாய்ப்பாக தினசரி ஆன்மீக நடைமுறை அமையலாம்.' },
  { emoji: '🌄', num: '09', title: 'மூன்று நேரங்கள்', desc: 'காலை, மதியம், மாலை என நாளின் முக்கியமான நேரங்களில் ஆன்மீக இடைவெளியை உருவாக்குகிறது.' },
  { emoji: '❤️', num: '10', title: 'ஆன்மீக தொடர்ச்சி', desc: 'தினசரி தொடர்ச்சியாகச் செய்வது சாதனை மற்றும் நியமம் என்ற உணர்வை உருவாக்குகிறது.' },
];

const FAQS = [
  {
    q: 'சந்தியாவந்தனம் தினமும் செய்ய வேண்டுமா?',
    a: 'வேத பாரம்பரியத்தில் இது நித்ய கர்மமாகக் கருதப்படுகிறது. ஆனால் தனிநபரின் சம்பிரதாயம் மற்றும் ஆசார்யர் வழிகாட்டுதலின்படி முறையைப் பின்பற்ற வேண்டும்.'
  },
  {
    q: 'மூன்று சந்தியாக்கள் என்ன?',
    a: 'பிராதஸ் (காலை), மாத்யாஹ்னிகம் (மதியம்), சாயம் (மாலை) — இவை மூன்றும் நாளின் மாற்றத்தின் நேரங்களாகக் கருதப்படுகின்றன.'
  },
  {
    q: 'காயத்ரி மந்திரம் ஏன் முக்கியமானது?',
    a: 'வேத பாரம்பரியத்தில் காயத்ரி மந்திரம் மிகவும் முக்கியமான மந்திரமாகக் கருதப்படுகிறது; சந்தியாவந்தனத்தில் இது முக்கிய இடம் பெறுகிறது.'
  },
  {
    q: 'நான் முறையை சரியாக அறியவில்லை என்றால்?',
    a: 'உங்கள் குடும்ப சம்பிரதாயம் அல்லது ஆசார்யரிடம் கற்றுக்கொள்வது சிறந்தது. ஒவ்வொரு சம்பிரதாயமும் சிறிது வேறுபட்டிருக்கலாம்.'
  },
  {
    q: 'வெறும் streak காகச் செய்வது போதுமா?',
    a: 'Streak → Discipline → Practice → Understanding → Spiritual growth. App தொடர்ச்சியை ஊக்குவிக்கிறது; ஆனால் பயிற்சியின் உள்ளார்ந்த பொருளை புரிந்துகொள்வதே உண்மையான நோக்கம்.'
  },
];

// ─── Gayatri Mantra Section ──────────────────────────────────────────────────
const GayatriSection = () => {
  const [view, setView] = useState<'sanskrit' | 'tamil'>('sanskrit');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = view === 'sanskrit'
      ? 'ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात् ॥'
      : 'ஓம் பூர்புவஸ்ஸுவஃ\nதத் ஸவிதுர் வரேண்யம்\nபர்கோ தேவஸ்ய தீமஹி\nதியோ யோ நஃ ப்ரசோதயாத்';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📿</span>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">காயத்ரி மந்திரம்</h2>
      </div>

      <Card className="overflow-hidden border border-[#E9DFCF]/60 dark:border-gray-800 bg-[#FDFCF8] dark:bg-[#151514]">
        {/* Toggle */}
        <div className="flex border-b border-[#E9DFCF]/50 dark:border-gray-800">
          {(['sanskrit', 'tamil'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                view === v
                  ? 'bg-brand-saffron/10 text-brand-saffron border-b-2 border-brand-saffron'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {v === 'sanskrit' ? 'Sanskrit' : 'Tamil'}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'sanskrit' ? (
                <p className="text-2xl leading-loose text-center font-medium text-brand-charcoal dark:text-gray-100 whitespace-pre-line">
                  {`ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात् ॥`}
                </p>
              ) : (
                <p className="text-xl leading-loose text-center font-medium text-brand-charcoal dark:text-gray-100 whitespace-pre-line">
                  {`ஓம் பூர்புவஸ்ஸுவஃ\nதத் ஸவிதுர் வரேண்யம்\nபர்கோ தேவஸ்ய தீமஹி\nதியோ யோ நஃ ப்ரசோதயாத்`}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pt-4 border-t border-[#E9DFCF]/40 dark:border-gray-800 space-y-3">
            <div>
              <p className="text-xs font-semibold tracking-wider text-brand-saffron uppercase mb-1">பொருள்</p>
              <p className="text-brand-charcoal dark:text-gray-200 leading-relaxed">
                "அந்த தெய்வீக ஒளியை நாம் தியானிக்கிறோம். அது எங்களுடைய புத்தியை நல்ல பாதையில் செலுத்தட்டும்."
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-brand-saffron uppercase mb-1">ஆன்மீக விளக்கம்</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                காயத்ரி மந்திரம் வேத பாரம்பரியத்தில் மிகவும் முக்கியமான மந்திரமாகக் கருதப்படுகிறது. 
                சந்தியாவந்தனத்தின் முக்கிய அங்கமாக இது பல நூற்றாண்டுகளாக கடைப்பிடிக்கப்படுகிறது.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-saffron transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'நகலெடுக்கப்பட்டது ✓' : 'மந்திரத்தை நகலெடுக்க'}
          </button>
        </div>
      </Card>
    </section>
  );
};

// ─── Sandhya Times ────────────────────────────────────────────────────────────
const SandhyaTimesSection = () => {
  const [times, setTimes] = useState<SandhyaTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimes = () => {
    if (!navigator.geolocation) {
      setError('இந்த உலாவி இருப்பிடத்தை ஆதரிக்கவில்லை.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const today = format(new Date(), 'yyyy-MM-dd');
        const res = await fetch(
          `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${today}`
        );
        const data = await res.json();
        if (data.status === 'OK') {
          const sr = data.results.sunrise;
          const ss = data.results.sunset;
          // Calculate midday
          const toMin = (t: string) => {
            const [time, ampm] = t.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return h * 60 + m;
          };
          const midMin = Math.round((toMin(sr) + toMin(ss)) / 2);
          const midH = Math.floor(midMin / 60);
          const midM = midMin % 60;
          const midAmPm = midH >= 12 ? 'PM' : 'AM';
          const midH12 = midH > 12 ? midH - 12 : midH === 0 ? 12 : midH;
          const midStr = `${midH12}:${String(midM).padStart(2, '0')} ${midAmPm}`;

          setTimes({
            sunrise: sr,
            sunset: ss,
            pratah: sr,
            madhyahnikam: midStr,
            sayam: ss,
            location: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
          });
        } else {
          setError('சூரிய நேரத் தரவை பெற முடியவில்லை.');
        }
      } catch {
        setError('இணைப்பில் பிழை. மீண்டும் முயற்சிக்கவும்.');
      } finally {
        setLoading(false);
      }
    }, () => {
      setError('இருப்பிட அனுமதி மறுக்கப்பட்டது.');
      setLoading(false);
    });
  };

  const timeCards = times ? [
    { icon: Sunrise, label: 'பிராதஸ் சந்தியா', time: times.pratah, sub: 'சூரிய உதயம்', color: 'text-orange-400' },
    { icon: Sun, label: 'மாத்யாஹ்னிகம்', time: times.madhyahnikam, sub: 'மதிய நேரம்', color: 'text-yellow-500' },
    { icon: Sunset, label: 'சாயம் சந்தியா', time: times.sayam, sub: 'சூரிய அஸ்தமனம்', color: 'text-brand-saffron' },
  ] : [];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🌅</span>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">சந்தியா நேரங்கள்</h2>
      </div>

      {!times && !loading && (
        <Card className="p-6 text-center space-y-4">
          <MapPin className="w-10 h-10 text-brand-saffron/50 mx-auto" />
          <div>
            <p className="font-semibold text-brand-charcoal dark:text-gray-100">உங்கள் இருப்பிட நேரங்களைக் காண</p>
            <p className="text-sm text-gray-500 mt-1">இருப்பிட அனுமதியை அனுமதிக்கவும்</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={fetchTimes}
            className="px-6 py-3 rounded-xl bg-brand-saffron text-white font-semibold text-sm active:scale-95 transition-transform"
          >
            நேரங்களைக் காட்டு
          </button>
        </Card>
      )}

      {loading && (
        <Card className="p-6 text-center animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
        </Card>
      )}

      {times && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            <span>{times.location}</span>
            <button onClick={fetchTimes} className="text-brand-saffron underline ml-1">புதுப்பி</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {timeCards.map(({ icon: Icon, label, time, sub, color }) => (
              <Card key={label} className="p-4 text-center space-y-2">
                <Icon className={`w-6 h-6 mx-auto ${color}`} />
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-base font-bold text-brand-charcoal dark:text-gray-100">{time}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </Card>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">
            * நேரங்கள் சம்பிரதாயத்திற்கேற்ப மாறலாம். ஆசார்யர் வழிகாட்டுதலை முன்னுரிமை கொள்ளவும்.
          </p>
        </div>
      )}
    </section>
  );
};

// ─── FAQ Section ─────────────────────────────────────────────────────────────
const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">📚</span>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">கேள்வி & பதில்</h2>
      </div>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-brand-charcoal dark:text-gray-100 pr-4 leading-snug">{faq.q}</span>
              {open === i
                ? <ChevronUp className="w-5 h-5 text-brand-saffron shrink-0" />
                : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
              }
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </section>
  );
};

// ─── Quote Carousel ───────────────────────────────────────────────────────────
const QuoteCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % STATIC_QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleShare = () => {
    if (navigator.share) navigator.share({ text: STATIC_QUOTES[idx] });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">🌟</span>
        <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">பொன்மொழிகள்</h2>
      </div>
      <Card className="relative overflow-hidden bg-gradient-to-br from-[#FDF8F0] to-[#F5EED8] dark:from-[#1A1810] dark:to-[#151210] border border-[#E9DFCF]/60 dark:border-gray-800 p-6">
        <div className="absolute top-3 left-4 text-[#D8AD62]/20 font-serif text-7xl leading-none select-none">"</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 pt-4 space-y-4"
          >
            <p className="text-lg font-medium text-brand-charcoal dark:text-gray-100 leading-relaxed">
              {STATIC_QUOTES[idx]}
            </p>
            <p className="text-sm text-brand-saffron font-semibold">— ஆன்மீக சிந்தனை</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E9DFCF]/40 dark:border-gray-800">
          <div className="flex gap-1.5">
            {STATIC_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-brand-saffron w-4' : 'bg-gray-300 dark:bg-gray-700'}`}
              />
            ))}
          </div>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-saffron transition-colors">
            <Share2 className="w-4 h-4" /> பகிர்
          </button>
        </div>
      </Card>
    </section>
  );
};

// ─── Disclaimer Banner ────────────────────────────────────────────────────────
const DisclaimerBanner = () => (
  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 space-y-3">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-2 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
        <p>
          <strong>குறிப்பு:</strong> இங்கே குறிப்பிடப்படும் ஆன்மீகப் பயன்கள் பாரம்பரிய/ஆன்மீகக் கண்ணோட்டத்தில் வழங்கப்படுகின்றன. அவற்றை மருத்துவ ரீதியாக நிரூபிக்கப்பட்ட சிகிச்சைப் பயன்களாகக் கருதக்கூடாது.
        </p>
        <p>
          சந்தியாவந்தன முறைகளும் மந்திரங்களின் வரிசையும் சம்பிரதாயம், வேதசாகை, சூத்திரம் மற்றும் குடும்பப் பாரம்பரியத்தைப் பொறுத்து மாறுபடலாம். தகுதியான ஆசார்யர்/குருவின் வழிகாட்டுதலை முன்னுரிமையாகக் கொள்ள வேண்டும்.
        </p>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const WisdomPage: React.FC = () => {
  const { wisdom, loading: wisdomLoading } = useWisdom();
  const { mantras, loading: mantrasLoading } = useMantras();
  const { savedWisdomIds, toggleSave } = useSavedWisdom();

  const [activeCategory, setActiveCategory] = useState('அனைத்தும்');
  const [searchQuery, setSearchQuery] = useState('');

  const todaysReflection = useMemo(() => {
    if (wisdom.length === 0) return null;
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    return wisdom[Math.abs(hash) % wisdom.length];
  }, [wisdom]);

  const filteredWisdom = useMemo(() =>
    wisdom.filter(w => {
      const matchesCat = activeCategory === 'அனைத்தும்' || w.category === activeCategory;
      const q = searchQuery.toLowerCase();
      return matchesCat && (!q ||
        w.contentTamil?.toLowerCase().includes(q) ||
        w.content?.toLowerCase().includes(q) ||
        w.author?.toLowerCase().includes(q));
    }), [wisdom, activeCategory, searchQuery]);

  const filteredMantras = useMemo(() =>
    (activeCategory === 'அனைத்தும்' || activeCategory === 'மந்திரங்கள்')
      ? mantras.filter(m => {
          const q = searchQuery.toLowerCase();
          return !q ||
            m.titleTamil?.toLowerCase().includes(q) ||
            m.title.toLowerCase().includes(q) ||
            m.originalText.toLowerCase().includes(q);
        })
      : [], [mantras, activeCategory, searchQuery]);

  const isLoading = wisdomLoading || mantrasLoading;
  const showStaticContent = !searchQuery || searchQuery.length < 2;
  const categoryId = activeCategory;

  return (
    <div className="max-w-2xl mx-auto space-y-10 p-4 md:p-0 pb-28">

      {/* ── Hero ── */}
      <header className="pt-6 text-center space-y-4">
        <div className="w-14 h-14 bg-gradient-to-br from-brand-saffron/20 to-brand-gold/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">🌅</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-charcoal dark:text-gray-100 tracking-tight">
            சந்தியா ஞானம்
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            சந்தியாவந்தனத்தின் ஆன்மீக மற்றும் தத்துவப் பார்வைகளை அறிந்துகொள்வோம்.
          </p>
          <p className="text-sm italic text-brand-saffron/80 mt-2">
            "சந்தியா என்பது ஒரு நேரம் மட்டுமல்ல — நம்மை நாமே திரும்பிப் பார்க்கும் ஒரு வாய்ப்பு."
          </p>
        </div>
      </header>

      {/* ── Disclaimer ── */}
      <DisclaimerBanner />

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="சந்தியா ஞானத்தைத் தேடுங்கள்... (Tamil / English)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-brand-darkElevated border border-gray-200 dark:border-gray-800 rounded-full py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-saffron/40 transition-all shadow-sm"
        />
      </div>

      {/* ── Categories ── */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-brand-charcoal dark:bg-brand-saffron text-white shadow-sm'
                : 'bg-white dark:bg-brand-darkElevated text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50'
            }`}
          >
            {cat.emoji && <span className="text-xs">{cat.emoji}</span>}
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {/* ── Main Content ── */}
      {!isLoading && showStaticContent && (
        <div className="space-y-12">

          {/* Sandhya Times */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'சந்தியா நேரங்கள்') && <SandhyaTimesSection />}

          {/* Today's Reflection from Firestore */}
          {todaysReflection && (categoryId === 'அனைத்தும்' || categoryId === 'பொன்மொழிகள்') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪔</span>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">இன்று சிந்திக்க</h2>
              </div>
              <Card className="p-6 bg-[#FDFCF8] dark:bg-[#151514] border border-[#E9DFCF]/50 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute top-3 left-4 text-[#D8AD62]/15 font-serif text-7xl leading-none select-none">"</div>
                <div className="relative z-10 space-y-4">
                  <p className="text-lg font-medium text-brand-charcoal dark:text-gray-100 leading-relaxed">
                    {todaysReflection.contentTamil || todaysReflection.content}
                  </p>
                  {todaysReflection.author && (
                    <p className="text-sm text-brand-saffron font-semibold">— {todaysReflection.author}</p>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleSave(todaysReflection.id, savedWisdomIds.includes(todaysReflection.id))}
                      className={`p-2 rounded-full transition-colors ${savedWisdomIds.includes(todaysReflection.id) ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
                    >
                      <Heart size={18} fill={savedWisdomIds.includes(todaysReflection.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
              </Card>
            </section>
          )}

          {/* Quote Carousel */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'பொன்மொழிகள்') && <QuoteCarousel />}

          {/* What is Sandhyavandanam */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'தத்துவம்' || categoryId === 'பாரம்பரியம்') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌅</span>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">சந்தியாவந்தனம் என்றால் என்ன?</h2>
              </div>
              <Card className="p-6 space-y-5">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-brand-charcoal dark:text-gray-100">சந்தியாவந்தனம்</strong> என்பது வேத பாரம்பரியத்தில் தினசரி கடைப்பிடிக்கப்படும் ஒரு முக்கியமான நித்ய கர்மமாகக் கருதப்படுகிறது. "சந்தியா" என்பது <strong>இரு காலங்களின் சங்கமம்</strong> என்ற பொருளைக் கொண்டது.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { emoji: '🌄', title: 'பிராதஸ் சந்தியா', sub: 'சூரிய உதயம்' },
                    { emoji: '☀️', title: 'மாத்யாஹ்னிகம்', sub: 'மதிய நேரம்' },
                    { emoji: '🌆', title: 'சாயம் சந்தியா', sub: 'சூரிய அஸ்தமனம்' },
                  ].map(s => (
                    <div key={s.title} className="text-center p-3 bg-brand-saffron/5 rounded-xl space-y-1">
                      <span className="text-2xl">{s.emoji}</span>
                      <p className="text-xs font-semibold text-brand-charcoal dark:text-gray-200 leading-tight">{s.title}</p>
                      <p className="text-[10px] text-gray-500">{s.sub}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-2 border-brand-saffron/30 pl-4">
                  சந்தியாவந்தனம் என்பது வெறும் ஒரு சடங்கு மட்டுமல்லாமல், நாளின் முக்கியமான மாற்ற நேரங்களில் இறைநினைவு, சுயக்கட்டுப்பாடு, மந்திர ஜபம் மற்றும் ஆன்ம சிந்தனை ஆகியவற்றை ஒருங்கிணைக்கும் ஒரு பாரம்பரிய வழிபாட்டு முறையாகப் பார்க்கப்படுகிறது.
                </p>
              </Card>
            </section>
          )}

          {/* Purpose Grid */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'தத்துவம்' || categoryId === 'ஒழுக்கம்') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕉️</span>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">நோக்கம்</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PURPOSES.map(p => (
                  <Card key={p.title} className="p-4 space-y-2">
                    <span className="text-2xl">{p.emoji}</span>
                    <p className="font-semibold text-brand-charcoal dark:text-gray-100 text-sm">{p.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{p.desc}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Parts Timeline */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'பாரம்பரியம்') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">முக்கியமான பகுதிகள்</h2>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/30 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                கீழே கொடுக்கப்பட்டுள்ள பகுதிகளும் அவற்றின் வரிசையும் சம்பிரதாயத்திற்கு ஏற்ப மாறலாம்.
              </div>
              <div className="space-y-2">
                {PARTS.map((p, i) => (
                  <motion.div
                    key={p.num}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-saffron/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand-saffron">{p.num}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-charcoal dark:text-gray-100">{p.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{p.desc}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Gayatri Mantra */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'மந்திரங்கள்') && <GayatriSection />}

          {/* Firestore Mantras */}
          {filteredMantras.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-display font-bold border-b border-gray-100 dark:border-gray-800 pb-2">
                📿 மேலும் மந்திரங்கள்
              </h2>
              {filteredMantras.map(m => (
                <Card key={m.id} className="p-6 bg-[#FDFCF8] dark:bg-[#151514] border border-[#E9DFCF]/50 dark:border-gray-800">
                  <h3 className="text-xl font-display font-semibold text-brand-saffron mb-4">{m.titleTamil || m.title}</h3>
                  <p className="text-lg font-medium leading-loose text-center whitespace-pre-wrap">{m.originalText}</p>
                  {m.meaningTamil && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-semibold text-gray-500 mb-1">பொருள்:</p>
                      <p className="text-sm leading-relaxed">{m.meaningTamil}</p>
                    </div>
                  )}
                </Card>
              ))}
            </section>
          )}

          {/* Benefits */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'ஆன்மீக சிந்தனைகள்') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌞</span>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">பாரம்பரிய ஆன்மீகப் பார்வைகள்</h2>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/30 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                இவை பாரம்பரிய/ஆன்மீகக் கண்ணோட்டங்கள்; மருத்துவ ரீதியாக நிரூபிக்கப்பட்ட சிகிச்சைப் பயன்கள் அல்ல.
              </div>
              <div className="grid grid-cols-1 gap-3">
                {BENEFITS.map(b => (
                  <Card key={b.num} className="p-4 flex items-start gap-4">
                    <div className="text-2xl shrink-0">{b.emoji}</div>
                    <div>
                      <p className="font-semibold text-brand-charcoal dark:text-gray-100 text-sm">{b.num}. {b.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{b.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Philosophy */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'தத்துவம்') && (
            <section className="space-y-4">
              <Card className="p-6 bg-gradient-to-br from-[#1A1612] to-[#0D0C0A] text-white border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-saffron/10 to-transparent" />
                <div className="relative z-10 space-y-5">
                  <p className="text-xl font-display font-bold text-white/90 leading-relaxed">
                    "சந்தியா என்பது நேரம் மட்டுமல்ல; ஒரு நினைவூட்டல்."
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ['பகல்', 'இரவு'],
                      ['அறியாமை', 'அறிவு'],
                      ['அமைதியின்மை', 'அமைதி'],
                      ['வெளிப்புற வாழ்க்கை', 'உள்ளார்ந்த சிந்தனை'],
                    ].map(([a, b]) => (
                      <div key={a} className="flex items-center gap-2 text-white/70">
                        <span className="text-white/40">{a}</span>
                        <span className="text-brand-saffron">→</span>
                        <span className="text-white/90 font-medium">{b}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/80 italic leading-relaxed">
                      "நாள் மாறும் ஒவ்வொரு சந்தியிலும், நம்முள் ஒரு சிறிய மாற்றம் நிகழட்டும்."
                    </p>
                    <p className="text-brand-saffron/80 text-sm mt-2">— ஆன்மீக சிந்தனை</p>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* Tradition */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'பாரம்பரியம்') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <h2 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100">பாரம்பரியம்</h2>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'வேத பாரம்பரியம்', desc: 'சந்தியாவந்தனம் சம்பந்தப்பட்ட வேத பாரம்பரியங்களில் நித்ய கர்மமாகக் கருதப்படுகிறது. தலைமுறை தலைமுறையாக ஆசார்யரிடம் கற்றுக்கொள்ளப்பட்டு வருகிறது.' },
                  { title: 'குரு பரம்பரை', desc: 'சந்தியாவந்தனத்தின் முறையை தகுதியான ஆசார்யர் / குருவிடம் கற்றுக்கொள்வது முக்கியமானது. நேரடி கற்றல் மிகவும் பயனுள்ளது.' },
                  { title: 'சம்பிரதாய வேறுபாடுகள்', desc: 'வேத சாகைகள், கோத்திர/சூத்திர மரபுகள், குடும்ப சம்பிரதாயங்கள் மற்றும் பிராந்திய வழக்கங்களுக்கேற்ப முறை மாறுபடலாம். ஒரு வரிசை மட்டும் எல்லோருக்கும் பொருந்தாது.' },
                ].map(t => (
                  <Card key={t.title} className="p-5 space-y-2">
                    <p className="font-bold text-brand-charcoal dark:text-gray-100">{t.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.desc}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {(categoryId === 'அனைத்தும்' || categoryId === 'கேள்வி & பதில்') && <FAQSection />}

          {/* Firestore Wisdom Feed */}
          {filteredWisdom.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-display font-bold border-b border-gray-100 dark:border-gray-800 pb-2">🌟 ஞான தொகுப்பு</h2>
              {filteredWisdom.map(item => {
                if (item.id === todaysReflection?.id && categoryId === 'அனைத்தும்') return null;
                const isSaved = savedWisdomIds.includes(item.id);
                return (
                  <Card key={item.id} className="p-6 bg-[#FDFCF8] dark:bg-[#151514] border border-[#E9DFCF]/50 dark:border-gray-800 relative overflow-hidden group">
                    <div className="absolute top-3 left-4 text-[#D8AD62]/15 font-serif text-6xl leading-none select-none">"</div>
                    <div className="relative z-10 space-y-4 pt-3">
                      <p className="text-lg font-medium text-brand-charcoal dark:text-gray-100 leading-relaxed">
                        {item.contentTamil || item.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {item.author && <p className="text-sm font-semibold text-brand-saffron">— {item.author}</p>}
                          {item.tradition && <p className="text-xs text-gray-400 mt-0.5">மரபு: {item.tradition}</p>}
                        </div>
                        <button
                          onClick={() => toggleSave(item.id, isSaved)}
                          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-gray-400 bg-gray-50 dark:bg-gray-800'}`}
                        >
                          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
                  </Card>
                );
              })}
            </section>
          )}

          {/* Final Philosophy */}
          <section className="text-center py-8 space-y-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              நினைவு → நியமம் → பயிற்சி → புரிதல் → உள்ளார்ந்த வளர்ச்சி
            </p>
            <p className="text-brand-saffron font-display font-semibold">
              "திரும்பி வாருங்கள்."
            </p>
          </section>
        </div>
      )}

      {/* ── Search Results ── */}
      {!isLoading && !showStaticContent && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            "{searchQuery}" க்கான முடிவுகள்: {filteredWisdom.length + filteredMantras.length}
          </p>
          {filteredMantras.map(m => (
            <Card key={m.id} className="p-5">
              <p className="text-xs text-brand-saffron font-semibold uppercase tracking-wider mb-2">மந்திரம்</p>
              <p className="font-semibold">{m.titleTamil || m.title}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{m.originalText}</p>
            </Card>
          ))}
          {filteredWisdom.map(w => (
            <Card key={w.id} className="p-5">
              <p className="text-xs text-brand-saffron font-semibold uppercase tracking-wider mb-2">{w.category}</p>
              <p className="text-sm text-brand-charcoal dark:text-gray-100 line-clamp-3">{w.contentTamil || w.content}</p>
            </Card>
          ))}
          {filteredWisdom.length === 0 && filteredMantras.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">தேடலுக்கு முடிவுகள் இல்லை.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
