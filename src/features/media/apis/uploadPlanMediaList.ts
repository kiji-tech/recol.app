import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';

/**
 * プランのメディアをアップロード
 */
export async function uploadPlanMediaList(
  planId: string,
  images: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<void>('/media', {
    method: 'POST',
    session,
    body: { planId, images },
    ctrl,
  });
  return response.data!;
}
