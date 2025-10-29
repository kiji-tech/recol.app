import { Context } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { createProfile } from './fetchProfile.ts';

export const createProfileHandler = async (c: Context) => {
  console.log('[POST] profile');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const data = await createProfile(c).catch(() => {
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  });

  return c.json(data);
};
