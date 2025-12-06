import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@/src/components';

const PlanLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="ScheduleScreen" options={{ title: 'SCHEDULE', headerShown: false }} />
      <Tabs.Screen name="MediaScreen" options={{ title: 'MEDIA', headerShown: false }} />
      <Tabs.Screen name="MapScreen" options={{ title: 'MAP', headerShown: false }} />
    </Tabs>
  );
};
export default PlanLayout;
