import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import * as ResponseUtil from '../libs/ResponseUtil.ts';

export const syncPremiumPlan = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[PUT] sync-premium-plan', { level: 'info' });
  const { isPremium, endAt } = await c.req.json();

  const { data, error } = await supabase
    .from('profile')
    .update({ payment_plan: isPremium ? 'Premium' : 'Free', payment_end_at: endAt })
    .eq('uid', user.id)
    .select('*')
    .maybeSingle();

  if (error) {
    LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
    return ResponseUtil.error(c, getMessage('C007', ['プロフィール']), 'C007', 400);
  }

  return ResponseUtil.success(c, data);
};
