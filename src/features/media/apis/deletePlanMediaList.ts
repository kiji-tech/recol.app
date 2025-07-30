import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';

/**
 * プランのメディアを削除
 */
export async function deletePlanMediaList(
  planId: string,
  mediaIdList: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  await apiRequest<void>('/media/delete', {
    method: 'POST',
    session,
    body: { planId, mediaIdList },
    ctrl,
  });
}
