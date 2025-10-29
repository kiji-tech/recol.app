import React from 'react';
import { Stack } from 'expo-router';

// === Stack Layout Sample ===
const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
    </Stack>
  );
};

export default StackLayout;
