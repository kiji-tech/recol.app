import React from 'react';
import '@/global.css';
import { Stack } from 'expo-router';

const SettingsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="ProfileEditorScreen"
        options={{ title: 'プロフィール', headerShown: false }}
      />
    </Stack>
  );
};
export default SettingsLayout;
