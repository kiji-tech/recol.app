// @ts-ignore
import { Hono } from 'jsr:@hono/hono';
// @ts-ignore
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';
const app = new Hono().basePath('/plan');

const generateSupabase = (c: Hono.Context) => {
  return createClient(
    // @ts-ignore
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
};

const getUser = async (c: Hono.Context, supabase: SupabaseClient) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Authorization header is missing' }, 401);
  }
  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  return user;
};

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

  console.log({ userId: user.id });

  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('user_id', user.id)
    .order('from', { ascending: false });
  if (error) {
    console.error(error);
    return c.json(error, 403);
  }
  console.log(data);
  return c.json(data);
};

app.post('/list', list);
app.get('/:uid', get);
app.post('/', create);
app.put('/', update);

//@ts-ignore
Deno.serve(app.fetch);
