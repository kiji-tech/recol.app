import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="signIn" options={{ title: 'サインイン', headerShown: false }} />
      <Stack.Screen name="signUp" options={{ title: 'サインアップ', headerShown: false }} />
      <Stack.Screen
        name="forget.password"
        options={{ title: 'パスワード再発行', headerShown: false }}
      />
    </Stack>
  );
}
