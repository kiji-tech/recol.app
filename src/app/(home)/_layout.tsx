import React from 'react';
import TabBar from '@/src/components/TabBar';
import { Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
      <Tabs.Screen name="BlogScreen" options={{ title: 'ブログ', headerShown: false }} />
      <Tabs.Screen name="PlanListScreen" options={{ title: 'プラン', headerShown: false }} />
      <Tabs.Screen name="SettingsScreen" options={{ title: '設定', headerShown: false }} />
      <Tabs.Screen name="SampleScreen" options={{ title: 'サンプル', headerShown: true }} />
    </Tabs>
  );
};

export default EventsLayout;
