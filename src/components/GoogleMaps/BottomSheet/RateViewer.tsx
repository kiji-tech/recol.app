import React from 'react';
import { View, Text } from 'react-native';
type Props = {
  rating: number;
};

export default function RateViewer({ rating }: Props) {
  return (
    <View className="flex flex-row">
      <Text className="text-lg text-light-text dark:text-dark-text">
        {Array.from({ length: 5 }, (_, index) => (
          <Text key={index} className="text-lg text-yellow-500 dark:text-yellow-400">
            {index < rating ? '★' : '☆'}
          </Text>
        ))}
        （{rating || ' - '}）
      </Text>
    </View>
  );
}
