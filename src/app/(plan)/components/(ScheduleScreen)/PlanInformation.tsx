import React from 'react';
import { View, Text } from 'react-native';
import Title from '@/src/components/Common/Title';
import { Plan } from '@/src/features/plan';

type Props = {
  plan: Plan | null;
};

/**
 * プランインフォメーション
 * ・予定メモ
 * ・画像
 * ・メンバー
 */
export default function PlanInformation({ plan }: Props) {
  // === Member ===

  // === Render ===
  if (!plan) return <></>;

  return (
    <View className="flex flex-col gap-2 mb-4">
      <Title text={plan.title || ''} />
      {/* 予定メモ */}
      {plan.memo ? (
        <Text className="text-md text-light-text dark:text-dark-text">{plan.memo}</Text>
      ) : (
        <Text className="text-md text-light-text dark:text-dark-text opacity-70">
          メモはありません.
        </Text>
      )}
      {/* メンバーリスト */}
    </View>
  );
}
