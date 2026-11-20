import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { Challenge } from './pages/Challenge';
import { Calendar } from './pages/Calendar';
import { Circle } from './pages/Circle';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Auth/Login';
import { motion } from 'framer-motion';
import { useAuth } from './store/AuthContext';

import { ErrorBoundary } from './components/shared/ErrorBoundary';

const Onboarding = () => {
  const navigate = useNavigate();
  const { currentUser, loginAsGuest } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleStartNow = () => {
    loginAsGuest();
    navigate('/');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/arudhra_logo.png')" }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-0"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-6 relative z-10"
      >
        <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-2xl ring-4 ring-orange-400/50 mb-2 bg-white flex items-center justify-center p-1">
          <img src="/arudhra_logo.png" alt="Arudhra Logo" className="w-full h-full object-cover rounded-2xl" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-extrabold text-white tracking-tight">SANDHYā</h1>
          <p className="text-sm text-gray-200 leading-relaxed max-w-xs mx-auto">
            தினசரி வேத சந்தியாவந்தன அனுஷ்டானம் மற்றும் காயத்ரி தியான சாதனை செயலி.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={handleStartNow} 
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-base shadow-xl shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ Start Practice Now • உடனடி தொடக்கம்</span>
          </button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-bold text-xs backdrop-blur border border-white/15 transition-all"
          >
            Sign In with Email / கணக்கில் உள்நுழைக
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    // Default to clean Orange & White theme unless explicitly set to dark
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/welcome" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/friends" element={<Navigate to="/circle" replace />} />
          
          {/* Protected Routes - App Mode */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="challenge" element={<Challenge />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="circle" element={<Circle />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch-all fallback route to prevent blank pages */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
