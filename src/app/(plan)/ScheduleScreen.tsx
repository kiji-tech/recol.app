import React, { ReactNode, useEffect } from 'react';
import { BackgroundView } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import { searchId } from '@/src/apis/GoogleMaps';
import { Text, View } from 'react-native';
import TripCalendar from '@/src/components/Schedule/TripCalendar';

export default function ScheduleScreen(): ReactNode {
  const { plan } = usePlan();

  useEffect(() => {
    const _fetch = async () => {
      //   const res = await searchId(plan!.place_id_list![0]);
    };
    _fetch();
  });

  return (
    <SafeAreaView>
      <BackgroundView>
        <TripCalendar plan={plan} />
      </BackgroundView>
    </SafeAreaView>
  );
}
