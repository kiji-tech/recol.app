import React from 'react';
import { View, Text } from 'react-native';
import generateI18nMessage from '@/src/libs/i18n';

const PlanItem = ({
  title,
  free,
  premium,
  highlight = false,
}: {
  title: string;
  free: string;
  premium: string;
  highlight?: boolean;
}) => {
  return (
    <View
      className={`flex flex-row justify-between ${highlight ? 'bg-light-primary/10 dark:bg-dark-primary/10' : ''}`}
    >
      <Text className="p-4 flex-1 text-center text-light-text dark:text-dark-text font-medium">
        {title}
      </Text>
      <Text className="p-4 w-32 text-center text-light-text dark:text-dark-text">{free}</Text>
      <View className="p-4 w-40 text-center items-center flex">
        <Text className="text-light-primary dark:text-dark-primary font-bold">{premium}</Text>
        {highlight && (
          <View className="mt-2 flex items-start justify-center">
            <Text className="p-2 text-xs text-light-primary dark:text-dark-primary bg-light-primary/20 dark:bg-dark-primary/20 rounded-full">
              {generateI18nMessage('FEATURE.PAYMENT.RECOMMENDED')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default function PlanTable() {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <View className="bg-light-primary dark:bg-dark-primary">
        <View className="flex flex-row justify-between">
          <Text className="p-4 flex-1 self-center text-center text-white font-bold text-lg">
            {generateI18nMessage('FEATURE.PAYMENT.FEATURE')}
          </Text>
          <View className="p-4 w-32 self-center">
            <Text className="text-center text-white font-bold">
              {generateI18nMessage('FEATURE.PAYMENT.FREE')}
            </Text>
          </View>
          <View className="p-4 w-40 self-center">
            <Text className="text-center text-white font-bold text-lg">
              {generateI18nMessage('FEATURE.PAYMENT.PREMIUM')}
            </Text>
            <Text className="text-center text-white/80 text-xs">
              {generateI18nMessage('FEATURE.PAYMENT.ALL_FEATURES')}
            </Text>
          </View>
        </View>
      </View>
      <PlanItem
        title={generateI18nMessage('FEATURE.PAYMENT.MEDIA_CAPACITY')}
        free={generateI18nMessage('FEATURE.PAYMENT.MEDIA_CAPACITY_FREE')}
        premium={generateI18nMessage('FEATURE.PAYMENT.MEDIA_CAPACITY_PREMIUM')}
      />
      <PlanItem
        title={generateI18nMessage('FEATURE.PAYMENT.RATE_LIMIT')}
        free={generateI18nMessage('FEATURE.PAYMENT.RATE_LIMIT_FREE')}
        premium={generateI18nMessage('FEATURE.PAYMENT.RATE_LIMIT_PREMIUM')}
      />
      <PlanItem
        title={generateI18nMessage('FEATURE.PAYMENT.AD_DISPLAY')}
        free={generateI18nMessage('FEATURE.PAYMENT.YES')}
        premium={generateI18nMessage('FEATURE.PAYMENT.NO')}
      />
      {/* <PlanItem title="AI分析機能" free="-" premium="○" highlight={true} />
      <PlanItem title="優先サポート" free="-" premium="○" />
      <PlanItem title="データエクスポート" free="-" premium="○" /> */}
    </View>
  );
}
