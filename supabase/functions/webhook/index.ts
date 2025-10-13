import Stripe from 'stripe';
import dayjs from 'dayjs';
import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';

const app = new Hono().basePath('/webhook');

// ============ Stripe ============

// サブスクリプションの作成
// サブスクリプションの更新

/**
 * Subscription Data
 * - subscription_id
 * - price_id
 * - customer
 * - latest_invoice
 * - start_date
 * - ended_at
 * - canceled_at
 * - current_period_start
 * - current_period_end
 * - status
 * - trial_start
 * - trial_end
 * - created
 * -
 */

const convertSubscriptionData = (data: Stripe.Subscription & { plan: Stripe.Plan }) => {
  const {
    id: subscription_id,
    canceled_at,
    created,
    start_date,
    ended_at,
    current_period_start,
    current_period_end,
    customer,
    status,
    trial_start,
    trial_end,
    latest_invoice,
    plan: { id: price_id },
  } = data;

  return {
    uid: subscription_id,
    price_id: price_id,
    customer_id: customer,
    invoice_id: latest_invoice,
    status: status,
    start_at: start_date ? dayjs(start_date * 1000).toDate() : null,
    end_at: ended_at ? dayjs(ended_at * 1000).toDate() : null,
    canceled_at: canceled_at ? dayjs(canceled_at * 1000).toDate() : null,
    current_period_start: current_period_start ? dayjs(current_period_start * 1000).toDate() : null,
    current_period_end: current_period_end ? dayjs(current_period_end * 1000).toDate() : null,
    trial_start: trial_start ? dayjs(trial_start * 1000).toDate() : null,
    trial_end: trial_end ? dayjs(trial_end * 1000).toDate() : null,
    created_at: dayjs(created * 1000).toDate(),
    updated_at: dayjs().toDate(),
  };
};

const updateSubscription = async (
  c: Hono.Context,
  data: Stripe.Subscription & { plan: Stripe.Plan }
) => {
  const supabase = generateSupabase(c, true);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const subscription = convertSubscriptionData(data);

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('stripe_customer_id', subscription.customer_id)
    .maybeSingle();

  if (profileError) {
    LogUtil.log(
      {
        message: 'プロフィール取得失敗',
        error: profileError,
      },
      { level: 'error', notify: true }
    );
    return c.json({ message: getMessage('C007', ['プロフィール']) }, 400);
  }

  const { error: updateError } = await supabase.from('subscription').upsert(
    { ...subscription, user_id: profile.uid },
    {
      onConflict: 'uid',
    }
  );

  if (updateError) {
    LogUtil.log(
      {
        message: 'サブスクリプション更新失敗',
        subscription,
        updateError,
      },
      { level: 'error', notify: true }
    );
    return c.json({ message: getMessage('C007', ['サブスクリプション']) }, 400);
  }

  // プランの更新
  const { error: updatePlanError } = await supabase
    .from('profile')
    .update({
      payment_plan: subscription.status === 'active' ? 'Premium' : 'Free',
    })
    .eq('uid', profile.uid);
  if (updatePlanError) {
    LogUtil.log(
      {
        message: 'プラン更新失敗',
        profile,
        updatePlanError,
      },
      { level: 'error', notify: true }
    );
    return c.json({ message: getMessage('C007', ['プラン']) }, 400);
  }

  LogUtil.log(
    {
      message: 'サブスクリプション更新',
      subscription,
    },
    { level: 'info' }
  );

  return;
};

/** Stripe Webhook */
const stripeWebhook = async (c: Hono.Context) => {
  console.log('[POST] /webhook/stripe');

  // サブスク完了時に､プラン変更
  // サブスクの期間を表示できるようにテーブル作成
  // 期間が過ぎたらフリープランに戻す

  const event = await c.req.json();
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await updateSubscription(c, event.data.object);
      break;
  }

  return c.json('stripe webhook');
};

app.post('/stripe', stripeWebhook);
Deno.serve(app.fetch);
