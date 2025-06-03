import { Session } from '@supabase/supabase-js';
import { Tables } from './database.types';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
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
  try {
    const { method, session, body, ctrl } = options;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: createHeaders(session),
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl?.signal,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// ============ Plan ============
/**
 * プラン情報の取得
 *
 * @param planId {string}
 * @param session  {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'plan'>
 */
async function fetchPlan(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'plan'> & { schedule: Tables<'schedule'>[] }>(
    `/plan/${planId}`,
    { method: 'GET', session, ctrl }
  );
  if (response.error) throw response.error;
  return response.data!;
}

/**
 * プラン一覧の取得
 *
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'plan'> & { schedule: Tables<'schedule'>[] }[]
 */
async function fetchPlanList(
  session: Session | null,
  ctrl?: AbortController
): Promise<(Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]> {
  const response = await apiRequest<(Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]>(
    '/plan/list',
    { method: 'POST', session, ctrl }
  );
  if (response.error) throw response.error;
  return response.data!;
}

async function deletePlan(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<void>('/plan/delete', {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
  if (response.error) throw response.error;
}

// ============ Schedule ============
/**
 * スケジュール情報の取得
 *
 * @param scheduleId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>
 */
async function fetchSchedule(scheduleId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'schedule'>>(`/schedule/${scheduleId}`, {
    method: 'GET',
    session,
    ctrl,
  });
  if (response.error) throw response.error;
  return response.data!;
}

/**
 * スケジュール一覧の取得
 *
 * @param planId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>[]
 */
async function fetchScheduleList(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'schedule'>[]>(`/schedule/${planId}`, {
    method: 'GET',
    session,
    ctrl,
  });
  if (response.error) throw response.error;
  return response.data!;
}

/**
 * スケジュールの削除
 *
 * @param uid {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 */
async function deleteSchedule(uid: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<void>('/schedule/delete', {
    method: 'POST',
    session,
    body: { uid },
    ctrl,
  });
  if (response.error) throw response.error;
}

/**
 * スケジュールの作成・更新
 *
 * @param schedule {Tables<'schedule'>}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>
 */
async function upsertSchedule(
  schedule: Tables<'schedule'>,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Tables<'schedule'>[]>('/schedule', {
    method: 'POST',
    session,
    body: { schedule },
    ctrl,
  });
  if (response.error) throw response.error;
  return response.data!;
}

// ============ Profile ============
async function getProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'profile'>>('/profile', {
    method: 'GET',
    session,
    ctrl,
  });
  if (response.error) throw response.error;
  return response.data!;
}

async function updateProfile(
  displayName: string,
  avatarUrl: string | null,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Tables<'profile'>>('/profile', {
    method: 'PUT',
    session,
    body: {
      display_name: displayName,
      avatar_url: avatarUrl,
    },
    ctrl,
  });
  if (response.error) throw response.error;
  return response.data!;
}

// ============ MicroCMS ============
async function fetchBlog(id: string, ctrl?: AbortController) {
  const url = process.env.EXPO_PUBLIC_MICROCMS_URI! + '/blogs/' + id;
  console.log({ url });
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
    signal: ctrl?.signal,
  });
  if (!response.ok) throw new Error('Failed to fetch blog');
  return response.json();
}

async function fetchBlogList() {
  const response = await fetch(process.env.EXPO_PUBLIC_MICROCMS_URI! + '/blogs', {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog list');
  }

  const data = await response.json();
  return data.contents;
}

export {
  fetchPlan,
  fetchPlanList,
  deletePlan,
  fetchSchedule,
  fetchScheduleList,
  deleteSchedule,
  upsertSchedule,
  getProfile,
  updateProfile,
  fetchBlog,
  fetchBlogList,
};
