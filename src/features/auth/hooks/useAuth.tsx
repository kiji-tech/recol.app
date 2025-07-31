import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../libs/supabase';
import { useRouter } from 'expo-router';
import { LogUtil } from '../../../libs/LogUtil';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { Profile } from '../../profile/types/Profile';
import { Subscription } from '../../payment/types/Subscription';
import { login } from '../libs/login';
import { signup } from '../libs/signup';
import { resetPassword, updateUserPassword } from '../libs/password';
import { logout } from '../libs/logout';
import { signInWithGoogle, signInWithApple } from '../libs/socialAuth';
import { getProfile, getSession, isRecoverySession } from '../libs/session';
import { AuthContextType } from '../types/Auth';

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
  const loginHandler = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await login(email, password);
      setSession(result.session);
      setUser(result.user);
      setProfile(result.profile);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // サインアップ関数
  const signupHandler = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signup(email, password);
      setSession(result.session);
      setUser(result.user);
      setProfile(result.profile);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // パスワードリセット関数
  const resetPasswordHandler = async (email: string) => {
    setLoading(true);
    try {
      await resetPassword(email);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ユーザー情報更新関数
  const updateUserPasswordHandler = async (password: string) => {
    setLoading(true);
    try {
      const updatedUser = await updateUserPassword(password);
      setUser(updatedUser);
      if (session) {
        setSession({ ...session, user: updatedUser });
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト関数
  const logoutHandler = async () => {
    setLoading(true);
    try {
      await logout();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Googleサインイン関数
  const signInWithGoogleHandler = async () => {
    try {
      const result = await signInWithGoogle();
      setSession(result.session);
      setUser(result.user);
      setProfile(result.profile);
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
  const signInWithAppleHandler = async () => {
    try {
      const result = await signInWithApple();
      setSession(result.session);
      setUser(result.user);
      setProfile(result.profile);
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

  /** プロフィール取得 */
  const getProfileHandler = async () => {
    if (!session) return;
    try {
      const profileData = await getProfile(session);
      setProfile(profileData);
    } catch {
      setProfile(null);
    }
  };

  // 初回マウント時にセッション取得
  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (session) {
          // リカバリーセッションかどうかチェックする
          const isRecovery = await isRecoverySession();
          if (isRecovery) {
            await logout();
            return;
          }
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch {
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
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

  useEffect(() => {
    // プロフィール再取得
    if (!session) return;
    getProfileHandler();
  }, [session, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        getProfileInfo,
        getProfile: getProfileHandler,
        setProfile,
        login: loginHandler,
        logout: logoutHandler,
        signup: signupHandler,
        resetPassword: resetPasswordHandler,
        updateUserPassword: updateUserPasswordHandler,
        signInWithGoogle: signInWithGoogleHandler,
        signInWithApple: signInWithAppleHandler,
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
