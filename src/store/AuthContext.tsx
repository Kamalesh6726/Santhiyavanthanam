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
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            await createUserProfile(user.uid, user.email, user.displayName);
          } catch (profileErr) {
            console.error("Failed to create user profile in Firestore. Check Firestore Rules:", profileErr);
          }
        }
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Firebase not configured properly.", e);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
