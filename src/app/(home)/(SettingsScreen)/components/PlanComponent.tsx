import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Tables } from '@/src/libs/database.types';
import { SubscriptionUtil } from '@/src/libs/SubscriptionUtil';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

type PlanComponentProps = {
  profile: (Tables<'profile'> & { subscription: Tables<'subscription'>[] }) | null;
};

export default function PlanComponent({ profile }: PlanComponentProps) {
  // === Member ===
  const { isDarkMode } = useTheme();

  // === Method ===
  if (SubscriptionUtil.isAdmin(profile!) || SubscriptionUtil.isSuperUser(profile!)) {
    return (
      <View>
        <Text className="text-light-text dark:text-dark-text">スーパーユーザーです</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      className="flex flex-row items-start justify-between"
      onPress={() => router.push('/(payment)/PaymentPlan')}
    >
      {profile && profile!.subscription && profile!.subscription.length === 0 && (
        <View className="flex flex-row items-start justify-between ">
          <Text className="text-light-text dark:text-dark-text">無料プラン</Text>
        </View>
      )}

      {profile && profile!.subscription && profile!.subscription.length > 0 && (
        <View className="flex-col items-start justify-between">
          <Text className="text-light-text dark:text-dark-text mb-2 text-lg">プレミアムプラン</Text>
          {/* プランの有効期限 */}
          <Text className="text-light-text dark:text-dark-text mb-2 text-sm">
            有効期限: {dayjs(profile?.subscription[0].current_period_end).format('YYYY-MM-DD')}
          </Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
}
