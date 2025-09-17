import { LogUtil } from '@/src/libs/LogUtil';
import { Session } from '@supabase/supabase-js';
import { createStripeSubscription } from '../apis/createStripeSubscription';
import { Payment } from '../types/Payment';

/** Stripeの支払いシートをセットアップ */
export const setupCreateSubscription = async (payment: Payment, session: Session | null) => {
  if (!payment.priceId) {
    LogUtil.log({ payment }, { level: 'error' });
    throw new Error('Price ID is not set');
  }

  const subscription = await createStripeSubscription(payment.priceId, session);

  const clientSecret =
    typeof subscription.latest_invoice === 'string'
      ? undefined
      : subscription.latest_invoice?.confirmation_secret?.client_secret;

  if (!clientSecret) {
    throw new Error('Client secret is not available');
  }

  return subscription;
};
