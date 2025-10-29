import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Plan, CreatePlanRequest, ValidationResult, DatabaseResult } from '../libs/types.ts';

const validateCreateRequest = async (c: Context): Promise<ValidationResult<CreatePlanRequest>> => {
  const { title, memo } = await c.req.json();

  if (!title || typeof title !== 'string') {
    LogUtil.log('プラン作成リクエスト: タイトルが無効', { level: 'warn' });
    return {
      isValid: false,
      data: null,
      error: c.json({ message: getMessage('C003'), code: 'C003' }, 400),
    };
  }

  return { isValid: true, data: { title, memo }, error: null };
};

const createPlanRecord = async (
  supabase: SupabaseClient,
  title: string,
  memo: string,
  userId: string
): Promise<DatabaseResult<Plan[]>> => {
  const { data, error } = await supabase
    .from('plan')
    .insert({ title, memo, user_id: userId })
    .select('*');

  if (error) {
    LogUtil.log('プラン作成エラー', {
      level: 'error',
      notify: true,
      error: error,
      additionalInfo: { title, userId },
    });
    return { data: null, error };
  }

  LogUtil.log(`プラン作成成功: ${data?.[0]?.uid}`, { level: 'info' });
  return { data, error: null };
};

export const createPlan = async (
  c: Context,
  supabase: SupabaseClient,
  user: User
): Promise<Response> => {
  LogUtil.log('[POST] plan 開始', { level: 'info' });

  const validation = await validateCreateRequest(c);
  if (!validation.isValid) {
    return validation.error as Response;
  }

  const { data, error } = await createPlanRecord(
    supabase,
    validation.data!.title,
    validation.data!.memo || '',
    user.id
  );
  if (error) {
    return c.json({ message: getMessage('C006', ['プラン']), code: 'C006' }, 500);
  }

  LogUtil.log('[POST] plan 完了', { level: 'info' });
  return c.json({ data, error: null });
};
