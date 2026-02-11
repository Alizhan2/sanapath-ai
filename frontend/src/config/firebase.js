import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Firebase configuration from environment variables
// All values MUST be set in .env file - no hardcoded fallbacks for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required Firebase config in development
if (import.meta.env.DEV) {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  if (missingKeys.length > 0) {
    console.warn(
      `⚠️ Missing Firebase config: ${missingKeys.join(', ')}\n` +
      'Please set VITE_FIREBASE_* variables in frontend/.env file.\n' +
      'See frontend/.env.example for reference.'
    );
  }
}

// Initialize Firebase (with crash protection)
let app, auth, googleProvider, githubProvider;

try {
  if (!firebaseConfig.apiKey) {
    console.error('Firebase API key is missing! Check environment variables.');
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create mock auth to prevent app crash
  auth = null;
  googleProvider = null;
  githubProvider = null;
}

// Auth functions (with safety checks)
export const signInWithGoogle = () => {
  if (!auth) throw new Error('Firebase not initialized');
  return signInWithPopup(auth, googleProvider);
};
export const signInWithGithub = () => {
  if (!auth) throw new Error('Firebase not initialized');
  return signInWithPopup(auth, githubProvider);
};
export const signInWithEmail = (email, password) => {
  if (!auth) throw new Error('Firebase not initialized');
  return signInWithEmailAndPassword(auth, email, password);
};
export const signUpWithEmail = (email, password) => {
  if (!auth) throw new Error('Firebase not initialized');
  return createUserWithEmailAndPassword(auth, email, password);
};
export const logOut = () => {
  if (!auth) return Promise.resolve();
  return signOut(auth);
};
export const updateUserProfile = (user, data) => updateProfile(user, data);

export { auth, onAuthStateChanged };
export default app;

