import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

export const createPosts = async (c: Context, supabase: SupabaseClient, user: User) => {
  const { posts } = await c.req.json();

  const { data, error } = await supabase
    .from('posts')
    .insert({ ...posts, user_id: user.id })
    .select('*')
    .maybeSingle();

  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
    return c.json({ message: getMessage('C007', ['投稿']), code: 'C007' }, 400);
  }

  return c.json({ data, error: null });
};
