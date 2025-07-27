import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

export default function BackHomeLink() {
  return (
    <View className="flex flex-row justify-center items-center gap-2">
      <TouchableOpacity onPress={() => router.navigate('/(home)')}>
        <Text className="text-sm text-light-text dark:text-dark-text">ホームに戻る</Text>
      </TouchableOpacity>
    </View>
  );
}
