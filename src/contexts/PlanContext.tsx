import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Tables } from '../libs/database.types';

type PlanContextType = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
  setPlan: (plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [plan, setPlan] = useState<(Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null>(
    null
  );
  return <PlanContext.Provider value={{ plan, setPlan }}>{children}</PlanContext.Provider>;
};

const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export { PlanProvider, usePlan };
