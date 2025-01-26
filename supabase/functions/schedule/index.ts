// @ts-ignore
import { Hono } from 'jsr:@hono/hono';
// @ts-ignore
import { createClient } from 'jsr:@supabase/supabase-js@2';
const app = new Hono().basePath('/schedule');

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

const get = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const scheduleId = c.req.param('scheduleId');
  const planId = c.req.param('planId');
  if (planId != null) {
    const { data, error } = await supabase.from('schedule').select('*').eq('plan_id', planId);

    if (error) {
      console.error(error);
      return c.json({ error }, 403);
    }
    return c.json(data);
  } else if (!scheduleId) {
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('id', scheduleId)
      .maybeSingle();

    if (error) {
      console.error(error);
      return c.json({ error }, 403);
    }
    return c.json(data);
  }
};

const upsert = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const { schedule } = await c.req.json();
  console.log(schedule);
  // scheduleの更新
  const { data, error } = await supabase
    .from('schedule')
    .upsert({ ...schedule }, { onConflict: 'uid' })
    .select('*');
  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json({ data, error });
};

app.get('/:planId', get);
app.post('/', upsert);

//@ts-ignore
Deno.serve(app.fetch);
