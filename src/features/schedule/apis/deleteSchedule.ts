import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Schedule } from '../types/Schedule';

/**
 * スケジュールの削除
 */
export async function deleteSchedule(
  schedule: Schedule,
  session: Session | null,
  ctrl?: AbortController
) {
  await apiRequest<void>('/v1/schedule/delete', {
    method: 'POST',
    session,
    body: { uid: schedule.uid },
    ctrl,
  });
}
