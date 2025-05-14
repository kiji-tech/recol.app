import React from 'react';
import { Tables } from '@/src/libs/database.types';
import { View, Text } from 'react-native';

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
  // No plan
  if (!plan) return <></>;

  return (
      <View className="flex flex-col gap-2">
          {/* */}
      <Text className="text-2xl font-bold text-light-text dark:text-dark-text">{plan.title}</Text>
    </View>
  );
}
