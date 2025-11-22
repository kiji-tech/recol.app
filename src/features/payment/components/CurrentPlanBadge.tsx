import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { Profile } from '@/src/features/profile';
import generateI18nMessage from '@/src/libs/i18n';

type CurrentPlanBadgeProps = {
  profile: Profile | null;
};

export default function CurrentPlanBadge({ profile }: CurrentPlanBadgeProps) {
  if (!profile?.isPremiumUser()) {
    return (
      <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <Text className="text-center text-gray-600 dark:text-gray-300 font-medium">
          {generateI18nMessage('COMPONENT.PAYMENT.CURRENT_FREE_PLAN')}
        </Text>
        <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          {generateI18nMessage('COMPONENT.PAYMENT.UPGRADE_MESSAGE')}
        </Text>
      </View>
    );
  }

  const endDate = dayjs(profile.payment_end_at).format('YYYY年MM月DD日');

  return (
    <View className="bg-light-primary/10 dark:bg-dark-primary/10 rounded-lg p-4 border border-light-primary/20 dark:border-dark-primary/20">
      <View className="flex-row items-center justify-center mb-2">
        <View className="bg-light-primary dark:bg-dark-primary rounded-full px-3 py-1">
          <Text className="text-white text-sm font-bold">
            {generateI18nMessage('COMPONENT.PAYMENT.PREMIUM')}
          </Text>
        </View>
      </View>
      <Text className="text-center text-light-text dark:text-dark-text">
        {generateI18nMessage('COMPONENT.PLAN.EXPIRATION_DATE')}: {endDate}まで
      </Text>
    </View>
  );
}
