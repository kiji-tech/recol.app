import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function MaskLoading() {
  return (
    <View className="absolute top-0 left-0 z-50">
      <View className="flex justify-center w-screen h-screen items-center bg-white dark:bg-black opacity-50">
        <ActivityIndicator className="text-black" />
      </View>
    </View>
  );
}
