import { Context } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

export const upsertSchedule = async (c: Context) => {
  LogUtil.log('[UPSERT] schedule', { level: 'info' });
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { schedule } = await c.req.json();
  // scheduleの更新
  const { data, error } = await supabase
    .from('schedule')
    .upsert(
      {
        ...schedule,
        place_list: schedule.place_list
          ? schedule.place_list.map((place: { id: string }) => place.id)
          : [],
      },
      { onConflict: 'uid' }
    )
    .select('*');
  if (error) {
    LogUtil.log(error, { level: 'error' });
    return c.json({ message: getMessage('C007', ['スケジュール']), code: 'C007' }, 400);
  }

  return c.json(data);
};
