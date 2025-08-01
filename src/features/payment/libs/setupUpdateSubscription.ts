import { Session } from '@supabase/supabase-js';
import { Subscription, updateStripeSubscription } from '../';

export async function setupUpdateSubscription(
  subscription: Subscription,
  type: 'm' | 'y',
  session: Session | null
) {
  const priceId =
    type == 'm'
      ? process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN
      : process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN;

  return updateStripeSubscription(subscription, priceId || '', session);
}
