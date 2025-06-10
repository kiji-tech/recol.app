import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../libs/supabase';
import { getProfile } from '../libs/ApiService';
import { Tables } from '../libs/database.types';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { LogUtil } from '../libs/LogUtil';

// 型定義
export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Tables<'profile'> | null;
  setProfile: (profile: Tables<'profile'> | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
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
      LogUtil.log({ _event }, { level: 'info' });
      if (_event == 'PASSWORD_RECOVERY') {
        router.navigate('/(auth)/ResetPassword');
      }

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

  // サインアップ関数
  const signup = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
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

  // パスワードリセット関数
  const resetPassword = async (email: string) => {
    setLoading(true);
    const resetPasswordURL = Linking.createURL('/(auth)/ResetPassword');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetPasswordURL,
    });
    setLoading(false);
    if (error) throw error;
  };

  // ユーザー情報更新関数
  const updateUserPassword = async (password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    if (data.user) {
      setUser(data.user);
      if (session) {
        setSession({ ...session, user: data.user });
      }
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

  // Googleサインイン関数
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const redirectTo = Linking.createURL('/(home)');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) throw error;
      // ブラウザで認証が行われるため、ここでの後続処理は不要
    } catch (e) {
      // 必要に応じてエラーハンドリング
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        setProfile,
        loading,
        login,
        logout,
        signup,
        resetPassword,
        updateUserPassword,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
