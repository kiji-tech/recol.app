import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

export const listMedia = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[POST] v1/media/list', { level: 'info' });
  const { planId } = await c.req.json();
  if (!planId) {
    return ResponseUtil.error(c, getMessage('C009', ['プランID']), 'C009', 400);
  }

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('plan_id', planId)
    .eq('delete_flag', false);

  if (error) {
    LogUtil.log(error, { level: 'error' });
    return ResponseUtil.error(c, getMessage('C005', ['メディア']), 'C005', 500);
  }
  return ResponseUtil.success(c, data);
};
