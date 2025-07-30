import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { StripeUtil } from '../libs/StripeUtil.ts';
import { getMessage } from '../libs/MessageUtil.ts';

const app = new Hono().basePath('/stripe');

const getCustomerId = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  const { data } = await supabase
    .from('profile')
    .select('stripe_customer_id')
    .eq('uid', user.id)
    .single();

  let customerId = data.stripe_customer_id;
  if (!customerId) {
    const customer = await StripeUtil.createCustomer(user.email!);
    customerId = customer.id;
    await supabase.from('profile').update({ stripe_customer_id: customerId }).eq('uid', user.id);
  }
  return customerId;
};

const postCustomer = async (c: Hono.Context) => {
  console.log('[POST] stripe/customer');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const customer = await StripeUtil.createCustomer(user.email!);
  await supabase.from('profile').update({ stripe_customer_id: customer.id }).eq('uid', user.id);

  return c.json(customer);
};

const postPaymentSheet = async (c: Hono.Context) => {
  console.log('[POST] stripe/payment-sheet');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { redirectURL } = await c.req.json();

  const customerId = await getCustomerId(c);

  const ephemeralKey = await StripeUtil.createEphemeralKey(customerId);
  const paymentIntent = await StripeUtil.createPaymentIntents(customerId);
  return c.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customerId,
    returnURL: redirectURL,
    publishableKey: Deno.env.get('STRIPE_PUBLIC_KEY') || '',
  });
};

const postSubscription = async (c: Hono.Context) => {
  console.log('[POST] stripe/subscription');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { priceId } = await c.req.json();
  if (!priceId) {
    return c.json({ message: getMessage('C009', ['priceId']), code: 'C009' }, 400);
  }
  const customerId = await getCustomerId(c);
  console.log({ priceId, customerId });
  const subscription = await StripeUtil.createSubscription(customerId, priceId);
  console.log({ subscription });
  return c.json(subscription);
};

const updateSubscription = async (c: Hono.Context) => {
  console.log('[POST] stripe/update-subscription');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { subscriptionId, priceId } = await c.req.json();
  const subscription = await StripeUtil.updateSubscription(subscriptionId, priceId);
  console.log(subscription);
  return c.json(subscription);
};

const cancelSubscription = async (c: Hono.Context) => {
  console.log('[POST] stripe/cancel-subscription');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { subscriptionId } = await c.req.json();
  console.log('cancelSubscription', subscriptionId);
  const subscription = await StripeUtil.cancelSubscription(subscriptionId);
  return c.json(subscription);
};

app.post('/payment-sheet', postPaymentSheet);
app.post('/customer', postCustomer);
app.post('/subscription', postSubscription);
app.post('/update-subscription', updateSubscription);
app.post('/cancel-subscription', cancelSubscription);
Deno.serve(app.fetch);
