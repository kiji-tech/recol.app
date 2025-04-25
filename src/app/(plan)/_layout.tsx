import React from 'react';
import { Stack } from 'expo-router';

const PlanLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="ScheduleScreen" options={{ title: 'スケジュール', headerShown: false }} />
    </Stack>
  );
};
export default PlanLayout;
