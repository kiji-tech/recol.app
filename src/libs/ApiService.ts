import { Session } from '@supabase/supabase-js';
import { Tables } from './database.types';
import { LogUtil } from './LogUtil';
import Stripe from 'stripe';
import { Place } from '../entities/Place';
import { Profile, Subscription } from '../entities';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

type ApiErrorResponse = {
  message: string;
  code: string;
};

type ApiResponse<T> = {
  data: T | null;
  error: ApiErrorResponse | null;
};

const createHeaders = (session: Session | null) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${session?.access_token}`,
});

async function apiRequest<T, B = Record<string, unknown>>(
  endpoint: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    session: Session | null;
    body?: B;
    ctrl?: AbortController;
  }
): Promise<ApiResponse<T>> {
  const { method, session, body, ctrl } = options;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: createHeaders(session),
    body: body ? JSON.stringify(body) : undefined,
    signal: ctrl?.signal,
  });

  const data = await res.json();
  if (!res.ok) {
    if (data.message && data.code) {
      LogUtil.log(JSON.stringify(data), { level: 'error', notify: true });
      throw data;
    }
    throw new Error(`Other API error: ${res.status} ${res.statusText}`);
  }
  LogUtil.log(`=== apiRequest ${endpoint} ===`);

  return { data: data, error: null };
}

// ============ Plan ============

// ============ Schedule ============

// ============ Media ============

// ============ Profile ============
/**
 * プロフィールの取得
 */
async function getProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'profile'> & { subscription: Tables<'subscription'>[] }>(
    '/profile',
    {
      method: 'GET',
      session,
      ctrl,
    }
  );
  return response.data!;
}

/**
 * プロフィールの作成
 */
async function createProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Profile & { subscription: Subscription[] }>('/profile', {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}

/**
 * プロフィールの更新
 */
async function updateProfile(profile: Profile, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Profile>('/profile', {
    method: 'PUT',
    session,
    body: {
      ...profile,
      avatar_url: profile?.avatar_url || null,
    },
    ctrl,
  });
  return response.data!;
}

// ============ Cache ============
/**
 * GoogleMap Place情報の取得
 */
async function fetchCachePlace(
  placeIdList: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Place>(`/cache/place`, {
    method: 'POST',
    session,
    body: { placeIdList },
    ctrl,
  });
  return response.data!;
}

// ============ Stripe ============

/**
 * 支払いシートの作成
 */
async function createPaymentSheet(
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

/**
 * Stripe顧客の作成
 */
async function createStripeCustomer(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Stripe.Customer>('/stripe/customer', {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}

/**
 * Stripeサブスクリプションの作成
 */
async function createStripeSubscription(
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

/**
 * Stripeサブスクリプションの更新
 */
async function updateStripeSubscription(
  subscriptionId: string,
  priceId: string,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Stripe.Subscription>('/stripe/update-subscription', {
    method: 'POST',
    session,
    body: { subscriptionId, priceId },
    ctrl,
  });
  return response.data!;
}

/**
 * Stripeサブスクリプションのキャンセル
 */
async function cancelStripeSubscription(
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

export {
  getProfile,
  createProfile,
  updateProfile,
  fetchCachePlace,
  createPaymentSheet,
  createStripeCustomer,
  updateStripeSubscription,
  createStripeSubscription,
  cancelStripeSubscription,
};
