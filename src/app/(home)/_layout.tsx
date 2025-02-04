import React from 'react';
import TabBar from '@/src/components/TabBar';
import { Stack, Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
      <Tabs.Screen name="PlanListScreen" options={{ title: '旅行計画', headerShown: false }} />
      <Tabs.Screen name="SettingsScreen" options={{ title: '設定', headerShown: false }} />
      {/* <Tabs.Screen name="sample" options={{ title: 'サンプル', headerShown: true }} /> */}
    </Tabs>
  );
};

export default EventsLayout;
