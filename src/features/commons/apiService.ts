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

  const data = await res.json();
  // ユーザー認証に失敗した場合は最新セッションを取得してリトライ
  if (data && data.code == 'C001') {
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
  LogUtil.log(`=== completed apiRequest ${endpoint} ===`);

  return { data: data, error: null };
}
