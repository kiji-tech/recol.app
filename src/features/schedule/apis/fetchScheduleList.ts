import { Session } from '@supabase/supabase-js';
import { apiRequest } from '@/src/features/commons/apiService';
import { Schedule } from '@/src/features/schedule';

/**
 * スケジュール一覧の取得
 */
export async function fetchScheduleList(
  planId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Schedule[]>(`/v1/schedule/list`, {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
  return response.data!.map((schedule) => new Schedule(schedule));
}

export default fetchScheduleList;
