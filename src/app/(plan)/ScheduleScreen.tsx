import React, { ReactNode, useEffect } from 'react';
import { BackgroundView, Header } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import Schedule from '@/src/components/Schedule';
import { useRouter } from 'expo-router';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
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
        {/* ヘッダー */}
        <Header
          title={`${plan?.title}のスケジュール`}
          onBack={() => {
            router.back();
          }}
        />
        <Schedule plan={plan} />
      </BackgroundView>
    </SafeAreaView>
  );
}
