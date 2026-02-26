import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildUser = (supabaseUser) => ({
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email?.split('@')[0],
    avatar_url: supabaseUser.user_metadata?.avatar_url ||
                supabaseUser.user_metadata?.picture || null,
    provider: supabaseUser.app_metadata?.provider || 'email',
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session ? buildUser(session.user) : null);
      if (session) localStorage.setItem('token', session.access_token);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? buildUser(session.user) : null);
      if (session) {
        localStorage.setItem('token', session.access_token);
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setError(error.message); throw error; }
  };

  const loginWithGithub = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { setError(error.message); throw error; }
  };

  const loginWithEmail = async (email, password) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); throw error; }
  };

  const registerWithEmail = async (email, password, name) => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, name } },
    });
    if (error) { setError(error.message); throw error; }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    setUser(null);
  };

  const demoLogin = async () => {
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/auth/demo/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@sanapath.ai', name: 'Demo User' }),
      });
      if (!response.ok) throw new Error('Demo login failed');
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatar_url: data.user.avatar_url,
        provider: 'demo',
      });
    } catch (err) {
      setError(err.message || 'Demo login failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      isAuthenticated: !!user,
      loginWithGoogle, loginWithGithub,
      loginWithEmail, registerWithEmail,
      demoLogin,
      logout,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
