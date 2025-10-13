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
  const response = await apiRequest<Stripe.PaymentIntent>('/stripe/payment-sheet', {
    method: 'POST',
    session,
    body: { redirectURL },
    ctrl,
  });
  return response.data!;
}
