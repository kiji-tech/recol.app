import React from 'react';
import '@/global.css';
import { router, Stack } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { supabase } from '../libs/supabase';
import { PlanProvider } from '../contexts/PlanContext';
import { AuthProvider } from '../contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'expo-dev-client';

const THEME_STORAGE_KEY = '@theme_mode';

// デフォルトはライトモード
colorScheme.set('light');

const RouteLayout = () => {
  useEffect(() => {
    const initializeApp = async () => {
      // セッションチェック
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.navigate('/(auth)/SignIn');
        return;
      }

      // テーマ設定の読み込み
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          colorScheme.set(savedTheme as 'dark' | 'light');
        }
      } catch (error) {
        console.error('テーマ設定の読み込みに失敗しました:', error);
      }
    };

    initializeApp();
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
