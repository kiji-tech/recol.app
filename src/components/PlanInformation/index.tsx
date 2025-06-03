import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

/**
 * プランインフォメーション
 * ・予定地
 * ・予定メモ
 * ・友達
 */
export default function PlanInformation({ plan }: Props) {
  const { isDarkMode } = useTheme();

  // No plan
  if (!plan) return <></>;

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-2xl font-bold text-light-text dark:text-dark-text">{plan.title}</Text>
      {/* 計画メモ */}
      <View className="px-2 py-4">
        <Text className="text-sm text-light-text dark:text-dark-text">
          {plan.memo || 'メモはありません.'}
        </Text>
      </View>
      {/* イメージビュー */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row gap-2">
          <View className="w-44 h-32 bg-light-theme dark:bg-dark-theme rounded-md"></View>
          <View className="w-44 h-32 bg-light-theme dark:bg-dark-theme rounded-md"></View>
          <View className="w-44 h-32 bg-light-theme dark:bg-dark-theme rounded-md"></View>
          <View className="w-44 h-32 bg-light-theme dark:bg-dark-theme rounded-md"></View>
          <View className="w-44 h-32 bg-light-theme dark:bg-dark-theme rounded-md"></View>
          <View className="w-44 h-32 bg-light-background dark:bg-dark-background rounded-md border border-light-border dark:border-dark-border">
            <View className="flex-1 justify-center items-center bg-light-background dark:bg-dark-background">
              <AntDesign name="plus" size={24} color={isDarkMode ? 'white' : 'black'} />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* メンバーリスト */}
      {/* 予定地 */}
    </View>
  );
}
