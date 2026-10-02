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
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-brand-darkElevated/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center z-50">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isActive 
                ? 'text-brand-saffron' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-saffron"
                />
              )}
            </div>
            <span className="text-[10px] font-medium mt-1">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
