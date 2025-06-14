import React from 'react';
import { Text, View } from 'react-native';
import { BackgroundView, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Enums } from '@/src/libs/database.types';

export default function PaymentPlan() {
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <BackgroundView>
      <Header title="プレミアムプラン紹介" onBack={() => router.back()} />
      <View className="flex flex-col">
        {/* 前段 */}
        <View>
          <Text>プレミアムプラン</Text>
        </View>
        {/* 比較表 */}
        <View className="flex flex-row">
          <Text className="w-32">フリー</Text>
          <Text className="w-32">プレミアム</Text>
          <Text className="flex-1" />
        </View>
        <View className="flex flex-row">
          <Text className="w-32">広告表示</Text>
          <Text className="w-32">○</Text>
          <Text className="w-32">×</Text>
          <Text className="flex-1" />
        </View>

        {/* プレミアムプランはこちらから */}
        <View>
          {/* 月額 */}
          {/* 年額 */}
        </View>
      </View>
    </BackgroundView>
  );
}
