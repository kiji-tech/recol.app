import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

/**
 * スケジュールの作成・更新APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @return {Promise<Response>} 作成・更新されたスケジュール情報を含むレスポンス
 */
export const upsertSchedule = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[UPSERT] schedule', { level: 'info' });
  const { schedule } = await c.req.json();
  // scheduleの更新
  const { data, error } = await supabase
    .from('schedule')
    .upsert(
      {
        ...schedule,
        place_list: schedule.place_list
          ? schedule.place_list.map((place: { id: string }) => place.id)
          : [],
      },
      { onConflict: 'uid' }
    )
    .select('*');
  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error' });
    return c.json({ message: getMessage('C007', ['スケジュール']), code: 'C007' }, 400);
  }

  return c.json(data);
};
