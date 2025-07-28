import { Session } from '@supabase/supabase-js';
import { Tables } from './database.types';
import { LogUtil } from './LogUtil';
import Stripe from 'stripe';
import { Place } from '../entities/Place';
import { Plan, Schedule } from '@/src/entities/Plan';
import { Profile, Subscription } from '../entities';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL;

export type ApiErrorResponse = {
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
/**
 * プラン情報の取得
 */
async function fetchPlan(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>(`/plan/${planId}`, { method: 'GET', session, ctrl });
  return response.data!;
}

/**
 * プラン一覧の取得
 */
async function fetchPlanList(session: Session | null, ctrl?: AbortController): Promise<Plan[]> {
  const response = await apiRequest<Plan[]>('/plan/list', { method: 'POST', session, ctrl });
  return response.data!;
}

async function createPlan(plan: Plan, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>('/plan', {
    method: 'POST',
    session,
    body: plan as Plan,
    ctrl,
  });
  return response.data!;
}
/**
 * プランの更新
 */
async function updatePlan(plan: Plan, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>('/plan', {
    method: 'PUT',
    session,
    body: plan as Plan,
    ctrl,
  });
  return response.data!;
}

/**
 * プランの削除
 */
async function deletePlan(planId: string, session: Session | null, ctrl?: AbortController) {
  await apiRequest<void>('/plan/delete', {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
}

// ============ Schedule ============
/**
 * スケジュール情報の取得
 */
async function fetchSchedule(scheduleId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Schedule>(`/schedule/${scheduleId}`, {
    method: 'GET',
    session,
    ctrl,
  });
  return response.data!;
}

/**
 * スケジュール一覧の取得
 */
async function fetchScheduleList(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Schedule[]>(`/schedule/list`, {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
  return response.data!;
}

/**
 * 通知を追加するスケジュール一覧の取得
 */
async function fetchScheduleListForNotification(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Schedule[]>(`/schedule/list/notification`, {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}

/**
 * スケジュールの削除
 */
async function deleteSchedule(uid: string, session: Session | null, ctrl?: AbortController) {
  await apiRequest<void>('/schedule/delete', {
    method: 'POST',
    session,
    body: { uid },
    ctrl,
  });
}

/**
 * スケジュールの作成・更新
 */
async function upsertSchedule(schedule: Schedule, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Schedule>('/schedule', {
    method: 'POST',
    session,
    body: { schedule },
    ctrl,
  });
  return response.data!;
}

// ============ Media ============
/**
 * プランのメディア一覧を取得
 */
async function fetchPlanMediaList(
  planId: string,
  session: Session | null,
  ctrl?: AbortController
): Promise<Tables<'media'>[]> {
  const response = await apiRequest<Tables<'media'>[]>('/media/list', {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
  return response.data! as Tables<'media'>[];
}

/**
 * プランのメディアをアップロード
 */
async function uploadPlanMedias(
  planId: string,
  images: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<void>('/media', {
    method: 'POST',
    session,
    body: { planId, images },
    ctrl,
  });
  return response.data!;
}

/**
 * プランのメディアを削除
 */
async function deletePlanMedias(
  planId: string,
  mediaIdList: string[],
  session: Session | null,
  ctrl?: AbortController
) {
  await apiRequest<void>('/media/delete', {
    method: 'POST',
    session,
    body: { planId, mediaIdList },
    ctrl,
  });
}

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
// ============ MicroCMS ============
/**
 * ブログの取得
 */
async function fetchBlog(id: string, ctrl?: AbortController) {
  const url = process.env.EXPO_PUBLIC_MICROCMS_URI! + '/blogs/' + id;
  console.log({ url });
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
    signal: ctrl?.signal,
  });
  if (!response.ok) throw new Error('Failed to fetch blog');
  return response.json();
}

/**
 * ブログ一覧の取得
 */
async function fetchBlogList() {
  const response = await fetch(process.env.EXPO_PUBLIC_MICROCMS_URI! + '/blogs', {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog list');
  }

  const data = await response.json();
  return data.contents;
}

export {
  fetchPlan,
  fetchPlanList,
  createPlan,
  updatePlan,
  deletePlan,
  fetchSchedule,
  fetchScheduleList,
  fetchScheduleListForNotification,
  deleteSchedule,
  upsertSchedule,
  fetchPlanMediaList,
  uploadPlanMedias,
  deletePlanMedias,
  getProfile,
  createProfile,
  updateProfile,
  fetchBlog,
  fetchBlogList,
  fetchCachePlace,
  createPaymentSheet,
  createStripeCustomer,
  updateStripeSubscription,
  createStripeSubscription,
  cancelStripeSubscription,
};
