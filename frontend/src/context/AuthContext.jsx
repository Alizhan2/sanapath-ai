import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  signUpWithEmail,
  logOut,
  updateUserProfile
} from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if Firebase auth is not initialized
    if (!auth) {
      setLoading(false);
      return;
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get Firebase ID token
        const token = await firebaseUser.getIdToken();

        // Sync with backend
        try {
          const response = await axios.post(`${API_URL}/api/auth/firebase/verify`, {
            token,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            avatar_url: firebaseUser.photoURL,
            provider: firebaseUser.providerData[0]?.providerId || 'firebase'
          });

          // Store backend token
          localStorage.setItem('token', response.data.access_token);

          setUser({
            id: response.data.user.id,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            avatar_url: firebaseUser.photoURL,
            provider: firebaseUser.providerData[0]?.providerId || 'firebase',
            firebaseUser
          });
        } catch (err) {
          console.error('Backend sync error:', err);
          // Still allow user to use app with Firebase only
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            avatar_url: firebaseUser.photoURL,
            provider: firebaseUser.providerData[0]?.providerId || 'firebase',
            firebaseUser
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGithub = async () => {
    setError(null);
    try {
      await signInWithGithub();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithEmail = async (email, password) => {
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const registerWithEmail = async (email, password, name) => {
    setError(null);
    try {
      const { user: firebaseUser } = await signUpWithEmail(email, password);
      if (name) {
        await updateUserProfile(firebaseUser, { displayName: name });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logOut();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    registerWithEmail,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
