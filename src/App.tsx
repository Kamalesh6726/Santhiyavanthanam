import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { Challenge } from './pages/Challenge';
import { Calendar } from './pages/Calendar';
import { Circle } from './pages/Circle';
import { Profile } from './pages/Profile';
import { WisdomPage } from './pages/Wisdom';
import { Settings } from './pages/Settings';
import { Login } from './pages/Auth/Login';
import { Button } from './components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from './store/AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/arudhra_logo.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
      
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-2xl ring-4 ring-brand-saffron/30 mb-8 bg-brand-ivory dark:bg-brand-darkCard flex items-center justify-center">
          <img src="/arudhra_logo.png" alt="Arudhra Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white">Welcome to Sandhyā</h1>
        <p className="text-lg text-gray-200 mb-8">Turn daily practice into a shared commitment.</p>
        
        <Button onClick={() => navigate('/login')} size="lg" className="w-full text-lg h-14 bg-brand-saffron text-white border-none hover:bg-brand-gold">
          Get Started
        </Button>
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
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/welcome" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - App Mode */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="challenge" element={<Challenge />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="circle" element={<Circle />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wisdom" element={<WisdomPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
