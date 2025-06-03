import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../libs/supabase';
import { getProfile } from '../libs/ApiService';
import { Tables } from '../libs/database.types';

// 型定義
export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Tables<'profile'> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profile'> | null>(null);
  const [loading, setLoading] = useState(true);

  // 初回マウント時にセッション取得
  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        try {
          const profileData = await getProfile(data.session);
          setProfile(profileData);
        } catch {
          setProfile(null);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };
    getSessionAndProfile();

    // 認証状態の変化を監視
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        try {
          const profileData = await getProfile(session);
          setProfile(profileData);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    setUser(data.session?.user ?? null);
    if (data.session) {
      try {
        const profileData = await getProfile(data.session);
        setProfile(profileData);
      } catch {
        setProfile(null);
      }
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  // ログアウト関数
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
