import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BackgroundView } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { usePremiumPlan } from '@/src/features/auth/hooks/usePremiumPlan';
import i18n from '@/src/libs/i18n';

export default function SubscriptionComplete() {
  const TIMEOUT = 3000;
  const router = useRouter();
  const { getProfile } = useAuth();
  const { onRefetch } = usePremiumPlan();

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        onRefetch();
        router.replace('/(home)');
      }, TIMEOUT);

      return () => clearTimeout(timer);
    }, [router])
  );

  // === Render ===
  return (
    <BackgroundView>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-light-text dark:text-dark-text text-center text-6xl">🎉</Text>
        <Text className="mb-2 text-light-text dark:text-dark-text text-center text-2xl font-bold">
          {i18n.t('SCREEN.PAYMENT.UPGRADE_COMPLETE')}
        </Text>
        <Text className="text-center text-light-text dark:text-dark-text text-lg">
          {i18n.t('SCREEN.PAYMENT.WELCOME_PREMIUM')}
        </Text>
      </View>
    </BackgroundView>
  );
}
