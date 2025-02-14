import React from 'react';
import '@/global.css';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '../libs/supabase';
import { PlanProvider } from '../contexts/PlanContext';
import { AuthProvider } from '../contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, AppRegistry, Platform } from 'react-native';
import { colorScheme } from 'nativewind';
import 'expo-dev-client';

const THEME_STORAGE_KEY = '@theme_mode';

// 初期テーマを'light'に設定
if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('ThemeInitializer', () => {
    colorScheme.set('light');
    return () => Promise.resolve();
  });
} else {
  colorScheme.set('light');
}

const RouteLayout = () => {
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const themeToApply = savedTheme || systemColorScheme || 'light';

        // 初期テーマと異なる場合のみ設定を変更
        if (themeToApply !== 'light') {
          if (Platform.OS === 'ios') {
            colorScheme.set(themeToApply as 'dark' | 'light');
          } else {
            // Androidの場合は遅延実行
            setTimeout(() => {
              colorScheme.set(themeToApply as 'dark' | 'light');
            }, 100);
          }
        }

        // 保存されていない場合は保存
        if (!savedTheme) {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, themeToApply);
        }
      } catch (error) {
        console.error('テーマ設定の読み込みに失敗しました:', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

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

  return (
    <AuthProvider>
      <PlanProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
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
