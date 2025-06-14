import { Hono } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'jsr:@supabase/supabase-js@2';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import dayjs from 'dayjs';
import { getMessage } from '../libs/MessageUtil.ts';

const app = new Hono().basePath('/plan');

const MAXIMUM_FREE_PLAN = 4;
const MAXIMUM_BASIC_PLAN = 12;

/**
 * プランの作成数が制限を超えているかどうかをチェックする
 *
 * @param supabase {SupabaseClient}
 * @param user {User}
 * @returns {boolean}
 */
const maximumVerifyChecker = async (supabase: SupabaseClient, user: User) => {
  const IS_OVER = true;
  const from = dayjs().add(-1, 'year').format('YYYY-MM-DD HH:mm');
  const { data: profile } = await supabase.from('profile').select('payment_plan').maybeSingle();
  const { count } = await supabase
    .from('plan')
    .select('uid, created_at', { count: 'exact' })
    .gte('created_at', from)
    .eq('user_id', user.id);

  const { payment_plan } = profile;

  switch (payment_plan) {
    case 'Free':
      if (count > MAXIMUM_FREE_PLAN) {
        return IS_OVER;
      }
      break;
    case 'Basic':
      if (count > MAXIMUM_BASIC_PLAN) {
        return IS_OVER;
      }
      break;
  }
  return !IS_OVER;
};

const create = async (c: Hono.Context) => {
  console.log('[POST] plan');
  const supabase = generateSupabase(c);
  const { title } = await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  if (await maximumVerifyChecker(supabase, user)) {
    return c.json({ message: getMessage('PP001'), code: 'PP001' }, 400);
  }

  // planを作成
  const { data, error } = await supabase
    .from('plan')
    .insert({ title, user_id: user.id })
    .select('*');

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C006', ['プラン']), code: 'C006' }, 403);
  }

  return c.json({ data, error });
};

const update = async (c: Hono.Context) => {
  console.log('[PUT] plan');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);

  if (!user) {
    return c.json({ message: getMessage('C001') }, 403);
  }

  const { uid, title, memo } = await c.req.json();
  // planを更新
  const { data, error } = await supabase
    .from('plan')
    .update({ title, memo })
    .eq('uid', uid)
    .eq('user_id', user.id)
    .select('*');

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['プラン']) }, 403);
  }

  return c.json(data);
};

const get = async (c: Hono.Context) => {
  console.log('[GET] plan/');
  const supabase = generateSupabase(c);
  const uid = c.req.param('uid');
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
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
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 403);
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
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('user_id', user.id)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 403);
  }
  return c.json(data);
};

const deletePlan = async (c: Hono.Context) => {
  console.log('[POST] plan/delete');
  const supabase = generateSupabase(c);
  const { planId } = await c.req.json();
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data, error } = await supabase
    .from('plan')
    .update({ delete_flag: true })
    .eq('uid', planId)
    .eq('user_id', user.id);
  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C008'), code: 'C008' }, 403);
  }
  return c.json(data);
};

app.post('/list', list);
app.get('/:uid', get);
app.post('/', create);
app.put('/', update);
app.post('/delete', deletePlan);
Deno.serve(app.fetch);
