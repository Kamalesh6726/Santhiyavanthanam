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
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-orange-100 p-6 sticky top-0 shadow-[2px_0_12px_rgba(255,107,0,0.03)]">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-md shadow-orange-500/20 bg-white ring-2 ring-orange-200">
          <img src="/arudhra_logo.png" alt="Arudhra Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-display font-extrabold tracking-tight text-[#191815]">SANDHYā</h1>
      </div>

      <nav className="flex-1 space-y-1.5">
        {sidebarItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all relative ${
                isActive 
                  ? 'text-orange-600 font-bold bg-orange-50/80 shadow-sm shadow-orange-500/5' 
                  : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/40'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r-full bg-orange-500"
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-orange-500' : ''} />
              <span className="text-[14px]">{label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-orange-100 px-4 text-xs text-gray-400 font-medium">
        v1.0.0 Production
      </div>
    </aside>
  );
};
