import React from 'react';
import '@/global.css';
import { Stack } from 'expo-router';

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'ブログ', headerShown: false }} />
    </Stack>
  );
};
export default RouteLayout;
