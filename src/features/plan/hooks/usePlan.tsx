import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchPlan } from '@/src/features/plan';
import { Schedule } from '@/src/features/schedule';
import { useAuth } from '@/src/features/auth';

export const usePlan = () => {
  const { session } = useAuth();
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const {
    data: plan,
    refetch: refetchPlan,
    isLoading,
  } = useQuery({
    queryKey: ['plan', planId],
    queryFn: () => fetchPlan(planId as string, session),
    enabled: !!planId,
  });

  return {
    plan,
    planId,
    planLoading: isLoading,
    refetchPlan,
    setPlanId,
    editSchedule,
    setEditSchedule,
  };
};
