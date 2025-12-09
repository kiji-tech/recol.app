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

// v1 APIの統一レスポンス形式
type ServerSuccessResponse<T> = {
  success: true;
  data: T;
  error: null;
};

type ServerErrorResponse = {
  success: false;
  data: null;
  error: {
    message: string;
    code: string;
  };
};

type ServerResponse<T> = ServerSuccessResponse<T> | ServerErrorResponse;

const createHeaders = (session: Session | null) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${session?.access_token}`,
});

export async function apiRequest<T, B = Record<string, unknown>>(
  endpoint: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    session: Session | null;
    body?: B;
    ctrl?: AbortController;
  }
): Promise<ApiResponse<T>> {
  const { method, body, ctrl, session } = options;
  LogUtil.log(`=== start apiRequest ${endpoint} ===`);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: createHeaders(session),
    body: body ? JSON.stringify(body) : undefined,
    signal: ctrl?.signal,
  });

  const serverData: ServerResponse<T> = await res.json();

  // ユーザー認証に失敗した場合は最新セッションを取得してリトライ
  if (!serverData.success && serverData.error?.code === 'C001') {
    LogUtil.log('C001エラー: 最新セッションを取得してリトライします', { level: 'warn' });
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      LogUtil.log(`セッション取得エラー: ${JSON.stringify(sessionError)}`, { level: 'warn' });
      throw new Error('認証セッションが無効です。再度ログインしてください。');
    }

    // 最新セッションでリトライ（1回のみ）
    const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: createHeaders(sessionData.session),
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl?.signal,
    });

    const retryServerData: ServerResponse<T> = await retryRes.json();

    if (!retryRes.ok || !retryServerData.success) {
      if (retryServerData.success === false && retryServerData.error) {
        LogUtil.log(JSON.stringify(retryServerData.error), { level: 'error', notify: true });
        throw retryServerData.error;
      }
      throw new Error(`Other API error: ${retryRes.status} ${retryRes.statusText}`);
    }
    LogUtil.log(`=== apiRequest ${endpoint} (retry) ===`);

    return { data: retryServerData.data, error: null };
  }

  // エラーレスポンスの処理
  if (!res.ok || !serverData.success) {
    if (serverData.success === false && serverData.error) {
      LogUtil.log(JSON.stringify(serverData.error), { level: 'error', notify: true });
      throw serverData.error;
    }
    throw new Error(`Other API error: ${res.status} ${res.statusText}`);
  }

  LogUtil.log(`=== completed apiRequest ${endpoint} ===`);
  return { data: serverData.data, error: null };
}
