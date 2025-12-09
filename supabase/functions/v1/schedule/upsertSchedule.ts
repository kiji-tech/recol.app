import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Schedule } from '../libs/types.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

/**
 * スケジュールの作成・更新APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @return {Promise<Response>} 作成・更新されたスケジュール情報を含むレスポンス
 */
export const upsertSchedule = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[UPSERT] v1 schedule', { level: 'info' });
  const { schedule } = await c.req.json();
  const { uid, plan_id, title, description, category, place_list, from, to, delete_flag } =
    schedule;
  // scheduleの更新
  const scheduleData = {
    uid,
    plan_id,
    title,
    description,
    category,
    place_list,
    from,
    to,
    delete_flag,
  };
  LogUtil.log(JSON.stringify({ scheduleData }), { level: 'info' });
  const { data, error } = await supabase
    .from('schedule')
    .upsert(scheduleData, { onConflict: 'uid' })
    .select(
      '*, media(*)                                                                                                                                                                                                                                                                                 '
    )
    .maybeSingle();
  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error' });
    return ResponseUtil.error(c, getMessage('C007', ['スケジュール']), 'C007', 400);
  }

  return ResponseUtil.success(c, data);
};
