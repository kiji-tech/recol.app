import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { LogUtil } from '../libs/LogUtil.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

export const deletePosts = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('=== deletePosts Start ===');
  const { posts } = await c.req.json();
  const { uid } = posts;

  const { data, error } = await supabase.from('posts').update({ delete_flag: true }).eq('uid', uid);

  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
    return ResponseUtil.error(c, getMessage('C008', ['投稿']), 'C008', 400);
  }

  return ResponseUtil.success(c, data);
};
