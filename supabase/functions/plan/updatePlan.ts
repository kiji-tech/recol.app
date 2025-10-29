import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Plan, UpdatePlanRequest, ValidationResult, DatabaseResult } from '../libs/types.ts';

const validateUpdateRequest = async (c: Context): Promise<ValidationResult<UpdatePlanRequest>> => {
  const { uid, title, memo } = await c.req.json();

  if (!uid || typeof uid !== 'string') {
    LogUtil.log('プラン更新リクエスト: UIDが無効', { level: 'warn' });
    return {
      isValid: false,
      data: null,
      error: c.json({ message: getMessage('C003'), code: 'C003' }, 400),
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

  return { isValid: true, data: { uid, title, memo }, error: null };
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

export const update = async (c: Context) => {
  LogUtil.log('[PUT] plan 開始', { level: 'info' });

  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);

  if (!user) {
    LogUtil.log('プラン更新: 認証失敗', { level: 'warn' });
    return c.json({ message: getMessage('C001'), code: 'C001' }, 401);
  }

  const validation = await validateUpdateRequest(c);
  if (!validation.isValid) {
    return validation.error;
  }

  const { data, error } = await updatePlanRecord(
    supabase,
    validation.data!.uid,
    validation.data!.title,
    validation.data!.memo || '',
    user.id
  );

  if (error) {
    return c.json({ message: getMessage('C007', ['プラン']), code: 'C007' }, 500);
  }

  LogUtil.log('[PUT] plan 完了', { level: 'info' });
  return c.json(data);
};
