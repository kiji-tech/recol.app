import { Session } from '@supabase/supabase-js';
import { apiRequest } from '@/src/features/commons/apiService';
import { Schedule } from '@/src/features/schedule';

/**
 * スケジュールの作成・更新
 */
export async function upsertSchedule(
  schedule: Schedule,
  session: Session | null,
  ctrl?: AbortController
): Promise<Schedule> {
  const response = await apiRequest<Schedule>('/v1/schedule', {
    method: 'POST',
    session,
    body: { schedule },
    ctrl,
  });
  return response.data!;
}
