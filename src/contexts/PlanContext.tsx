import React from 'react';
import { createContext, useContext } from 'react';
import { Plan } from '../features/plan';
import { Schedule } from '../features/schedule';
import { usePlanList } from '../features/plan/hooks/usePlanList';
import { usePlan as usePlanHook } from '../features/plan/hooks/usePlan';
import { PlanSortType } from '../features/plan/types/PlanSortType';

type PlanContextType = {
  planList: Plan[];
  setPlanList: (planList: Plan[]) => void;
  plan: Plan | null;
  setPlan: (plan: Plan) => void;
  editSchedule: Schedule | null;
  setEditSchedule: (schedule: Schedule) => void;
  planLoading: boolean;
  fetchPlan: (ctrl?: AbortController, sortType?: PlanSortType) => Promise<void>;
  clearStoragePlan: () => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const { plan, setPlan, editSchedule, setEditSchedule } = usePlanHook();

  const { planList, setPlanList, planLoading, fetchPlan, clearStoragePlan } = usePlanList(
    plan,
    setPlan
  );

  return (
    <PlanContext.Provider
      value={{
        planList,
        setPlanList,
        plan,
        setPlan,
        editSchedule,
        setEditSchedule,
        planLoading,
        fetchPlan,
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
