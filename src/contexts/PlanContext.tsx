import React from 'react';
import { createContext, useContext } from 'react';
import { Plan } from '../features/plan';
import { Schedule } from '../features/schedule';
import { usePlanList } from '../features/plan/hooks/usePlanList';
import { usePlan as usePlanHook } from '../features/plan/hooks/usePlan';
import { useStoragePlanList } from '../features/plan/hooks/useStoragePlanList';
import { PlanSortType } from '../features/plan/types/PlanSortType';

type PlanContextType = {
  planList: Plan[] | undefined;
  storagePlanList: Plan[] | undefined;
  plan: Plan | null;
  setPlan: (plan: Plan) => void;
  setStoragePlan: (planList: Plan[]) => Promise<void>;
  editSchedule: Schedule | null;
  setEditSchedule: (schedule: Schedule) => void;
  planLoading: boolean;
  clearStoragePlan: () => Promise<void>;
  refetchPlanList: () => void;
  refetchStoragePlanList: () => void;
  sortType: PlanSortType;
  setSortType: (sortType: PlanSortType) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { plan, setPlan, editSchedule, setEditSchedule } = usePlanHook();

  const {
    data: planList,
    isLoading: planLoading,
    refetch: refetchPlanList,
    sortType,
    setSortType,
  } = usePlanList(plan, setPlan);
  const {
    data: storagePlanList,
    refetch: refetchStoragePlanList,
    setStoragePlan,
    clearStoragePlan,
  } = useStoragePlanList();

  return (
    <PlanContext.Provider
      value={{
        planList,
        storagePlanList,
        plan,
        setPlan,
        setStoragePlan,
        editSchedule,
        setEditSchedule,
        planLoading,
        refetchPlanList,
        refetchStoragePlanList,
        clearStoragePlan,
        sortType,
        setSortType,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export { PlanProvider, usePlan };
