import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnm9cBlLGYByl9ocrboMlEHlQS4-x1KBo",
  authDomain: "sandhyavanthanam.firebaseapp.com",
  projectId: "sandhyavanthanam",
  storageBucket: "sandhyavanthanam.firebasestorage.app",
  messagingSenderId: "369631430508",
  appId: "1:369631430508:web:19f2c300bbb7aae50b9549"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();

// Helper functions for Auth
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, pass: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const signInWithEmail = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};
