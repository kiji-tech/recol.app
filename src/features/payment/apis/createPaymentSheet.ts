import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import Stripe from 'stripe';

/**
 * 支払いシートの作成
 */
export async function createPaymentSheet(
  redirectURL: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<{
    paymentIntent: Stripe.PaymentIntent;
    ephemeralKey: Stripe.EphemeralKey;
    customerId: string;
  }>('/stripe/payment-sheet', {
    method: 'POST',
    session,
    body: { redirectURL },
    ctrl,
  });
  return response.data!;
}
