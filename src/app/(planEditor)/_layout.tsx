import React from 'react';
import '@/global.css';
import { Stack } from 'expo-router';

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="PlanEditor" options={{ title: 'プラン編集', headerShown: false }} />
    </Stack>
  );
};
export default RouteLayout;
