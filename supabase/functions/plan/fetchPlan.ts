import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { enrichPlanListWithPlaceData } from './placeUtils.ts';
import { Plan, Schedule, DatabaseResult } from '../libs/types.ts';
import dayjs from 'dayjs';

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

/**
 * プラン一覧をソートする
 * @param {Plan[]} planList - ソート対象のプラン一覧
 * @param {'created_at' | 'schedule_date'} sortType - ソート条件
 * @return {Plan[]} ソート後のプラン一覧
 */
const sortPlanList = (
  planList: (Plan & { schedule: Schedule[] })[],
  sortType: 'created_at' | 'schedule_date'
): (Plan & { schedule: Schedule[] })[] => {
  const sortedList = [...planList];

  switch (sortType) {
    case 'created_at':
      // 作成日順（降順）- データベース側でソート済みのため、そのまま返す
      return sortedList;

    case 'schedule_date':
      // スケジュールの日付順（降順）
      return sortedList.sort((a, b) => {
        // 各プランのスケジュール配列の中で最も早い日付（fromの最小値）を取得
        const getEarliestScheduleDate = (plan: Plan & { schedule: Schedule[] }): number => {
          if (!plan.schedule || plan.schedule.length === 0) {
            return 0; // スケジュールがない場合は0（最後に配置）
          }
          const dates = plan.schedule.filter((s) => s.from).map((s) => dayjs(s.from!).valueOf());
          return dates.length > 0 ? Math.min(...dates) : 0;
        };

        const dateA = getEarliestScheduleDate(a);
        const dateB = getEarliestScheduleDate(b);

        // スケジュールがないプランは最後に配置
        if (dateA === 0 && dateB === 0) return 0;
        if (dateA === 0) return 1;
        if (dateB === 0) return -1;

        return dateB - dateA;
      });

    default:
      return sortedList;
  }
};

const fetchPlanList = async (
  supabase: SupabaseClient,
  userId: string,
  sortType: 'created_at' | 'schedule_date' = 'created_at'
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

  // ソート条件に応じてソート
  const sortedPlanList = sortPlanList(planList || [], sortType);

  LogUtil.log(`プラン一覧取得成功: ${sortedPlanList.length}件 (sortType: ${sortType})`, {
    level: 'info',
  });
  return { data: sortedPlanList, error: null };
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

  // リクエストボディからソート条件を取得（オプショナル、デフォルトはcreated_at）
  const { sortType } = await c.req.json().catch(() => ({}));
  const validSortType: 'created_at' | 'schedule_date' =
    sortType === 'schedule_date' ? 'schedule_date' : 'created_at';

  const { data: planList, error } = await fetchPlanList(supabase, user.id, validSortType);
  if (error) {
    return c.json({ message: getMessage('C005', ['プラン']), code: 'C005' }, 500);
  }

  const enrichedPlanList = await enrichPlanListWithPlaceData(supabase, planList || []);

  LogUtil.log('[POST] plan/list 完了', { level: 'info' });
  return c.json(enrichedPlanList);
};
