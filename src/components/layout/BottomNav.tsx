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
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-orange-100 px-6 py-3.5 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(255,107,0,0.04)]">
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center space-y-0.5 transition-colors ${
              isActive 
                ? 'text-orange-600 font-bold' 
                : 'text-gray-400 hover:text-orange-500'
            }`}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              )}
            </div>
            <span className="text-[10px] mt-0.5">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
