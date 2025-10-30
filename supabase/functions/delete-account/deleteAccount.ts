import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

/**
 * ユーザーアカウント削除APIのメイン処理
 * @param c {Context} Honoコンテキスト
 * @param supabase {SupabaseClient} Supabaseクライアント
 * @param user {User} 認証済みユーザー情報
 * @return {Promise<Response>} 削除結果を含むレスポンス
 */
export const deleteUserAccount = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[DELETE] delete-account', { level: 'info' });
  const { data, error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 400);
  }
  return c.json(data);
};
