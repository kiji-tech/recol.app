import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const PlanItem = ({ title, free, premium }: { title: string; free: string; premium: string }) => {
  return (
    <View className="flex flex-row justify-between  border-light-border dark:border-dark-border border-b">
      <Text className="p-4 flex-1 text-center text-light-text dark:text-dark-text">{title}</Text>
      <Text className="p-4 w-32 text-center text-light-text dark:text-dark-text ">{free}</Text>
      <Text className="p-4 w-40 text-center text-light-text dark:text-dark-text font-bold">
        {premium}
      </Text>
    </View>
  );
};

export default function SampleScreen() {
  const router = useRouter();
  // === Render ===

  return (
    <BackgroundView>
      <Header title="プレミアムプラン紹介" onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-8 pb-8">
          {/* 前段 */}
          <View>
            <Text className="text-light-text dark:text-dark-text">プレミアムプランにすると...</Text>
          </View>
          {/* 比較表 */}
          <View className="">
            <View className="flex flex-row justify-between border-b border-light-border dark:border-dark-border">
              <Text className="p-4 flex-1" />
              <Text className="p-4 w-32 text-center text-light-text dark:text-dark-text ">
                フリー
              </Text>
              <Text className="p-4 w-40 text-center text-light-text dark:text-dark-text font-bold">
                プレミアム
              </Text>
            </View>
            <PlanItem title="プラン数" free="4プラン / 年" premium="20プラン / 年" />
            <PlanItem title="ストレージ容量" free="1GB / プラン" premium="100GB / プラン" />
            <PlanItem title="広告表示" free="○" premium="-" />
          </View>

          {/* プレミアムプランはこちらから */}
          <View className="flex flex-row justify-around items-start gap-2">
            {/* 月額 */}
            <TouchableOpacity className="flex flex-col items-center justify-center bg-light-warn dark:bg-dark-warn rounded-md w-1/2 h-28 p-4">
              <Text className="text-3xl text-light-text dark:text-dark-text">400円</Text>
              <Text className="text-sm text-light-text dark:text-dark-text"> / 月額</Text>
            </TouchableOpacity>
            {/* 年額 */}
            <TouchableOpacity className="flex flex-col items-center justify-center bg-light-danger dark:bg-dark-danger rounded-md w-1/2 h-28 p-4">
              <Text className="text-3xl text-light-text dark:text-dark-text">4,000円</Text>
              <Text className="text-md text-light-text dark:text-dark-text"> / 年額</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
