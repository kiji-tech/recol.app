import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

const app = new Hono().basePath('/schedule');
const TTL = 60 * 60 * 24 * 25; // 25日
const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';
const FiledMaskValue =
  'id,types,reviews,displayName,formattedAddress,rating,location,photos,websiteUri,editorialSummary,currentOpeningHours.openNow,currentOpeningHours.weekdayDescriptions,googleMapsUri,googleMapsLinks.*';

const searchId = async (placeId: string) => {
  const response = await fetch(`${GOOGLE_MAPS_API_URL}/${placeId}?languageCode=ja`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': Deno.env.get('GOOGLE_MAPS_API_KEY') || '',
      'X-Goog-FieldMask': FiledMaskValue,
    }),
  }).then(async (response) => await response.text());

  return response;
};

const fetchPlaceInfo = async (supabase: SupabaseClient, placeId: string) => {
  const key = `google-place/${placeId}`;
  const { data: cachePlaceData } = await supabase.storage.from('caches').download(key);
  if (cachePlaceData) {
    LogUtil.log(`[fetchPlaceInfo] ${placeId} HIT!!!`, { level: 'info' });
    const buf = await cachePlaceData.arrayBuffer();
    return JSON.parse(new TextDecoder().decode(buf));
  }

  LogUtil.log(`[fetchPlaceInfo] ${placeId} MISS!!!`, { level: 'info' });
  const placeData = await searchId(placeId);
  if (placeData) {
    // キャッシュに保存
    const { error: storageSaveError } = await supabase.storage
      .from('caches')
      .upload(key, placeData, {
        upsert: true,
        contentType: 'application/json',
        cacheControl: TTL,
      });
    if (storageSaveError) {
      console.error('キャッシュ保存エラー');
      console.error(storageSaveError);
    }
    return JSON.parse(placeData);
  }
  return null;
};

const get = async (c: Hono.Context) => {
  const scheduleId = c.req.param('id');
  console.log(`[GET] schedule/${scheduleId}`);
  const supabase = generateSupabase(c);
  const { data: schedule, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('id', scheduleId)
    .maybeSingle();

  if (error) {
    return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
  }

  if (schedule) {
    const { place_list } = schedule;
    const placeList = [];
    for (const placeId of place_list) {
      const placeData = await fetchPlaceInfo(supabase, placeId);
      if (placeData) {
        placeList.push(placeData);
      }
      schedule.place_list = placeList;
    }
  }

  return c.json(schedule);
};

const list = async (c: Hono.Context) => {
  console.log(`[POST] schedule/list`);
  const { planId } = await c.req.json();
  const supabase = generateSupabase(c);
  const { data: scheduleList, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('plan_id', planId)
    .eq('delete_flag', false);

  if (error) {
    return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
  }

  if (scheduleList) {
    for (const schedule of scheduleList) {
      const { place_list } = schedule;
      const placeList = [];
      for (const placeId of place_list) {
        const placeData = await fetchPlaceInfo(supabase, placeId);
        if (placeData) {
          placeList.push(placeData);
        }
        schedule.place_list = placeList;
      }
    }
  }
  console.log({ scheduleList });
  return c.json(scheduleList);
};

const upsert = async (c: Hono.Context) => {
  console.log('[UPSERT] schedule/:id');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { schedule } = await c.req.json();
  // scheduleの更新
  const { data, error } = await supabase
    .from('schedule')
    .upsert(
      {
        ...schedule,
        place_list: schedule.place_list.map((place: { id: string }) => place.id),
      },
      { onConflict: 'uid' }
    )
    .select('*');
  if (error) {
    return c.json({ message: getMessage('C007', ['スケジュール']), code: 'C007' }, 400);
  }

  return c.json(data);
};

const deleteSchedule = async (c: Hono.Context) => {
  console.log('[DELETE] schedule/:id');
  const supabase = generateSupabase(c);
  const { uid } = await c.req.json();
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  // 削除フラグの更新
  const { data, error } = await supabase
    .from('schedule')
    .update({ delete_flag: true })
    .eq('uid', uid);
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C008', ['スケジュール']), code: 'C008' }, 400);
  }
  return c.json(data);
};

app.get('/:id', get);
app.post('/list', list);
app.post('/delete', deleteSchedule);
app.post('/', upsert);

Deno.serve(app.fetch);
