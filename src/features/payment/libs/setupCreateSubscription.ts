import { LogUtil } from '@/src/libs/LogUtil';
import { Session } from '@supabase/supabase-js';
import { createStripeSubscription } from '../apis/createStripeSubscription';
import { initPaymentSheet } from '@stripe/stripe-react-native';

/** Stripeの支払いシートをセットアップ */
export const setupCreateSubscription = async (type: 'm' | 'y', session: Session | null) => {
  LogUtil.log('setup subscription.');
  const priceId =
    type == 'm'
      ? process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN
      : process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN;
  if (!priceId) {
    LogUtil.log({ type, priceId }, { level: 'error' });
    throw new Error('Price ID is not set');
  }

  const subscription = await createStripeSubscription(priceId, session);

  const clientSecret =
    typeof subscription.latest_invoice === 'string'
      ? undefined
      : subscription.latest_invoice?.confirmation_secret?.client_secret;

  if (!clientSecret) {
    throw new Error('Client secret is not available');
  }

  await initPaymentSheet({
    merchantDisplayName: `Re:CoL プレミアムプラン ${type === 'm' ? '月額' : '年額'}`,
    paymentIntentClientSecret: clientSecret,
    allowsDelayedPaymentMethods: true,
  });
  return subscription;
};
