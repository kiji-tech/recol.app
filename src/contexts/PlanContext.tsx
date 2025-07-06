import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { fetchPlanList } from '../libs/ApiService';
import { useAuth } from './AuthContext';
import { LogUtil } from '../libs/LogUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan, Schedule } from '../entities/Plan';

const PLAN_LIST_STORAGE_KEY = '@plan_list';

type PlanContextType = {
  planList: Plan[];
  setPlanList: (planList: Plan[]) => void;
  plan: Plan | null;
  setPlan: (plan: Plan) => void;
  editSchedule: Schedule | null;
  setEditSchedule: (schedule: Schedule) => void;
  planLoading: boolean;
  fetchPlan: (ctrl?: AbortController) => Promise<void>;
  clearStoragePlan: () => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const { session } = useAuth();
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchStoragePlan();
    fetchPlan(ctrl);
    return () => {
      ctrl.abort();
    };
  }, [session]);

  const fetchStoragePlan = async () => {
    const list = JSON.parse((await AsyncStorage.getItem(PLAN_LIST_STORAGE_KEY)) || '[]');
    if (list && list.length > 0) {
      LogUtil.log(`set storage plan list ${list.length}`, { level: 'info' });
      setPlanList(JSON.parse(list));
    }
  };

  const fetchPlan = async (ctrl?: AbortController) => {
    setPlanLoading(true);
    fetchPlanList(session, ctrl)
      .then(async (response) => {
        setPlanList(response);
        await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, JSON.stringify(response));
        if (plan) {
          const updatePlan = response.find((p) => p.uid === plan.uid);
          if (updatePlan) setPlan(updatePlan);
        }
      })
      .catch((e) => {
        if (e && e.message.includes('Aborted')) {
          LogUtil.log('Aborted', { level: 'info' });
          return;
        }
        LogUtil.log(JSON.stringify({ fetchPlanList: e }), { level: 'error', notify: true });
        throw e;
      })
      .finally(() => {
        setPlanLoading(false);
      });
  };

  const clearStoragePlan = async () => {
    await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, '[]');
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
