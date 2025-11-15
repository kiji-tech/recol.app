import React from 'react';
import { createContext, useContext } from 'react';
import { Plan } from '../features/plan';
import { Schedule } from '../features/schedule';
import { usePlanList } from '../features/plan/hooks/usePlanList';
import { usePlan as usePlanHook } from '../features/plan/hooks/usePlan';
import { useStoragePlanList } from '../features/plan/hooks/useStoragePlanList';

type PlanContextType = {
  planList: Plan[] | undefined;
  storagePlanList: Plan[] | undefined;
  plan: Plan | null;
  setPlan: (plan: Plan) => void;
  editSchedule: Schedule | null;
  setEditSchedule: (schedule: Schedule) => void;
  planLoading: boolean;
  clearStoragePlan: () => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { plan, setPlan, editSchedule, setEditSchedule } = usePlanHook();

  const { data: planList, isLoading: planLoading } = usePlanList(plan, setPlan);
  const { data: storagePlanList, clearStoragePlan } = useStoragePlanList();

  return (
    <PlanContext.Provider
      value={{
        planList,
        storagePlanList,
        plan,
        setPlan,
        editSchedule,
        setEditSchedule,
        planLoading,
        clearStoragePlan,
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
