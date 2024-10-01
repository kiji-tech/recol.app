// @ts-ignore
import { Hono } from 'jsr:@hono/hono';
// @ts-ignore
import { createClient } from 'jsr:@supabase/supabase-js@2';
const app = new Hono().basePath('/plan');

const generateSupabase = (c: Hono.Context) => {
  // @ts-ignore
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    // {
    //     global: { headers: { Authorization: c.headers.get('Authorization')! } },
    // }
  );
};

const create = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const { from, to, locations } = await c.req.json();

  // planを作成
  const { data, error } = await supabase.from('plan').insert([{ from, to, locations }]).select('*');

  return c.json({ data, error });
};

const get = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const id = c.req.param('id');
  console.log('plan/' + id);
  const { data, error } = await supabase.from('plan').select('*').eq('id', id).maybeSingle();
  return c.json({ data, error });
};

const list = async (c: Hono.Context) => {
  console.log('plan/list');
  const supabase = generateSupabase(c);
  // TODO filter by user
  const { data, error } = await supabase.from('plan').select('*');
  return c.json({ data, error });
};

app.post('/list', list);
app.get('/:id', get);
app.post('/', create);

//@ts-ignore
Deno.serve(app.fetch);
