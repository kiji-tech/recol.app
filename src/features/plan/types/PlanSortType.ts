/**
 * プラン一覧のソート条件
 */
export type PlanSortType = 'created_at' | 'schedule_date';

/**
 * LocalStorageのキー
 */
export const PLAN_SORT_TYPE_STORAGE_KEY = '@plan_sort_type';

/**
 * デフォルトのソート条件
 */
export const DEFAULT_PLAN_SORT_TYPE: PlanSortType = 'created_at';
