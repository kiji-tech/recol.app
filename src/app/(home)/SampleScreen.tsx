import React from 'react';
import ToastManager from 'toastify-react-native';

import { BackgroundView, Button } from '@/src/components';
import { usePlanList } from '@/src/features/plan/hooks/usePlanList';
import { Plan } from '@/src/features/plan/types/Plan';
import { useStoragePlanList } from '@/src/features/plan/hooks/useStoragePlanList';

export default function SampleScreen() {
  const { data: planList, isLoading: planLoading, refetch: refetchPlanList } = usePlanList();
  const { data: storagePlanList } = useStoragePlanList();

  if (!planLoading) {
    console.log({ planList: planList?.map((p: Plan) => p.title) });
    console.log({ storagePlanList: storagePlanList?.map((p: Plan) => p.title) });
  }

  const handle = async () => {
    refetchPlanList();
  };

  return (
    <BackgroundView>
      <ToastManager />
      <Button text="handler" onPress={handle} />
    </BackgroundView>
  );
}
