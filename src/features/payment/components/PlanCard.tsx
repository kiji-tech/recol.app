import generateI18nMessage from '@/src/libs/i18n';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

export default function PlanCard({
  payment,
  onPress,
  disabled = false,
  isCurrentPlan = false,
  discount = undefined,
}: {
  payment: PurchasesPackage;
  onPress: () => void;
  disabled?: boolean;
  isCurrentPlan?: boolean;
  discount?: number;
}) {
  // === Member ===
  const isPopular = payment.packageType === 'ANNUAL'; // 人気プラン
  const isMonthly = payment.packageType === 'MONTHLY'; // 月額プラン

  const getPriceString = (price: string) => {
    // 日本円なら､記号を外して､円をつけて返す
    if (price.includes('\¥')) {
      return (price.replace('\¥', '') + '円').trim();
    }
    return price;
  };

  return (
    <TouchableOpacity
      className={`flex flex-col gap-2 py-2 px-4 rounded-md  
        ${isCurrentPlan ? 'bg-light-shadow dark:bg-dark-shadow' : 'bg-light-background dark:bg-dark-background'}
        `}
      onPress={onPress}
      disabled={disabled}
    >
      {/* 現在のプラン */}
      {isCurrentPlan ? (
        <View className="absolute top-[-10px] right-[-10px]">
          <Text className="text-xs bg-light-primary dark:bg-dark-primary text-white px-2 py-1 rounded-full">
            {generateI18nMessage('COMPONENT.PAYMENT.CURRENT_PLAN')}
          </Text>
        </View>
      ) : (
        isPopular && (
          <View className="absolute top-[-10px] right-[-10px]">
            <Text className="text-xs bg-light-primary dark:bg-dark-primary text-white px-2 py-1 rounded-full">
              {generateI18nMessage('COMPONENT.PAYMENT.POPULAR_PLAN')}
            </Text>
          </View>
        )
      )}
      {/* 月額プランの場合 */}
      {isMonthly && (
        <View className="flex flex-col gap-2">
          <Text className="text-sm font-bold text-light-text dark:text-dark-text">
            {generateI18nMessage('COMPONENT.PAYMENT.TRIAL_MESSAGE')}
          </Text>
          <View className="flex flex-row gap-2 justify-start items-end">
            <Text className="text-3xl font-bold text-light-text dark:text-dark-text">
              {getPriceString(payment.product.priceString)} / Month
            </Text>
            <Text className="text-md font-semibold text-light-danger dark:text-dark-danger">
              {generateI18nMessage('COMPONENT.PAYMENT.TRIAL_MESSAGE_MONTHLY')}
            </Text>
          </View>
          <Text className="text-xs opacity-70 font-semibold">
            {generateI18nMessage('COMPONENT.PAYMENT.TRIAL_MESSAGE_AFTER_END')}
          </Text>
        </View>
      )}

      {/* 人気のプラン */}
      {!isMonthly && (
        <View className="flex flex-col gap-2">
          <Text className="text-sm font-bold text-light-text dark:text-dark-text">
            {generateI18nMessage('COMPONENT.PAYMENT.POPULAR_PLAN')}
          </Text>
          <View className="flex flex-row gap-2 justify-start items-end">
            <Text className="text-3xl font-bold text-light-text dark:text-dark-text">
              {getPriceString(payment.product.priceString)} / Year
            </Text>
            <Text className="text-md font-semibold text-light-danger dark:text-dark-danger">
              {generateI18nMessage('COMPONENT.PAYMENT.DISCOUNT_MESSAGE', [
                { key: 'discount', value: (discount?.toFixed(0) ?? 0).toString() },
              ])}
            </Text>
          </View>
          <Text className="text-xs opacity-70 font-semibold">
            （{getPriceString(payment.product.pricePerMonthString || '')} /{' '}
            {generateI18nMessage('COMMON.MONTH')}）
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
