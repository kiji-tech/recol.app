import React from 'react';
import { View, Text } from 'react-native';

export default function Bar({ text }: { text: string }) {
  return (
    <View className="flex flex-row justify-center items-center gap-4 mt-4">
      <View className="w-1/3 h-px bg-light-border dark:bg-dark-border"></View>
      <Text className="text-sm text-light-text dark:text-dark-text">{text}</Text>
      <View className="w-1/3 h-px bg-light-border dark:bg-dark-border"></View>
    </View>
  );
}
