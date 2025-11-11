import React from 'react';
import { View, Text } from 'react-native';
type Props = {
  rating: number;
};

export default function RateViewer({ rating }: Props) {
  const ratingStars: string = Array.from({ length: 5 }, (_, index) =>
    index < rating ? '★' : '☆'
  ).join('');

  return (
    <View className="flex flex-row items-center">
      <Text className="text-lg text-light-text dark:text-dark-text">{ratingStars}</Text>
      <Text className="text-lg text-light-text dark:text-dark-text">（{rating || ' - '}）</Text>
    </View>
  );
}
