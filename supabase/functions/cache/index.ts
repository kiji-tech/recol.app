import { Hono } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';
import { LogUtil } from '../libs/LogUtil.ts';

const app = new Hono().basePath('/cache');

const getGooglePlacePhoto = async (c: Hono.Context) => {
  LogUtil.log('[GET] /cache/google-place/photo', { level: 'info' });
  const TTL = 60 * 60 * 24 * 25; // 25日
  const id = c.req.param('id');
  const supabase = generateSupabase(c);
  // safeIdからSHA-256ハッシュ値を生成し、16進文字列としてUUID代わりに利用
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const uuid = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  const key = `google-place-photo/${uuid}`;
  console.log({ key });

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
  console.log({ contentType });
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

app.get('/google-place/photo/:id', getGooglePlacePhoto);
Deno.serve(app.fetch);
