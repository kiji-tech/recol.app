import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
const app = new Hono().basePath('/profile');

const get = async (c: Hono.Context) => {
  console.log('[GET] profile');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data, error } = await supabase
    .from('profile')
    .select('*, subscription(*)')
    .eq('uid', user.id)
    .eq('subscription.user_id', user.id)
    .eq('subscription.status', 'active')
    .maybeSingle();
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  return c.json(data);
};

const update = async (c: Hono.Context) => {
  console.log('[PUT] profile');
  const supabase = generateSupabase(c);
  const { display_name, avatar_url } = await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  // 古いアバター画像を削除
  const { data: oldProfile } = await supabase
    .from('profile')
    .select('avatar_url')
    .eq('uid', user.id)
    .maybeSingle();

  let finalAvatarUrl = oldProfile?.avatar_url || null;
  if (avatar_url && avatar_url.startsWith('data:image')) {
    // Base64画像をデコード
    const base64Data = avatar_url.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // ファイル名を生成
    const fileExt = avatar_url.split(';')[0].split('/')[1];
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    if (oldProfile?.avatar_url) {
      const oldFilePath = oldProfile.avatar_url.split('/').pop();
      if (oldFilePath) {
        await supabase.storage.from('avatars').remove([oldFilePath]);
      }
    }
    // 新しいアバター画像をアップロード
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, buffer, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

    if (uploadError) {
      console.error({
        uploadError,
        filePath,
        contentType: `image/${fileExt}`,
      });
      return c.json({ message: getMessage('C006', ['アバター']), code: 'C006' }, 500);
    }

    // 公開URLを取得
    finalAvatarUrl = filePath;
  }

  // プロフィールを更新
  const { data, error } = await supabase
    .from('profile')
    .upsert({ uid: user.id, display_name, avatar_url: finalAvatarUrl }, { onConflict: 'uid' })
    .select('*, subscription(*)')
    .eq('subscription.user_id', user.id)
    .eq('subscription.status', 'active')
    .maybeSingle();

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['プロフィール']), code: 'C007' }, 400);
  }

  return c.json(data);
};

app.get('/', get);
app.put('/', update);
Deno.serve(app.fetch);
