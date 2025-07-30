import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import Stripe from 'stripe';

/**
 * Stripe顧客の作成
 */
export async function createStripeCustomer(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Stripe.Customer>('/stripe/customer', {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}
