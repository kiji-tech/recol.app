import { Session } from '@supabase/supabase-js';
import { Subscription, updateStripeSubscription } from '../';
import { Payment } from '../types/Payment';

export async function setupUpdateSubscription(
  subscription: Subscription,
  payment: Payment,
  session: Session | null
) {
  return updateStripeSubscription(subscription, payment.priceId || '', session);
}
