import { Context } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

export const createPostsReport = async (c: Context) => {
  LogUtil.log('=== createPostsReport ===', { level: 'info' });
  const supabase = generateSupabase(c);
  const { postsReports } = await c.req.json();
  const { user_id, posts_id, category_id, body } = postsReports;

  const { data, error } = await supabase.from('posts_report').insert({
    user_id,
    posts_id,
    category_id,
    body,
  });

  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
    return ResponseUtil.error(c, error.message, 'C007', 500);
  }

  return ResponseUtil.success(c, data);
};
