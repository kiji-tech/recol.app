import { Session } from '@supabase/supabase-js';
import { Place, fetchCachePlace } from '@/src/features/map';
import { i18n } from '@/src/libs/i18n';
const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';
const FiledMaskValue = 'places.id';

export const searchPlaceByText = async (
  session: Session | null,
  latitude: number,
  longitude: number,
  text: string,
  radius: number = 2000
): Promise<Place[]> => {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}:searchText`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
    body: JSON.stringify({
      textQuery: text,
      maxResultCount: process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAX_RESULT_COUNT || 3,
      languageCode: i18n.locale || 'en',
      locationBias: {
        circle: {
          center: {
            latitude: latitude,
            longitude,
          },
          radius,
        },
      },
    }),
  }).then(async (response) => {
    const { places } = await response.json();
    // cacheから取得する
    const cachePlaces = await fetchCachePlace(
      places.map((place: { id: string }) => place.id),
      session
    );
    return cachePlaces;
  });
  return response as unknown as Place[];
};
