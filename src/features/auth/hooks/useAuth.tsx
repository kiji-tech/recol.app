import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { supabase } from '../../../libs/supabase';
import { useRouter } from 'expo-router';
import { LogUtil } from '../../../libs/LogUtil';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { Profile } from '../../profile/types/Profile';
import { login } from '../libs/login';
import { signup } from '../libs/signup';
import { resetPassword, updateUserPassword } from '../libs/password';
import { logout } from '../libs/logout';
import { signInWithGoogle, signInWithApple } from '../libs/socialAuth';
import { getProfile, getSession, isRecoverySession } from '../libs/session';
import { AuthContextType } from '../types/Auth';
import { CommonUtil } from '../../../libs/CommonUtil';
import { usePremiumPlan } from './usePremiumPlan';
import { syncPremiumPlan } from '../../profile/apis/syncPremiumPlan';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { isPremium, endAt, customerInfo } = usePremiumPlan();
  const appState = useRef(AppState.currentState);

  // delete_flagチェック関数
  const checkDeleteFlag = async () => {
    if (profile && profile.delete_flag) {
      LogUtil.log('User account has delete_flag set to true, forcing logout', { level: 'info' });
      try {
        await logout();
        setSession(null);
        setUser(null);
        setProfile(null);
        Alert.alert(
          'アカウントは無効化されています',
          '同じメールアドレスをご利用したい場合は、お問い合わせからご連絡ください。',
          [
            {
              text: 'お問い合わせ',
              onPress: () => {
                const contactUrl = process.env.EXPO_PUBLIC_CONTACT_PAGE_URL;
                if (contactUrl) {
                  CommonUtil.openBrowser(contactUrl).catch((error) => {
                    LogUtil.log(`Error opening contact page: ${JSON.stringify(error)}`, {
                      level: 'error',
                    });
                  });
                }
              },
            },
            { text: 'OK', style: 'cancel' },
          ]
        );
      } catch (error) {
        LogUtil.log(`Error during forced logout: ${JSON.stringify(error)}`, { level: 'error' });
      }
    }
  };

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
    if (!session || !customerInfo) return;
    LogUtil.log('getProfileHandler', { level: 'info' });
    try {
      const profileData = await syncPremiumPlan(isPremium, endAt, session);
      setProfile(profileData);
    } catch (e) {
      LogUtil.log('getProfileHandler error', { level: 'error' });
      LogUtil.log(JSON.stringify(e), { level: 'error' });
      setProfile(null);
    }
  };

  /**
   * セッションを再検証する
   * セッションが期限切れの場合はリフレッシュを試みる
   */
  const revalidateSession = useCallback(async () => {
    try {
      // 最新のセッションを取得
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        LogUtil.log(`セッション再検証エラー: ${JSON.stringify(sessionError)}`, { level: 'error' });
        return;
      }

      const latestSession = sessionData.session;
      
      if (!latestSession) {
        LogUtil.log('セッションが存在しません', { level: 'info' });
        setSession(null);
        setUser(null);
        setProfile(null);
        return;
      }

      // セッションの有効期限をチェック
      const expirationTime = latestSession.expires_at ? latestSession.expires_at * 1000 : null;
      const thresholdTime = Date.now() + 5 * 60 * 1000; // 5分前
      
      // セッションが期限切れまたは期限切れが近い場合はリフレッシュ
      if (!expirationTime || expirationTime <= thresholdTime) {
        LogUtil.log('セッションが期限切れのためリフレッシュを試みます', { level: 'info' });
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          LogUtil.log(`セッションリフレッシュエラー: ${JSON.stringify(refreshError)}`, { level: 'error' });
          // リフレッシュに失敗した場合はセッションをクリア
          setSession(null);
          setUser(null);
          setProfile(null);
          return;
        }

        if (refreshData.session) {
          setSession(refreshData.session);
          setUser(refreshData.session.user);
          
          // リカバリーセッションかどうかチェック
          const isRecovery = await isRecoverySession();
          if (isRecovery) {
            await logout();
            return;
          }

          // プロフィールを取得
          try {
            const profileData = await getProfile(refreshData.session);
            setProfile(profileData);
          } catch {
            setProfile(null);
          }
        }
      } else {
        // セッションが有効な場合は更新
        setSession(latestSession);
        setUser(latestSession.user);
      }
    } catch (error) {
      LogUtil.log(`セッション再検証中にエラーが発生しました: ${JSON.stringify(error)}`, { level: 'error' });
    }
  }, []);

  // 初回マウント時にセッション取得
  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (!session) return;
        // リカバリーセッションかどうかチェックする
        const isRecovery = await isRecoverySession();
        if (isRecovery) {
          await logout();
          return;
        }
        setSession(session);
        setUser(session.user);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    getSessionAndProfile();

    // 認証状態の変化を監視
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      LogUtil.log({ _event }, { level: 'info' });
      if (_event == 'PASSWORD_RECOVERY') {
        router.navigate('/(auth)/ResetPassword');
      }
      if (!session) return;

      setSession(session);
      setUser(session.user);

      try {
        const profileData = await getProfile(session);
        setProfile(profileData);
      } catch {
        setProfile(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // プロフィール再取得
    getProfileHandler();
  }, [session, user, customerInfo]);

  // profileのdelete_flagをチェック
  useEffect(() => {
    checkDeleteFlag();
  }, [profile]);

  // アプリ状態の監視（フォアグラウンド復帰時にセッションを再検証）
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        LogUtil.log('アプリがフォアグラウンドに復帰しました。セッションを再検証します', { level: 'info' });
        revalidateSession();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [revalidateSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        initialized,
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
