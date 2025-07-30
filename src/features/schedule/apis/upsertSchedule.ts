import { apiRequest } from '../../commons/apiService';
import { Schedule } from '../types/Schedule';
import { Session } from '@supabase/supabase-js';

/**
 * スケジュールの作成・更新
 */
export async function upsertSchedule(
  schedule: Schedule,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Schedule>('/schedule', {
    method: 'POST',
    session,
    body: { schedule },
    ctrl,
  });
  return response.data!;
}
