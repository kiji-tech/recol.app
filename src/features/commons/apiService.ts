import { Session } from '@supabase/supabase-js';
import { LogUtil } from '@/src/libs/LogUtil';
import { supabase } from '@/src/libs/supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

export type ApiErrorResponse = {
  message: string;
  code: string;
};

type ApiResponse<T> = {
  data: T | null;
  error: ApiErrorResponse | null;
};

const createHeaders = (session: Session | null) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${session?.access_token}`,
});

/**
 * セッションの有効期限をチェックする
 * @param session {Session | null} チェックするセッション
 * @returns {boolean} セッションが有効な場合true
 */
const isSessionValid = (session: Session | null): boolean => {
  if (!session || !session.expires_at) {
    return false;
  }
  // 有効期限の5分前を閾値として、期限切れが近い場合は無効とみなす
  const expirationTime = session.expires_at * 1000; // 秒をミリ秒に変換
  const thresholdTime = Date.now() + 5 * 60 * 1000; // 5分前
  return expirationTime > thresholdTime;
};

/**
 * 有効なセッションを取得する
 * セッションが期限切れまたは無効な場合はリフレッシュを試みる
 * @param currentSession {Session | null} 現在のセッション
 * @returns {Promise<Session | null>} 有効なセッション
 */
const getValidSession = async (): Promise<Session | null> => {
  // 最新のセッションを取得
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    LogUtil.log(`セッション取得エラー: ${JSON.stringify(sessionError)}`, { level: 'error' });
    return null;
  }

  const latestSession = sessionData.session;

  // セッションが存在しない場合はnullを返す
  if (!latestSession) {
    return null;
  }

  // セッションが有効な場合はそのまま返す
  if (isSessionValid(latestSession)) {
    return latestSession;
  }

  // セッションが期限切れの場合はリフレッシュを試みる
  LogUtil.log('セッションが期限切れのためリフレッシュを試みます', { level: 'info' });
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

  if (refreshError) {
    LogUtil.log(`セッションリフレッシュエラー: ${JSON.stringify(refreshError)}`, {
      level: 'error',
    });
    return null;
  }

  return refreshData.session;
};

export async function apiRequest<T, B = Record<string, unknown>>(
  endpoint: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    session: Session | null;
    body?: B;
    ctrl?: AbortController;
  }
): Promise<ApiResponse<T>> {
  const { method, body, ctrl } = options;

  // リクエスト前に有効なセッションを取得
  const validSession = await getValidSession();

  if (!validSession) {
    LogUtil.log('有効なセッションが取得できませんでした', { level: 'error' });
    throw new Error('認証セッションが無効です。再度ログインしてください。');
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: createHeaders(validSession),
    body: body ? JSON.stringify(body) : undefined,
    signal: ctrl?.signal,
  });

  const data = await res.json();
  // ユーザー認証に失敗した場合は最新セッションを取得してリトライ
  if (data && data.code == 'C001') {
    LogUtil.log('C001エラー: 最新セッションを取得してリトライします', { level: 'warn' });
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      LogUtil.log(`セッション取得エラー: ${JSON.stringify(sessionError)}`, { level: 'error' });
      throw new Error('認証セッションが無効です。再度ログインしてください。');
    }

    // 最新セッションでリトライ（1回のみ）
    const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: createHeaders(sessionData.session),
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl?.signal,
    });

    const retryData = await retryRes.json();
    if (!retryRes.ok) {
      if (retryData.message && retryData.code) {
        LogUtil.log(JSON.stringify(retryData), { level: 'error', notify: true });
        throw retryData;
      }
      throw new Error(`Other API error: ${retryRes.status} ${retryRes.statusText}`);
    }
    LogUtil.log(`=== apiRequest ${endpoint} (retry) ===`);

    return { data: retryData, error: null };
  }
  if (!res.ok) {
    if (data.message && data.code) {
      LogUtil.log(JSON.stringify(data), { level: 'error', notify: true });
      throw data;
    }
    throw new Error(`Other API error: ${res.status} ${res.statusText}`);
  }
  LogUtil.log(`=== apiRequest ${endpoint} ===`);

  return { data: data, error: null };
}
