import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { View, Text } from 'react-native';
import Title from '@/src/components/Common/Title';
// import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

/**
 * プランインフォメーション
 * ・予定メモ
 * ・画像
 * ・メンバー
 */
export default function PlanInformation({ plan }: Props) {
  // === Member ===
  //   const { isDarkMode } = useTheme();

  // === Method ===

  // === Render ===
  if (!plan) return <></>;

  return (
    <View className="flex flex-col gap-2">
      <Title text={plan.title || ''} />
      {/* 計画メモ */}
      <Text className="text-md text-light-text dark:text-dark-text">
        {plan.memo || 'メモはありません.'}
      </Text>
      {/* メンバーリスト */}
    </View>
  );
}
