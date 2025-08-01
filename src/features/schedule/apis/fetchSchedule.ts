import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Schedule } from '../types/Schedule';

/**
 * スケジュール情報の取得
 */
export async function fetchSchedule(
  scheduleId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Schedule>(`/schedule/${scheduleId}`, {
    method: 'GET',
    session,
    ctrl,
  });
  return response.data!;
}
