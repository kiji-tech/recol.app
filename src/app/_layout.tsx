import '@/global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { PlanProvider } from '../contexts/PlanContext';
import { AuthProvider } from '../features/auth';
import { Linking, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../contexts/ThemeContext';
import {
  PermissionStatus,
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import 'expo-dev-client';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';
import { MenuProvider } from 'react-native-popup-menu';
import * as Font from 'expo-font';
import { LocationProvider } from '../contexts/LocationContext';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { useTheme } from '@/src/contexts/ThemeContext';

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
  const [ready, setReady] = useState(false);
  const { isDarkMode } = useTheme();
  useEffect(() => {
    (async () => {
      // ここでフォントや API をプリロード
      await Font.loadAsync({
        // 例: 'Roboto': require('./assets/fonts/Roboto-Regular.ttf')
      });
      setReady(true);
    })();
  }, []);

  const onLayout = useCallback(async () => {
    if (ready) {
      // レイアウトが終わってから隠すと白画面を防げる
      await SplashScreen.hideAsync();
    }
  }, [ready]);

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
    // 広告初期化
    initAd();
  };

  if (!ready) return null;

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={isDarkMode ? 'black' : 'white'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Stack>
        <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
        <Stack.Screen name="(plan)" options={{ title: '計画表示', headerShown: false }} />
        <Stack.Screen name="(chat)" options={{ title: 'チャット', headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ title: '設定', headerShown: false }} />
        <Stack.Screen name="(modal)" options={{ title: '', headerShown: false }} />
        <Stack.Screen
          name="(scheduleEditor)"
          options={{ title: 'スケジュール編集', headerShown: false }}
        />
        <Stack.Screen name="(payment)" options={{ title: 'プラン更新', headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ title: 'ログイン', headerShown: false }} />
      </Stack>
    </View>
  );
};

const RouteLayout = () => {
  // === Stripe Redirect処理 ===
  const { handleURLCallback } = useStripe();

  // === DeepLink処理 ===
  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        }
        const urlObj = new URL(url);
        if (url.includes('ResetPassword')) {
          const params = new URLSearchParams(urlObj.hash.replace(/^#/, ''));
          const tokens = {
            access_token: params.get('access_token') ?? undefined,
            refresh_token: params.get('refresh_token') ?? undefined,
            expires_in: params.get('expires_in') ?? undefined,
            type: params.get('type') ?? undefined,
          };
          // パスワードリセット画面に遷移
          router.push({
            pathname: '/(auth)/ResetPassword',
            params: {
              access_token: tokens.access_token ?? undefined,
              refresh_token: tokens.refresh_token ?? undefined,
            },
          } as const);
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener('url', (event: { url: string }) => {
      handleDeepLink(event.url);
    });

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  // === Notifications 初期化 ===
  useEffect(() => {
    NotificationUtil.initializeNotifications();
  }, []);

  return (
    <AuthProvider>
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}>
        <MenuProvider>
          <PlanProvider>
            <LocationProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider>
                  <Layout />
                </ThemeProvider>
              </GestureHandlerRootView>
            </LocationProvider>
          </PlanProvider>
        </MenuProvider>
      </StripeProvider>
    </AuthProvider>
  );
};

export default RouteLayout;
