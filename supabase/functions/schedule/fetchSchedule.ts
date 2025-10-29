import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Schedule, DatabaseResult } from '../libs/types.ts';
import { enrichScheduleWithPlaceData, enrichScheduleListWithPlaceData } from './scheduleUtils.ts';
import dayjs from 'dayjs';

/**
 * スケジュールIDを指定してスケジュールを取得する
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param scheduleId {string} スケジュールID
 * @return {Promise<DatabaseResult<Schedule>>} スケジュールデータまたはエラー
 */
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

/**
 * プランIDを指定してスケジュール一覧を取得する
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param planId {string} プランID
 * @return {Promise<DatabaseResult<Schedule[]>>} スケジュール一覧またはエラー
 */
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

/**
 * 通知用のスケジュール一覧を取得する（未来のスケジュールのみ）
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param userId {string} ユーザーID
 * @return {Promise<DatabaseResult<Schedule[]>>} 通知用スケジュール一覧またはエラー
 */
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

/**
 * スケジュール詳細取得APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @return {Promise<Response>} スケジュール詳細を含むレスポンス
 */
export const get = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[GET] schedule/:id 開始', { level: 'info' });

  const scheduleId = c.req.param('id');

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

/**
 * スケジュール一覧取得APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @return {Promise<Response>} スケジュール一覧を含むレスポンス
 */
export const list = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[POST] schedule/list 開始', { level: 'info' });
  const { planId } = await c.req.json();
  const { data: scheduleList, error } = await fetchScheduleListByPlanId(supabase, planId);
  if (error) {
    return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
  }

  const enrichedScheduleList = await enrichScheduleListWithPlaceData(supabase, scheduleList || []);

  LogUtil.log('[POST] schedule/list 完了', { level: 'info' });
  return c.json(enrichedScheduleList);
};

/**
 * 通知用スケジュール一覧取得APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param user {User} 認証済みユーザー情報
 * @return {Promise<Response>} 通知用スケジュール一覧を含むレスポンス
 */
export const listForNotification = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[POST] schedule/list/notification 開始', { level: 'info' });
  const { data: scheduleList, error } = await fetchScheduleListForNotification(supabase, user.id);
  if (error) {
    return c.json({ message: getMessage('C005', ['スケジュール']), code: 'C005' }, 400);
  }

  LogUtil.log('[POST] schedule/list/notification 完了', { level: 'info' });
  return c.json(scheduleList || []);
};
