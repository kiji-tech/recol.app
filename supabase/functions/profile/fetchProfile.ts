import { Context } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { sendSlackNotification } from '../libs/SlackUtil.ts';
import dayjs from 'dayjs';

export const createProfile = async (c: Context) => {
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  LogUtil.log(`${user.id}のプロフィールがないため作成します`, { level: 'info' });
  LogUtil.log('プロフィールの作成', { level: 'info' });

  const { data: newData, error: newError } = await supabase
    .from('profile')
    .insert({ uid: user.id })
    .select('*')
    .maybeSingle();

  if (newError) {
    LogUtil.log(JSON.stringify(newError), { level: 'error', notify: true });
    throw newError;
  }

  newData.subscription = [];
  return newData;
};

export const getProfile = async (c: Context) => {
  console.log('[GET] profile');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('uid', user.id)
    .maybeSingle();

  if (!data) {
    const newData = await createProfile(c).catch(() => {
      return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
    });

    await sendSlackNotification({
      message: `[${user.id}] [${user.email}]が新規登録されました`,
      webhookUrl: Deno.env.get('NEW_ACCOUNT_SLACK_WEBHOOK_URL') || '',
    });

    return c.json(newData);
  }

  if (error) {
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  const subscriptionData = await getSubscriptionData(supabase, user.id);
  if (!subscriptionData) {
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  data.subscription = subscriptionData;
  return c.json(data);
};

const getSubscriptionData = async (supabase: any, userId: string) => {
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscription')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trying', 'canceled'])
    .gte('current_period_end', dayjs().format('YYYY-MM-DD HH:mm:ss'));

  if (subscriptionError) {
    LogUtil.log(JSON.stringify(subscriptionError), { level: 'error', notify: true });
    return null;
  }

  return subscriptionData || [];
};
