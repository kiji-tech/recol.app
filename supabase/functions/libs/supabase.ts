import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js';

/**
 * Supabaseクライアントを生成する
 * @param c {Hono.Context} context
 * @returns {SupabaseClient} supabase client
 */
const generateSupabase = (c: Hono.Context, admin?: boolean = false) => {
  const key = admin
    ? (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')
    : (Deno.env.get('SUPABASE_ANON_KEY') ?? '');

  const authorization = c.req.header('Authorization') ?? '';
  const headers = authorization ? { Authorization: authorization } : {};
  return createClient(Deno.env.get('SUPABASE_URL') ?? '', key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: headers,
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
