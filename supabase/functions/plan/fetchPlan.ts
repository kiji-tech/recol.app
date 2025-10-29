import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { enrichScheduleWithPlaceData, enrichPlanListWithPlaceData } from './placeUtils.ts';
import { Plan, Schedule, DatabaseResult, PlanWithEnrichedSchedule } from '../libs/types.ts';

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
  const { data: planList, error } = await supabase
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

  LogUtil.log(`プラン一覧取得成功: ${planList?.length || 0}件`, { level: 'info' });
  return { data: planList, error: null };
};

export const get = async (c: Context) => {
  LogUtil.log('[GET] plan/:uid 開始', { level: 'info' });

  const supabase = generateSupabase(c);
  const uid = c.req.param('uid');

  const user = await getUser(c, supabase);
  if (!user) {
    LogUtil.log('プラン取得: 認証失敗', { level: 'warn' });
    return c.json({ message: getMessage('C001'), code: 'C001' }, 401);
  }

  const { data: plan, error } = await fetchPlanWithSchedule(supabase, uid, user.id);
  if (error) {
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 500);
  }

  if (plan && plan.schedule) {
    const enrichedSchedule = await enrichScheduleWithPlaceData(supabase, plan.schedule);
    const enrichedPlan: PlanWithEnrichedSchedule = {
      ...plan,
      schedule: enrichedSchedule,
    };

    LogUtil.log('[GET] plan/:uid 完了', { level: 'info' });
    return c.json(enrichedPlan);
  }

  LogUtil.log('[GET] plan/:uid 完了', { level: 'info' });
  return c.json(plan);
};

export const list = async (c: Context) => {
  LogUtil.log('[POST] plan/list 開始', { level: 'info' });

  const supabase = generateSupabase(c, false);
  const user = await getUser(c, supabase);
  if (!user) {
    LogUtil.log('プラン一覧取得: 認証失敗', { level: 'warn' });
    return c.json({ message: getMessage('C001'), code: 'C001' }, 401);
  }

  const { data: planList, error } = await fetchPlanList(supabase, user.id);
  if (error) {
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 500);
  }

  const enrichedPlanList = await enrichPlanListWithPlaceData(supabase, planList || []);

  LogUtil.log('[POST] plan/list 完了', { level: 'info' });
  return c.json(enrichedPlanList);
};
