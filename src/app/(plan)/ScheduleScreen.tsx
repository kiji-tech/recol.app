import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { BackgroundView, Header, Loading } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlan } from '@/src/contexts/PlanContext';
import Schedule from '@/src/components/Schedule';
import { useRouter } from 'expo-router';
import { fetchPlan } from '@/src/libs/ApiService';
import { useFocusEffect } from '@react-navigation/native';
import { Tables } from '@/src/libs/database.types';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { plan, setPlan } = usePlan();
  const [viewPlan, setViewPlan] = useState<
    (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setViewPlan(null);
      const ctrl = new AbortController();
      fetchPlan(plan!.uid, ctrl).then((data) => {
        setViewPlan({ ...data } as Tables<'plan'> & { schedule: Tables<'schedule'>[] });
        setIsLoading(false);
      });
      return () => {
        ctrl.abort();
      };
    }, [])
  );

  return (
    <SafeAreaView>
      <BackgroundView>
        {/* ヘッダー */}
        <Header
          title={`${viewPlan?.title}のスケジュール`}
          onBack={() => {
            router.back();
          }}
        />
        {viewPlan && <Schedule plan={viewPlan} />}
        {/* {isLoading && <Loading />} */}
      </BackgroundView>
    </SafeAreaView>
  );
}
