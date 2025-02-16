import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
const app = new Hono().basePath('/profile');

const update = async (c: Hono.Context) => {
  console.log('[PUT] profile');
  const supabase = generateSupabase(c);
  const { display_name, avatar_url } = await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }

  let finalAvatarUrl = avatar_url;
  if (avatar_url && avatar_url.startsWith('data:image')) {
    // Base64画像をデコード
    const base64Data = avatar_url.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // ファイル名を生成
    const fileExt = avatar_url.split(';')[0].split('/')[1];
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 古いアバター画像を削除
    const { data: oldProfile } = await supabase
      .from('profile')
      .select('avatar_url')
      .eq('uid', user.id)
      .maybeSingle();

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
      console.log({
        uploadError,
        filePath,
        contentType: `image/${fileExt}`,
      });
      return c.json({ error: 'Failed to upload avatar' }, 500);
    }

    // 公開URLを取得
    finalAvatarUrl = filePath;
  }

  // プロフィールを更新
  const { data, error } = await supabase
    .from('profile')
    .upsert({ uid: user.id, display_name, avatar_url: finalAvatarUrl }, { onConflict: 'uid' })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json(data);
};

/**
 *
 * @param c
 * @returns
 */
const get = async (c: Hono.Context) => {
  console.log('[GET] profile');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('uid', user.id)
    .maybeSingle();
  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json(data);
};
app.get('/', get);
app.put('/', update);
Deno.serve(app.fetch);
