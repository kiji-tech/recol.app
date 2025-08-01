import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import Stripe from 'stripe';

/**
 * Stripeサブスクリプションのキャンセル
 */
export async function cancelStripeSubscription(
  subscriptionId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Stripe.Subscription>('/stripe/cancel-subscription', {
    method: 'POST',
    session,
    body: { subscriptionId },
    ctrl,
  });
  return response.data!;
}
