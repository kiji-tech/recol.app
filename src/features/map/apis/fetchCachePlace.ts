import { Place } from '@/src/features/map/types/Place';
import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import i18n from '@/src/libs/i18n';

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
    body: { placeIdList, languageCode: i18n.locale || 'ja' },
    ctrl,
  });
  return response.data!;
}

export { fetchCachePlace };
