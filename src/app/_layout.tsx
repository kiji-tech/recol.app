import '@/global.css';
import React, { useCallback, useEffect } from 'react';
import { router, Stack } from 'expo-router';
import { supabase } from '../libs/supabase';
import { PlanProvider } from '../contexts/PlanContext';
import { AuthProvider } from '../contexts/AuthContext';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import {
  PermissionStatus,
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import 'expo-dev-client';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';

// === LogBox ===
LogBox.ignoreLogs([
  // 非表示にしたい警告があればここへ
  'Support for defaultProps will be removed from function components',
  'Support for defaultProps will be removed from memo components',
]);

// === SplashScreen ===
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const Layout = () => {
  const { isThemeLoaded } = useTheme();

  const initAd = useCallback(async () => {
    try {
      const { status } = await getTrackingPermissionsAsync();
      if (status === PermissionStatus.UNDETERMINED) {
        await requestTrackingPermissionsAsync();
      }
      mobileAds().setRequestConfiguration({
        // An array of test device IDs to add to the allow list.
        testDeviceIdentifiers: ['EMULATOR'],
      });

      await mobileAds().initialize();
    } catch (err) {
      alert(err);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);
  const initializeApp = async () => {
    // セッションチェック
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.navigate('/(auth)/SignIn');
    }

    // 広告初期化
    initAd();
  };

  if (!isThemeLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
      <Stack.Screen name="(addPlan)" options={{ title: '計画作成', headerShown: false }} />
      <Stack.Screen name="(blog)" options={{ title: 'ブログ', headerShown: false }} />
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
