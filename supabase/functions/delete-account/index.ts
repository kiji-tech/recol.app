import { Hono, Context } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';

const app = new Hono().basePath('/delete-account');

const deleteUserAccount = async (c: Context) => {
  const supabase = generateSupabase(c, false);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  // 削除フラグを追加する
  const { error } = await supabase.from('profile').update({ delete_flag: true }).eq('uid', user.id);
  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ success: true });
};
app.delete('/', deleteUserAccount);

export default app;
