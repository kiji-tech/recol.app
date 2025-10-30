import { Place } from '@/src/features/map/types/Place';
import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';

/**
 * GoogleMap Place情報の取得
 */
async function fetchCachePlace(
  placeIdList: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Place>(`/cache/place`, {
    method: 'POST',
    session,
    body: { placeIdList },
    ctrl,
  });
  return response.data!;
}

export { fetchCachePlace };
