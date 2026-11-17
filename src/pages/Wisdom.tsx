import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, Sparkles, ShieldCheck,
  ExternalLink, ChevronLeft, ChevronRight, Layers,
  FileText, Shuffle
} from 'lucide-react';

// ─── Language Type ─────────────────────────────────────────────────────────────
type Language = 'ta' | 'en' | 'sa';

// ─── Flashcards Data across 3 Languages ─────────────────────────────────────────
const FLASHCARDS = {
  ta: [
    {
      id: 1,
      tag: '01 • அறிமுகம்',
      title: 'சந்தியாவந்தனம் என்றால் என்ன?',
      subtitle: 'வேத மரபில் நித்ய கர்மா',
      icon: '🌅',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            <strong>சந்தியாவந்தனம்</strong> என்பது வேத மரபில் தவறாமல் கடைப்பிடிக்கப்படும் ஒரு <strong>நித்ய கர்மா</strong> (தினசரி கடமை). "சந்தியா" என்பது பகலும் இரவும் சந்திக்கும் புனிதம் வாய்ந்த காலத்தைக் குறிக்கிறது.
          </p>
          <div className="bg-orange-50/70 dark:bg-orange-950/30 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/40 space-y-2">
            <p className="font-bold text-xs uppercase tracking-wider text-orange-600">மூன்று முக்கிய அனுஷ்டான நேரங்கள்:</p>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
              <li>• <strong>1. பிராத சந்தியா</strong> – காலை விடியல் (சூரிய உதயத்திற்கு முன்).</li>
              <li>• <strong>2. மாத்யானிகம்</strong> – நண்பகல் (சூரியன் உச்சியில் இருக்கும் வேளை).</li>
              <li>• <strong>3. சாயம் சந்தியா</strong> – மாலை அந்திப்பொழுது (சூரிய அஸ்தமனம்).</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            இது சூரிய உபாசனை, காயத்ரி ஜபம், பிராணாயாமம் மற்றும் வேத மந்திரங்களை ஒருங்கிணைத்த முழுமையான ஆன்மீகப் பயிற்சியாகும்.
          </p>
        </div>
      )
    },
    {
      id: 2,
      tag: '02 • ஆன்மீகம்',
      title: 'சந்தியாவந்தனத்தின் ஆன்மீக நன்மைகள்',
      subtitle: 'மனத்தூய்மை & ஆன்ம ஒழுக்கம்',
      icon: '🪔',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">1. ஆன்மீக ஒழுக்கம்</span>
            <p className="text-gray-600 dark:text-gray-300">தினமும் குறிப்பிட்ட நேரத்தில் இறைவனை வழிபடுவதன் மூலம் வாழ்க்கையில் ஒழுக்கமும் நிலைத்தன்மையும் வளர்கிறது.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">2. காயத்ரி உபாசனை</span>
            <p className="text-gray-600 dark:text-gray-300">காயத்ரி மந்திரம் அறிவு, தெளிவு மற்றும் நல்வழிச் சிந்தனைக்காகப் பிரார்த்திக்கும் உச்சகட்ட வேத மந்திரமாகும்.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">3. மன ஒருமைப்பாடு</span>
            <p className="text-gray-600 dark:text-gray-300">மந்திர ஜபம் மற்றும் தியானத்தில் மனதை ஒருமுகப்படுத்தும் அபாரமான பயிற்சி கிடைக்கிறது.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">4. வேத மரபைப் பாதுகாத்தல்</span>
            <p className="text-gray-600 dark:text-gray-300">தலைமுறை தலைமுறையாகக் கடத்தப்பட்டு வரும் வேத அனுஷ்டானத்தைத் தொடர்ந்து பாதுகாக்க உதவுகிறது.</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: '03 • அறிவியல் பார்வைகள்',
      title: 'அறிவியல் பார்வையில் சாத்தியமான நன்மைகள்',
      subtitle: 'நவீன உடலியல் & நரம்பியல்',
      icon: '🔬',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">A. மன அழுத்த மேலாண்மை</strong>
              <p className="text-gray-600 dark:text-gray-300">மந்திர தியானம் மன அழுத்தம், கார்டிசோல் மற்றும் பதற்றத்தை நிர்வகிக்க உதவுவது ஆய்வுகளில் காணப்படுகிறது.</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">B. மூச்சுக் கட்டுப்பாடு</strong>
              <p className="text-gray-600 dark:text-gray-300">பிராணாயாமம் போன்ற கட்டுப்படுத்தப்பட்ட மூச்சுப் பயிற்சிகள் வேகஸ் நரம்பை தூண்டி உடலின் ஓய்வு நிலையைத் தூண்டுகிறது.</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">C. கவனிக்கும் திறன்</strong>
              <p className="text-gray-600 dark:text-gray-300">மந்திர ஜபம் மற்றும் தியானப் பயிற்சிகள் மூளையின் ஆல்ஃபா அலைகளைத் தூண்டி கவனத்தை ஒருமுகப்படுத்துகிறது.</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">D. தினசரி வாழ்க்கை ஒழுக்கம்</strong>
              <p className="text-gray-600 dark:text-gray-300">குறிப்பிட்ட அந்தி வேளைகளில் அனுஷ்டானம் செய்வது சர்க்காடியன் உயிரியல் கடிகாரத்தை ஒழுங்குபடுத்துகிறது.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
            <strong>அறிவியல் குறிப்பு:</strong> மேற்கண்ட நன்மைகள் மந்திர தியானம் மற்றும் மூச்சுப் பயிற்சி ஆய்வுகளிலிருந்து பெறப்பட்டவை. முழுமையான மருத்துவ சிகிச்சையாகக் கருதக்கூடாது.
          </div>
        </div>
      )
    },
    {
      id: 4,
      tag: '04 • அனுஷ்டானம்',
      title: 'சந்தியாவந்தனத்தின் முக்கிய அங்கங்கள்',
      subtitle: 'அனுஷ்டானமும் அதன் பாரம்பரிய முக்கியத்துவமும்',
      icon: '📿',
      content: (
        <div className="overflow-hidden rounded-2xl border border-orange-100 dark:border-gray-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold border-b border-orange-100">
              <tr>
                <th className="py-2.5 px-3">அனுஷ்டானம்</th>
                <th className="py-2.5 px-3">பாரம்பரிய முக்கியத்துவம்</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-darkCard">
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">ஆச்சமனம்</td>
                <td className="py-2.5 px-3">உள்ளத் தூய்மை மற்றும் அகச்சுத்தம்.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">பிராணாயாமம்</td>
                <td className="py-2.5 px-3">மூச்சு மற்றும் மன ஒருமைப்பாடு.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">சங்கல்பம்</td>
                <td className="py-2.5 px-3">அனுஷ்டான நோக்கத்தை உறுதிப்படுத்துதல்.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">அர்க்யப் பிரதானம்</td>
                <td className="py-2.5 px-3">சூரிய தேவனுக்கு நீர் சமர்ப்பித்தல்.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">காயத்ரி ஜபம்</td>
                <td className="py-2.5 px-3">அறிவொளி மற்றும் மேதைமைக்கான பிரார்த்தனை.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">உபஸ்தானம்</td>
                <td className="py-2.5 px-3">பிரபஞ்ச ஒளியான சூரிய தேவனை வணங்குதல்.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 5,
      tag: '05 • மகா மந்திரம்',
      title: 'காயத்ரி மந்திரம் & பொருள்',
      subtitle: 'வேதங்களின் தாய் எனப் போற்றப்படும் மந்திரம்',
      icon: '☀️',
      content: (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 font-serif text-base sm:text-lg font-bold text-orange-700 dark:text-orange-400 leading-loose">
            ஓம் பூர் புவஸ் ஸுவஹ: <br />
            தத் ஸவிதுர் வரேண்யம் <br />
            பர்கோ தேவஸ்ய தீமஹி <br />
            தியோ யோ நஹ் ப்ரசோதயாத் ||
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-gray-100 text-xs text-left space-y-1">
            <span className="font-bold text-orange-600 block">பொருள்:</span>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              "அந்த தெய்வீகமான உன்னத சூரிய ஒளியை நாம் தியானிக்கிறோம். அந்த ஒளி நமது அறிவையும் சிந்தனையையும் எப்போதும் நல்வழியில் செலுத்தட்டும்."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      tag: '06 • அறிவியல் ஆய்வுகள்',
      title: 'அறிவியல் ஆராய்ச்சி ஆதாரங்கள் (PubMed & Journals)',
      subtitle: 'நவீன மருத்துவ இதழ்களில் வெளியிடப்பட்ட ஆய்வுகள்',
      icon: '📑',
      content: (
        <div className="space-y-2.5 text-xs">
          <p className="text-gray-600 dark:text-gray-400">
            மந்திர தியானம் மற்றும் அதன் நரம்பியல் செயல்பாடுகளைப் புரிந்துகொள்ள உதவும் முக்கிய ஆய்வுகள்:
          </p>
          <div className="space-y-2">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/35329068/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">1. Mantra-Based Meditation and Mental Health (2022)</span>
                <span className="text-[11px] text-gray-500">National Library of Medicine • PubMed: 35329068</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href="https://pubmed.ncbi.nlm.nih.gov/36329765/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">2. Mantra Meditation and Health Benefits (2022)</span>
                <span className="text-[11px] text-gray-500">Systematic Review • PubMed: 36329765</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href="https://psvmkendra.com/index.php/journal/article/view/2020"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">3. Gayatri Mantra Chanting and Sustained Attention (2025)</span>
                <span className="text-[11px] text-gray-500">Cognitive Neuro-Psychological Research</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            *ஆராய்ச்சி வெளிப்படைத்தன்மை: இந்த ஆய்வுகள் மந்திர தியானத்தின் பலன்களை விளக்குகின்றன. ஒவ்வொரு ஆய்வையும் அதன் முறைக்கேற்ப தனித்தனியாக மதிப்பிட வேண்டும்.
          </p>
        </div>
      )
    },
    {
      id: 7,
      tag: '07 • லட்சியம்',
      title: 'இறுதிச் சிந்தனை & சங்கல்பம்',
      subtitle: 'மரபையும் அறிவியலையும் இணைக்கும் பாலம்',
      icon: '🌟',
      content: (
        <div className="space-y-4 text-center py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
            சந்தியாவந்தனம் என்பது வேத மரபில் ஆன்மீக ஒழுக்கத்தையும் இறை வழிபாட்டையும் ஒருங்கிணைக்கும் ஒரு உன்னதமான அனுஷ்டானமாகும்.
          </p>
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-orange-200" />
            <h4 className="text-base font-extrabold font-display">
              "வேத ஞானத்தைப் பாதுகாப்போம். உண்மையான அறிவைப் பகிர்வோம்."
            </h4>
            <p className="text-xs text-orange-100">
              பாரம்பரிய நோக்கத்தைப் புரிந்துகொள்வதோடு, அதில் இடம்பெறும் மூச்சுப் பயிற்சி மற்றும் மந்திர தியானம் தொடர்பான அறிவியல் ஆய்வுகளையும் உணர்ந்து அனுஷ்டிப்போம்.
            </p>
          </div>
        </div>
      )
    }
  ],
  en: [
    {
      id: 1,
      tag: '01 • Overview',
      title: 'What is Sandhyāvandanam?',
      subtitle: 'The Daily Vedic Nitya Karma',
      icon: '🌅',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            <strong>Sandhyāvandanam</strong> is a foundational <strong>Nitya Karma</strong> (obligatory daily duty) in the Vedic tradition. "Sandhyā" denotes the sacred intersection or juncture of day and night.
          </p>
          <div className="bg-orange-50/70 dark:bg-orange-950/30 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/40 space-y-2">
            <p className="font-bold text-xs uppercase tracking-wider text-orange-600">The Three Daily Sandhyā Sessions:</p>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
              <li>• <strong>1. Prātaḥ Sandhyā</strong> – Dawn (before sunrise, as stars fade).</li>
              <li>• <strong>2. Mādhyāhnikam</strong> – Solar Noon (when the sun is at its zenith).</li>
              <li>• <strong>3. Sāyam Sandhyā</strong> – Dusk (sunset transitioning to night).</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            It integrates solar adoration, Gayatri Japa, Pranayama breath control, and Vedic cleansing rituals.
          </p>
        </div>
      )
    },
    {
      id: 2,
      tag: '02 • Spirituality',
      title: 'Spiritual Dimensions & Benefits',
      subtitle: 'Inner purity and sacred continuity',
      icon: '🪔',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">1. Spiritual Discipline</span>
            <p className="text-gray-600 dark:text-gray-300">Daily practice at designated hours establishes unwavering rhythm, discipline, and emotional stability.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">2. Gayatri Upasana</span>
            <p className="text-gray-600 dark:text-gray-300">The Gayatri Mantra is the pinnacle prayer for intellect awakening, clarity of thought, and righteous living.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">3. Mental Concentration</span>
            <p className="text-gray-600 dark:text-gray-300">Rhythmic chanting and pranic breath control quiet internal mental chatter and sharpen focus.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">4. Vedic Heritage Preservation</span>
            <p className="text-gray-600 dark:text-gray-300">Safeguards uninterrupted millenia-old ancestral knowledge and sacred oral traditions.</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: '03 • Science',
      title: 'Scientific & Physiological Insights',
      subtitle: 'Modern medicine and neuroscience perspectives',
      icon: '🔬',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">A. Stress Management</strong>
              <p className="text-gray-600 dark:text-gray-300">Mantra repetition downregulates sympathetic stress responses and reduces circulating cortisol.</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">B. Breath Regulation</strong>
              <p className="text-gray-600 dark:text-gray-300">Pranayama stimulates the parasympathetic Vagus nerve, lowering blood pressure and stabilizing heart rate.</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">C. Sustained Attention</strong>
              <p className="text-gray-600 dark:text-gray-300">Gayatri acoustic vibrations produce EEG Alpha waves (8-12 Hz) associated with deep alert focus.</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">D. Circadian Alignment</strong>
              <p className="text-gray-600 dark:text-gray-300">Timing at solar junctures harmonizes the SCN biological clock, improving natural sleep cycles.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
            <strong>Scientific Notice:</strong> Insights are synthesized from clinical research on meditation and breathwork. It should not be regarded as medical advice.
          </div>
        </div>
      )
    },
    {
      id: 4,
      tag: '04 • The Angas',
      title: 'Core Ritual Angas (Steps)',
      subtitle: 'The 6 primary pillars of the practice',
      icon: '📿',
      content: (
        <div className="overflow-hidden rounded-2xl border border-orange-100 dark:border-gray-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold border-b border-orange-100">
              <tr>
                <th className="py-2.5 px-3">Ritual Step</th>
                <th className="py-2.5 px-3">Traditional Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-darkCard">
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">Ācamanam</td>
                <td className="py-2.5 px-3">Sipping consecrated water for internal and speech purification.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">Prāṇāyāma</td>
                <td className="py-2.5 px-3">Controlled breath retention for mental and psychic equilibrium.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">Saṅkalpa</td>
                <td className="py-2.5 px-3">Solemn reaffirmation of spiritual purpose and divine surrender.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">Arghya Pradānam</td>
                <td className="py-2.5 px-3">Offering water oblations facing the solar deity.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">Gāyatrī Japa</td>
                <td className="py-2.5 px-3">Sacred meditative repetition for intellectual enlightenment.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">Upasthānam</td>
                <td className="py-2.5 px-3">Standing adoration to Surya Bhagavan as the cosmic light.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 5,
      tag: '05 • Supreme Mantra',
      title: 'The Gāyatrī Mahā Mantra',
      subtitle: 'Mother of all Vedic revelations',
      icon: '☀️',
      content: (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 font-serif text-base sm:text-lg font-bold text-orange-700 dark:text-orange-400 leading-loose">
            Oṃ Bhūr Bhuvaḥ Svaḥ <br />
            Tat Savitur Vareṇyaṃ <br />
            Bhargo Devasya Dhīmahi <br />
            Dhiyo Yo Naḥ Pracodayāt ||
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-gray-100 text-xs text-left space-y-1">
            <span className="font-bold text-orange-600 block">Meaning:</span>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              "We meditate on the transcendental glory of the Supreme Sun Creator. May that divine illumination inspire, guide, and illuminate our intellect toward righteousness."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      tag: '06 • Research',
      title: 'Scientific Research Evidence',
      subtitle: 'PubMed-indexed clinical papers',
      icon: '📑',
      content: (
        <div className="space-y-2.5 text-xs">
          <p className="text-gray-600 dark:text-gray-400">
            Peer-reviewed clinical studies evaluating mantra meditation and cognitive focus:
          </p>
          <div className="space-y-2">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/35329068/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">1. Mantra-Based Meditation & Mental Health (2022)</span>
                <span className="text-[11px] text-gray-500">National Library of Medicine • PubMed: 35329068</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href="https://pubmed.ncbi.nlm.nih.gov/36329765/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">2. Mantra Meditation & Health Benefits (2022)</span>
                <span className="text-[11px] text-gray-500">Systematic Review • PubMed: 36329765</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href="https://psvmkendra.com/index.php/journal/article/view/2020"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">3. Gayatri Mantra Chanting & Sustained Attention (2025)</span>
                <span className="text-[11px] text-gray-500">Cognitive Neuro-Psychological Research</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            *Research Transparency: These studies evaluate mantra meditation principles. Each study methodology should be evaluated independently.
          </p>
        </div>
      )
    },
    {
      id: 7,
      tag: '07 • Resolution',
      title: 'Final Contemplation & Resolve',
      subtitle: 'Bridging heritage and scientific understanding',
      icon: '🌟',
      content: (
        <div className="space-y-4 text-center py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
            Sandhyāvandanam is an extraordinary Vedic practice uniting sacred devotion with daily lifestyle discipline.
          </p>
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-orange-200" />
            <h4 className="text-base font-extrabold font-display">
              "Preserve Vedic Wisdom. Share Authentic Knowledge."
            </h4>
            <p className="text-xs text-orange-100">
              Let us embrace both its spiritual purpose and its scientifically studied breathwork and cognitive meditation.
            </p>
          </div>
        </div>
      )
    }
  ],
  sa: [
    {
      id: 1,
      tag: '०१ • स्वरूपम्',
      title: 'सन्ध्यावन्दनं किम्?',
      subtitle: 'वैदिकपरम्परायां नित्यकर्म',
      icon: '🌅',
      content: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            <strong>सन्ध्यावन्दनम्</strong> वैदिकपरम्परायां पुरुषार्थसाधकं <strong>नित्यकर्म</strong> अस्ति। "सन्ध्या" नाम कालद्वयस्य सङ्गमः — अहर्निशयोः सन्धिकालः।
          </p>
          <div className="bg-orange-50/70 dark:bg-orange-950/30 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/40 space-y-2">
            <p className="font-bold text-xs uppercase tracking-wider text-orange-600">त्रयः मुख्याः सन्ध्याकालाः:</p>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
              <li>• <strong>१. प्रातः सन्ध्या</strong> – सूर्योदयात् प्राक्।</li>
              <li>• <strong>२. माध्याह्निकम्</strong> – मध्याह्ने आकाशमध्ये सूर्ये स्थिते।</li>
              <li>• <strong>३. सायं सन्ध्या</strong> – सूर्यास्तसमये।</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            अत्र सूर्योपासना, गायत्रीजपः, प्राणायामः, वेदमन्त्राश्च सम्भूय अनुष्ठीयन्ते।
          </p>
        </div>
      )
    },
    {
      id: 2,
      tag: '०२ • आध्यात्मिकम्',
      title: 'सन्ध्यावन्दनस्य आध्यात्मिक लाभाः',
      subtitle: 'चित्तशुद्धिः एवं धर्मसंरक्षणम्',
      icon: '🪔',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">१. आध्यात्मिक नियमः</span>
            <p className="text-gray-600 dark:text-gray-300">नियतकाले ईश्वराराधनेन जीवने स्थैर्यं नियमश्च संवर्धते।</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">२. गायत्री उपासना</span>
            <p className="text-gray-600 dark:text-gray-300">गायत्रीमन्त्रः मेधायाः बुद्धेश्च सन्मार्गप्रेरणाय सर्वोच्चः वैदिकमन्त्रः।</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">३. चित्तैकाग्रता</span>
            <p className="text-gray-600 dark:text-gray-300">जपेन ध्यानेन च मनसः चाञ्चल्यं शाम्यति, एकाग्रता च सिध्यति।</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 shadow-sm space-y-1">
            <span className="font-extrabold text-orange-600">४. वेदपरम्परा-रक्षणम्</span>
            <p className="text-gray-600 dark:text-gray-300">ऋषिपरम्परायाः अक्षुण्णं रक्षणं पोषणं च भवति।</p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      tag: '०३ • विज्ञानम्',
      title: 'वैज्ञानिक-दृष्ट्या सम्भाविताः लाभाः',
      subtitle: 'तन्त्रिकाविज्ञानम् एवं शरीरक्रियाशास्त्रम्',
      icon: '🔬',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">A. तनाव-नियमनम् (Stress)</strong>
              <p className="text-gray-600 dark:text-gray-300">मन्त्रध्यानेन कोर्टिसोल-हार्मोन न्यूनं भवति, तनावश्च शाम्यति।</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">B. श्वासनियन्त्रणम्</strong>
              <p className="text-gray-600 dark:text-gray-300">प्राणायामेन वेगस-नाडी (Vagus nerve) प्रेरिता भूत्वा रक्तचापः समः भवति।</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">C. अवधान-शक्तिः (Attention)</strong>
              <p className="text-gray-600 dark:text-gray-300">ध्वनिकम्पनेन मस्तिष्के अल्फा-तरङ्गाः जायन्ते येन एकाग्रता वर्धते।</p>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
              <strong className="text-orange-700 dark:text-orange-400 block mb-0.5">D. दिनचर्या-नियमः</strong>
              <p className="text-gray-600 dark:text-gray-300">सन्ध्याकाले अनुष्ठानेन शरीरस्य जैविक-घटिका सन्तुलिता भवति।</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
            <strong>वैज्ञानिक-टिप्पणी:</strong> एते लाभाः प्राणायाम-मन्त्रध्यान-शोधैः प्राप्ताः। नैतद् सम्पूर्णं चिकित्सारूपम्।
          </div>
        </div>
      )
    },
    {
      id: 4,
      tag: '०४ • मुख्याङ्गानि',
      title: 'सन्ध्यावन्दनस्य मुख्याङ्गानि',
      subtitle: 'अनुष्ठानक्रमः तन्महत्त्वं च',
      icon: '📿',
      content: (
        <div className="overflow-hidden rounded-2xl border border-orange-100 dark:border-gray-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 font-bold border-b border-orange-100">
              <tr>
                <th className="py-2.5 px-3">अनुष्ठानम्</th>
                <th className="py-2.5 px-3">पारम्परिक महत्त्वम्</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-brand-darkCard">
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">आचमनम्</td>
                <td className="py-2.5 px-3">अन्तःकरणशुद्धिः देहशुद्धिश्च।</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">प्राणायामः</td>
                <td className="py-2.5 px-3">प्राणसंयमः चित्तैकाग्रता च।</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">सङ्कल्पः</td>
                <td className="py-2.5 px-3">कर्तव्यनिश्चयः ईश्वरार्पणबुद्धिश्च।</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">अर्घ्यप्रदानम्</td>
                <td className="py-2.5 px-3">सूर्याय जलसमर्पणम्।</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">गायत्रीजपः</td>
                <td className="py-2.5 px-3">बुद्धिप्रेरणाय परमात्मनः ध्यानम्।</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-orange-600">उपस्थानम्</td>
                <td className="py-2.5 px-3">प्रत्यक्षदेवस्य सूर्यस्य अभिवन्दनम्।</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      id: 5,
      tag: '०५ • महामन्त्रः',
      title: 'श्री गायत्री महामन्त्रः',
      subtitle: 'वेदानां जननी मन्त्रराजः',
      icon: '☀️',
      content: (
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/80 font-serif text-base sm:text-lg font-bold text-orange-700 dark:text-orange-400 leading-loose">
            ॐ भूर्भुवः स्वः । <br />
            तत्सवितुर्वरेण्यं । <br />
            भर्गो देवस्य धीमहि । <br />
            धियो यो नः प्रचोदयात् ॥
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-darkElevated border border-gray-100 text-xs text-left space-y-1">
            <span className="font-bold text-orange-600 block">भावार्थः:</span>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              "वयं तस्य सवितुर्देवस्य श्रेष्ठं पापनाशकं दिव्यं तेजः ध्यायामः, यः अस्माकं बुद्धीः सन्मार्गे प्रेरयेत्।"
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      tag: '०६ • शोधाः',
      title: 'वैज्ञानिक-अनुसन्धान-प्रमाणानि (PubMed)',
      subtitle: 'शोधपत्रिकाप्रकाशितानि प्रमाणानि',
      icon: '📑',
      content: (
        <div className="space-y-2.5 text-xs">
          <p className="text-gray-600 dark:text-gray-400">
            मन्त्रध्यानस्य शारीरिक-मानसिक-प्रभावानां शोधप्रमाणानि:
          </p>
          <div className="space-y-2">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/35329068/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">1. Mantra-Based Meditation and Mental Health (2022)</span>
                <span className="text-[11px] text-gray-500">PubMed: 35329068</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href="https://pubmed.ncbi.nlm.nih.gov/36329765/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">2. Mantra Meditation and Health Benefits (2022)</span>
                <span className="text-[11px] text-gray-500">PubMed: 36329765</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <a
              href="https://psvmkendra.com/index.php/journal/article/view/2020"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-brand-darkElevated border border-orange-100 dark:border-gray-800 hover:border-orange-300 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="font-bold text-orange-600 block">3. Gayatri Mantra Chanting and Sustained Attention (2025)</span>
                <span className="text-[11px] text-gray-500">Neuro-Psychological Journal</span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            *शोधपारदर्शिता: एते शोधाः मन्त्रध्यानप्रभावानां विश्लेषणं कुर्वन्ति।
          </p>
        </div>
      )
    },
    {
      id: 7,
      tag: '०७ • संकल्पः',
      title: 'अन्तिम-विचारः & सङ्कल्पः',
      subtitle: 'परम्परा-विज्ञानयोः समन्वयः',
      icon: '🌟',
      content: (
        <div className="space-y-4 text-center py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
            सन्ध्यावन्दनं नाम वैदिकपरम्परायां आध्यात्मिकनियमस्य ईश्वरोपासनायाश्च परमं समन्वयम्।
          </p>
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-orange-200" />
            <h4 className="text-base font-extrabold font-display">
              "वेदज्ञानं संरक्षामः । सत्यं ज्ञानं प्रसारयामः ॥"
            </h4>
            <p className="text-xs text-orange-100">
              पारम्परिकं प्रयोजनं ज्ञात्वा, प्राणायाम-मन्त्रध्यान-सम्बन्धितान् वैज्ञानिक-लाभांश्च अवबुध्य नित्यं समनुष्ठातव्यम्।
            </p>
          </div>
        </div>
      )
    }
  ]
};

