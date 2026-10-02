import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Trophy, Calendar as CalendarIcon, User as UserIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/circle', label: 'Circle', icon: Users },
  { path: '/challenge', label: 'Challenge', icon: Trophy },
  { path: '/calendar', label: 'My Journey', icon: CalendarIcon },
  { path: '/profile', label: 'Profile', icon: UserIcon },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-brand-darkElevated border-r border-gray-200 dark:border-gray-800 p-6 sticky top-0">
      <div className="flex items-center space-x-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-brand-saffron/30 bg-white ring-2 ring-brand-saffron/20">
          <img src="/arudhra_logo.png" alt="Arudhra Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-display font-bold tracking-tight text-brand-primary dark:text-brand-darkPrimaryText">Sandhyā</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-brand-primary dark:text-white font-semibold bg-gray-50 dark:bg-gray-800/50' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-brand-saffron"
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-brand-saffron' : ''} />
              <span className="text-[15px]">{label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 px-4 text-xs text-gray-400 font-medium">
        v1.0.0 Production
      </div>
    </aside>
  );
};
