import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Plan, Schedule, DatabaseResult } from '../libs/types.ts';

const fetchPlanWithSchedule = async (
  supabase: SupabaseClient,
  uid: string,
  userId: string
): Promise<DatabaseResult<Plan & { schedule: Schedule[] }>> => {
  const { data: plan, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('uid', uid)
    .eq('user_id', userId)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .maybeSingle();

  if (error) {
    LogUtil.log('プラン取得エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { uid, userId },
    });
    return { data: null, error };
  }

  LogUtil.log(`プラン取得成功: ${uid}`, { level: 'info' });
  return { data: plan, error: null };
};

const fetchPlanList = async (
  supabase: SupabaseClient,
  userId: string
): Promise<DatabaseResult<(Plan & { schedule: Schedule[] })[]>> => {
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('user_id', userId)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .order('created_at', { ascending: false });

  if (error) {
    LogUtil.log('プラン一覧取得エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { userId },
    });
    return { data: null, error };
  }
  return { data, error: null };
};

export const get = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[GET] plan/:uid 開始', { level: 'info' });
  const uid = c.req.param('uid');

  const { data: plan, error } = await fetchPlanWithSchedule(supabase, uid, user.id);
  if (error) {
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 500);
  }

  LogUtil.log('[GET] plan/:uid 完了', { level: 'info' });
  return c.json(plan);
};

export const list = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[POST] plan/list 開始', { level: 'info' });

  const { data: planList, error } = await fetchPlanList(supabase, user.id);
  if (error) {
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 500);
  }

  LogUtil.log('[POST] plan/list 完了', { level: 'info' });
  return c.json(planList);
};
