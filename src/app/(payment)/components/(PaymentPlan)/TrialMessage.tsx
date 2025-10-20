import React from 'react';
import { Text } from 'react-native';

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
      1ヶ月お試しで始められます
    </Text>
  );
}
