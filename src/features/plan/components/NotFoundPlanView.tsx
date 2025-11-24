import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/src/components';
import generateI18nMessage from '@/src/libs/i18n';

export default function NotFoundPlanView() {
  return (
    <View className="flex flex-col justify-center items-center h-full">
      <Text className="text-light-text dark:text-dark-text text-lg font-bold">
        {generateI18nMessage('COMPONENT.PLAN.NOT_FOUND')}
      </Text>
      <Button
        text={generateI18nMessage('COMPONENT.PLAN.ADD_PLAN')}
        theme={'info'}
        onPress={() => router.push('/(modal)/PlanCreator')}
      />
    </View>
  );
}
