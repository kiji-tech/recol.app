import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
const app = new Hono().basePath('/media');

const list = async (c: Hono.Context) => {
  console.log('[POST] media/list');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);

  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const { planId } = await c.req.json();
  if (!planId) {
    return c.json({ message: getMessage('C009', ['プランID']), code: 'C009' }, 400);
  }

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('plan_id', planId)
    .eq('delete_flag', false);

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C005', ['メディア']), code: 'C005' }, 400);
  }
  return c.json(data);
};

const post = async (c: Hono.Context) => {
  console.log('[POST] media');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);

  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const { planId, images } = await c.req.json();
  if (!planId || !images) {
    return c.json({ message: getMessage('C009', ['プランID､メディア']), code: 'C009' }, 400);
  }

  // ファイル名を生成
  const uploadedImages = [];
  for (const image of images) {
    const base64Data = image.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const fileExt = image.split(';')[0].split('/')[1];
    const filePath = `${planId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('medias').upload(filePath, buffer, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

    if (uploadError) {
      console.error({
        uploadError,
        filePath,
        contentType: `image/${fileExt}`,
      });
      return c.json({ message: getMessage('C006', ['メディア']), code: 'C006' }, 500);
    }
    // 公開URLを取得
    uploadedImages.push(filePath);
  }

  // DBに保存
  for (const url of uploadedImages) {
    const { error } = await supabase.from('media').insert({
      plan_id: planId,
      upload_user_id: user.id,
      url: url,
    });

    if (error) {
      console.error(error);
      return c.json({ message: getMessage('C006', ['メディア']), code: 'C006' }, 500);
    }
  }

  return c.json({ uploadedImages });
};

const deleteMedia = async (c: Hono.Context) => {
  console.log('[POST] media/delete');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);

  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const { planId, mediaIdList } = await c.req.json();
  if (!planId || !mediaIdList) {
    return c.json({ message: getMessage('C009', ['プランID､メディア']), code: 'C009' }, 400);
  }

  const { error } = await supabase
    .from('media')
    .update({ delete_flag: true })
    .in('uid', mediaIdList);

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C008', ['メディア']), code: 'C008' }, 500);
  }

  return c.json({ message: getMessage('C004', ['メディア']), code: 'C004' });
};

app.post('/list', list);
app.post('/', post);
app.post('/delete', deleteMedia);
Deno.serve(app.fetch);
