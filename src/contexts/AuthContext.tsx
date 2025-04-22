import React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../libs/supabase';
import { Tables } from '../libs/database.types';
import { getProfile } from '../libs/ApiService';
import { LogUtil } from '../libs/LogUtil';
import { CommonUtil } from '../libs/CommonUtil';

type AuthContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  profile: Tables<'profile'> | null;
  setProfile: (profile: Tables<'profile'> | null) => void;
  resetSession: () => Promise<Session | null>;
  refreshSession: () => Promise<void>;
  isRefreshing: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'profile'> | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshAttempts, setRefreshAttempts] = useState<number>(0);
  const MAX_REFRESH_ATTEMPTS = 5;
  const REFRESH_WAIT_TIME = 2000; // 2秒

  // セッションを手動で更新する関数
  const refreshSession = async () => {
    if (isRefreshing) return; // 既に更新中なら処理しない

    // 最大試行回数を超えた場合はアラートを表示して処理を中断
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      LogUtil.log('セッション更新の最大試行回数を超えました', { level: 'error', notify: true });
      alert('ログイン情報の取得に失敗しました｡アプリケーションを再度起動してください｡');
      setRefreshAttempts(0); // カウンターをリセット
      return;
    }

    try {
      setIsRefreshing(true);
      setRefreshAttempts((prev) => prev + 1);

      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);

        // プロフィール情報も更新
        if (data.session.user) {
          const profile = await getProfile(data.session).catch((e) => {
            throw e;
          });
          setProfile(profile);
        }

        // 成功したらカウンターをリセット
        setRefreshAttempts(0);
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラー';
      LogUtil.log(`セッション更新エラー: ${errorMessage}`, { level: 'error' });

      // エラー発生時に待機してから再試行できるようにする
      await CommonUtil.wait(REFRESH_WAIT_TIME);
    } finally {
      setIsRefreshing(false);
    }
  };

  // セッション有効性のチェックとエラーハンドリングのセットアップ
  useEffect(() => {
    // Supabaseのリクエストインターセプターをセットアップ
    const setupAuthErrorHandler = () => {
      // APIレスポンスを監視するためのオリジナルfetchの保存
      const originalFetch = window.fetch;

      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);

          // 認証エラーを検出（401 Unauthorized または 403 Forbidden）
          if (response.status === 401 || response.status === 403) {
            // セッションが無効になっている可能性があるため更新を試みる
            LogUtil.log('認証エラーを検出: セッションを更新します', { level: 'info' });
            await refreshSession();

            // セッション更新後、元のリクエストを再試行できるようにクローンを作成
            if (session) {
              const request = args[0] as Request;
              const clonedRequest = request.clone ? request.clone() : request;
              return originalFetch(clonedRequest, args[1]);
            }
          }

          return response;
        } catch (error) {
          // ネットワークエラーなどの例外をそのまま伝播
          throw error;
        }
      };
    };

    setupAuthErrorHandler();

    // クリーンアップ関数
    return () => {
      // 元のfetchに戻す処理があればここに実装
    };
  }, [session]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        if (error.message) {
          alert(error.message);
        }
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await getProfile(session).catch((e) => {
          // ログインされていません
          throw e;
        });
        setProfile(profile);
      }
    })().catch((e) => {
      if (e && e.message) LogUtil.log(e.message, { level: 'error' });
    });

    // セッション変更監視のサブスクリプション
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      LogUtil.log(`Auth state changed: ${event}`, { level: 'info' });
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);

        if (newSession.user) {
          try {
            const profile = await getProfile(newSession);
            setProfile(profile);
          } catch (e: Error | unknown) {
            const errorMessage = e instanceof Error ? e.message : '不明なエラー';
            LogUtil.log(`プロフィール取得エラー`, {
              level: 'error',
              error: new Error(errorMessage),
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    // セッションの有効期限切れに備えてバックアップとして長めの間隔で更新
    // 30分ごとにセッションを更新（主にバックアップとして）
    const refreshTimer = setInterval(refreshSession, 30 * 60 * 1000);

    return () => {
      ctrl.abort();
      subscription?.unsubscribe();
      clearInterval(refreshTimer);
    };
  }, []);

  const resetSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      alert(error.message);
    }
    setSession(session);
    setUser(session?.user ?? null);
    return session;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        user,
        setUser,
        profile,
        setProfile,
        resetSession,
        refreshSession,
        isRefreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
