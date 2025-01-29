import { Session } from '@supabase/supabase-js';

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
    alert('プランの取得に失敗しました');
    return;
  }
  const data = await res.json();
  return data;
};

const fetchPlanList = async (session: Session | null, ctrl?: AbortController) => {
  const res = await fetch(process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/plan/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  if (!res.ok) {
    alert('プラン一覧の取得に失敗しました');
    return;
  }
  const data = await res.json();
  return data;
};

/** */
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
    alert('スケジュールの取得に失敗しました');
    return;
  }
  const data = await res.json();
  return data;
};

/** */
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
    alert('スケジュール一覧の取得に失敗しました');
    return;
  }
  const data = await res.json();
  return data;
};

export { fetchPlan, fetchPlanList, fetchSchedule, fetchScheduleList };
