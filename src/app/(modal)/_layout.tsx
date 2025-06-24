import React from 'react';
import '@/global.css';
import { Stack } from 'expo-router';

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="PlanCreator" options={{ title: '計画登録', headerShown: false }} />
      <Stack.Screen name="PlanEditor" options={{ title: '計画編集', headerShown: false }} />
      <Stack.Screen name="MediaList" options={{ title: 'メディア一覧', headerShown: false }} />
      <Stack.Screen name="NotFound" options={{ title: '404 NotFound', headerShown: true }} />
    </Stack>
  );
};
export default RouteLayout;
