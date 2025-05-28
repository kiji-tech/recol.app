import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { Tables } from '../libs/database.types';
import { fetchPlanList } from '../libs/ApiService';
import { useAuth } from './AuthContext';

type PlanContextType = {
  planList: (Tables<'plan'> & { schedule: Tables<'schedule'>[] })[];
  setPlanList: (planList: (Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]) => void;
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
  setPlan: (plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => void;
  editSchedule: Tables<'schedule'> | null;
  setEditSchedule: (schedule: Tables<'schedule'>) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [planList, setPlanList] = useState<(Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]>(
    []
  );
  const [plan, setPlan] = useState<(Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null>(
    null
  );
  const { session } = useAuth();
  const [editSchedule, setEditSchedule] = useState<Tables<'schedule'> | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchPlan(ctrl);
    return () => {
      ctrl.abort();
    };
  }, []);

  const fetchPlan = async (ctrl?: AbortController) => {
    const planList = await fetchPlanList(session, ctrl);
    setPlanList(planList);
  };

  return (
    <PlanContext.Provider
      value={{ planList, setPlanList, plan, setPlan, editSchedule, setEditSchedule }}
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
