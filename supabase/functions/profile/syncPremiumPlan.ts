import { Context } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';

export const syncPremiumPlan = async (c: Context) => {
  console.log('[PUT] sync-premium-plan');
  const supabase = generateSupabase(c);
  const { isPremium, endAt } = await c.req.json();
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const { data, error } = await supabase
    .from('profile')
    .update({ payment_plan: isPremium ? 'Premium' : 'Free', payment_end_at: endAt })
    .eq('uid', user.id)
    .select('*')
    .maybeSingle();

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['プロフィール']), code: 'C007' }, 400);
  }

  return c.json(data);
};
