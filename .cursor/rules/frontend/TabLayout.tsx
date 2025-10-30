import React from 'react';
import TabBar from '@/src/components/TabBar';
import { Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
    </Tabs>
  );
};

export default EventsLayout;
