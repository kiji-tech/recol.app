import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogUtil } from '../../../libs/LogUtil';

const RECENT_PLAN_DAYS_STORAGE_KEY = '@recent_plan_days';
const DEFAULT_DAYS = 7;
const AVAILABLE_DAYS = [7, 14, 30] as const;

export type RecentPlanDays = (typeof AVAILABLE_DAYS)[number];

/**
 * 直近プラン表示日数を管理するカスタムフック
 * @return {{ days: RecentPlanDays, setDays: (days: RecentPlanDays) => Promise<void>, isLoading: boolean }} 日数設定とローディング状態
 */
export const useRecentPlanDays = () => {
  const [days, setDaysState] = useState<RecentPlanDays>(DEFAULT_DAYS);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * ローカルストレージから日数設定を読み込む
   */
  const loadDays = async (): Promise<void> => {
    try {
      const savedDays = await AsyncStorage.getItem(RECENT_PLAN_DAYS_STORAGE_KEY);
      if (savedDays) {
        const parsedDays = parseInt(savedDays, 10);
        if (AVAILABLE_DAYS.includes(parsedDays as RecentPlanDays)) {
          setDaysState(parsedDays as RecentPlanDays);
        }
      }
    } catch (error) {
      LogUtil.log('Failed to load recent plan days', {
        level: 'error',
        error: error as Error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 日数設定を保存する
   * @param {RecentPlanDays} newDays - 保存する日数
   */
  const setDays = async (newDays: RecentPlanDays): Promise<void> => {
    try {
      await AsyncStorage.setItem(RECENT_PLAN_DAYS_STORAGE_KEY, newDays.toString());
      setDaysState(newDays);
    } catch (error) {
      LogUtil.log('Failed to save recent plan days', {
        level: 'error',
        error: error as Error,
      });
    }
  };

  useEffect(() => {
    loadDays();
  }, []);

  return {
    days,
    setDays,
    isLoading,
    availableDays: AVAILABLE_DAYS,
  };
};

