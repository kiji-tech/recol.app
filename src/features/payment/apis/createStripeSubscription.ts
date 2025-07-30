import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import Stripe from 'stripe';

/**
 * Stripeサブスクリプションの作成
 */
export async function createStripeSubscription(
  priceId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Stripe.Subscription>('/stripe/subscription', {
    method: 'POST',
    session,
    body: { priceId },
    ctrl,
  });
  return response.data!;
}
