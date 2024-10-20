import React, { ReactNode } from 'react';
import { BackgroundView } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import { Text, View } from 'react-native';

export default function ScheduleScreen(): ReactNode {
  const { plan } = usePlan();
  return (
    <SafeAreaView>
      <BackgroundView>
        <View className="w-full h-full">
          <Text>{plan!.title || ''}</Text>
        </View>
      </BackgroundView>
    </SafeAreaView>
  );
}
