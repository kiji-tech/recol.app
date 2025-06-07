import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

/**
 * Supabaseクライアントを生成する
 * @param c {Hono.Context} context
 * @returns {SupabaseClient} supabase client
 */
const generateSupabase = (c: Hono.Context) => {
  return createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: c
        ? {
            Authorization: c.req.header('Authorization') ?? '',
          }
        : {},
    },
  });
};

/**
 * ユーザーを取得する
 * @param c {Hono.Context} context
 * @param supabase {SupabaseClient} supabase client
 * @returns {Promise<User | null>} user
 */
const getUser = async (c: Hono.Context, supabase: SupabaseClient) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Authorization header is missing' }, 401);
  }
  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  return user;
};

export { generateSupabase, getUser };
