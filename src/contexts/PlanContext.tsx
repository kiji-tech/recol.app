import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Tables } from '../libs/database.types';

type PlanContextType = {
  plan: Tables<'plan'> | null;
  setPlan: (plan: Tables<'plan'>) => void;
};

const PlanContext = createContext<PlanContextType | null>(null);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [plan, setPlan] = useState<Tables<'plan'> | null>(null);
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
