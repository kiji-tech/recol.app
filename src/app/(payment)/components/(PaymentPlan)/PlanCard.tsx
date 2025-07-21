import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export default function PlanCard({
  price,
  period,
  originalPrice,
  discount,
  isPopular = false,
  onPress,
  disabled = false,
  isCurrentPlan = false,
}: {
  price: string;
  period: string;
  originalPrice?: string;
  discount?: string;
  isPopular?: boolean;
  onPress: () => void;
  disabled?: boolean;
  isCurrentPlan?: boolean;
}) {
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

      {isCurrentPlan && (
        <View className="absolute -top-3 self-center">
          <View className="bg-light-danger dark:bg-dark-danger px-3 py-1 rounded-full">
            <Text className="text-light-text dark:text-dark-text text-xs font-bold">契約済み</Text>
          </View>
        </View>
      )}

      <View className="flex-1 items-center justify-center">
        {originalPrice && !isCurrentPlan && (
          <Text className={`text-sm line-through ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>
            {originalPrice}
          </Text>
        )}
        <Text
          className={`text-3xl font-bold ${
            isCurrentPlan
              ? 'text-gray-600 dark:text-gray-300'
              : isPopular
                ? 'text-white'
                : 'text-light-text dark:text-dark-text'
          }`}
        >
          {price}
        </Text>
        <Text
          className={`text-sm ${
            isCurrentPlan
              ? 'text-gray-500 dark:text-gray-400'
              : isPopular
                ? 'text-white/80'
                : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          / {period}
        </Text>
        {discount && !isCurrentPlan && (
          <View className="mt-2 bg-light-danger dark:bg-dark-danger px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">{discount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
