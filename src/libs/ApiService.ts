import { Session } from '@supabase/supabase-js';
import { Tables } from './database.types';
import { LogUtil } from './LogUtil';
import Stripe from 'stripe';
import { Place } from '../entities/Place';

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
      LogUtil.log(data.message, { level: 'error', notify: true });
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
 *
 * @param planId {string}
 * @param session  {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'plan'>
 */
async function fetchPlan(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'plan'> & { schedule: Tables<'schedule'>[] }>(
    `/plan/${planId}`,
    { method: 'GET', session, ctrl }
  );
  return response.data!;
}

/**
 * プラン一覧の取得
 *
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'plan'> & { schedule: Tables<'schedule'>[] }[]
 */
async function fetchPlanList(
  session: Session | null,
  ctrl?: AbortController
): Promise<(Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]> {
  const response = await apiRequest<(Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]>(
    '/plan/list',
    { method: 'POST', session, ctrl }
  );
  return response.data!;
}

async function createPlan(plan: Tables<'plan'>, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'plan'> & { schedule: Tables<'schedule'>[] }>('/plan', {
    method: 'POST',
    session,
    body: plan,
    ctrl,
  });
  return response.data!;
}
/**
 * プランの更新
 */
async function updatePlan(plan: Tables<'plan'>, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'plan'> & { schedule: Tables<'schedule'>[] }>('/plan', {
    method: 'PUT',
    session,
    body: plan,
    ctrl,
  });
  return response.data!;
}

/**
 * プランの削除
 *
 * @param planId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
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
 *
 * @param scheduleId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>
 */
async function fetchSchedule(scheduleId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'schedule'> & { place_list: Place[] }>(
    `/schedule/${scheduleId}`,
    {
      method: 'GET',
      session,
      ctrl,
    }
  );
  return response.data!;
}

/**
 * スケジュール一覧の取得
 *
 * @param planId {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>[]
 */
async function fetchScheduleList(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Tables<'schedule'>[]>(`/schedule/list`, {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
  return response.data!;
}

/**
 * スケジュールの削除
 *
 * @param uid {string}
 * @param session {Session | null}
 * @param ctrl {AbortController}
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
 *
 * @param schedule {Tables<'schedule'>}
 * @param session {Session | null}
 * @param ctrl {AbortController}
 * @returns Tables<'schedule'>
 */
async function upsertSchedule(
  schedule: Tables<'schedule'>,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Tables<'schedule'>[]>('/schedule', {
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
 *
 * @param planId {string} プランID
 * @param session {Session | null} Supabaseのセッション情報
 * @param ctrl {AbortController}
 * @returns Tables<'media'>[]
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
 *
 * @param planId {string} プランID
 * @param images {string[]} Base64形式の画像データ
 * @param session {Session | null} Supabaseのセッション情報
 * @param ctrl {AbortController}
 * @returns
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

async function updateProfile(
  profile: Tables<'profile'>,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Tables<'profile'> & { subscription: Tables<'subscription'>[] }>(
    '/profile',
    {
      method: 'PUT',
      session,
      body: {
        ...profile,
        avatar_url: profile.avatar_url || null,
      },
      ctrl,
    }
  );
  return response.data!;
}

// ============ Cache ============
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
  console.log({ cachePlace: response.data });
  return response.data!;
}

// ============ Stripe ============
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

async function createStripeCustomer(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Stripe.Customer>('/stripe/customer', {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}

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
  deleteSchedule,
  upsertSchedule,
  fetchPlanMediaList,
  uploadPlanMedias,
  deletePlanMedias,
  getProfile,
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
