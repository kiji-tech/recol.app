import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Subscription, SubscriptionType } from '../types/Subscription';

/**
 * Stripeサブスクリプションの更新
 */
export async function updateStripeSubscription(
  subscription: Subscription,
  priceId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<SubscriptionType>('/stripe/update-subscription', {
    method: 'POST',
    session,
    body: { subscriptionId: subscription.uid, priceId },
    ctrl,
  });
  return new Subscription(response.data!);
}
