import { apiRequest } from '../../commons/apiService';
import { Schedule } from '../types/Schedule';
import { Session } from '@supabase/supabase-js';

/**
 * スケジュール一覧の取得
 */
export async function fetchScheduleList(
  planId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Schedule[]>(`/schedule/list`, {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
  return response.data!.map((schedule) => new Schedule(schedule));
}

export default fetchScheduleList;
