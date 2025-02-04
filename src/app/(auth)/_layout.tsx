import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="SignIn" options={{ title: 'サインイン', headerShown: false }} />
      <Stack.Screen name="SignUp" options={{ title: 'サインアップ', headerShown: false }} />
      <Stack.Screen
        name="ForgetPassword"
        options={{ title: 'パスワード再発行', headerShown: false }}
      />
    </Stack>
  );
}
