// @ts-ignore
import { Hono } from 'jsr:@hono/hono';
// @ts-ignore
import { createClient } from 'jsr:@supabase/supabase-js@2';
const app = new Hono().basePath('/plan');

const generateSupabase = (c: Hono.Context) => {
  return createClient(
    // @ts-ignore
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    // {
    //     global: { headers: { Authorization: c.headers.get('Authorization')! } },
    // }
  );
};

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
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json({ data, error });
};

const update = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const { uid, title, from, to, locations, place_id_list } = await c.req.json();
  console.log({ uid, title, from, to, locations, place_id_list });
  // planを更新
  const { data, error } = await supabase
    .from('plan')
    .update({ title, from, to, locations, place_id_list })
    .eq('uid', uid)
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
  const supabase = generateSupabase(c);
  const uid = c.req.param('uid');
  console.log('plan/' + uid);
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('uid', uid)
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
  console.log('list');
  const supabase = generateSupabase(c);
  // TODO filter by user
  const { data, error } = await supabase.from('plan').select('*, schedule(*)');
  console.log({ data, error });
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

//@ts-ignore
Deno.serve(app.fetch);
