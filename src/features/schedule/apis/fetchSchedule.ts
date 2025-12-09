import { Session } from '@supabase/supabase-js';
import { apiRequest } from '@/src/features/commons/apiService';
import { Schedule } from '@/src/features/schedule';

/**
 * スケジュール情報の取得
 */
export async function fetchSchedule(
  scheduleId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Schedule>(`/v1/schedule/${scheduleId}`, {
    method: 'GET',
    session,
    ctrl,
  });
  return new Schedule(response.data!);
}
