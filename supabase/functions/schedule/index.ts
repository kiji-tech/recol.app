import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
const app = new Hono().basePath('/schedule');

const get = async (c: Hono.Context) => {
  console.log('[GET] schedule/:id');
  const supabase = generateSupabase(c);
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
      return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
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
      return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
    }
    return c.json(data);
  } else {
    return c.json({ message: getMessage('C009', ['スケジュールID']), code: 'C009' }, 400);
  }
};

const upsert = async (c: Hono.Context) => {
  console.log('[UPSERT] schedule/:id');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { schedule } = await c.req.json();
  console.log({ user, schedule });
  // scheduleの更新
  const { data, error } = await supabase
    .from('schedule')
    .upsert({ ...schedule }, { onConflict: 'uid' })
    .select('*');
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['スケジュール']), code: 'C007' }, 400);
  }
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['スケジュール']), code: 'C007' }, 400);
  }

  return c.json(data);
};

const deleteSchedule = async (c: Hono.Context) => {
  console.log('[DELETE] schedule/:id');
  const supabase = generateSupabase(c);
  const { uid } = await c.req.json();
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  // 削除フラグの更新
  const { data, error } = await supabase
    .from('schedule')
    .update({ delete_flag: true })
    .eq('uid', uid);
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C008', ['スケジュール']), code: 'C008' }, 400);
  }
  return c.json(data);
};

app.get('/:planId', get);
app.post('/delete', deleteSchedule);
app.post('/', upsert);

Deno.serve(app.fetch);
