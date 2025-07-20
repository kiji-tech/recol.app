import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { View, Text } from 'react-native';
import { SubscriptionUtil } from '@/src/libs/SubscriptionUtil';
import dayjs from 'dayjs';

type CurrentPlanBadgeProps = {
  profile: (Tables<'profile'> & { subscription: Tables<'subscription'>[] }) | null;
};

export default function CurrentPlanBadge({ profile }: CurrentPlanBadgeProps) {
  if (!profile?.subscription || profile.subscription.length === 0) {
    return (
      <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <Text className="text-center text-gray-600 dark:text-gray-300 font-medium">
          現在フリープランをご利用中です
        </Text>
        <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          プレミアムプランにアップグレードして、すべての機能をお楽しみください
        </Text>
      </View>
    );
  }

  const isMonthly = SubscriptionUtil.isMonthly(profile);
  const endDate = dayjs(profile.subscription[0].current_period_end).format('YYYY年MM月DD日');

  return (
    <View className="bg-light-primary/10 dark:bg-dark-primary/10 rounded-lg p-4 border border-light-primary/20 dark:border-dark-primary/20">
      <View className="flex-row items-center justify-center mb-2">
        <View className="bg-light-primary dark:bg-dark-primary rounded-full px-3 py-1">
          <Text className="text-white text-sm font-bold">プレミアム</Text>
        </View>
        <Text className="ml-2 text-light-primary dark:text-dark-primary font-bold">
          {isMonthly ? '月額' : '年額'}プラン
        </Text>
      </View>
      <Text className="text-center text-light-text dark:text-dark-text">
        有効期限: {endDate}まで
      </Text>
    </View>
  );
}
