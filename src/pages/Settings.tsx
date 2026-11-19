import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useUserData } from '../hooks/useFirebaseData';
import { logOut } from '../lib/firebase';
import {
  Bell, Moon, Sun, LogOut, Check, Smartphone, Download
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersSaved, setRemindersSaved] = useState(false);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setRemindersSaved(true);
    setTimeout(() => setRemindersSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 pb-28 font-sans">
      
      {/* ── Page Header ── */}
      <header className="px-1">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#191815] tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          அமைப்புகள் & விருப்பத்தேர்வுகள்
        </p>
      </header>

      {/* ── Account Summary Card ── */}
      <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-[0_10px_35px_rgba(255,107,0,0.06)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center text-xl font-bold font-display shadow-md shadow-orange-500/25 shrink-0">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-display font-extrabold text-[#191815] truncate">
              {userData?.name || 'சாதகர்'}
            </h2>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {currentUser?.email}
            </p>
            <span className="inline-block text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/80 mt-1">
              Active Member
            </span>
          </div>
        </div>
      </div>

      {/* ── Section: Preferences ── */}
      <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] space-y-4">
        <h3 className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
          Preferences • விருப்பங்கள்
        </h3>

        <div className="divide-y divide-orange-100/80 text-xs">
          
          {/* Theme Selector */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-extrabold text-[#191815]">App Theme</p>
                <p className="text-gray-400 text-[11px]">Orange & White (Light) பரிந்துரைக்கப்படுகிறது</p>
              </div>
            </div>

            <div className="inline-flex p-1 bg-orange-50 rounded-xl border border-orange-200">
              <button
                onClick={() => toggleTheme('light')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  theme === 'light' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  theme === 'dark' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Daily Reminders Toggle */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="font-extrabold text-[#191815]">Daily Sandhyā Reminders</p>
                <p className="text-gray-400 text-[11px]">பிராத, நண்பகல், மாலை நினைவூட்டல்</p>
              </div>
            </div>

            <button
              onClick={handleToggleNotifications}
              className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-orange-500' : 'bg-gray-200'
              }`}
            >
              <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                notificationsEnabled ? 'translate-x-5.5' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {remindersSaved && (
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold flex items-center gap-1.5 border border-orange-200">
            <Check className="w-3.5 h-3.5 text-orange-600" />
            <span>Reminders preference updated!</span>
          </div>
        )}
      </div>

      {/* ── Section: Download APK ── */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-5 text-white shadow-[0_8px_25px_rgba(255,107,0,0.25)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Android Application (.apk)</h3>
            <p className="text-white/80 text-[11px]">Install SANDHYā directly on your phone</p>
          </div>
        </div>
        <p className="text-xs text-white/90 leading-relaxed">
          Install the native Android app with notifications, offline support, and high performance.
        </p>
        <a
          href="/SANDHYa.apk"
          download="SANDHYa.apk"
          className="w-full py-3 px-4 bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4 text-orange-600" />
          <span>Download SANDHYā.apk (6.4 MB)</span>
        </a>
      </div>

      {/* ── Section: App & Device Info ── */}
      <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-[0_4px_20px_rgba(255,107,0,0.04)] space-y-3">
        <h3 className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
          About App • செயலி தகவல்
        </h3>

        <div className="divide-y divide-orange-100/80 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">Application</span>
            <span className="font-bold text-[#191815]">SANDHYā</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">Version</span>
            <span className="font-bold text-orange-600">v1.0.0 Production (Mobile App)</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-gray-500 font-medium">Mobile Engine</span>
            <span className="font-bold text-[#191815]">Capacitor Android + PWA</span>
          </div>
        </div>
      </div>

      {/* ── Sign Out Button ── */}
      <button
        onClick={() => logOut()}
        className="w-full py-4 rounded-3xl bg-white hover:bg-red-50 text-red-600 font-extrabold text-xs sm:text-sm border-2 border-red-100 hover:border-red-200 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span>கணக்கிலிருந்து வெளியேறு (Sign Out)</span>
      </button>

    </div>
  );
};
