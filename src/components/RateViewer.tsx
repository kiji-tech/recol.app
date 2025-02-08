import React from 'react';
import { View, Text } from 'react-native';
type Props = {
  rating: number;
};

export default function RateViewer({ rating }: Props) {
  return (
    <View className="flex flex-row">
      <Text className="text-lg">
        {Array.from({ length: 5 }, (_, index) => (
          <Text key={index} className="text-lg">
            {index < rating - 1 ? '★' : '☆'}
          </Text>
        ))}
      </Text>
    </View>
  );
}
