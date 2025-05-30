import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { Tables } from '../libs/database.types';
import { fetchPlanList } from '../libs/ApiService';
import { useAuth } from './AuthContext';
import { LogUtil } from '../libs/LogUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAN_LIST_STORAGE_KEY = '@plan_list';

type PlanContextType = {
  planList: (Tables<'plan'> & { schedule: Tables<'schedule'>[] })[];
  setPlanList: (planList: (Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]) => void;
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
  setPlan: (plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => void;
  editSchedule: Tables<'schedule'> | null;
  setEditSchedule: (schedule: Tables<'schedule'>) => void;
  planLoading: boolean;
  fetchPlan: (ctrl?: AbortController) => Promise<void>;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [planList, setPlanList] = useState<(Tables<'plan'> & { schedule: Tables<'schedule'>[] })[]>(
    []
  );
  const [plan, setPlan] = useState<(Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null>(
    null
  );
  const [planLoading, setPlanLoading] = useState(false);
  const { session } = useAuth();
  const [editSchedule, setEditSchedule] = useState<Tables<'schedule'> | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    fetchStoragePlan();

    fetchPlan(ctrl);
    return () => {
      ctrl.abort();
    };
  }, []);

  const fetchStoragePlan = async () => {
    try {
      const planList = await AsyncStorage.getItem(PLAN_LIST_STORAGE_KEY);
      LogUtil.log('set storage plan list', { level: 'info' });
      if (planList) {
        setPlanList(JSON.parse(planList));
      }
    } catch (error) {
      LogUtil.log(error, { level: 'error' });
    }
  };

  const fetchPlan = async (ctrl?: AbortController) => {
    try {
      setPlanLoading(true);
      const planList = await fetchPlanList(session, ctrl);
      LogUtil.log('set API plan list', { level: 'info' });
      setPlanList(planList);
      await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, JSON.stringify(planList));
    } finally {
      setPlanLoading(false);
    }
  };

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
