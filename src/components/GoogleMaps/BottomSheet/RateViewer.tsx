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
          <Text key={index} className="text-sm text-light-text dark:text-dark-text">
            {index < rating - 1 ? '★' : '☆'}
          </Text>
        ))}
        （{rating}）
      </Text>
    </View>
  );
}
