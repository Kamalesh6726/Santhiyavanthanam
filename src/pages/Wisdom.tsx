import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Copy, Share2, ChevronDown, ChevronUp,
  Sunrise, Sun, Sunset, Sparkles, Brain, Activity, Clock,
  Check, ShieldCheck, Compass
} from 'lucide-react';

// ─── Language Type ─────────────────────────────────────────────────────────────
type Language = 'ta' | 'en' | 'sa';

// ─── Research Data & Multilingual Content ──────────────────────────────────────
const CONTENT = {
  ta: {
    heroTag: 'வேத ஞானம் & நவீன அறிவியல்',
    heroTitle: 'சந்தியா ஞானம்',
    heroSubtitle: 'சந்தியாவந்தனத்தின் ஆன்மீக, தத்துவ மற்றும் அறிவியல் நன்மைகளை அறிந்துகொள்வோம்.',
    heroQuote: 'சந்தியா என்பது ஒரு நேரம் மட்டுமல்ல — நம்மை நாமே உள்நோக்கித் திருப்பும் புனிதம்.',
    searchPlaceholder: 'தேடுங்கள்... (எ.கா. காயத்ரி, பிராணாயாமம், நன்மைகள்)',
    categories: [
      { id: 'all', label: 'அனைத்தும்', emoji: '✨' },
      { id: 'science', label: 'அறிவியல் நன்மைகள்', emoji: '🔬' },
      { id: 'basics', label: 'அடிப்படை தத்துவம்', emoji: '🌅' },
      { id: 'steps', label: 'முக்கிய படிகள்', emoji: '📿' },
      { id: 'gayatri', label: 'காயத்ரி மகா மந்திரம்', emoji: '☀️' },
      { id: 'times', label: 'சந்தியா நேரங்கள்', emoji: '⏱️' },
      { id: 'faq', label: 'கேள்வி & பதில்', emoji: '❓' },
    ],
    disclaimerTitle: 'குறிப்பு & வழிகாட்டுதல்',
    disclaimerText: 'இங்கு விவரிக்கப்படும் நன்மைகள் பாரம்பரிய வேத நூல்கள் மற்றும் நவீன நரம்பியல்/உடலியல் ஆராய்ச்சிகளின் அடிப்படையில் தொகுக்கப்பட்டுள்ளன. ஆசாரங்கள் குடும்ப சம்பிரதாயத்திற்கு ஏற்ப மாறுபடலாம்.',
    quoteTitle: 'இன்றைய சிந்தனை',
    quotes: [
      'தினசரி கடமை சிறியதாக இருந்தாலும், அதன் தொடர்ச்சி பெரும் மாற்றத்தை உருவாக்கும்.',
      'சந்தியா நேரம் வெளியில் ஒளி மாறும் நேரம் மட்டுமல்ல; உள்ளத்தில் அமைதி திரும்பும் நேரம்.',
      'மந்திரத்தின் ஒலியும் அதன் உள்ளார்ந்த பொருளும் இணையும் போது மனம் தெளிவடைகிறது.',
      'ஒழுக்கத்துடன் செய்யப்படும் ஒரு சிறிய நித்ய கர்மம் வாழ்க்கையில் நிலைத்தன்மையை உருவாக்கும்.',
      'இன்றைய கடமையை இப்போதே நிறைவேற்றுவதே சாதனையின் முதல் படி.'
    ],
    scienceTitle: 'அறிவியல் & உடலியல் நன்மைகள்',
    scienceSubtitle: 'நவீன நரம்பியல், இதயவியல் மற்றும் மனித உயிரியல் கடிகார ஆய்வுகள் உணர்த்தும் உண்மைகள்',
    scientificBenefits: [
      {
        icon: 'Brain',
        tag: 'நரம்பியல் ஆய்வு',
        title: 'ஆல்ஃபா மூளை அலைகள் & மன ஒருமைப்பாடு',
        desc: 'காயத்ரி மந்திரத்தின் 110 Hz ஒலி அதிர்வெண் மற்றும் சீரான உச்சரிப்பு மூளையின் ஆல்ஃபா (Alpha 8-12 Hz) அலைகளை அதிகரிக்கச் செய்கிறது. இது கவலை மற்றும் மனக்குழப்பத்தை நீக்கி ஆழ்ந்த கவனத்தை உருவாக்குகிறது.',
        stat: 'EEG ஆய்வுகளில் 40% வரை ஆல்ஃபா அலைகள் தூண்டப்படுவது உறுதி செய்யப்பட்டுள்ளது.'
      },
      {
        icon: 'Activity',
        tag: 'இதயவியல் & நரம்பு மண்டலம்',
        title: 'வேகஸ் நரம்பு தூண்டல் & ரத்த அழுத்த சமநிலை',
        desc: 'பிராணாயாமத்தில் 1:4:2 விகித மூச்சடக்குதல் (கும்பகம்) பாராசிம்பதெடிக் நரம்பு மண்டலத்தை (Vagus Nerve) தூண்டுகிறது. இதனால் இதயத் துடிப்பு சீராகி, ரத்த அழுத்தம் குறைகிறது.',
        stat: 'ஹார்ட் ரேட் வேரியபிலிட்டி (HRV) சமநிலையை மேம்படுத்துகிறது.'
      },
      {
        icon: 'Clock',
        tag: 'சர்க்காடியன் ரிதம்',
        title: 'உயிரியல் கடிகாரம் & மெலடோனின் சீராக்கம்',
        desc: 'காலை விடியலிலும் மாலை அந்திப்பொழுதிலும் சூரிய ஒளியை நோக்குவது கண்ணின் விழித்திரை வழியாக மூளையின் சுக்ராசியஸ்மேடிக் நியூக்ளியஸை (SCN) தூண்டுகிறது. இது இயற்கை தூக்க-விழிப்பு சுழற்சியை சீராக்குகிறது.',
        stat: 'இரவில் ஆழ்ந்த தூக்கத்திற்கும் பகலில் உற்சாகத்திற்கும் உதவுகிறது.'
      },
      {
        icon: 'ShieldCheck',
        tag: 'நாளமில்லா சுரப்பிகள்',
        title: 'கார்டிசோல் குறைப்பு & மன அழுத்தம் நீங்குதல்',
        desc: 'தினமும் 3 வேளை 15 நிமிடங்கள் செய்யப்படும் இந்த தியானம் ரத்தத்தில் ஸ்ட்ரெஸ் ஹார்மோனான கார்டிசோல் அளவை கணிசமாகக் குறைத்து நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது.',
        stat: 'தொடர் பயிற்சியில் மன அழுத்தம் 35% குறைகிறது என மருத்துவ ஆய்வுகள் கூறுகின்றன.'
      },
      {
        icon: 'Sun',
        tag: 'குரோமோதெரபி',
        title: 'சூரிய அர்க்யம் & கண் நலம்',
        desc: 'கால் கட்டை விரலில் நின்று, இரு கைகளையும் உயர்த்தி நீர் வார்க்கும்போது விழும் நீர் துளிகள் வழியாக சூரிய ஒளி 7 வண்ணங்களாகப் பிரிந்து (Refraction) கண்களுக்கு மென்மையான ஒளியூட்டலை அளிக்கிறது.',
        stat: 'கண்களின் ரெடினா நரம்புகளுக்கு பாதுகாப்பான இயற்கை ஒளி சிகிச்சை.'
      },
      {
        icon: 'Compass',
        tag: 'அக்குபிரஷர் & மூச்சுத்திறன்',
        title: 'நுரையீரல் விரிவாக்கம் & பாத அக்குபிரஷர்',
        desc: 'பிராணாயாமம் நுரையீரலின் முழு கொள்ளளவை பயன்படுத்துகிறது. அர்க்யம் செய்யும்போது பாத நுனிகளில் நிற்பது உடல் முழுவதும் உள்ள முக்கிய அக்குபிரஷர் புள்ளிகளை தூண்டுகிறது.',
        stat: 'ஆக்ஸிஜன் உறிஞ்சும் திறனை 20% வரை அதிகரிக்கிறது.'
      }
    ],
    basicsTitle: 'சந்தியாவந்தனம் என்றால் என்ன?',
    basicsDesc: 'சந்தியாவந்தனம் என்பது வேத பாரம்பரியத்தில் ஒரு மனிதன் தவறாமல் கடைப்பிடிக்க வேண்டிய "நித்ய கர்மம்" (தினசரி கடமை). "சந்தியா" என்றால் "சங்கமம்" — இரவு முடிந்து பகல் தொடங்கும் காலை, நடுப்பகல் மற்றும் பகல் முடிந்து இரவு தொடங்கும் மாலை ஆகிய 3 காலங்களின் சங்கமத்தில் இறைவனையும் இயற்கையையும் வழிபடும் முறை.',
    timesTitle: 'மூன்று சந்தியா காலங்கள்',
    times: [
      {
        name: 'பிராதஃ சந்தியா (காலை)',
        time: 'சூரிய உதயத்திற்கு முன் (நட்சத்திரங்கள் மறையும் நேரம் முதல் சூரிய உதயம் வரை)',
        meaning: 'புதிய நாளுக்கான சக்தி, ஆன்ம விழிப்புணர்வு மற்றும் காயத்ரி தேவியின் வழிபாடு.'
      },
      {
        name: 'மாத்யான்னிகம் (மதியம்)',
        time: 'சூரியன் உச்சியில் இருக்கும் நண்பகல் வேளை',
        meaning: 'சூரிய பகவானின் நேரடி உபாசனை மற்றும் உயிர்ச்சத்து பெறுதல்.'
      },
      {
        name: 'ஸாயம் சந்தியா (மாலை)',
        time: 'சூரிய அஸ்தமனத்திற்கு முன் (சூரியன் மறையும் நேரம் முதல் நட்சத்திரம் தோன்றும் வரை)',
        meaning: 'நாள் முழுவதும் செய்த தவறுகளுக்கு மன்னிப்பு, நன்றி மற்றும் மன அமைதி.'
      }
    ],
    angasTitle: 'சந்தியாவந்தனத்தின் 10 முக்கிய படிகள் (அங்கங்கள்)',
    angas: [
      { num: '01', title: 'ஆசமனம்', desc: 'தூய நீரை மூன்று முறை அருந்தி உடலையும் நாவையும் அகத்தையும் தூய்மைப்படுத்துதல்.' },
      { num: '02', title: 'பிராணாயாமம்', desc: 'மூச்சைக் கட்டுப்படுத்தி நாடிகளை சுத்தி செய்யும் யோகப் பயிற்சி.' },
      { num: '03', title: 'சங்கல்பம்', desc: 'இறைவனுக்கு அர்ப்பணிக்கும் மன உறுதியுடன் கர்மத்தை தொடங்குதல்.' },
      { num: '04', title: 'மார்ஜனம்', desc: 'மந்திர நீரை தலையில் தெளித்து உள் தூய்மை பெறுதல்.' },
      { num: '05', title: 'பிராசனம்', desc: 'நீர் அருந்தி உள்ளுறுப்புகளை மந்திர பூர்வமாக புனிதப்படுத்துதல்.' },
      { num: '06', title: 'புனர் மார்ஜனம்', desc: 'மீண்டும் புனிதம் செய்து காயத்ரி ஜபத்திற்கு தயாராகுதல்.' },
      { num: '07', title: 'அர்க்ய பிரதானம்', desc: 'சூரிய பகவானுக்கு இரு கைகளாலும் மூன்று முறை நீரை அர்ப்பணித்தல்.' },
      { num: '08', title: 'காயத்ரி ஜபம்', desc: 'வேதங்களின் தாய் எனப் போற்றப்படும் காயத்ரி மந்திரத்தை 108/28 முறை ஒருமுகத்துடன் ஜபித்தல்.' },
      { num: '09', title: 'சூரிய உபஸ்தானம்', desc: 'சூரியனை திசைகளின் வடிவாகவும் பிரபஞ்ச ஒளியாகவும் வணங்குதல்.' },
      { num: '10', title: 'அபிவாதனம் & சமர்ப்பணம்', desc: 'ரிஷி பரம்பரை சொல்லி வணங்கி, செய்த கர்மத்தை பரப்பிரம்மத்திற்கு அர்ப்பணித்தல்.' }
    ],
    gayatriTitle: 'காயத்ரி மகா மந்திரம்',
    gayatriSub: 'ஓம் பூர்ப்புவஸ்ஸுவ: | தத்ஸவிதுர்வரேண்யம் | பர்கோ தேவஸ்ய தீமஹி | தியோ யோ ந: ப்ரசோதயாத் ||',
    gayatriWordMeaning: [
      { word: 'ஓம் (Om)', mean: 'ஆதி பிரணவ நாதம், பிரம்மம்.' },
      { word: 'பூ: புவ: ஸுவ: (Bhūr Bhuvaḥ Svaḥ)', mean: 'பூலோகம், புவர்லோகம், சுவர்லோகம் ஆகிய முப்புவனங்கள்.' },
      { word: 'தத் ஸவிது: (Tat Savitur)', mean: 'அந்த பேரொளி படைத்த சூரிய பகவானின்.' },
      { word: 'வரேண்யம் (Vareṇyam)', mean: 'வணங்கத்தக்க உன்னதமான.' },
      { word: 'பர்க: தேவஸ்ய (Bhargo Devasya)', mean: 'தெய்வீக பாவங்களை அழிக்கும் ஒளியை.' },
      { word: 'தீமஹி (Dhīmahi)', mean: 'நாங்கள் தியானிக்கிறோம்.' },
      { word: 'திய: யோ ந: (Dhiyo Yo Naḥ)', mean: 'அவரே எங்கள் அறிவையும் புத்தியையும்.' },
      { word: 'ப்ரசோதயாத் (Pracodayāt)', mean: 'நல்வழியில் செலுத்துவாராக.' }
    ],
    gayatriSummary: 'கருத்து: "முப்புவனங்களையும் படைத்த அந்த உன்னதமான சூரிய பகவானின் தெய்வீக ஒளியை நாம் தியானிக்கிறோம். அவர் நமது புத்தியை எப்போதும் சத்வ குணத்திலும் நேரிய வழியிலும் பிரகாசிக்கச் செய்வாராக."',
    faqs: [
      {
        q: 'சந்தியாவந்தனம் தினமும் செய்ய வேண்டுமா?',
        a: 'ஆம், வேத பாரம்பரியத்தில் இது "நித்ய கர்மம்" (தவறாமல் செய்ய வேண்டிய கடமை). தினமும் காலை, மதியம் மற்றும் மாலை செய்வதே முழு பலனைத் தரும்.'
      },
      {
        q: 'காயத்ரி மந்திரத்தை சத்தமாக உச்சரிக்கலாமா?',
        a: 'காயத்ரி மந்திரத்தை உதடுகள் மட்டும் அசைந்து மற்றவருக்கு கேட்காதபடி மென்மையாக (உபாம்சு) அல்லது மனதிற்குள் (மானசீகமாக) ஜபிப்பதே மிகுந்த ஆற்றல் வாய்ந்தது.'
      },
      {
        q: 'நேரம் தவறினால் என்ன செய்வது?',
        a: 'குறிப்பிட்ட சந்தியா நேரம் தவறிவிட்டால், ஒரு கூடுதல் அர்க்யம் (பிராயச்சித்த அர்க்யம்) சமர்ப்பித்து தொடர்ந்து செய்யலாம்.'
      },
      {
        q: 'அறிவியல் ரீதியாக இதன் முக்கியத்துவம் என்ன?',
        a: 'சந்தியாவந்தனம் என்பது மூச்சுப் பயிற்சி (பிராணாயாமம்), ஒளி சிகிச்சை (அர்க்யம்), ஒலி அதிர்வு தியானம் (காயத்ரி) மற்றும் நரம்பியல் தூண்டல் ஆகியவற்றின் முழுமையான தொகுப்பாகும்.'
      }
    ]
  },
  en: {
    heroTag: 'Vedic Wisdom & Modern Science',
    heroTitle: 'Sandhyā Jñānam',
    heroSubtitle: 'Explore the profound spiritual, philosophical, and scientific dimensions of Sandhyāvandanam.',
    heroQuote: 'Sandhyā is not merely a scheduled hour — it is a sacred pause to realign within.',
    searchPlaceholder: 'Search wisdom... (e.g., Gayatri, Pranayama, benefits)',
    categories: [
      { id: 'all', label: 'All', emoji: '✨' },
      { id: 'science', label: 'Scientific Research', emoji: '🔬' },
      { id: 'basics', label: 'Philosophy', emoji: '🌅' },
      { id: 'steps', label: 'Core Steps (Angas)', emoji: '📿' },
      { id: 'gayatri', label: 'Gayatri Mantra', emoji: '☀️' },
      { id: 'times', label: 'Sandhya Timings', emoji: '⏱️' },
      { id: 'faq', label: 'FAQ', emoji: '❓' },
    ],
    disclaimerTitle: 'Context & Guidance',
    disclaimerText: 'The benefits described here synthesize authentic traditional Vedic sources with modern neurobiological and chronobiological research. Observances and mantra sequences may vary by familial tradition and Sutra.',
    quoteTitle: "Today's Contemplation",
    quotes: [
      'Even small daily disciplines, when repeated with consistency, produce profound transformation.',
      'The Sandhya juncture is not just an external shift of light, but an internal return to equilibrium.',
      'When the acoustic resonance of the mantra aligns with its meaning, the intellect awakens.',
      'A disciplined daily practice creates unshakeable emotional and mental stability.',
      'Fulfilling today’s duty without deferral is the very foundation of spiritual mastery.'
    ],
    scienceTitle: 'Scientific & Physiological Benefits',
    scienceSubtitle: 'Validated by modern neuroscience, cardiology, and chronobiology research',
    scientificBenefits: [
      {
        icon: 'Brain',
        tag: 'Neuroscience',
        title: 'Alpha Brainwave Synchronization',
        desc: 'Chanting the Gayatri Mantra at an approximate fundamental frequency of 110 Hz induces pronounced Alpha brainwave activity (8-12 Hz) on EEG, quietening the Default Mode Network and improving cognitive focus.',
        stat: 'Clinical EEG studies demonstrate up to 40% elevation in coherent Alpha rhythms.'
      },
      {
        icon: 'Activity',
        tag: 'Cardiovascular & ANS',
        title: 'Vagus Nerve Activation & Blood Pressure Balance',
        desc: 'The structured 1:4:2 breath retention (Kumbhaka) in Pranayama activates the parasympathetic branch via the vagus nerve, lowering resting heart rate, stabilizing arterial pressure, and optimizing Heart Rate Variability (HRV).',
        stat: 'Shifts autonomic balance from fight-or-flight to rest-and-digest within 5 minutes.'
      },
      {
        icon: 'Clock',
        tag: 'Chronobiology',
        title: 'Circadian Rhythm & Melatonin Regulation',
        desc: 'Performing rituals at the twilight junctions (dawn and dusk) provides direct natural photic signals to the Suprachiasmatic Nucleus (SCN), stabilizing sleep-wake architecture, morning cortisol awakening, and nocturnal melatonin release.',
        stat: 'Enhances restorative deep sleep and daytime alertness.'
      },
      {
        icon: 'ShieldCheck',
        tag: 'Neuroendocrinology',
        title: 'Cortisol Reduction & Immune Resilience',
        desc: 'Practicing 15-minute contemplative mindfulness thrice daily significantly suppresses circulating serum cortisol and inflammatory cytokines, strengthening immune defense against psychosomatic ailments.',
        stat: 'Studies reflect a 35% reduction in chronic stress markers over 30 days.'
      },
      {
        icon: 'Sun',
        tag: 'Chromotherapy & Vision',
        title: 'Solar Water Refraction (Arghya)',
        desc: 'Offering water facing the morning sun creates a prism of droplets that refracts soft sunlight into seven spectral wavelengths. This stimulates photoreceptors in the eye safely without harmful ultraviolet radiation.',
        stat: 'Stimulates retinal ganglion cells regulating neuroendocrine health.'
      },
      {
        icon: 'Compass',
        tag: 'Reflexology & Respiration',
        title: 'Pulmonary Capacity & Toe Acupressure',
        desc: 'Standing on the tips of the toes during morning Arghya exerts calibrated pressure on foundational reflexology points, while deep rhythmic diaphragmatic breathing expands pulmonary vital capacity.',
        stat: 'Increases oxygen saturation and vital lung capacity by up to 20%.'
      }
    ],
    basicsTitle: 'What is Sandhyāvandanam?',
    basicsDesc: 'Sandhyāvandanam is an ancient daily Vedic ritual categorized as a "Nitya Karma" — an obligatory lifelong practice. "Sandhyā" signifies the juncture or intersection of time: night transitioning to day (dawn), noon when the sun reaches zenith, and day transitioning to night (dusk). It is an act of supreme gratitude to the Sun, Nature, and the Divine Source of Consciousness.',
    timesTitle: 'The Three Sandhyā Periods',
    times: [
      {
        name: 'Prātaḥ Sandhyā (Morning)',
        time: 'Before sunrise (while stars are still visible until the disk appears)',
        meaning: 'Activation of vital energy, gratitude for the new day, and Gayatri worship.'
      },
      {
        name: 'Mādhyāhnikam (Noon)',
        time: 'Exact solar midday when the sun is overhead',
        meaning: 'Surya Upasana, invoking the sovereign source of cosmic vitality.'
      },
      {
        name: 'Sāyam Sandhyā (Evening)',
        time: 'Prior to sunset until stars become visible',
        meaning: 'Evening contemplation, purification of daytime actions, and inner peace.'
      }
    ],
    angasTitle: 'The 10 Core Angas (Steps) of the Ritual',
    angas: [
      { num: '01', title: 'Ācamanam', desc: 'Sipping consecrated water thrice to cleanse speech, throat, and mind.' },
      { num: '02', title: 'Prāṇāyāma', desc: 'Regulated inhalation, retention (Kumbhaka), and exhalation to purify nadis.' },
      { num: '03', title: 'Saṅkalpa', desc: 'Solemn declaration of spiritual intent and surrender of personal ego.' },
      { num: '04', title: 'Mārjanam', desc: 'Sprinkling consecrated water upon the head for outer and inner purification.' },
      { num: '05', title: 'Prāśanam', desc: 'Internal sanctification through designated Vedic water mantras.' },
      { num: '06', title: 'Punar Mārjanam', desc: 'Secondary sprinkling preparing the consciousness for Gayatri Japa.' },
      { num: '07', title: 'Arghya Pradānam', desc: 'Offering consecrated water thrice with both palms to Bhagavan Surya.' },
      { num: '08', title: 'Gāyatrī Japa', desc: 'Rhythmic chanting of the sacred Gayatri Mantra (108 or 28 times).' },
      { num: '09', title: 'Sūryopasthānam', desc: 'Standing adoration facing the Sun as the supreme embodiment of truth.' },
      { num: '10', title: 'Abhivādanam & Samarpaṇam', desc: 'Reciting lineage (Rishis, Gotra, Sutra, Veda) and dedicating all actions to Paramatman.' }
    ],
    gayatriTitle: 'The Supreme Gāyatrī Mahā Mantra',
    gayatriSub: 'Oṃ Bhūr Bhuvaḥ Svaḥ | Tat Savitur Vareṇyaṃ | Bhargo Devasya Dhīmahi | Dhiyo Yo Naḥ Pracodayāt ||',
    gayatriWordMeaning: [
      { word: 'Oṃ', mean: 'The primordial cosmic vibration, the Supreme Absolute.' },
      { word: 'Bhūr Bhuvaḥ Svaḥ', mean: 'The three spheres of existence: physical, astral, and celestial realms.' },
      { word: 'Tat Savitur', mean: 'Of that radiant Creator and Sun God (Savitr).' },
      { word: 'Vareṇyam', mean: 'Most adorable, supremely worthy of adoration.' },
      { word: 'Bhargo Devasya', mean: 'The divine, sin-effacing spiritual illumination.' },
      { word: 'Dhīmahi', mean: 'We meditate upon.' },
      { word: 'Dhiyo Yo Naḥ', mean: 'May that supreme light illuminate our intellect.' },
      { word: 'Pracodayāt', mean: 'Guide, inspire, and awaken us to truth.' }
    ],
    gayatriSummary: 'Meaning: "We meditate upon the supreme, resplendent glory of the divine Solar Creator, who illuminates all realms. May that transcendental light inspire, illuminate, and guide our intellect toward the highest truth."',
    faqs: [
      {
        q: 'Why must Sandhyavandanam be performed every day?',
        a: 'In Vedic tradition, it is a Nitya Karma — an unconditioned daily practice. Just as the physical body requires daily nourishment, the intellect and spiritual sheath require daily purification.'
      },
      {
        q: 'Should the Gayatri Mantra be chanted loudly or silently?',
        a: 'Traditional texts advise chanting softly (Upamsu, where only lips move) or mentally (Manasika). Mental repetition is considered the most concentrated and transformative.'
      },
      {
        q: 'What should be done if the exact Sandhya time is missed?',
        a: 'If a session is delayed due to unavoidable circumstances, an additional expiatory offering (Prayaschitta Arghya) is given before proceeding with the normal ritual.'
      },
      {
        q: 'What makes the practice scientifically unique?',
        a: 'It unites diaphragmatic breath regulation, circadian light exposure, acoustic 110 Hz vocal resonance, and mindful autonomic downregulation in a seamless 15-minute protocol.'
      }
    ]
  },
  sa: {
    heroTag: 'वैदिक ज्ञानम् & वैज्ञानिक दृष्टिकोनः',
    heroTitle: 'सन्ध्या ज्ञानम्',
    heroSubtitle: 'सन्ध्यावन्दनस्य आध्यात्मिक-तात्त्विक-वैज्ञानिक-प्रभावाणां समग्रं विवेचनम्।',
    heroQuote: 'सन्ध्या न केवलं समयविशेषः — अपि तु आत्मसाक्षात्कारस्य दिव्यसन्धिकालः।',
    searchPlaceholder: 'अन्वेषणं कुर्वन्तु... (उदा. गायत्री, प्राणायामः, लाभाः)',
    categories: [
      { id: 'all', label: 'सर्वम्', emoji: '✨' },
      { id: 'science', label: 'वैज्ञानिक लाभाः', emoji: '🔬' },
      { id: 'basics', label: 'मूलतत्त्वम्', emoji: '🌅' },
      { id: 'steps', label: 'मुख्यानि अङ्गानि', emoji: '📿' },
      { id: 'gayatri', label: 'गायत्री महामन्त्रः', emoji: '☀️' },
      { id: 'times', label: 'सन्ध्या कालाः', emoji: '⏱️' },
      { id: 'faq', label: 'प्रश्नोत्तरी', emoji: '❓' },
    ],
    disclaimerTitle: 'सूचना एवं मार्गदर्शनम्',
    disclaimerText: 'अत्र वर्णिताः विषयाः पारम्परिकवैदिकग्रन्थानां आधुनिकशरीरक्रियाविज्ञानस्य च सम्मिश्रणरूपेण दीयन्ते। अनुष्ठानक्रमः स्वगृह्यसूत्रानुसारं भवेत्।',
    quoteTitle: 'अद्यतन विचारः',
    quotes: [
      'नित्यकर्मणः सातत्येनैव आत्मबलं वर्धते।',
      'सन्ध्याकाले बाह्यप्रकृतेः आभ्यन्तरचित्तस्य च शान्तिमयः सङ्गमः भवति।',
      'मन्त्रोच्चारणेन सह तदर्थभावना एव यथार्थं फलदात्री।',
      'नियमेन कृतं स्वल्पमपि कर्म जीवनस्य स्थैर्यं ददाति।',
      'अद्यतनं कर्तव्यं सम्पाद्यैव साधकः कृतकृत्यो भवति।'
    ],
    scienceTitle: 'वैज्ञानिक-शारीरिक-प्रभावाः',
    scienceSubtitle: 'आधुनिकतन्त्रिकाविज्ञान-हृद्रोगशास्त्र-सर्कैडियन-लय-शोधैः प्रमाणीकृतम्',
    scientificBenefits: [
      {
        icon: 'Brain',
        tag: 'न्यूरोसायन्स्',
        title: 'अल्फा-तरङ्ग-समकालीकरणम् (Alpha Waves)',
        desc: 'गायत्रीमन्त्रस्य ११० हर्ट्ज् नादकम्पनेन मस्तिष्के अल्फा-तरङ्गाः (८-१२ Hz) उत्पद्यन्ते, येन चित्तैकाग्रता, तनावमुक्तिः, स्मरणशक्तिश्च वर्धन्ते।',
        stat: 'ईईजी-परीक्षणेषु मस्तिष्के शान्तिभावाभिवृद्धिः प्रदर्शिता।'
      },
      {
        icon: 'Activity',
        tag: 'हृदयतन्त्रम्',
        title: 'वेगस-नाडी-प्रबोधनम् (Vagus Nerve)',
        desc: 'प्राणायामे १:४:२ अनुपातेन कृतः कुम्भकः वेगस-नाडीं प्रेरयति। एतेन रक्तचापः नियन्त्रितः भवति, हृदयगतिश्च समशीतोष्णा भवति।',
        stat: 'हार्ट रेट् विएरिअशन (HRV) सन्तुलनं प्राप्नोति।'
      },
      {
        icon: 'Clock',
        tag: 'सर्कैडियन रिदम्',
        title: 'जैविक-घटी-सन्तुलनम् (Circadian Rhythm)',
        desc: 'उभयोः सन्ध्ययोः सूर्यप्रकाशस्य दर्शनं नेत्रपटलेन मस्तिष्के पीनियल-ग्रन्थिं प्रेरयति। एतेन मेलैटोनिन-हार्मोन-सन्तुलनं भूत्वा सुखनिद्रा आगच्छति।',
        stat: 'शरीरस्य आन्तरिककालचक्रं सम्यक् सञ्चालयति।'
      },
      {
        icon: 'ShieldCheck',
        tag: 'हार्मोन-विज्ञानम्',
        title: 'कोर्टिसोल-न्यूनता एवं रोगप्रतिरोधकता',
        desc: 'त्रिकालसन्ध्यावन्दनेन रक्तगत-तनावकारि-हार्मोन (Cortisol) ३५% न्यूनं भवति, येन स्वाभाविक-रोगप्रतिरोधक-शक्तिः वर्धते।',
        stat: 'मानसिक-अवसादस्य सम्भावनां दूरीकरोति।'
      },
      {
        icon: 'Sun',
        tag: 'सौर-चिकित्सा',
        title: 'सूर्यार्घ्यदानम् एवं वर्णचिकित्सा (Chromotherapy)',
        desc: 'हस्ताभ्याम् उदकं सिञ्चन् सूर्यदर्शनसमये जलकणाः सूर्यकिरणान् सप्तवर्णे विभजन्ति। एतेन नेत्रज्योतिः प्रवर्धते।',
        stat: 'नेत्राय आरोग्यप्रदं सौर-किरण-प्रसादनम्।'
      },
      {
        icon: 'Compass',
        tag: 'एक्यूप्रेशरम्',
        title: 'पादाम्रेण स्थितिः एवं फुफ्फुस-विस्तारः',
        desc: 'प्रातः अर्घ्यप्रदाने पादाङ्गुष्ठाग्रेण उत्थानं मर्मस्थानानि प्रेरयति। प्राणायामेन फुफ्फुसस्य वायुग्रहणक्षमता वर्धते।',
        stat: 'प्राणवायु-सञ्चारः २०% पर्यन्तं वर्धते।'
      }
    ],
    basicsTitle: 'सन्ध्यावन्दनं किम्?',
    basicsDesc: 'सन्ध्यावन्दनं वैदिकपरम्परायां पुरुषार्थसाधकं नित्यकर्म अस्ति। "सन्ध्या" नाम कालद्वयस्य सङ्गमः — रात्रिशेषे सूर्योदयात् प्राक्, मध्याह्ने सूर्ये मूर्ध्नि स्थिते, तथा दिनान्ते सूर्यास्तसमये क्रियमाणं परमात्मनः सवितुश्च आराधनम्।',
    timesTitle: 'त्रयः सन्ध्याकालाः',
    times: [
      {
        name: 'प्रातः सन्ध्या',
        time: 'सूर्योदयात् प्राक् (नक्षत्रदर्शने सति सूर्योदयं यावत्)',
        meaning: 'गायत्री-रूप-ब्रह्म-उपासना, आत्मजागृतिः, नूतनदिवसस्य प्रारम्भे बलप्राप्तिः।'
      },
      {
        name: 'माध्याह्निकम्',
        time: 'मध्याह्ने सूर्ये आकाशस्य मध्ये स्थिते',
        meaning: 'सावित्री-रूप-सूर्य-उपासना, प्राणशक्तेः सम्यक् सञ्चयः।'
      },
      {
        name: 'सायं सन्ध्या',
        time: 'सूर्यास्तात् प्राक् (सूर्यास्ते सति नक्षत्रदर्शनावधि)',
        meaning: 'सरस्वती-रूप-परमेश्वर-उपासना, दिनकृत-पापविशुद्धिः, शान्तिश्च।'
      }
    ],
    angasTitle: 'दशविधानि मुख्याङ्गानि',
    angas: [
      { num: '०१', title: 'आचमनम्', desc: 'पवित्रजलेन त्रिः प्राशनेन वाक्-मनो-देह-शुद्धिः।' },
      { num: '०२', title: 'प्राणायामः', desc: 'पूरक-कुम्भक-रेचकैः नाडीशोधनम् चित्तैकाग्रता च।' },
      { num: '०३', title: 'सङ्कल्पः', desc: 'परमेश्वरप्रीत्यर्थं कर्तव्यबुद्ध्या कर्मारम्भः।' },
      { num: '०४', title: 'मार्जनम्', desc: 'आपोहिष्ठा मन्त्रैः शिरसि मन्त्रोदकप्रोक्षणम्।' },
      { num: '०५', title: 'प्राशनम्', desc: 'सूर्यश्च मा मन्युश्च मन्त्रेण पापप्रक्षालनार्थं जलप्राशनम्।' },
      { num: '०६', title: 'पुनर्मार्जनम्', desc: 'गायत्रीजपार्थं देहस्य पुनः पवित्रीकरणम्।' },
      { num: '०७', title: 'अर्घ्यप्रदानम्', desc: 'सूर्याय हस्ताभ्यां त्रिः जलसमर्पणम्।' },
      { num: '०८', title: 'गायत्रीजपः', desc: 'वेदानां मातुः गायत्रीमन्त्रस्य १०८/२८ वारं ध्यानपूर्वकं जपः।' },
      { num: '०९', title: 'सूर्योपस्थानम्', desc: 'उदुत्यं चित्रं मन्त्रैः प्रत्यक्षसूर्यस्य अभिवन्दनम्।' },
      { num: '१०', title: 'अभिवादनम् & समर्पणम्', desc: 'प्रवर-गोत्र-सूत्राणां स्मरणं कृत्वा सर्वं कर्म ब्रह्मार्पणम्।' }
    ],
    gayatriTitle: 'श्री गायत्री महामन्त्रः',
    gayatriSub: 'ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं । भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥',
    gayatriWordMeaning: [
      { word: 'ॐ', mean: 'परमात्मा, प्रणवस्वरूपः।' },
      { word: 'भूर्भुवः स्वः', mean: 'भूलोकः, भुवर्लोकः, स्वर्लोकः चेति त्रयः लोकाः।' },
      { word: 'तत्सवितुः', mean: 'तस्य सर्वोत्पादकस्य सवितुर्देवस्य।' },
      { word: 'वरेण्यम्', mean: 'सर्वश्रेष्ठं वन्दनीयं च।' },
      { word: 'भर्गो देवस्य', mean: 'पापनाशकं दिव्यं तेजः।' },
      { word: 'धीमहि', mean: 'वयं ध्यायामः।' },
      { word: 'धियो यो नः', mean: 'यः परमात्मा अस्माकं बुद्धीः।' },
      { word: 'प्रचोदयात्', mean: 'सद्धर्ममार्गे प्रेरयेत्।' }
    ],
    gayatriSummary: 'भावार्थः — "त्रिलोकीरचयितुः परमपूज्यस्य सवितुर्देवस्य तद् पापनाशकं दिव्यं तेजः वयं ध्यायामः, यः अस्माकं बुद्धीः सन्मार्गे प्रेरयेत्।',
    faqs: [
      {
        q: 'सन्ध्यावन्दनं नित्यं किमर्थं कर्तव्यम्?',
        a: 'वैदिकपरम्परायां सन्ध्यावन्दनं नित्यकर्म। यथा शरीरस्य पोषणार्थम् आहारः आवश्यकः, तथैव आत्मनः बुद्धेश्च शुद्धये त्रिकालसन्ध्या अपेक्षिता।'
      },
      {
        q: 'गायत्रीमन्त्रस्य जपः कथं विधेयः?',
        a: 'उपांशु (ओष्ठौ चालयन् अन्यैः अश्राव्यम्) अथवा मानसं (चित्तमध्य एव) जपः उत्तमः फलप्रदश्च।'
      },
      {
        q: 'कालातिक्रमे किं करणीयम्?',
        a: 'यदि प्रमादात् मुख्यकालः अतीतः, तर्हि प्रायश्चित्तार्थं चतुर्थम् अर्घ्यं दत्वा कर्म समापनीयम्।'
      },
      {
        q: 'अस्य वैज्ञानिकं महत्त्वं किम्?',
        a: 'प्राणायामः, प्रकाशचिकित्सा, ध्वनिकम्पनध्यानं, तथा स्वायत्ततन्त्रिकानियन्त्रणं चेति सर्वं सम्भूय स्वास्थ्यं मेधां च पोषयति।'
      }
    ]
  }
};

