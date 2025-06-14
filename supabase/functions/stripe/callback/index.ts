import { Hono } from 'jsr:@hono/hono';
import { generateSupabase } from '../../libs/supabase';
import { StripeUtil } from '../../libs/StripeUtil';
import { getUser } from '../../libs/supabase';
import { getMessage } from '../../libs/MessageUtil';

const app = new Hono().basePath('/stripe/callback');

const post = async (c: Hono.Context) => {
  console.log('[POST] /stripe/callback');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const customer = await StripeUtil.createCustomer(user.email!);
  await supabase.from('profile').update({ stripe_customer_id: customer.id }).eq('uid', user.id);
  return c.json({ customer });
};

app.post('/', post);
Deno.serve(app.fetch);
