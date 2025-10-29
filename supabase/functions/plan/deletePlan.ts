import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { DeletePlanRequest, ValidationResult, DatabaseResult } from '../libs/types.ts';

const validateDeleteRequest = async (c: Context): Promise<ValidationResult<DeletePlanRequest>> => {
  const { planId } = await c.req.json();

  if (!planId || typeof planId !== 'string') {
    LogUtil.log('プラン削除リクエスト: planIdが無効', { level: 'warn' });
    return {
      isValid: false,
      data: null,
      error: c.json({ message: getMessage('C003'), code: 'C003' }, 400),
    };
  }

  return { isValid: true, data: { planId }, error: null };
};

const softDeletePlan = async (
  supabase: SupabaseClient,
  planId: string,
  userId: string
): Promise<DatabaseResult<{ count: number }>> => {
  const { data, error } = await supabase
    .from('plan')
    .update({ delete_flag: true })
    .eq('uid', planId)
    .eq('user_id', userId);

  if (error) {
    LogUtil.log('プラン削除エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { planId, userId },
    });
    return { data: null, error };
  }

  LogUtil.log(`プラン削除成功: ${planId}`, { level: 'info' });
  return { data, error: null };
};

export const deletePlan = async (c: Context) => {
  LogUtil.log('[POST] plan/delete 開始', { level: 'info' });

  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    LogUtil.log('プラン削除: 認証失敗', { level: 'warn' });
    return c.json({ message: getMessage('C001'), code: 'C001' }, 401);
  }

  const validation = await validateDeleteRequest(c);
  if (!validation.isValid) {
    return validation.error;
  }

  const { data, error } = await softDeletePlan(supabase, validation.data!.planId, user.id);
  if (error) {
    return c.json({ message: getMessage('C008'), code: 'C008' }, 500);
  }

  LogUtil.log('[POST] plan/delete 完了', { level: 'info' });
  return c.json(data);
};
