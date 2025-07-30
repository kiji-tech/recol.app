import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Media } from '../types/Media';

/**
 * プランのメディア一覧を取得
 */
export async function fetchPlanMediaList(
  planId: string,
  session: Session | null,
  ctrl?: AbortController
): Promise<Media[]> {
  const response = await apiRequest<Media[]>('/media/list', {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
    
    
  return response.data?.map((data) => new Media(data)) || [];
}
