import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-background dark:bg-brand-darkBg flex">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative md:pb-0 pb-20">
        {/* We use an inner container for max-width on large screens to keep content readable */}
        <main className="flex-1 overflow-y-auto custom-scrollbar w-full relative">
          <div className="w-full max-w-4xl mx-auto md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
