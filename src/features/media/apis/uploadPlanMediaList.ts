import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';

/**
 * プランのメディアをアップロード
 */
export async function uploadPlanMediaList(
  planId: string,
  scheduleId: string | null,
  images: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<void>('/v1/media', {
    method: 'POST',
    session,
    body: { planId, scheduleId, images },
    ctrl,
  });
  return response.data!;
}
