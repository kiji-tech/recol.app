import React from 'react';
import '@/global.css';
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="ChatScreen" options={{ title: 'チャット', headerShown: false }} />
    </Stack>
  );
};
export default ChatLayout;
