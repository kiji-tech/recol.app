import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Media, MediaType } from '../types/Media';

/**
 * プランのメディア一覧を取得
 */
export async function fetchPlanMediaList(
  planId: string,
  session: Session | null,
  ctrl?: AbortController
): Promise<Media[]> {
  const response = await apiRequest<MediaType[]>('/v1/media/list', {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });

  return response.data?.map((data) => new Media(data)) || [];
}
