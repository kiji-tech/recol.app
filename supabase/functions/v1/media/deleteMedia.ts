import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

export const deleteMedia = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[POST] media/delete', { level: 'info' });
  const { planId, mediaIdList } = await c.req.json();
  if (!planId || !mediaIdList) {
    return ResponseUtil.error(c, getMessage('C009', ['プランID､メディア']), 'C009', 400);
  }

  const { error } = await supabase
    .from('media')
    .update({ delete_flag: true })
    .in('uid', mediaIdList);

  if (error) {
    LogUtil.log(error, { level: 'error' });
    return ResponseUtil.error(c, getMessage('C008', ['メディア']), 'C008', 500);
  }

  return ResponseUtil.success(c, { message: getMessage('C004', ['メディア']) });
};
