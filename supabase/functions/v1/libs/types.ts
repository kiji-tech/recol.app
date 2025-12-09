// 共通型定義
import { Tables, Enums } from './database.types.ts';

// データベースの型定義を使用
export type Plan = Tables<'plan'>;
export type PlanWithScheduleWithMedia = Tables<'plan'> & {
  schedule: (Tables<'schedule'> & {
    media: Tables<'media'>[];
  })[];
};
export type Schedule = Tables<'schedule'>;
export type ScheduleWithMedia = Tables<'schedule'> & {
  media: Tables<'media'>[];
};
export type Profile = Tables<'profile'>;
export type Media = Tables<'media'>;
export type Message = Tables<'message'>;
export type Subscription = Tables<'subscription'>;

// 列挙型
export type ScheduleCategory = Enums<'ScheduleCategory'>;
export type PaymentPlan = Enums<'PaymentPlan'>;
export type Role = Enums<'Role'>;

// スケジュールの拡張型（プレースデータ付き）
export interface ScheduleWithPlaceData extends Omit<Schedule, 'place_list'> {
  place_list: PlaceData[];
}

// プランの拡張型（プレースデータ付きスケジュール）
export interface PlanWithEnrichedSchedule extends Plan {
  schedule: ScheduleWithPlaceData[];
}

// Google Places API関連の型定義
export interface PlaceData {
  id: string;
  types: string[];
  reviews?: Review[];
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  rating?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  photos?: Photo[];
  websiteUri?: string;
  editorialSummary?: {
    text: string;
    languageCode: string;
  };
  currentOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  googleMapsUri: string;
  googleMapsLinks?: {
    webUri: string;
  };
}

export interface Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
  originalText: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string;
}

export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: {
    displayName: string;
    uri: string;
    photoUri: string;
  }[];
}

// API レスポンス用の型定義

/**
 * 成功レスポンスの型定義
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}

/**
 * エラーレスポンスの型定義
 */
export interface ErrorResponse {
  success: false;
  data: null;
  error: {
    message: string;
    code: string;
  };
}

/**
 * 統一APIレスポンス型
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// プラン関連のリクエスト型
export interface CreatePlanRequest {
  title: string;
  memo?: string;
}

export interface UpdatePlanRequest {
  uid: string;
  title: string;
  memo?: string;
  schedule?: (Schedule & { place_list: { id: string }[] })[];
}

export interface DeletePlanRequest {
  planId: string;
}

// プロフィール関連のリクエスト型
export interface UpdateProfileRequest {
  display_name?: string;
  avatar_url?: string;
  enabled_schedule_notification?: boolean;
  notification_token?: string;
}

// データベース操作の戻り値型
export interface DatabaseResult<T = unknown> {
  data: T | null;
  error: Error | string | null;
}

// バリデーション結果の型
export interface ValidationResult<T = unknown> {
  isValid: boolean;
  data: T | null;
  error?: Response | null;
}
