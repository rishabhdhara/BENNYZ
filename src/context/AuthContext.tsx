import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ShippingAddress } from '../types';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  default_address: Partial<ShippingAddress> | null;
}

interface AuthResult {
  success: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isSupabaseConfigured: boolean;
  signUp: (params: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: (redirectToPath?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: {
    full_name: string;
    phone: string;
    default_address: Partial<ShippingAddress> | null;
  }) => Promise<AuthResult>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, default_address')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as UserProfile);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp: AuthContextType['signUp'] = async ({ fullName, email, password, phone }) => {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: {
          full_name: fullName.trim(),
          phone: (phone || '').trim(),
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    const needsEmailConfirmation = Boolean(data.user && !data.session);
    return {
      success: true,
      needsEmailConfirmation,
      message: needsEmailConfirmation
        ? 'Account created. Please check your inbox and confirm your email address before signing in.'
        : 'Welcome to BENNYZ.',
    };
  };

  const signIn: AuthContextType['signIn'] = async (email, password) => {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  };

  const signInWithGoogle: AuthContextType['signInWithGoogle'] = async (redirectToPath = '/account') => {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    try {
      if (redirectToPath && redirectToPath !== '/account') {
        sessionStorage.setItem('bennyz_auth_redirect', redirectToPath);
      } else {
        sessionStorage.removeItem('bennyz_auth_redirect');
      }
    } catch {
      // ignore storage errors
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase().includes('not enabled')
        ? 'Google Sign-In is not enabled in your Supabase dashboard yet (Authentication → Providers → Google).'
        : error.message;
      return { success: false, message: msg };
    }

    return { success: true };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  };

  const sendPasswordReset: AuthContextType['sendPasswordReset'] = async (email) => {
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured yet.' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Password reset link sent. Check your email inbox.',
    };
  };

  const updateProfile: AuthContextType['updateProfile'] = async (updates) => {
    if (!supabase || !user) {
      return { success: false, message: 'You must be signed in to update your profile.' };
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: updates.full_name,
      phone: updates.phone,
      default_address: updates.default_address,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, message: error.message };
    }

    await fetchProfile(user.id);
    return { success: true, message: 'Profile saved.' };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isSupabaseConfigured,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        sendPasswordReset,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
