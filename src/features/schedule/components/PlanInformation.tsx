import React from 'react';
import { View, Text } from 'react-native';
import Autolink from 'react-native-autolink';
import { Title, MaskLoading } from '@/src/components';
import { usePlan, useTheme } from '@/src/contexts';
import { openUrl } from '../../article/libs/openBrowser';
import generateI18nMessage from '@/src/libs/i18n';

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
          {generateI18nMessage('FEATURE.PLAN.NO_MEMO')}
        </Text>
      )}
      {/* メンバーリスト */}
    </View>
  );
}
