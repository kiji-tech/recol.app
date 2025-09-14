import React, { useState, useCallback } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { useTheme } from '@/src/contexts/ThemeContext';
import { router, useFocusEffect } from 'expo-router';
import { Text, View, ScrollView } from 'react-native';
import { STORAGE_KEYS } from '@/src/libs/ConstValue';
import { CommonUtil } from '@/src/libs/CommonUtil';
import { usePlan } from '@/src/contexts/PlanContext';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingItem from './components/SettingItem';
import PlanComponent from './components/PlanComponent';
import SettingDarkMode from './components/SettingDarkMode';
import ScheduleNotification from './components/ScheduleNotification';
import ProfileAvatar from './components/ProfileAvatar';

// TODO: 将来的にはDB化
const CHAT_NOTIFICATION_KEY = STORAGE_KEYS.CHAT_NOTIFICATION_KEY;

export default function Settings() {
  // === Member ===
  const { logout } = useAuth();
  const { clearStoragePlan } = usePlan();
  const version = Constants.expoConfig?.version || '1.0.0';

  // === チャット関係 ===
  // チャット通知設定の変更
  //   const { isDarkMode } = useTheme();
  //   const [chatNotification, setChatNotification] = useState(false);
  //   const handleChatNotificationChange = async (value: boolean) => {
  //     await AsyncStorage.setItem(CHAT_NOTIFICATION_KEY, String(value));
  //     setChatNotification(value);
  //   };

  // === Method ===
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
        // const [chatEnabled] = await Promise.all([AsyncStorage.getItem(CHAT_NOTIFICATION_KEY)]);
        // setChatNotification(chatEnabled !== 'false');
      };
      loadSettings();
    }, [])
  );

  // === Render ===
  return (
    <BackgroundView>
      <ScrollView className="gap-8 flex flex-col" showsVerticalScrollIndicator={false}>
        {/* プロフィールセクション */}
        <ProfileAvatar />

        {/* アカウント設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
            アカウント設定
          </Text>
          <SettingItem
            icon="person-outline"
            title="プロフィール編集"
            onPress={() => router.push('/(settings)/ProfileEditorScreen')}
          />
        </View>
        <View className="pb-4 border-b border-light-border dark:border-dark-border">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">プラン</Text>
          <PlanComponent />
        </View>

        {/* アプリ設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">アプリ設定</Text>

          {/* ダークモード設定 */}
          <SettingDarkMode />

          {/* スケジュール通知設定 */}
          <ScheduleNotification />

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
          />
        </View>

        {/* その他 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">その他</Text>
          <SettingItem
            icon="document-text-outline"
            title="利用規約"
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/terms`)}
          />
          <SettingItem
            icon="shield-outline"
            title="プライバシーポリシー"
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/policy`)}
          />
          <SettingItem
            icon="mail-outline"
            title="お問い合わせはこちら"
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_CONTACT_PAGE_URL}`)}
          />
          <SettingItem
            icon="trash-outline"
            title="アカウント削除する"
            isDanger={true}
            showArrow={false}
            onPress={() => router.push('/(modal)/RemoveAccount')}
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
