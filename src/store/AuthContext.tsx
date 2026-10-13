import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile } from '../lib/db';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout: If Firebase auth listener takes longer than 3.5 seconds, unblock UI
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timer);
        setCurrentUser(user);
        setLoading(false);

        if (user) {
          // Asynchronously ensure user profile exists without blocking render
          createUserProfile(user.uid, user.email, user.displayName).catch((err) => {
            console.warn('Profile sync notice:', err);
          });
        }
      });

      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    } catch (e) {
      console.warn('Firebase initialization notice:', e);
      clearTimeout(timer);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background dark:bg-brand-darkBg text-center p-6 select-none">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl ring-4 ring-brand-saffron/30 bg-white flex items-center justify-center mb-6 animate-pulse">
            <img src="/arudhra_logo.png" alt="SANDHYĀ" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal dark:text-gray-100 tracking-wide">
            SANDHYĀ
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 tracking-widest uppercase">
            Loading...
          </p>
          <div className="w-24 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-brand-saffron rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
