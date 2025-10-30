import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { LogUtil } from '../libs/LogUtil.ts';
import {
  PlaceData,
  Schedule,
  Plan,
  ScheduleWithPlaceData,
  PlanWithEnrichedSchedule,
} from '../libs/types.ts';

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
  schedule: Schedule[]
): Promise<ScheduleWithPlaceData[]> => {
  const enrichedSchedule: ScheduleWithPlaceData[] = [];

  for (const sc of schedule) {
    const { place_list } = sc;
    const placeList: PlaceData[] = [];

    if (place_list) {
      for (const placeId of place_list) {
        const placeData = await fetchPlaceInfo(supabase, placeId);
        if (placeData) {
          placeList.push(placeData);
        }
      }
    }

    enrichedSchedule.push({
      ...sc,
      place_list: placeList,
    });
  }

  return enrichedSchedule;
};

export const enrichPlanListWithPlaceData = async (
  supabase: SupabaseClient,
  planList: (Plan & { schedule: Schedule[] })[]
): Promise<PlanWithEnrichedSchedule[]> => {
  const enrichedPlanList: PlanWithEnrichedSchedule[] = [];

  if (planList && planList.length > 0) {
    for (const plan of planList) {
      const { schedule } = plan;
      const enrichedSchedule = await enrichScheduleWithPlaceData(supabase, schedule);

      enrichedPlanList.push({
        ...plan,
        schedule: enrichedSchedule,
      });
    }
  }

  return enrichedPlanList;
};
