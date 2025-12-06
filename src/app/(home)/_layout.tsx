import React from 'react';
import { TabBar } from '@/src/components';
import { Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'HOME', headerShown: false }} />
      <Tabs.Screen name="(PlanListScreen)/index" options={{ title: 'PLAN', headerShown: false }} />
      <Tabs.Screen
        name="(SettingsScreen)/index"
        options={{ title: 'SETTINGS', headerShown: false }}
      />
      <Tabs.Screen name="SampleScreen" options={{ title: 'SAMPLE', headerShown: false }} />
    </Tabs>
  );
};

export default EventsLayout;
