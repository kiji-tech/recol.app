import '@/global.css';
import React, { useCallback, useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { Linking, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  PermissionStatus,
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import 'expo-dev-client';
import { LogBox } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { MenuProvider } from 'react-native-popup-menu';
import { LocationProvider } from '@/src/contexts';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { useTheme, ThemeProvider, PlanProvider } from '@/src/contexts';
import { useAuth, AuthProvider, PremiumPlanProvider } from '@/src/features/auth';
import { isUpdateRequired, checkVersion as checkVersionApi } from '@/src/features/version';
import { ForceUpdateModal } from '@/src/features/version/components/ForceUpdateModal';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MapProvider } from '@/src/features/map';
import { LogUtil } from '@/src/libs/LogUtil';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ToastManager from 'toastify-react-native';
import Constants from 'expo-constants';

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

// === QueryClient ===
const queryClient = new QueryClient();

const Layout = () => {
  const [ready, setReady] = useState(false);
  const [showForceUpdate, setShowForceUpdate] = useState(false);
  const { isDarkMode } = useTheme();
  const { initialized } = useAuth();

  const onLayout = useCallback(async () => {
    if (ready && initialized) {
      // レイアウトが終わってから隠すと白画面を防げる
      await SplashScreen.hideAsync();
    }
  }, [ready, initialized]);

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

  const checkVersion = useCallback(async () => {
    try {
      const versionInfo = await checkVersionApi();
      const currentVersion = Constants.expoConfig?.version || '';

      if (isUpdateRequired(currentVersion, versionInfo.minVersion)) {
        setShowForceUpdate(true);
      }
    } catch (error) {
      LogUtil.log('バージョンチェックエラー', { level: 'warn', error: error as Error });
    }
  }, []);

  const initializeApp = async () => {
    // ここでフォントや API をプリロード
    await Font.loadAsync({
      // 例: 'Roboto': require('./assets/fonts/Roboto-Regular.ttf')
    });
    // 広告初期化
    await initAd();

    // バージョンチェック
    await checkVersion();

    setReady(true);
  };

  if (!ready || !initialized) return null;

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={isDarkMode ? 'black' : 'white'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Stack>
        <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
        <Stack.Screen name="(plan)" options={{ title: '予定表示', headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ title: '設定', headerShown: false }} />
        <Stack.Screen name="(modal)" options={{ title: 'モーダル', headerShown: false }} />
        <Stack.Screen
          name="(scheduleEditor)"
          options={{ title: 'スケジュール編集', headerShown: false }}
        />
        <Stack.Screen name="(payment)" options={{ title: 'プラン更新', headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ title: 'ログイン', headerShown: false }} />
      </Stack>
      <ForceUpdateModal visible={showForceUpdate} />
    </View>
  );
};

const RouteLayout = () => {
  // === DeepLink処理 ===
  const handleDeepLink = useCallback(async (url: string | null) => {
    if (url && url.includes('ResetPassword')) {
      const urlObj = new URL(url);
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
  }, []);

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
    const initializeServices = async () => {
      // 通知初期化
      NotificationUtil.initializeNotifications();
    };

    initializeServices();
  }, []);

  return (
    <PremiumPlanProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LocationProvider>
            <MenuProvider>
              <PlanProvider>
                <MapProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <ThemeProvider>
                      <Layout />
                      <ToastManager />
                    </ThemeProvider>
                  </GestureHandlerRootView>
                </MapProvider>
              </PlanProvider>
            </MenuProvider>
          </LocationProvider>
        </QueryClientProvider>
      </AuthProvider>
    </PremiumPlanProvider>
  );
};

export default RouteLayout;
