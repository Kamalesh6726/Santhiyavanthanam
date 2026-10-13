import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const returnTo = location.state?.returnTo || '/';

  useEffect(() => {
    if (currentUser) {
      navigate(returnTo, { replace: true });
    }
  }, [currentUser, navigate, returnTo]);

  const handleError = (err: any) => {
    console.error(err);
    if (err.code === 'auth/invalid-api-key' || err.message?.includes('API_KEY')) {
      setError('Firebase is not configured properly. Check your API key.');
    } else if (err.code === 'auth/invalid-credential') {
      setError('Incorrect email or password. If you do not have an account, please switch to the Sign Up tab.');
    } else if (err.code === 'auth/operation-not-allowed') {
      setError('Email/Password accounts are not enabled. Please enable them in the Firebase Console.');
    } else if (err.code === 'auth/email-already-in-use') {
      setError('An account already exists with this email. Please switch to Sign In.');
    } else {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/arudhra_logo.png')" }}
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-0"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center mb-6 shadow-xl ring-4 ring-brand-saffron/40 bg-white">
            <img src="/arudhra_logo.png" alt="Arudhra Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            {activeTab === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-300 mt-2">
            {activeTab === 'signup' ? 'Start your consistency journey today.' : 'Sign in to continue your consistency journey.'}
          </p>
        </div>

        <Card className="p-8">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'signin' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-charcoal dark:text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => { setActiveTab('signin'); setError(null); }}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'signup' 
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-charcoal dark:text-white' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => { setActiveTab('signup'); setError(null); }}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-saffron outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-saffron outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full py-4" disabled={loading}>
              {loading ? 'Please wait...' : (activeTab === 'signup' ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-brand-darkCard text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full flex items-center justify-center space-x-3 py-4"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};
