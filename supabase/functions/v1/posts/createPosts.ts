import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { uploadMediaFiles } from '../libs/uploadMediaFiles.ts';

export const createPosts = async (c: Context, supabase: SupabaseClient, user: User) => {
  const { posts } = await c.req.json();
  const { place_id, body, medias } = posts;

  // DB保存
  const { data, error } = await supabase
    .from('posts')
    .insert({ place_id, body, user_id: user.id })
    .select('*')
    .maybeSingle();

  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
    return c.json({ message: getMessage('C007', ['投稿']), code: 'C007' }, 400);
  }
  // 画像がなければ終了
  if (medias.length == 0) {
    return c.json({ data, error: null });
  }

  // 画像をアップロード
  const filePath = `${user.id}/${data.uid}`;
  const { uploadedImages, error: uploadMediaFileError } = await uploadMediaFiles(
    supabase,
    filePath,
    medias,
    'posts'
  );
  if (uploadMediaFileError) {
    LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
    return c.json({ message: getMessage('C006', ['メディア']), code: 'C006' }, 400);
  }

  // DB更新
  const updateData = {
    medias: uploadedImages,
  };
  LogUtil.log(JSON.stringify(updateData), { level: 'info' });
  const { error: updateError } = await supabase
    .from('posts')
    .update(updateData)
    .eq('uid', data.uid);
  if (updateError) {
    LogUtil.log(JSON.stringify(updateError), { level: 'error', notify: true });
    return c.json({ message: getMessage('C007', ['投稿']), code: 'C007' }, 400);
  }

  return c.json({ data, error: null });
};