export const WisdomPage: React.FC = () => {
  const [lang, setLang] = useState<Language>('ta');
  const [viewMode, setViewMode] = useState<'flashcards' | 'full'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const cards = FLASHCARDS[lang];
  const currentCard = cards[currentCardIndex];

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentCardIndex(randomIndex);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentCard.title,
        text: `SANDHYĀ — ${currentCard.title}: ${currentCard.subtitle}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-brand-darkBg text-[#1C1917] dark:text-gray-100 p-4 md:p-8 space-y-6 max-w-xl mx-auto pb-28 font-sans">
      
      {/* ── Top Bar: Title & 3-Way Language Switcher ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold uppercase tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>சந்தியா ஞானம் • Wisdom</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold text-[#191815] dark:text-white tracking-tight">
            சந்தியா ஞானம்
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ஆன்மீக அறிவும் அறிவியல் உண்மைகளும்
          </p>
        </div>

        {/* Language Capsule */}
        <div className="inline-flex p-1 bg-white dark:bg-brand-darkElevated rounded-2xl shadow-sm border border-orange-100">
          {(['ta', 'en', 'sa'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                lang === l
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30'
                  : 'text-gray-500 hover:text-orange-600'
              }`}
            >
              {l === 'ta' ? 'தமிழ்' : l === 'en' ? 'EN' : 'संस्कृतम्'}
            </button>
          ))}
        </div>
      </div>

      {/* ── View Mode Switcher Capsule (Flashcards vs Full View) ── */}
      <div className="flex items-center justify-between p-1 bg-white dark:bg-brand-darkCard rounded-2xl border border-orange-100 dark:border-gray-800 shadow-sm">
        <button
          onClick={() => setViewMode('flashcards')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'flashcards'
              ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
              : 'text-gray-500 hover:text-orange-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>கற்றல் அட்டைகள் (Flashcards)</span>
        </button>
        <button
          onClick={() => setViewMode('full')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'full'
              ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
              : 'text-gray-500 hover:text-orange-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>முழுப் பார்வை (Full View)</span>
        </button>
      </div>

      {/* ── MODE 1: INTERACTIVE FLASHCARDS ── */}
      {viewMode === 'flashcards' && (
        <div className="space-y-4">
          
          {/* Card Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5 text-orange-600">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              அட்டை {currentCardIndex + 1} / {cards.length}
            </span>
            <div className="flex gap-1">
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setCurrentCardIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentCardIndex === i
                      ? 'bg-orange-500 w-6'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-orange-200'
                  }`}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Flashcard Component */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 sm:p-7 border-2 border-orange-100/90 dark:border-gray-800 shadow-[0_10px_35px_rgba(255,107,0,0.06)] space-y-5 min-h-[380px] flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
                    {currentCard.tag}
                  </span>
                  <span className="text-2xl">{currentCard.icon}</span>
                </div>

                <div>
                  <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white leading-snug">
                    {currentCard.title}
                  </h2>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
                    {currentCard.subtitle}
                  </p>
                </div>

                {/* Main Card Content */}
                <div className="pt-1">
                  {currentCard.content}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleShuffle}
                    className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-xs font-bold flex items-center gap-1"
                    title="Shuffle"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-brand-darkElevated text-gray-600 hover:text-orange-600 transition-colors text-xs font-bold flex items-center gap-1"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Navigation Pill Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-orange-100 active:scale-95 transition-all"
                    aria-label="Previous Card"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                  >
                    <span>அடுத்தது</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Jump Grid of All Cards */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2">
            {cards.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setCurrentCardIndex(idx)}
                className={`py-2 px-1.5 rounded-2xl text-[11px] font-bold text-center border transition-all ${
                  currentCardIndex === idx
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/25'
                    : 'bg-white dark:bg-brand-darkCard text-gray-600 border-gray-100 hover:border-orange-200'
                }`}
              >
                <div className="text-base mb-0.5">{c.icon}</div>
                <span className="truncate block">0{c.id}</span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* ── MODE 2: COMPLETE LIST VIEW ── */}
      {viewMode === 'full' && (
        <div className="space-y-6 animate-fade-in">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-orange-100/80 dark:border-gray-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60">
                  {card.tag}
                </span>
                <span className="text-xl">{card.icon}</span>
              </div>

              <div>
                <h3 className="text-lg font-display font-extrabold text-[#191815] dark:text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-orange-600 font-semibold">
                  {card.subtitle}
                </p>
              </div>

              <div>
                {card.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom Research Transparency Footer ── */}
      <div className="p-4 rounded-3xl bg-white dark:bg-brand-darkCard border border-orange-100 dark:border-gray-800 shadow-sm text-xs text-gray-500 space-y-1.5">
        <div className="flex items-center gap-1.5 text-orange-600 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>ஆராய்ச்சி வெளிப்படைத்தன்மை & மரபு</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          சந்தியாவந்தனம் என்பது ஆன்மீக ஒழுக்கம், பிராணாயாம மூச்சுப்பயிற்சி மற்றும் காயத்ரி தியானத்தை ஒருங்கிணைக்கும் புனித வேத அனுஷ்டானமாகும்.
        </p>
      </div>

    </div>
  );
};
