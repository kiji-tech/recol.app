import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { LogUtil } from '../libs/LogUtil.ts';

export const getProfile = async (c: Context) => {
  LogUtil.log(`[GET] /profile`, { level: 'info' });

  const supabase: SupabaseClient = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { data: profile, error: profileError } = await supabase
    .from('user')
    .select('*')
    .eq('uid', user.uid)
    .maybeSingle();

  if (profileError) {
    LogUtil.log(JSON.stringify(profileError), { level: 'error', notify: true });
    return c.json({ error: profileError.message }, 500);
  }

  return c.json(profile);
};
