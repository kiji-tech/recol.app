import { Context } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';
import { LogUtil } from '../../libs/LogUtil.ts';

export const fetchPostsList = async (c: Context) => {
  LogUtil.log('fetchPostsList', { level: 'info' });
  const supabase = generateSupabase(c);
  const { option } = await c.req.json();
  LogUtil.log(JSON.stringify(option), { level: 'info' });
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profile(*)')
    .eq('delete_flag', false)
    .range(option.offset, option.limit + option.offset)
    .order('created_at', { ascending: false });

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  LogUtil.log(posts.length, { level: 'info' });

  return c.json(posts);
};
 