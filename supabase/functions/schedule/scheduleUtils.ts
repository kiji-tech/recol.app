import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { LogUtil } from '../libs/LogUtil.ts';
import { PlaceData, Schedule } from '../libs/types.ts';

const TTL = 60 * 60 * 24 * 25; // 25日
const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';
const FiledMaskValue =
  'id,types,reviews,displayName,formattedAddress,rating,location,photos,websiteUri,editorialSummary,currentOpeningHours.openNow,currentOpeningHours.weekdayDescriptions,googleMapsUri,googleMapsLinks.*';

const searchPlaceById = async (placeId: string) => {
  LogUtil.log(`[searchPlaceById] 開始: ${placeId}`, { level: 'info' });

  const response = await fetch(`${GOOGLE_MAPS_API_URL}/${placeId}?languageCode=ja`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': Deno.env.get('GOOGLE_MAPS_API_KEY') || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
  });

  const responseText = await response.text();
  LogUtil.log(`[searchPlaceById] 完了: ${placeId}`, { level: 'info' });

  return responseText;
};

const getCachedPlaceData = async (supabase: SupabaseClient, placeId: string) => {
  const key = `google-place/${placeId}`;
  const { data: cachePlaceData } = await supabase.storage.from('caches').download(key);

  if (cachePlaceData) {
    LogUtil.log(`[getCachedPlaceData] キャッシュヒット: ${placeId}`, { level: 'info' });
    const buf = await cachePlaceData.arrayBuffer();
    return JSON.parse(new TextDecoder().decode(buf));
  }

  LogUtil.log(`[getCachedPlaceData] キャッシュミス: ${placeId}`, { level: 'info' });
  return null;
};

const savePlaceDataToCache = async (
  supabase: SupabaseClient,
  placeId: string,
  placeData: string
) => {
  const key = `google-place/${placeId}`;
  const { error: storageSaveError } = await supabase.storage.from('caches').upload(key, placeData, {
    upsert: true,
    contentType: 'application/json',
    cacheControl: TTL.toString(),
  });

  if (storageSaveError) {
    LogUtil.log('キャッシュ保存エラー', {
      level: 'error',
      notify: true,
      error: storageSaveError,
      additionalInfo: { placeId, key },
    });
    return false;
  }

  LogUtil.log(`[savePlaceDataToCache] 保存完了: ${placeId}`, { level: 'info' });
  return true;
};

export const fetchPlaceInfo = async (
  supabase: SupabaseClient,
  placeId: string
): Promise<PlaceData | null> => {
  LogUtil.log(`[fetchPlaceInfo] 開始: ${placeId}`, { level: 'info' });

  const cachedData = await getCachedPlaceData(supabase, placeId);
  if (cachedData) {
    return cachedData;
  }

  const placeData = await searchPlaceById(placeId);
  if (placeData) {
    await savePlaceDataToCache(supabase, placeId, placeData);
    return JSON.parse(placeData);
  }

  LogUtil.log(`[fetchPlaceInfo] データ取得失敗: ${placeId}`, { level: 'warn' });
  return null;
};

export const enrichScheduleWithPlaceData = async (
  supabase: SupabaseClient,
  schedule: Schedule
): Promise<Schedule & { place_list: PlaceData[] }> => {
  const { place_list } = schedule;
  const placeList: PlaceData[] = [];

  if (place_list) {
    for (const placeId of place_list) {
      const placeData = await fetchPlaceInfo(supabase, placeId);
      if (placeData) {
        placeList.push(placeData);
      }
    }
  }

  return {
    ...schedule,
    place_list: placeList,
  } as Schedule & { place_list: PlaceData[] };
};

export const enrichScheduleListWithPlaceData = async (
  supabase: SupabaseClient,
  scheduleList: Schedule[]
): Promise<Schedule[] & { place_list: PlaceData[] }[]> => {
  const enrichedScheduleList: (Schedule & { place_list: PlaceData[] })[] = [];

  for (const schedule of scheduleList) {
    const enrichedSchedule = await enrichScheduleWithPlaceData(supabase, schedule);
    enrichedScheduleList.push(enrichedSchedule);
  }

  return enrichedScheduleList;
};
