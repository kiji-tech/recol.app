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
      <Stack.Screen
        name="ResetPassword"
        options={{ title: 'パスワード再登録', headerShown: false }}
      />
      <Stack.Screen name="SignUpComplete" options={{ title: '新規登録完了', headerShown: false }} />
      <Stack.Screen
        name="RequestNewAccount"
        options={{ title: '新規登録メール送信', headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordComplete"
        options={{ title: 'パスワード再発行完了', headerShown: false }}
      />
    </Stack>
  );
}
