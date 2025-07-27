import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../libs/supabase';
import { getProfile } from '../libs/ApiService';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { LogUtil } from '../libs/LogUtil';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Profile, Subscription } from '../entities';

// 型定義
export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: (Profile & { subscription: Subscription[] }) | null;
  getProfileInfo: () => (Profile & { subscription: Subscription[] }) | null;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: (Profile & { subscription: Subscription[] }) | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<(Profile & { subscription: Subscription[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfileInfo = useCallback(() => {
    return profile;
  }, [profile]);

  // ログイン関数
  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    setUser(data.session?.user ?? null);
    if (data.session) {
      try {
        await fetchProfile();
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'recol://(auth)/CompleteNewAccount',
      },
    });
    if (error) throw error;
    setSession(data.session);
    setUser(data.session?.user ?? null);
    if (data.session) {
      try {
        await fetchProfile();
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
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      LogUtil.log('userInfo: ' + JSON.stringify(userInfo), { level: 'info' });
      if (!userInfo?.data?.idToken) {
        LogUtil.log('signInWithIdToken error: no ID token present!', {
          level: 'error',
          notify: true,
        });
        throw new Error('no ID token present!');
      }
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo?.data?.idToken,
      });

      if (error) {
        LogUtil.log('signInWithIdToken error: ' + JSON.stringify(error), {
          level: 'error',
          notify: true,
        });
        throw error;
      }
      LogUtil.log('signInWithIdToken data: ' + JSON.stringify(data), { level: 'info' });
      router.navigate('/(home)');
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        }
      } else {
        // some other error happened
      }
    }
  };

  // Appleサインイン関数
  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      if (credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) {
          LogUtil.log('signInWithApple error: ' + JSON.stringify(error), {
            level: 'error',
            notify: true,
          });
          throw error;
        }
        LogUtil.log('signInWithApple data: ' + JSON.stringify(data), { level: 'info' });
        router.navigate('/(home)');
      } else {
        LogUtil.log('signInWithApple error: no identity token present!', {
          level: 'error',
          notify: true,
        });
        throw new Error('no identity token present!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      }
      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        }
      } else {
        // some other error happened
      }
    }
  };

  /** プロフィール取得 */
  const fetchProfile = async () => {
    if (!session) return;
    getProfile(session)
      .then(async (profileData) => {
        const p = new Profile(profileData);
        setProfile(p);
      })
      .catch((e) => {
        if (e && e.message) {
          setProfile(null);
        }
      });
  };

  // 初回マウント時にセッション取得
  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
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
          await fetchProfile();
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

  useEffect(() => {
    // プロフィール再取得
    if (!session) return;
    fetchProfile();
  }, [session, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        getProfileInfo,
        fetchProfile,
        setProfile,
        login,
        logout,
        signup,
        resetPassword,
        updateUserPassword,
        signInWithGoogle,
        signInWithApple,
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
