import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

export const listMedia = async (c: Context, supabase: SupabaseClient) => {
  LogUtil.log('[POST] v1/media/list', { level: 'info' });
  const { planId } = await c.req.json();
  if (!planId) {
    return c.json({ message: getMessage('C009', ['プランID']), code: 'C009' });
  }

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('plan_id', planId)
    .eq('delete_flag', false);

  if (error) {
    LogUtil.log(error, { level: 'error' });
    return c.json({ message: getMessage('C005', ['メディア']), code: 'C005' }, 500);
  }
  return c.json(data);
};
