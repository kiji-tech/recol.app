import React from 'react';
import ToastManager from 'toastify-react-native';

import { BackgroundView, Button } from '@/src/components';
import { Plan, usePlanList, useStoragePlanList } from '@/src/features/plan';
import { LogUtil } from '@/src/libs/LogUtil';

export default function SampleScreen() {
  const { data: planList, isLoading: planLoading, refetch: refetchPlanList } = usePlanList();
  const { data: storagePlanList } = useStoragePlanList();

  if (!planLoading) {
    LogUtil.log({ planList: planList?.map((p: Plan) => p.title) }, { level: 'info' });
    LogUtil.log({ storagePlanList: storagePlanList?.map((p: Plan) => p.title) }, { level: 'info' });
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
