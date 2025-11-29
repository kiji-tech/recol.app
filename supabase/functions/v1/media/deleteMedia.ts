import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

export const deleteMedia = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[POST] media/delete', { level: 'info' });
  const { planId, mediaIdList } = await c.req.json();
  if (!planId || !mediaIdList) {
    return c.json({ message: getMessage('C009', ['プランID､メディア']), code: 'C009' });
  }

  const { error } = await supabase
    .from('media')
    .update({ delete_flag: true })
    .in('uid', mediaIdList);

  if (error) {
    LogUtil.log(error, { level: 'error' });
    return c.json({ message: getMessage('C008', ['メディア']), code: 'C008' }, 500);
  }

  return c.json({ message: getMessage('C004', ['メディア']), code: 'C004' }, 200);
};
