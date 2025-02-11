import React from 'react';
import '@/global.css';
import { router, Stack } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { supabase } from '../libs/supabase';
import { PlanProvider } from '../contexts/PlanContext';
import { AuthProvider } from '../contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'expo-dev-client';

// Use imperatively
// 'dark  | 'light' | 'system'
// colorScheme.set('dark');
colorScheme.set('light');

const RouteLayout = () => {
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.navigate('/(auth)/SignIn');
        return;
      }
    })();
  }, []);

  return (
    <AuthProvider>
      <PlanProvider>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
            <Stack.Screen name="(add.plan)" options={{ title: '計画作成', headerShown: false }} />
            <Stack.Screen name="(plan)" options={{ title: '計画表示', headerShown: false }} />
            <Stack.Screen name="(chat)" options={{ title: 'チャット', headerShown: false }} />
            <Stack.Screen
              name="(scheduleEditor)"
              options={{ title: 'スケジュール編集', headerShown: false }}
            />
            <Stack.Screen name="(auth)" options={{ title: 'ログイン', headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </PlanProvider>
    </AuthProvider>
  );
};
export default RouteLayout;
