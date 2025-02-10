import { Session } from '@supabase/supabase-js';
import { Tables } from './database.types';

/**
 * プラン情報の取得
 *
 * @param planId {string}
 * @param session  {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'plan'>
 */
const fetchPlan = async (planId: string, session: Session | null, ctrl?: AbortController) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/plan/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    signal: ctrl?.signal,
  });
  if (!res.ok) {
    throw res;
  }
  const data = await res.json();
  return data as Tables<'plan'> & { schedule: Tables<'schedule'>[] };
};

/**
 * プラン一覧の取得
 *
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'plan'> & { schedule: Tables<'schedule'>[] }[]
 */
const fetchPlanList = async (session: Session | null, ctrl?: AbortController) => {
  const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    signal: ctrl?.signal,
  });
  if (!res.ok) {
    throw res;
  }
  const data = await res.json();
  return data as Tables<'plan'> & { schedule: Tables<'schedule'>[] }[];
};

/**
 * スケジュール情報の取得
 *
 * @param scheduleId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>
 */
const fetchSchedule = async (
  scheduleId: string,
  session: Session | null,
  ctrl?: AbortController
) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule/${scheduleId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      signal: ctrl?.signal,
    }
  );
  if (!res.ok) {
    throw res;
  }
  const data = await res.json();
  return data as Tables<'schedule'>;
};

/**
 * スケジュール一覧の取得
 *
 * @param planId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>[]
 */
const fetchScheduleList = async (
  planId: string,
  session: Session | null,
  ctrl?: AbortController
) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule/${planId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    signal: ctrl?.signal,
  });
  if (!res.ok) {
    throw res;
  }
  const data = await res.json();
  return data as Tables<'schedule'>[];
};

/**
 * スケジュールの削除
 *
 * @param uid {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 */
const deleteSchedule = async (uid: string, session: Session | null, ctrl?: AbortController) => {
  const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      uid,
    }),
    signal: ctrl?.signal,
  });
  if (!res.ok) {
    throw res;
  }
  return;
};

export { fetchPlan, fetchPlanList, fetchSchedule, fetchScheduleList, deleteSchedule };
