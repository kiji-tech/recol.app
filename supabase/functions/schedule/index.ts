import { Hono } from 'jsr:@hono/hono';
import { generateSupabase } from '../libs/supabase.ts';
const app = new Hono().basePath('/schedule');

const get = async (c: Hono.Context) => {
  console.log('schedule get');
  const supabase = generateSupabase();
  const scheduleId = c.req.param('scheduleId');
  const planId = c.req.param('planId');
  if (planId != null) {
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('plan_id', planId)
      .eq('delete_flag', false);

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
  } else {
    return c.json({ error: 'Invalid request' }, 400);
  }
};

const upsert = async (c: Hono.Context) => {
  const supabase = generateSupabase();
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
  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }

  return c.json(data);
};

const deleteSchedule = async (c: Hono.Context) => {
  console.log('deleteSchedule');
  const supabase = generateSupabase();
  const { uid } = await c.req.json();

  // 削除フラグの更新
  const { data, error } = await supabase
    .from('schedule')
    .update({ delete_flag: true })
    .eq('uid', uid);
  if (error) {
    console.error(error);
    return c.json({ error }, 403);
  }
  return c.json(data);
};

app.get('/:planId', get);
app.post('/delete', deleteSchedule);
app.post('/', upsert);

Deno.serve(app.fetch);
