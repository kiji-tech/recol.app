import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { StripeUtil } from '../libs/StripeUtil.ts';
import { getMessage } from '../libs/MessageUtil.ts';

const app = new Hono().basePath('/stripe');

const postCustomer = async (c: Hono.Context) => {
  console.log('[POST] stripe/customer');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const customer = await StripeUtil.createCustomer(user.email!);
  await supabase.from('profile').update({ stripe_customer_id: customer.id }).eq('uid', user.id);

  return c.json({ customer });
};

app.post('/customer', postCustomer);
Deno.serve(app.fetch);
