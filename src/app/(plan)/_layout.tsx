import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '@/src/components/TabBar';

const PlanLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="ScheduleScreen" options={{ title: 'スケジュール', headerShown: false }} />
      <Tabs.Screen name="MediaScreen" options={{ title: 'メディア', headerShown: false }} />
      <Tabs.Screen name="MapScreen" options={{ title: 'マップ', headerShown: false }} />
    </Tabs>
  );
};
export default PlanLayout;
