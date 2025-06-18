import React from 'react';
import { Stack } from 'expo-router';

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="PaymentPlan" options={{ title: 'プラン更新', headerShown: true }} />
      <Stack.Screen
        name="SubscriptionComplete"
        options={{ title: 'サブスクリプション完了', headerShown: true }}
      />
    </Stack>
  );
};

export default RouteLayout;
