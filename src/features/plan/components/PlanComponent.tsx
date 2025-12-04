import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/features/auth';
import { usePremiumPlan } from '@/src/features/auth/hooks/usePremiumPlan';
import dayjs from 'dayjs';
import generateI18nMessage from '@/src/libs/i18n';

export default function PlanComponent() {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { profile } = useAuth();
  const { isPremium } = usePremiumPlan();

  // === Method ===
  if (profile && (profile.isAdmin() || profile.isSuperUser())) {
    return (
      <View className="px-4 py-2 text-md">
        <Text className="text-light-text dark:text-dark-text">
          {generateI18nMessage('FEATURE.PLAN.SUPER_USER')}
        </Text>
      </View>
    );
  }

  return (
    <View className="px-4 py-2 text-md">
      <TouchableOpacity
        className="flex flex-row items-start justify-between"
        onPress={() => router.push('/(payment)/PaymentPlan')}
      >
        {!isPremium && (
          <View className="flex flex-row items-start justify-between ">
            <Text className="text-light-text dark:text-dark-text">
              {generateI18nMessage('FEATURE.PLAN.FREE_PLAN')}
            </Text>
          </View>
        )}

        {profile && profile.isPremiumUser() && (
          <View className="flex-col items-start justify-between">
            <Text className="text-light-text dark:text-dark-text mb-2 text-lg">
              {generateI18nMessage('FEATURE.PLAN.PREMIUM_PLAN')}
            </Text>
            {/* プランの有効期限 */}
            <Text className="text-light-text dark:text-dark-text mb-2 text-sm">
              {generateI18nMessage('FEATURE.PLAN.EXPIRATION_DATE')}:{' '}
              {dayjs(profile.payment_end_at).format('YYYY-MM-DD HH:mm')}
            </Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={isDarkMode ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>
  );
}
