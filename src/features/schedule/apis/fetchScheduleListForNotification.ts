import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Schedule } from '../types/Schedule';

/**
 * 通知を追加するスケジュール一覧の取得
 */
export async function fetchScheduleListForNotification(
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Schedule[]>(`/v1/schedule/list/notification`, {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!.map((schedule) => new Schedule(schedule));
}
