import { Context } from 'jsr:@hono/hono';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { sendSlackNotification } from '../../libs/SlackUtil.ts';
import dayjs from 'dayjs';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

const getSubscriptionData = async (supabase: SupabaseClient, userId: string) => {
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

export const createProfile = async (c: Context, supabase: SupabaseClient, user: User) => {
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

export const getProfile = async (c: Context, supabase: SupabaseClient, user: User) => {
  console.log('[GET] profile');
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('uid', user.id)
    .maybeSingle();

  if (!data) {
    const newData = await createProfile(c, supabase, user).catch(() => {
      return ResponseUtil.error(c, getMessage('C005', ['プロフィール']), 'C005', 400);
    });

    await sendSlackNotification({
      message: `[${user.id}] [${user.email}]が新規登録されました`,
      webhookUrl: Deno.env.get('NEW_ACCOUNT_SLACK_WEBHOOK_URL') || '',
    });

    return ResponseUtil.success(c, newData);
  }

  if (error) {
    return ResponseUtil.error(c, getMessage('C005', ['プロフィール']), 'C005', 400);
  }

  const subscriptionData = await getSubscriptionData(supabase, user.id);
  if (!subscriptionData) {
    return ResponseUtil.error(c, getMessage('C005', ['プロフィール']), 'C005', 400);
  }

  data.subscription = subscriptionData;
  return ResponseUtil.success(c, data);
};
