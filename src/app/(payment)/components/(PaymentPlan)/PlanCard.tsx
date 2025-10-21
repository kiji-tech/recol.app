import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import TrialMessage from './TrialMessage';

export default function PlanCard({
  payment,
  onPress,
  disabled = false,
  isCurrentPlan = false,
}: {
  payment: PurchasesPackage;
  onPress: () => void;
  disabled?: boolean;
  isCurrentPlan?: boolean;
}) {
  // === Member ===
  console.log(
    'monthly plan identifier',
    process.env.EXPO_PUBLIC_REVENUECAT_MONTHLY_PLAN_IDENTIFIER
  );
  const MONTHLY_PLAN_IDENTIFIER = process.env.EXPO_PUBLIC_REVENUECAT_MONTHLY_PLAN_IDENTIFIER || ''; // 月額プランID
  const YEARLY_PLAN_IDENTIFIER = process.env.EXPO_PUBLIC_REVENUECAT_YEARLY_PLAN_IDENTIFIER || ''; // 年額プランID
  const isPopular = payment.identifier === YEARLY_PLAN_IDENTIFIER ? true : false; // 人気プラン
  const isMonthly = payment.identifier === MONTHLY_PLAN_IDENTIFIER; // 月額プラン
  const discount = undefined;
  return (
    <TouchableOpacity
      className={`relative flex-1 rounded-xl p-4 ${
        isCurrentPlan
          ? 'bg-gray-300 dark:bg-gray-600'
          : isPopular
            ? 'bg-light-primary dark:bg-dark-primary'
            : 'bg-white dark:bg-gray-800'
      } border-2 ${
        isCurrentPlan
          ? 'border-gray-400 dark:border-gray-500'
          : isPopular
            ? 'border-light-primary dark:border-dark-primary'
            : 'border-gray-200 dark:border-gray-600'
      } shadow-lg ${disabled ? 'opacity-60' : ''}`}
      onPress={onPress}
      disabled={disabled}
    >
      {isPopular && !isCurrentPlan && (
        <View className="absolute -top-3 self-center">
          <View className="bg-light-danger dark:bg-dark-danger px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">人気</Text>
          </View>
        </View>
      )}

      {/* 月額プランの無料トライアル表示 */}
      {isMonthly && !isCurrentPlan && (
        <View className="absolute -top-3 right-3">
          <View className="bg-light-success dark:bg-dark-success px-3 py-1 rounded-full shadow-sm">
            <Text className="text-white text-xs font-bold">初月無料</Text>
          </View>
        </View>
      )}

      {isCurrentPlan && (
        <View className="absolute -top-3 self-center">
          <View className="bg-light-danger dark:bg-dark-danger px-3 py-1 rounded-full">
            <Text className="text-light-text dark:text-dark-text text-xs font-bold">契約済み</Text>
          </View>
        </View>
      )}

      <View className="flex-1 items-center justify-center">
        {/* 元の金額
        {payment.product.price && !isCurrentPlan && (
          <Text className={`text-sm line-through ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>
            {payment.product.priceString}
          </Text>
        )} */}
        {/* 金額 */}
        <Text
          className={`text-3xl font-bold ${
            isCurrentPlan
              ? 'text-gray-600 dark:text-gray-300'
              : isPopular
                ? 'text-white'
                : 'text-light-text dark:text-dark-text'
          }`}
        >
          {payment.product.priceString}
        </Text>
        {/* 期間 */}
        <Text
          className={`text-sm ${
            isCurrentPlan
              ? 'text-gray-500 dark:text-gray-400'
              : isPopular
                ? 'text-white/80'
                : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          / {payment.identifier === MONTHLY_PLAN_IDENTIFIER ? '月額' : '年額'}
        </Text>
        {/* 月額のトライアル補足 */}
        <TrialMessage isMonthly={isMonthly} isCurrentPlan={isCurrentPlan} />
        {/* 割引 */}
        {discount && !isCurrentPlan && (
          <View className="mt-2 bg-light-danger dark:bg-dark-danger px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">{discount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
