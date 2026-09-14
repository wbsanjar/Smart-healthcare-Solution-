import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AppUser {
  id: string;
  email: string;
  fullName: string;
  imageUrl: string;
  role: string;
  primaryEmailAddress?: { emailAddress: string };
  publicMetadata: Record<string, unknown>;
}

interface AuthContextType {
  userId: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AppUser | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  demoSignIn: (role: string) => Promise<void>;
}

const defaultUser: AppUser = {
  id: '',
  email: '',
  fullName: '',
  imageUrl: '',
  role: '',
  primaryEmailAddress: { emailAddress: '' },
  publicMetadata: {},
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const buildAppUser = useCallback((supabaseUser: User | null): AppUser | null => {
    if (!supabaseUser) return null;
    const email = supabaseUser.email || '';
    return {
      id: supabaseUser.id,
      email,
      fullName: (supabaseUser.user_metadata?.full_name as string) || '',
      imageUrl: '',
      role: (supabaseUser.user_metadata?.role as string) || '',
      primaryEmailAddress: { emailAddress: email },
      publicMetadata: supabaseUser.user_metadata || {},
    };
  }, []);

  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    setAppUser(buildAppUser(user));
  }, [user, buildAppUser]);

  const createProfile = async (userId: string) => {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existing) {
        await supabase.from('profiles').insert({
          id: userId,
          full_name: '',
          phone: '',
          blood_type: 'Unknown',
          address: '',
          emergency_contact: {},
          medical_conditions: [],
          allergies: [],
          current_medications: [],
          location_lat: 0,
          location_lng: 0,
          avatar_url: null,
        });
      }
    } catch (err) {
      console.error('Error creating profile:', err);
    }
  };

  const refreshSession = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (currentSession?.user) {
        createProfile(currentSession.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && currentSession?.user) {
          createProfile(currentSession.user.id);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || '' },
      },
    });

    if (error) return { error: error.message };

    if (data.user) {
      await createProfile(data.user.id);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  const demoSignIn = useCallback(async (role: string) => {
    const demoUser = {
      id: 'demo_' + Date.now(),
      email: 'demo@user.com',
      user_metadata: {
        full_name: 'Demo User',
        role: role,
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const demoSession = {
      access_token: 'demo_token',
      refresh_token: 'demo_refresh',
      expires_in: 999999,
      expires_at: Math.floor(Date.now() / 1000) + 999999,
      token_type: 'bearer',
      user: demoUser,
    } as Session;

    setUser(demoUser);
    setAppUser(buildAppUser(demoUser));
    setSession(demoSession);
    setLoading(false);
    localStorage.setItem('demo_mode', 'true');
  }, [buildAppUser]);

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setAppUser(null);
    localStorage.removeItem('demo_mode');
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    userId: user?.id || null,
    isLoaded: !loading,
    isSignedIn: !!user,
    user: appUser,
    session,
    signUp,
    signIn,
    signOut,
    refreshSession,
    demoSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
