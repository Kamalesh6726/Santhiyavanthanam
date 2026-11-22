import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { InstallPrompt } from '../shared/InstallPrompt';
import { useUserData } from '../../hooks/useFirebaseData';
import { Flame } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUserData();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#191815] flex flex-col md:flex-row antialiased selection:bg-orange-100">
      {/* Desktop Sidebar (Hidden on mobile) */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden">
        
        {/* Mobile Top App Bar (Visible only on mobile devices) */}
        <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/90 px-4 pt-[max(env(safe-area-inset-top),20px)] pb-3 flex items-center justify-between shadow-[0_2px_12px_rgba(255,107,0,0.03)] w-full">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white ring-2 ring-orange-200/80 shadow-sm shrink-0">
              <img src="/arudhra_logo.png" alt="Arudhra Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg font-display font-extrabold tracking-tight text-[#191815]">SANDHYā</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Streak Pill */}
            <div 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 font-extrabold text-xs shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{userData?.currentStreak || 0}</span>
            </div>

            {/* Quick Profile Avatar */}
            <button
              onClick={() => navigate('/profile')}
              aria-label="Profile"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 text-white font-bold text-xs flex items-center justify-center ring-2 ring-orange-200 shadow-sm active:scale-95 transition-transform"
            >
              {userData?.name ? userData.name.charAt(0).toUpperCase() : 'S'}
            </button>
          </div>
        </header>

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
          <div className="w-full max-w-4xl mx-auto px-3.5 py-3.5 sm:px-4 md:p-8 pb-28 md:pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="min-h-full w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* PWA 1-Tap Install Banner */}
        <InstallPrompt />

        {/* Mobile Fixed Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
