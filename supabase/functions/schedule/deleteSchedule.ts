import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

/**
 * スケジュール削除APIのメイン処理（論理削除）
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param user {User} 認証済みユーザー情報
 * @return {Promise<Response>} 削除結果を含むレスポンス
 */
export const deleteSchedule = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[DELETE] schedule/:id', { level: 'info' });
  const { uid } = await c.req.json();
  if (!uid) {
    return c.json({ message: getMessage('C009', ['スケジュール']), code: 'C009' }, 400);
  }
  // 削除フラグの更新
  const { data, error } = await supabase
    .from('schedule')
    .update({ delete_flag: true })
    .eq('uid', uid);
  if (error) {
    LogUtil.log(error, { level: 'error' });
    return c.json({ message: getMessage('C008', ['スケジュール']), code: 'C008' }, 400);
  }
  return c.json(data);
};
