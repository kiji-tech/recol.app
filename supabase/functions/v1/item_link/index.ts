import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
const app = new Hono().basePath('/item_link');

/**
 * 全てのitem_linkを取得する
 * @param c
 * @returns
 */
const list = async (c: Hono.Context) => {
  console.log('[GET] item_link/list');
  const supabase = generateSupabase(c);

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }

  const { data, error } = await supabase
    .from('item_link')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json(data);
};

/**
 * カテゴリによるitem_linkの取得
 * @param c
 * @returns
 */
const getByCategory = async (c: Hono.Context) => {
  console.log('[GET] item_link/category/:category');
  const supabase = generateSupabase(c);
  const category = c.req.param('category');

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }

  const { data, error } = await supabase
    .from('item_link')
    .select('*')
    .filter('category', 'cs', `{${category}}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json(data);
};

/**
 * IDによるitem_linkの取得
 * @param c
 * @returns
 */
const getById = async (c: Hono.Context) => {
  console.log('[GET] item_link/:id');
  const supabase = generateSupabase(c);
  const id = c.req.param('id');

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 403);
  }

  const { data, error } = await supabase.from('item_link').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json(data);
};

app.get('/list', list);
app.get('/category/:category', getByCategory);
app.get('/:id', getById);
Deno.serve(app.fetch);
