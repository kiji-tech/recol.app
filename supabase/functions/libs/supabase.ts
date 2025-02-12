import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const generateSupabase = () => {
  return createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
};

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