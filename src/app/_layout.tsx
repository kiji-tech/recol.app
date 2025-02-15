import React from 'react';
import '@/global.css';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../libs/supabase';
import { PlanProvider } from '../contexts/PlanContext';
import { AuthProvider } from '../contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import 'expo-dev-client';

const Layout = () => {
  const { isThemeLoaded } = useTheme();

  useEffect(() => {
    const initializeApp = async () => {
      // セッションチェック
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.navigate('/(auth)/SignIn');
      }
    };

    initializeApp();
  }, []);

  if (!isThemeLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
      <Stack.Screen name="(add.plan)" options={{ title: '計画作成', headerShown: false }} />
      <Stack.Screen name="(plan)" options={{ title: '計画表示', headerShown: false }} />
      <Stack.Screen name="(chat)" options={{ title: 'チャット', headerShown: false }} />
      <Stack.Screen name="(settings)" options={{ title: '設定', headerShown: false }} />
      <Stack.Screen
        name="(scheduleEditor)"
        options={{ title: 'スケジュール編集', headerShown: false }}
      />
      <Stack.Screen name="(auth)" options={{ title: 'ログイン', headerShown: false }} />
    </Stack>
  );
};

const RouteLayout = () => {
  return (
    <AuthProvider>
      <PlanProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </GestureHandlerRootView>
      </PlanProvider>
    </AuthProvider>
  );
};

export default RouteLayout;
