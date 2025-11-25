import { Context } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../supabase.ts';
import { getMessage } from '../MessageUtil.ts';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { LogUtil } from '../LogUtil.ts';

export const withUser = async (
  c: Context,
  fn: (c: Context, supabase: SupabaseClient, user: User) => Promise<Response>
) => {
  LogUtil.log('[WITH USER] ユーザー認証開始', { level: 'info' }, c);
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    LogUtil.log('[WITH USER] ユーザーが見つかりません', { level: 'warn' }, c);
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  return await fn(c, supabase, user);
};
