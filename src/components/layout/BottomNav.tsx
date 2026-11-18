import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Trophy, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/circle', label: 'Circle', icon: Users },
  { path: '/challenge', label: 'Challenge', icon: Trophy },
  { path: '/calendar', label: 'Journey', icon: CalendarIcon },
  { path: '/profile', label: 'Profile', icon: UserIcon },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-orange-100/90 px-2 pt-1 pb-[max(10px,env(safe-area-inset-bottom))] flex justify-around items-center z-50 shadow-[0_-4px_24px_rgba(255,107,0,0.06)]">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-label={label}
            className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center rounded-2xl transition-all touch-manipulation active:scale-95 ${
              isActive 
                ? 'text-orange-600 font-extrabold' 
                : 'text-gray-400 hover:text-orange-500'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-colors ${isActive ? 'bg-orange-50' : ''}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-orange-600' : 'text-gray-400'} />
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              )}
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 leading-none ${isActive ? 'text-orange-600 font-extrabold' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
