import React from 'react';
import '@/global.css';
import { Stack } from 'expo-router';

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="PlanCreator" options={{ title: '予定登録', headerShown: false }} />
      <Stack.Screen name="PlanEditor" options={{ title: '予定編集', headerShown: false }} />
      <Stack.Screen
        name="RemoveAccount"
        options={{ title: 'アカウント削除', headerShown: false }}
      />
    </Stack>
  );
};
export default RouteLayout;
