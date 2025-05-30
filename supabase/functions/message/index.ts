import { Hono } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';
const app = new Hono().basePath('/message');

/**
 *
 * @param c
 * @returns
 */
const create = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const { title, from, to, locations } = await c.req.json();
  // planを作成
  const { data, error } = await supabase
    .from('plan')
    .insert({ title, from, to, locations })
    .select('*');

  if (error) {
    return c.json({ error }, 403);
  }

  return c.json({ data, error });
};

const update = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const { uid, title, from, to, locations, place_id_list } = await c.req.json();
  // planを更新
  const { data, error } = await supabase
    .from('plan')
    .update({ title, from, to, locations, place_id_list })
    .eq('uid', uid)
    .select('*');

  if (error) {
    return c.json({ error }, 403);
  }

  return c.json({ data, error });
};

/**
 *
 * @param c
 * @returns
 */
const get = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const uid = c.req.param('uid');
  const { data, error } = await supabase.from('plan').select('*').eq('uid', uid).maybeSingle();
  return c.json({ data, error });
};

/**
 *
 * @param c
 * @returns
 */
const list = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const { data, error } = await supabase.from('messages').select('*').limit(100);
  return c.json({ data, error });
};

app.post('/list', list);
app.get('/:uid', get);
app.post('/', create);
app.put('/', update);
Deno.serve(app.fetch);