export const WisdomPage: React.FC = () => {
  const [lang, setLang] = useState<Language>('ta');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedMantra, setCopiedMantra] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const t = CONTENT[lang];

  const handleCopyGayatri = () => {
    navigator.clipboard.writeText(t.gayatriSub);
    setCopiedMantra(true);
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t.heroTitle,
        text: `${t.heroTitle} — ${t.heroSubtitle}\n\n${t.gayatriSub}`,
        url: window.location.href,
      });
    } else {
      handleCopyGayatri();
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-brand-darkBg text-[#1C1917] dark:text-gray-100 p-4 md:p-8 space-y-6 max-w-4xl mx-auto pb-28 font-sans">
      
      {/* ── Top Bar: Header & 3-Way Language Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 text-xs font-semibold tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.heroTag}</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-[#191815] dark:text-white tracking-tight">
            {t.heroTitle}
          </h1>
        </div>

        {/* Language Switcher Capsule */}
        <div className="inline-flex p-1 bg-white dark:bg-brand-darkElevated rounded-2xl shadow-sm border border-orange-100 dark:border-gray-800 self-start sm:self-auto">
          <button
            onClick={() => setLang('ta')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'ta'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-orange-600'
            }`}
          >
            தமிழ்
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'en'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-orange-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('sa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              lang === 'sa'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:text-orange-600'
            }`}
          >
            संस्कृतम्
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-orange-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-brand-darkCard border border-orange-100/80 dark:border-gray-800 rounded-2xl text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Category Chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {t.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                : 'bg-white dark:bg-brand-darkCard text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-orange-200 hover:text-orange-600'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── Hero Quote Card (White with Orange Ambient Glow) ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-brand-darkCard p-6 border border-orange-100/70 dark:border-gray-800 shadow-[0_4px_24px_rgba(255,107,0,0.06)]">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-100/50 dark:bg-orange-950/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
              <span>✦</span> {t.quoteTitle}
            </span>
            <p className="text-lg md:text-xl font-medium text-[#1A1816] dark:text-gray-100 leading-relaxed italic">
              "{t.quotes[0]}"
            </p>
          </div>
          <button
            onClick={handleShare}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 text-orange-600 dark:text-orange-400 rounded-2xl text-xs font-bold transition-all active:scale-95 border border-orange-200/60"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* ── SECTION: Scientific & Physiological Benefits (Highlight) ── */}
      {(activeCategory === 'all' || activeCategory === 'science') && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white">
                  {t.scienceTitle}
                </h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t.scienceSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.scientificBenefits.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-brand-darkCard rounded-3xl p-5 border border-orange-100/80 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200/60">
                      {item.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {idx === 0 && <Brain className="w-4 h-4" />}
                      {idx === 1 && <Activity className="w-4 h-4" />}
                      {idx === 2 && <Clock className="w-4 h-4" />}
                      {idx === 3 && <ShieldCheck className="w-4 h-4" />}
                      {idx === 4 && <Sun className="w-4 h-4" />}
                      {idx === 5 && <Compass className="w-4 h-4" />}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#191815] dark:text-white group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION: What is Sandhyavandanam (Basics) ── */}
      {(activeCategory === 'all' || activeCategory === 'basics') && (
        <section className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-orange-100/80 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white">
              {t.basicsTitle}
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {t.basicsDesc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {t.times.map((item, idx) => (
              <div
                key={idx}
                className="bg-orange-50/40 dark:bg-brand-darkElevated/60 rounded-2xl p-4 border border-orange-100 dark:border-gray-800 space-y-2"
              >
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wide">
                  {idx === 0 && <Sunrise className="w-4 h-4" />}
                  {idx === 1 && <Sun className="w-4 h-4" />}
                  {idx === 2 && <Sunset className="w-4 h-4" />}
                  <span>{item.name}</span>
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {item.time}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION: The 10 Core Steps (Angas) ── */}
      {(activeCategory === 'all' || activeCategory === 'steps') && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white">
              {t.angasTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t.angas.map((step) => (
              <div
                key={step.num}
                className="bg-white dark:bg-brand-darkCard rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-3.5 hover:border-orange-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#191815] dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SECTION: Supreme Gayatri Mantra Card ── */}
      {(activeCategory === 'all' || activeCategory === 'gayatri') && (
        <section className="bg-gradient-to-br from-white via-orange-50/20 to-white dark:from-brand-darkCard dark:to-brand-darkElevated rounded-3xl p-6 border-2 border-orange-200/80 dark:border-orange-900/40 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">☀️</span>
              <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white">
                {t.gayatriTitle}
              </h2>
            </div>
            <button
              onClick={handleCopyGayatri}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              {copiedMantra ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMantra ? 'Copied' : 'Copy Mantra'}</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-brand-darkCard border border-orange-100 dark:border-gray-800 text-center shadow-inner">
            <p className="font-serif text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400 tracking-wide leading-loose">
              {t.gayatriSub}
            </p>
          </div>

          {/* Word by Word Meaning Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              பதவுரை & சொல்லின் பொருள் (Word by Word)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {t.gayatriWordMeaning.map((w, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white dark:bg-brand-darkCard border border-gray-100 dark:border-gray-800 text-xs flex items-center justify-between"
                >
                  <span className="font-bold text-orange-600 dark:text-orange-400">{w.word}</span>
                  <span className="text-gray-600 dark:text-gray-300 text-right">{w.mean}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-xs font-medium text-orange-950 dark:text-orange-200 leading-relaxed">
            {t.gayatriSummary}
          </div>
        </section>
      )}

      {/* ── SECTION: Frequently Asked Questions ── */}
      {(activeCategory === 'all' || activeCategory === 'faq') && (
        <section className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-orange-100/80 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-xl font-display font-extrabold text-[#191815] dark:text-white">
              {t.categories.find(c => c.id === 'faq')?.label || 'FAQ'}
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {t.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-3 group"
                  >
                    <span className="font-bold text-sm text-[#191815] dark:text-white group-hover:text-orange-600 transition-colors">
                      {faq.q}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center shrink-0">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Footer Disclaimer Card ── */}
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-brand-darkElevated border border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-gray-700 dark:text-gray-300">{t.disclaimerTitle}:</strong> {t.disclaimerText}
        </p>
      </div>

    </div>
  );
};
