import { Context } from 'jsr:@hono/hono';
import { SupabaseClient, User } from 'npm:@supabase/supabase-js';
import { getMessage } from '../libs/MessageUtil.ts';
import { createProfile } from './fetchProfile.ts';
import { LogUtil } from '../libs/LogUtil.ts';

export const createProfileHandler = async (c: Context, supabase: SupabaseClient, user: User) => {
  LogUtil.log('[POST] profile', { level: 'info' });
  const data = await createProfile(c, supabase, user).catch((error) => {
    LogUtil.log(error, { level: 'error' });
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  });
  return c.json(data);
};
