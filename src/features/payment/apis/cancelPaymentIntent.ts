import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';
import Stripe from 'stripe';

export async function cancelPaymentIntent(
  paymentIntentId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Stripe.PaymentIntent>('/stripe/cancel-payment-intent', {
    method: 'POST',
    session,
    body: { paymentIntentId },
    ctrl,
  });
  return response.data!;
}
