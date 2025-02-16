import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
const app = new Hono().basePath('/plan');

/**
 *
 * @param c
 * @returns
 */
const create = async (c: Hono.Context) => {
  console.log('[POST] plan');
  const supabase = generateSupabase(c);
  const { title, from, to, locations } = await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }

  // planを作成
  const { data, error } = await supabase
    .from('plan')
    .insert({ title, from, to, locations, user_id: user.id })
    .select('*');

  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json({ data, error });
};

const update = async (c: Hono.Context) => {
  console.log('[PUT] plan');
  const supabase = generateSupabase(c);
  const { uid, title, from, to, locations, place_id_list } = await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }
  // planを更新
  const { data, error } = await supabase
    .from('plan')
    .update({ title, from, to, locations, place_id_list })
    .eq('uid', uid)
    .eq('user_id', user.id)
    .select('*');

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
  console.log('[GET] plan/');
  const supabase = generateSupabase(c);
  const uid = c.req.param('uid');
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('uid', uid)
    .eq('user_id', user.id)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
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
const list = async (c: Hono.Context) => {
  console.log('[POST] plan/list');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('user_id', user.id)
    .order('from', { ascending: false });
  if (error) {
    console.error(error);
    return c.json(error, 403);
  }
  return c.json(data);
};

app.post('/list', list);
app.get('/:uid', get);
app.post('/', create);
app.put('/', update);
Deno.serve(app.fetch);
