import { Context, Hono } from 'jsr:@hono/hono';
import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

const app = new Hono().basePath('/plan');

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
    console.log(cachePlaceData);
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
        cacheControl: TTL.toString(),
      });
    if (storageSaveError) {
      console.error('キャッシュ保存エラー');
      console.error(storageSaveError);
    }
    return JSON.parse(placeData);
  }
  return null;
};

const create = async (c: Context) => {
  console.log('[POST] plan');
  const supabase = generateSupabase(c);
  const { title, memo } = await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  // planを作成
  const { data, error } = await supabase
    .from('plan')
    .insert({ title, memo, user_id: user.id })
    .select('*');

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C006', ['プラン']), code: 'C006' }, 403);
  }

  return c.json({ data, error });
};

const update = async (c: Context) => {
  console.log('[PUT] plan');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);

  if (!user) {
    return c.json({ message: getMessage('C001') }, 403);
  }

  const { uid, title, memo } = await c.req.json();
  // planを更新
  const { data, error } = await supabase
    .from('plan')
    .update({ title, memo })
    .eq('uid', uid)
    .eq('user_id', user.id)
    .select('*');

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['プラン']) }, 403);
  }

  return c.json(data);
};

const get = async (c: Context) => {
  console.log('[GET] plan/:uid');
  const supabase = generateSupabase(c);
  const uid = c.req.param('uid');
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data: plan, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('uid', uid)
    .eq('user_id', user.id)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .maybeSingle();
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 403);
  }

  if (plan) {
    const { schedule } = plan;
    for (const sc of schedule) {
      const { place_list } = sc;
      const placeList = [];
      for (const placeId of place_list) {
        const placeData = await fetchPlaceInfo(supabase, placeId);
        if (placeData) {
          placeList.push(placeData);
        }
      }
      sc.place_list = placeList;
    }
  }

  return c.json(plan);
};

const list = async (c: Context) => {
  console.log('[POST] plan/list');
  const supabase = generateSupabase(c, false);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data: planList, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('user_id', user.id)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 403);
  }

  if (planList && planList.length > 0) {
    for (const plan of planList) {
      const { schedule } = plan;
      for (const sc of schedule) {
        const { place_list } = sc;
        const placeList = [];
        for (const placeId of place_list) {
          const placeData = await fetchPlaceInfo(supabase, placeId);
          if (placeData) {
            placeList.push(placeData);
          }
        }
        sc.place_list = placeList;
      }
    }
  }
  return c.json(planList);
};

const deletePlan = async (c: Context) => {
  console.log('[POST] plan/delete');
  const supabase = generateSupabase(c);
  const { planId } = await c.req.json();
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data, error } = await supabase
    .from('plan')
    .update({ delete_flag: true })
    .eq('uid', planId)
    .eq('user_id', user.id);
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C008'), code: 'C008' }, 403);
  }
  return c.json(data);
};

app.get('/:uid', get);
app.post('/list', list);
app.post('/', create);
app.put('/', update);
app.post('/delete', deletePlan);
Deno.serve(app.fetch);
