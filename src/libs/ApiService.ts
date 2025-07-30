import { Session } from '@supabase/supabase-js';
import { LogUtil } from './LogUtil';
import { Place } from '../entities/Place';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

type ApiErrorResponse = {
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

async function apiRequest<T, B = Record<string, unknown>>(
  endpoint: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    session: Session | null;
    body?: B;
    ctrl?: AbortController;
  }
): Promise<ApiResponse<T>> {
  const { method, session, body, ctrl } = options;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: createHeaders(session),
    body: body ? JSON.stringify(body) : undefined,
    signal: ctrl?.signal,
  });

  const data = await res.json();
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

// ============ Plan ============

// ============ Schedule ============

// ============ Media ============

// ============ Profile ============

// ============ Cache ============
/**
 * GoogleMap Place情報の取得
 */
async function fetchCachePlace(
  placeIdList: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Place>(`/cache/place`, {
    method: 'POST',
    session,
    body: { placeIdList },
    ctrl,
  });
  return response.data!;
}

// ============ Stripe ============

export { fetchCachePlace };
