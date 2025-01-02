import React, { ReactNode, useEffect } from 'react';
import { BackgroundView } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import { Text, View } from 'react-native';
import { searchId } from '@/src/apis/GoogleMaps';

export default function ScheduleScreen(): ReactNode {
  const { plan } = usePlan();

  useEffect(() => {
    const _fetch = async () => {
      const res = await searchId(plan!.place_id_list![0]);
      console.log(JSON.stringify(res));
    };
    _fetch();
  });

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
