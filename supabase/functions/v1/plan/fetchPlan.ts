import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';
import {
  Plan,
  Schedule,
  DatabaseResult,
  Media,
  ScheduleWithMedia,
  PlanWithScheduleWithMedia,
} from '../libs/types.ts';

const fetchPlanWithSchedule = async (
  supabase: SupabaseClient,
  uid: string,
  userId: string
): Promise<DatabaseResult<Plan & { schedule: (Schedule & { media: Media })[] }>> => {
  const { data: plan, error } = await supabase
    .from('plan')
    .select('*, schedule(*, media(*))')
    .eq('uid', uid)
    .eq('user_id', userId)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .eq('schedule.media.delete_flag', false)
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
  return {
    data: {
      ...plan,
      schedule: plan.schedule.map((s: ScheduleWithMedia) => ({ ...s, media_list: s.media || [] })),
    },
    error: null,
  };
};

const fetchPlanList = async (
  supabase: SupabaseClient,
  userId: string
): Promise<DatabaseResult<(Plan & { schedule: (Schedule & { media: Media })[] })[]>> => {
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*, media(*))')
    .eq('user_id', userId)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .eq('schedule.media.delete_flag', false)
    .order('created_at', { ascending: false });

  if (error) {
    LogUtil.log(`プラン一覧取得エラー: ${JSON.stringify(error)}`, {
      level: 'error',
      notify: true,
    });
    return { data: null, error };
  }
  return {
    data: data.map((p: PlanWithScheduleWithMedia) => ({
      ...p,
      schedule: p.schedule.map((s: ScheduleWithMedia) => s),
    })) as any,
    error: null,
  };
};

export const get = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[GET] plan/:uid 開始', { level: 'info' });
  const uid = c.req.param('uid');

  const { data: plan, error } = await fetchPlanWithSchedule(supabase, uid, user.id);
  if (error) {
    return ResponseUtil.error(c, getMessage('C005', ['プラン']), 'C005', 500);
  }

  LogUtil.log('[GET] plan/:uid 完了', { level: 'info' }, c);
  return ResponseUtil.success(c, plan);
};

export const list = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[POST] plan/list 開始', { level: 'info' }, c);

  const { data: planList, error } = await fetchPlanList(supabase, user.id);
  if (error) {
    return ResponseUtil.error(c, getMessage('C005', ['プラン']), 'C005', 500);
  }
  LogUtil.log(`プラン一覧取得成功: ${JSON.stringify(planList)}`, { level: 'info' });
  LogUtil.log('[POST] plan/list 完了', { level: 'info' }, c);
  return ResponseUtil.success(c, planList);
};
