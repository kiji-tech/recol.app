import React from 'react';
import { Text } from 'react-native';
import generateI18nMessage from '@/src/libs/i18n';

interface TrialMessageProps {
  isMonthly: boolean;
  isCurrentPlan: boolean;
}

export default function TrialMessage({ isMonthly, isCurrentPlan }: TrialMessageProps) {
  if (!isMonthly || isCurrentPlan) {
    return null;
  }

  return (
    <Text className="mt-1 text-xs text-light-success dark:text-dark-success font-medium">
      {generateI18nMessage('COMPONENT.PAYMENT.TRIAL_MESSAGE')}
    </Text>
  );
}
