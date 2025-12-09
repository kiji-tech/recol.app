import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';
import {
  Plan,
  UpdatePlanRequest,
  ValidationResult,
  DatabaseResult,
  Schedule,
} from '../libs/types.ts';

const validateUpdateRequest = async (c: Context): Promise<ValidationResult<UpdatePlanRequest>> => {
  const { uid, title, memo, schedule } = await c.req.json();

  if (!uid || typeof uid !== 'string') {
    LogUtil.log('プラン更新リクエスト: UIDが無効', { level: 'warn' });
    return {
      isValid: false,
      data: null,
      error: ResponseUtil.error(c, getMessage('C003'), 'C003', 400),
    };
  }

  if (!title || typeof title !== 'string') {
    LogUtil.log('プラン更新リクエスト: タイトルが無効', { level: 'warn' });
    return {
      isValid: false,
      data: null,
      error: c.json({ message: getMessage('C003'), code: 'C003' }, 400),
    };
  }

  return { isValid: true, data: { uid, title, memo, schedule: schedule || [] }, error: null };
};

const updatePlanRecord = async (
  supabase: SupabaseClient,
  uid: string,
  title: string,
  memo: string,
  userId: string
): Promise<DatabaseResult<Plan[]>> => {
  const { data, error } = await supabase
    .from('plan')
    .update({ title, memo })
    .eq('uid', uid)
    .eq('user_id', userId)
    .select('*');

  if (error) {
    LogUtil.log('プラン更新エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { uid, title, userId },
    });
    return { data: null, error };
  }

  LogUtil.log(`プラン更新成功: ${uid}`, { level: 'info' });
  return { data, error: null };
};

/**
 * スケジュールを更新する
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param uid {string} プランUID
 * @param schedule {Schedule[]} スケジュール
 * @return {Promise<DatabaseResult<Schedule[]>>} スケジュール更新結果
 */
const updateScheduleRecord = async (
  supabase: SupabaseClient,
  scheduleList: Schedule[]
): Promise<DatabaseResult<Schedule[]>> => {
  if (!scheduleList || scheduleList.length === 0) return { data: null, error: null };
  const updateScheduleList = [];
  for (const schedule of scheduleList) {
    const { uid, plan_id, title, description, category, place_list, from, to, delete_flag } =
      schedule;
    updateScheduleList.push({
      uid,
      plan_id,
      title,
      description,
      category,
      place_list,
      from,
      to,
      delete_flag,
    });
  }
  const { data, error } = await supabase
    .from('schedule')
    .upsert(updateScheduleList, { onConflict: 'uid' })
    .select('*');
  return { data, error };
};

export const updatePlan = async (
  c: Context,
  supabase: SupabaseClient,
  user: User
): Promise<Response> => {
  LogUtil.log('[PUT] plan 開始', { level: 'info' });

  const validation = await validateUpdateRequest(c);
  if (!validation.isValid) {
    return validation.error as Response;
  }

  const { data, error } = await updatePlanRecord(
    supabase,
    validation.data!.uid,
    validation.data!.title,
    validation.data!.memo || '',
    user.id
  );

  if (error) {
    return ResponseUtil.error(c, getMessage('C007', ['プラン']), 'C007', 500);
  }

  // scheduleを更新
  const { data: updateScheduleData, error: updateScheduleError } = await updateScheduleRecord(
    supabase,
    validation.data!.schedule || []
  );

  if (updateScheduleError) {
    return ResponseUtil.error(c, getMessage('C007', ['スケジュール']), 'C007', 500);
  }

  LogUtil.log('[PUT] plan 完了', { level: 'info' });
  return ResponseUtil.success(c, { ...data, schedule: updateScheduleData });
};
