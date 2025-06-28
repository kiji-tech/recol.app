import { Hono } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';
import { LogUtil } from '../libs/LogUtil.ts';

const app = new Hono().basePath('/cache');
const TTL = 60 * 60 * 24 * 25; // 25日
const GOOGLE_MAPS_API_URL = 'https://places.googleapis.com/v1/places';
const FiledMaskValue =
  'id,types,reviews,displayName,formattedAddress,rating,location,photos,websiteUri,editorialSummary,currentOpeningHours.openNow,currentOpeningHours.weekdayDescriptions,googleMapsUri,googleMapsLinks.*';

const searchId = async (placeId: string) => {
  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY') || '';
  const url =
    `${GOOGLE_MAPS_API_URL}/${encodeURIComponent(placeId)}` +
    `?fields=${encodeURIComponent(FiledMaskValue)}` +
    `&languageCode=ja`;

  const upstream = await fetch(url, {
    headers: { 'X-Goog-Api-Key': apiKey },
  });
  if (!upstream.ok) {
    console.error(await upstream.json());
    return null;
  }
  return await upstream.text();
};

const getPlace = async (c: Hono.Context) => {
  LogUtil.log('[POST] /cache/place', { level: 'info' });
  const { placeIdList } = await c.req.json();
  LogUtil.log(JSON.stringify({ placeIdList }), { level: 'info' });

  const supabase = generateSupabase(c);

  const placeDataList = [];
  for (const placeId of placeIdList) {
    const key = `google-place/${placeId}`;
    const { data: cachePlaceData } = await supabase.storage.from('caches').download(key);
    if (cachePlaceData) {
      LogUtil.log(`[getPlace] ${placeId} HIT!!!`, { level: 'info' });
      const buf = await cachePlaceData.arrayBuffer();
      placeDataList.push(JSON.parse(new TextDecoder().decode(buf)));
      continue;
    }

    LogUtil.log(`[getPlace] ${placeId} MISS!!!`, { level: 'info' });
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
      placeDataList.push(JSON.parse(placeData));
    }
  }
  return c.json(placeDataList, 200, {
    'Cache-Control': `public, max-age=${TTL}`,
  });
};

const getGooglePlacePhoto = async (c: Hono.Context) => {
  LogUtil.log('[GET] /cache/google-place/photo/:id', { level: 'info' });
  const id = c.req.param('id');
  const supabase = generateSupabase(c);
  // safeIdからSHA-256ハッシュ値を生成し、16進文字列としてUUID代わりに利用
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const uuid = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const key = `google-place-photo/${uuid}`;

  // Storageを検索
  LogUtil.log(`[getGooglePlacePhoto] ${key}`, { level: 'info' });
  const { data: cacheData } = await supabase.storage.from('caches').download(key);

  if (cacheData) {
    LogUtil.log(`[getGooglePlacePhoto] ${key} HIT!!!`, { level: 'info' });
    const buf = await cacheData.arrayBuffer();
    return c.body(buf, 200, {
      'Content-Type': 'image/*',
      'Cache-Control': `public, max-age=${TTL}`,
    });
  }
  LogUtil.log(`[getGooglePlacePhoto] ${key} MISS!!!`, { level: 'info' });

  // なければGoogleAPIから取得
  LogUtil.log(`[getGooglePlacePhoto] GoogleAPIから取得`, { level: 'info' });
  const upstream = await fetch(
    `https://places.googleapis.com/v1/${id}/media?key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}&maxWidthPx=1980`,
    { redirect: 'follow' }
  );
  if (!upstream.ok) {
    return c.json({ message: 'GoogleAPIから取得できませんでした', code: 'C007' }, 500);
  }
  const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
  const buf = new Uint8Array(await upstream.arrayBuffer());
  // 取得したらStorageに保存
  const { error: storageError } = await supabase.storage.from('caches').upload(key, buf, {
    contentType,
    cacheControl: TTL,
    upsert: true,
  });
  if (storageError) {
    LogUtil.log(`[getGooglePlacePhoto] ${key} Storageに保存できませんでした`, {
      level: 'error',
    });
    LogUtil.log(JSON.stringify({ storageError }), { level: 'error' });
  }
  // 返却
  return c.body(buf, 200, {
    'Content-Type': contentType,
    'Cache-Control': `public, max-age=${TTL}`,
  });
};

app.post('/place', getPlace);
app.get('/google-place/photo/:id', getGooglePlacePhoto);
Deno.serve(app.fetch);
