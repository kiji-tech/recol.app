import { Context } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';

export const fetchPostsList = async (c: Context) => {
  const supabase = generateSupabase(c);
  const { option } = await c.req.json();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profile(*)')
    .eq('delete_flag', false)
    .range(option.offset, option.limit + option.offset)
    .order('created_at', { ascending: false });

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  return c.json(posts);
};
