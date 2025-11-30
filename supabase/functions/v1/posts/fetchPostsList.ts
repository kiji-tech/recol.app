import { Context } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';

export const fetchPostsList = async (c: Context) => {
  const supabase = generateSupabase(c);
  const { option } = await c.req.json();
  console.log({ option });
  const { data: posts, error } = await supabase.from('posts').select('*, profile(*)');
  // .limit(option.limit)
  // .offset(option.offset);

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  return c.json(posts);
};
