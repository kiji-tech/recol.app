import React from 'react';
import { View, Text } from 'react-native';
import Autolink from 'react-native-autolink';
import Title from '@/src/components/Title';
import { Plan } from '@/src/features/plan';
import { useTheme } from '@/src/contexts/ThemeContext';
import { usePlan } from '@/src/contexts/PlanContext';
import { openUrl } from '../../article/libs/openBrowser';
import generateI18nMessage from '@/src/libs/i18n';
import MaskLoading from '@/src/components/MaskLoading';

type Props = {
  plan: Plan | null;
};

/**
 * プランインフォメーション
 * ・予定メモ
 * ・画像
 * ・メンバー
 */
export default function PlanInformation() {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { plan, planLoading } = usePlan();

  // === Render ===
  if (!plan) return null;
  return (
    <View className="flex flex-col gap-2 mb-4">
      {planLoading && <MaskLoading />}
      <Title text={plan.title || ''} />
      {/* 予定メモ */}
      {plan.memo ? (
        <Autolink
          text={plan.memo || ''}
          linkStyle={{
            color: isDarkMode ? '#60a5fa' : '#2563eb',
          }}
          onPress={openUrl}
          textProps={{
            className: 'text-light-text dark:text-dark-text line-clamp-2',
          }}
          numberOfLines={2}
        />
      ) : (
        <Text className="text-md text-light-text dark:text-dark-text opacity-70">
          {generateI18nMessage('COMPONENT.PLAN.NO_MEMO')}
        </Text>
      )}
      {/* メンバーリスト */}
    </View>
  );
}
