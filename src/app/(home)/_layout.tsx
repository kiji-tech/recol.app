import React from 'react';
import TabBar from '@/src/components/TabBar';
import { Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
      <Tabs.Screen name="(PlanListScreen)/index" options={{ title: '予定', headerShown: false }} />
      <Tabs.Screen name="(SettingsScreen)/index" options={{ title: '設定', headerShown: false }} />
      <Tabs.Screen name="SampleScreen" options={{ title: 'サンプル', headerShown: false }} />
    </Tabs>
  );
};

export default EventsLayout;
