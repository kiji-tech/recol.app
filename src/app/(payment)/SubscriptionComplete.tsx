import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BackgroundView } from '@/src/components';

export default function SubscriptionComplete() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        router.replace('/(home)');
      }, 3000);

      return () => clearTimeout(timer);
    }, [router])
  );

  return (
    <BackgroundView>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center text-6xl">🎉</Text>
        <Text className="mb-2 text-center text-2xl font-bold">アップグレードが完了しました！</Text>
        <Text className="text-center text-lg">
          プレミアムプランへようこそ。全ての機能をお楽しみいただけます。
        </Text>
      </View>
    </BackgroundView>
  );
}
