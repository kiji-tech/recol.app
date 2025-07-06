import React, { useState, useCallback } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { router, useFocusEffect } from 'expo-router';
import { Text, View, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/src/libs/ConstValue';
import { CommonUtil } from '@/src/libs/CommonUtil';
import { usePlan } from '@/src/contexts/PlanContext';
import dayjs from 'dayjs';
import { SubscriptionUtil } from '@/src/libs/SubscriptionUtil';
import { Tables } from '@/src/libs/database.types';
import { fetchScheduleListForNotification, updateProfile } from '@/src/libs/ApiService';
import * as Notifications from 'expo-notifications';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { LogUtil } from '@/src/libs/LogUtil';
import { Profile } from '@/src/entities/Profile';

const PlanComponent = ({
  profile,
}: {
  profile: (Tables<'profile'> & { subscription: Tables<'subscription'>[] }) | null;
}) => {
  // === Member ===
  const { isDarkMode } = useTheme();

  // === Method ===
  if (SubscriptionUtil.isAdmin(profile!) || SubscriptionUtil.isSuperUser(profile!)) {
    return (
      <View>
        <Text className="text-light-text dark:text-dark-text">スーパーユーザーです</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      className="flex flex-row items-start justify-between"
      onPress={() => router.push('/(payment)/PaymentPlan')}
    >
      {profile && profile!.subscription && profile!.subscription.length === 0 && (
        <View className="flex flex-row items-start justify-between ">
          <Text className="text-light-text dark:text-dark-text">無料プラン</Text>
        </View>
      )}

      {profile && profile!.subscription && profile!.subscription.length > 0 && (
        <View className="flex-col items-start justify-between">
          <Text className="text-light-text dark:text-dark-text mb-2 text-lg">プレミアムプラン</Text>
          {/* プランの有効期限 */}
          <Text className="text-light-text dark:text-dark-text mb-2 text-sm">
            有効期限: {dayjs(profile?.subscription[0].current_period_end).format('YYYY-MM-DD')}
          </Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
};

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isDarkMode: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  value,
  onPress,
  showArrow = true,
  isDarkMode,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border"
  >
    <View className="flex-row items-center">
      <Ionicons name={icon} size={24} color={isDarkMode ? 'white' : 'black'} />
      <Text className="ml-3 text-light-text dark:text-dark-text">{title}</Text>
    </View>
    <View className="flex-row items-center">
      {value && <Text className="mr-2 text-light-text dark:text-dark-text">{value}</Text>}
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={isDarkMode ? 'white' : 'black'} />
      )}
    </View>
  </TouchableOpacity>
);

// TODO: 将来的にはDB化
const CHAT_NOTIFICATION_KEY = STORAGE_KEYS.CHAT_NOTIFICATION_KEY;

export default function Settings() {
  const { session, user, getProfileInfo, logout, setProfile, fetchProfile } = useAuth();
  const { clearStoragePlan } = usePlan();
  const { theme, setTheme } = useTheme();
  const [chatNotification, setChatNotification] = useState(false);
  const version = Constants.expoConfig?.version || '1.0.0';
  const isDarkMode = theme === 'dark';

  // テーマ切り替え処理
  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  // スケジュール通知設定の変更
  const handleScheduleNotificationChange = async (value: boolean) => {
    if (!getProfileInfo()) return;
    setProfile({ ...getProfileInfo(), enabled_schedule_notification: value } as Profile);
    let token = getProfileInfo()?.notification_token;

    // スケジュール通知を無効にした場合は､既存のスケジュールを全削除
    if (!value) {
      LogUtil.log('removeAllScheduleNotification', { level: 'info' });
      await NotificationUtil.removeAllScheduleNotification();
    }

    if (value) {
      LogUtil.log('Permission check', { level: 'info' });
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        LogUtil.log('Permission Request', { level: 'info' });
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          setProfile({ ...getProfileInfo(), enabled_schedule_notification: false } as Profile);
          return;
        }
      }
    }
    if (!token) {
      LogUtil.log('トークンを取得する', { level: 'info' });
      const expoToken = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas?.projectId,
      });
      token = expoToken.data;
    }

    await updateProfile(
      {
        ...getProfileInfo(),
        enabled_schedule_notification: value,
        notification_token: token,
      } as Profile,
      session
    );

    // ONになった場合は､今あるスケジュールに対してすべての通知を設定する
    const scheduleList = await fetchScheduleListForNotification(session);
    for (const schedule of scheduleList) {
      await NotificationUtil.upsertUserSchedule(schedule, value);
    }
  };

  // チャット通知設定の変更
  const handleChatNotificationChange = async (value: boolean) => {
    await AsyncStorage.setItem(CHAT_NOTIFICATION_KEY, String(value));
    setChatNotification(value);
  };

  // サインアウト処理
  const handleSignOut = async () => {
    router.replace('/(auth)/SignIn');
    await clearStoragePlan();
    await logout();
  };

  // === Effect ===
  // 通知設定の読み込み
  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        const [chatEnabled] = await Promise.all([AsyncStorage.getItem(CHAT_NOTIFICATION_KEY)]);

        setChatNotification(chatEnabled !== 'false');
      };
      loadSettings();
    }, [])
  );

  // === プロフィールの読み込み ===
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [session])
  );

  // === Render ===
  return (
    <BackgroundView>
      <ScrollView className="gap-8 flex flex-col" showsVerticalScrollIndicator={false}>
        {/* プロフィールセクション */}
        <View className="items-center p-6 border-b border-light-border dark:border-dark-border">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-light-border dark:border-dark-border">
            {getProfileInfo()?.avatar_url ? (
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatars/${getProfileInfo()?.avatar_url}`,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : (
              <View className="w-full h-full bg-light-shadow dark:bg-dark-shadow items-center justify-center">
                <Ionicons name="person" size={40} color="gray" />
              </View>
            )}
          </View>
          <Text className="text-xl font-bold text-light-text dark:text-dark-text">
            {getProfileInfo()?.display_name || 'ユーザー名未設定'}
          </Text>
          <Text className="text-light-text dark:text-dark-text">{user?.email}</Text>
        </View>

        {/* アカウント設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
            アカウント設定
          </Text>
          <SettingItem
            icon="person-outline"
            title="プロフィール編集"
            isDarkMode={isDarkMode}
            onPress={() => router.push('/(settings)/ProfileEditorScreen')}
          />
        </View>
        <View className="pb-4 border-b border-light-border dark:border-dark-border">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">プラン</Text>
          <View className="px-4 py-2 text-md text-light-text dark:text-dark-text">
            <PlanComponent profile={getProfileInfo()} />
          </View>
        </View>

        {/* アプリ設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">アプリ設定</Text>

          {/* ダークモード設定 */}
          <View className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={24} color={isDarkMode ? 'white' : 'black'} />
              <Text className="ml-3 text-light-text dark:text-dark-text">ダークモード</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={handleThemeChange} />
          </View>

          {/* スケジュール通知設定 */}
          <View className="flex-row items-center relative p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-1 pr-16">
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={isDarkMode ? 'white' : 'black'}
                />
                <Text className="ml-3 text-light-text dark:text-dark-text">スケジュールの通知</Text>
              </View>
              <Text className="text-sm text-light-text dark:text-dark-text ml-9 mt-1">
                スケジュールの開始時刻に通知を受け取ります
              </Text>
            </View>
            <View className="absolute right-4">
              <Switch
                value={getProfileInfo()?.enabled_schedule_notification ?? false}
                onValueChange={handleScheduleNotificationChange}
              />
            </View>
          </View>

          {/* TODO: チャット通知設定 */}
          {/* <View className="flex-row items-center relative p-4 border-b border-light-border dark:border-dark-border">
            <View className="flex-1 pr-16">
              <View className="flex-row items-center">
                <Ionicons
                  name="chatbubble-outline"
                  size={24}
                  color={isDarkMode ? 'white' : 'black'}
                />
                <Text className="ml-3 text-light-text dark:text-dark-text">チャットの通知</Text>
              </View>
              <Text className="text-sm text-light-text dark:text-dark-text ml-9 mt-1">
                新しいメッセージを受信したときに通知を受け取ります
              </Text>
            </View>
            <View className="absolute right-4">
              <Switch value={chatNotification} onValueChange={handleChatNotificationChange} />
            </View>
          </View> */}

          <SettingItem
            icon="information-circle-outline"
            title="アプリバージョン"
            value={version}
            showArrow={false}
            isDarkMode={isDarkMode}
          />
        </View>

        {/* その他 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">その他</Text>
          <SettingItem
            icon="document-text-outline"
            title="利用規約"
            isDarkMode={isDarkMode}
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/terms`)}
          />
          <SettingItem
            icon="shield-outline"
            title="プライバシーポリシー"
            isDarkMode={isDarkMode}
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/policy`)}
          />
        </View>

        {/* サインアウト */}
        <View className="p-4 mb-4">
          <Button theme="danger" text="サインアウト" onPress={handleSignOut} />
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
