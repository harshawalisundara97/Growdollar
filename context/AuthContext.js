import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const fetchProfile = async (authUser) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
  }

  return {
    uid: authUser.id,
    email: authUser.email,
    name: data?.name || authUser.user_metadata?.name || 'User',
    createdAt: data?.created_at,
  };
};

const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'Incorrect email or password.',
  'Email not confirmed': 'Please confirm your email before logging in.',
  'User already registered': 'An account with this email already exists.',
};

const friendlyAuthError = (error) =>
  AUTH_ERROR_MESSAGES[error.message] || error.message || 'Something went wrong. Please try again.';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && !cancelled) {
        const profile = await fetchProfile(session.user);
        if (!cancelled) setUser(profile);
      }
      if (!cancelled) setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        if (!cancelled) setUser(profile);
      } else {
        if (!cancelled) setUser(null);
      }
    });

    return () => {
      cancelled = true;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: friendlyAuthError(error) };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: friendlyAuthError(error) };
    }
  };

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isSupabaseConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
