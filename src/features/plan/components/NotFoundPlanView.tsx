import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/src/components';

export default function NotFoundPlanView() {
  return (
    <View className="flex flex-col justify-center items-center h-full">
      <Text className="text-light-text dark:text-dark-text text-lg font-bold">
        プランがありません
      </Text>
      <Button
        text={'プランを追加する'}
        theme={'info'}
        onPress={() => router.push('/(modal)/PlanCreator')}
      />
    </View>
  );
}
