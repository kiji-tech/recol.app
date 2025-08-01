import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useAuth } from '@/src/features/auth';

export default function PlanComponent() {
  // === Member ===
    const { isDarkMode } = useTheme();
    const { profile } = useAuth();

  // === Method ===
  if (profile && (profile.isAdmin() || profile.isSuperUser())) {
    return (
      <View>
        <Text className="text-light-text dark:text-dark-text">スーパーユーザーです</Text>
      </View>
    );
  }

  return (
    <View className="px-4 py-2 text-md text-light-text dark:text-dark-text">
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
            <Text className="text-light-text dark:text-dark-text mb-2 text-lg">
              プレミアムプラン
            </Text>
            {/* プランの有効期限 */}
            <Text className="text-light-text dark:text-dark-text mb-2 text-sm">
              有効期限: {dayjs(profile?.subscription[0].current_period_end).format('YYYY-MM-DD')}
            </Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>
  );
}
