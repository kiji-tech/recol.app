import { useState } from 'react';
import { Plan } from '../index';
import { Schedule } from '../../schedule';

export const usePlan = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);

  return {
    plan,
    setPlan,
    editSchedule,
    setEditSchedule,
  };
};
