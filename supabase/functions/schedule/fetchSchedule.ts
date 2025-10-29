import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Schedule, DatabaseResult } from '../libs/types.ts';
import { enrichScheduleWithPlaceData, enrichScheduleListWithPlaceData } from './scheduleUtils.ts';
import dayjs from 'dayjs';

const fetchScheduleById = async (
  supabase: SupabaseClient,
  scheduleId: string
): Promise<DatabaseResult<Schedule>> => {
  const { data: schedule, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('id', scheduleId)
    .maybeSingle();

  if (error) {
    LogUtil.log('スケジュール取得エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { scheduleId },
    });
    return { data: null, error };
  }

  LogUtil.log(`スケジュール取得成功: ${scheduleId}`, { level: 'info' });
  return { data: schedule, error: null };
};

const fetchScheduleListByPlanId = async (
  supabase: SupabaseClient,
  planId: string
): Promise<DatabaseResult<Schedule[]>> => {
  const { data: scheduleList, error } = await supabase
    .from('schedule')
    .select('*')
    .eq('plan_id', planId)
    .eq('delete_flag', false)
    .order('created_at', { ascending: false })
    .order('from', { ascending: true });

  if (error) {
    LogUtil.log('スケジュール一覧取得エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { planId },
    });
    return { data: null, error };
  }

  LogUtil.log(`スケジュール一覧取得成功: ${scheduleList?.length || 0}件`, { level: 'info' });
  return { data: scheduleList, error: null };
};

const fetchScheduleListForNotification = async (
  supabase: SupabaseClient,
  userId: string
): Promise<DatabaseResult<Schedule[]>> => {
  const { data, error } = await supabase
    .from('plan')
    .select('*, schedule(*)')
    .eq('user_id', userId)
    .eq('delete_flag', false)
    .eq('schedule.delete_flag', false)
    .gte('schedule.from', dayjs().toISOString());

  if (error) {
    LogUtil.log('通知用スケジュール取得エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { userId },
    });
    return { data: null, error };
  }

  const scheduleList: Schedule[] = [];
  for (const plan of data || []) {
    const { schedule } = plan;
    for (const sc of schedule) {
      scheduleList.push(sc);
    }
  }

  LogUtil.log(`通知用スケジュール取得成功: ${scheduleList.length}件`, { level: 'info' });
  return { data: scheduleList, error: null };
};

export const get = async (c: Context) => {
  LogUtil.log('[GET] schedule/:id 開始', { level: 'info' });

  const scheduleId = c.req.param('id');
  const supabase = generateSupabase(c);

  const { data: schedule, error } = await fetchScheduleById(supabase, scheduleId);
  if (error) {
    return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
  }

  if (schedule) {
    const enrichedSchedule = await enrichScheduleWithPlaceData(supabase, schedule);
    LogUtil.log('[GET] schedule/:id 完了', { level: 'info' });
    return c.json(enrichedSchedule);
  }

  LogUtil.log('[GET] schedule/:id 完了', { level: 'info' });
  return c.json(schedule);
};

export const list = async (c: Context) => {
  LogUtil.log('[POST] schedule/list 開始', { level: 'info' });

  const { planId } = await c.req.json();
  const supabase = generateSupabase(c);

  const { data: scheduleList, error } = await fetchScheduleListByPlanId(supabase, planId);
  if (error) {
    return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
  }

  const enrichedScheduleList = await enrichScheduleListWithPlaceData(supabase, scheduleList || []);

  LogUtil.log('[POST] schedule/list 完了', { level: 'info' });
  return c.json(enrichedScheduleList);
};

export const listForNotification = async (c: Context) => {
  LogUtil.log('[POST] schedule/list/notification 開始', { level: 'info' });

  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    LogUtil.log('通知用スケジュール取得: 認証失敗', { level: 'warn' });
    return c.json({ message: getMessage('C001'), code: 'C001' }, 401);
  }

  const { data: scheduleList, error } = await fetchScheduleListForNotification(supabase, user.id);
  if (error) {
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 403);
  }

  LogUtil.log('[POST] schedule/list/notification 完了', { level: 'info' });
  return c.json(scheduleList);
};
