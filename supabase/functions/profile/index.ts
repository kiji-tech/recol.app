import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
const app = new Hono().basePath('/profile');

const update = async (c: Hono.Context) => {
  console.log('[PUT] profile');
  const supabase = generateSupabase();
  const { display_name, avatar_url } = await c.req.json();

  // avatar_urlをストレージに保存する

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }
  // planを更新
  const { data, error } = await supabase
    .from('profile')
    .upsert({ uid: user.id, display_name, avatar_url }, { onConflict: 'uid' })
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
  const supabase = generateSupabase();
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
