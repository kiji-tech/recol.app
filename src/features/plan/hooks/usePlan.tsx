import { useState } from 'react';
import { fetchPlan } from '../index';
import { Schedule } from '../../schedule';
import { useQuery } from 'react-query';
import { useAuth } from '../../auth';

export const usePlan = () => {
  const { session } = useAuth();
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const {
    data: plan,
    refetch: refetchPlan,
    isLoading: planLoading,
  } = useQuery({
    queryKey: ['plan', planId],
    queryFn: () => fetchPlan(planId as string, session),
    enabled: !!planId,
  });

  return {
    plan,
    planId,
    planLoading,
    refetchPlan,
    setPlanId,
    editSchedule,
    setEditSchedule,
  };
};
