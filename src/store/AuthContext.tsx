import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile } from '../lib/db';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous?: boolean;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  loginAsGuest: (name?: string) => void;
  signOutApp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  loading: true,
  loginAsGuest: () => {},
  signOutApp: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('sandhya_local_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  
  const [loading, setLoading] = useState(!currentUser);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timer);
        if (user) {
          const appUser: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAnonymous: user.isAnonymous
          };
          setCurrentUser(appUser);
          localStorage.setItem('sandhya_local_user', JSON.stringify(appUser));
          createUserProfile(user.uid, user.email, user.displayName).catch((err) => {
            console.warn('Profile sync notice:', err);
          });
        }
        setLoading(false);
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

  const loginAsGuest = (name?: string) => {
    const existing = localStorage.getItem('sandhya_guest_id');
    const guestId = existing || ('guest_' + Math.random().toString(36).substring(2, 10));
    if (!existing) localStorage.setItem('sandhya_guest_id', guestId);

    const guestUser: AppUser = {
      uid: guestId,
      email: null,
      displayName: name || 'Sandhyā Practitioner',
      isAnonymous: true
    };
    setCurrentUser(guestUser);
    localStorage.setItem('sandhya_local_user', JSON.stringify(guestUser));
    
    // Ensure local profile exists
    const pKey = `user_profile_${guestId}`;
    if (!localStorage.getItem(pKey)) {
      const initialProfile = {
        id: guestId,
        uid: guestId,
        email: '',
        name: name || 'Sandhyā Practitioner',
        username: '@practitioner',
        currentStreak: 0,
        bestStreak: 0,
        totalSessions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(pKey, JSON.stringify(initialProfile));
    }
    window.dispatchEvent(new Event('sandhya_local_data_updated'));
  };

  const signOutApp = async () => {
    localStorage.removeItem('sandhya_local_user');
    setCurrentUser(null);
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    window.dispatchEvent(new Event('sandhya_local_data_updated'));
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginAsGuest, signOutApp }}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] text-center p-6 select-none">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl ring-4 ring-orange-200 bg-white flex items-center justify-center mb-6 animate-pulse">
            <img src="/arudhra_logo.png" alt="SANDHYĀ" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-[#191815] tracking-wide">
            SANDHYā
          </h1>
          <p className="text-xs text-orange-600 mt-2 font-bold tracking-widest uppercase">
            Loading...
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
