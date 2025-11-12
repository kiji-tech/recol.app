import React from 'react';
import { Text } from 'react-native';
import i18n from '@/src/libs/i18n';

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
      {i18n.t('COMPONENT.PAYMENT.TRIAL_MESSAGE')}
    </Text>
  );
}
