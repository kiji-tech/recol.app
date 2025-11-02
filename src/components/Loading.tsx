import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Loading() {
  return (
    <View className="bg-light-background dark:bg-dark-background p-4 rounded-xl">
      <Text className={`text-light-text dark:text-dark-text mb-2`}>{'Loading...'}</Text>
      <ActivityIndicator />
    </View>
  );
}
