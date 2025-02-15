import React, { useState, useEffect } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { supabase } from '@/src/libs/supabase';
import { router } from 'expo-router';
import { Text, View, Switch, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    className="flex-row items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-light-border dark:border-dark-border"
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

const SCHEDULE_NOTIFICATION_KEY = '@schedule_notification_enabled';
const CHAT_NOTIFICATION_KEY = '@chat_notification_enabled';

export default function Settings() {
  const { user, profile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [scheduleNotification, setScheduleNotification] = useState(true);
  const [chatNotification, setChatNotification] = useState(true);
  const version = Constants.expoConfig?.version || '1.0.0';
  const isDarkMode = theme === 'dark';

  // 通知設定の読み込み
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [scheduleEnabled, chatEnabled] = await Promise.all([
          AsyncStorage.getItem(SCHEDULE_NOTIFICATION_KEY),
          AsyncStorage.getItem(CHAT_NOTIFICATION_KEY),
        ]);

        setScheduleNotification(scheduleEnabled !== 'false');
        setChatNotification(chatEnabled !== 'false');
      } catch (error) {
        console.error('設定の読み込みに失敗しました:', error);
      }
    };
    loadSettings();
  }, []);

  // テーマ切り替え処理
  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  // スケジュール通知設定の変更
  const handleScheduleNotificationChange = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(SCHEDULE_NOTIFICATION_KEY, String(value));
      setScheduleNotification(value);
    } catch (error) {
      console.error('スケジュール通知設定の保存に失敗しました:', error);
    }
  };

  // チャット通知設定の変更
  const handleChatNotificationChange = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(CHAT_NOTIFICATION_KEY, String(value));
      setChatNotification(value);
    } catch (error) {
      console.error('チャット通知設定の保存に失敗しました:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.navigate('/(auth)/SignIn');
  };

  const handleOpenURL = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <BackgroundView>
      <ScrollView className="h-screen gap-8 flex flex-col" showsVerticalScrollIndicator={false}>
        {/* プロフィールセクション */}
        <View className="items-center p-6 border-b border-light-border dark:border-dark-border">
          <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-light-border dark:border-dark-border">
            {profile?.avatar_url ? (
              <Image source={{ uri: profile?.avatar_url }} className="w-full h-full" />
            ) : (
              <View className="w-full h-full bg-light-shadow dark:bg-dark-shadow items-center justify-center">
                <Ionicons name="person" size={40} color="gray" />
              </View>
            )}
          </View>
          <Text className="text-xl font-bold text-light-text dark:text-dark-text">
            {profile?.display_name || 'ユーザー名未設定'}
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

        {/* アプリ設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">アプリ設定</Text>

          {/* ダークモード設定 */}
          <View className="flex-row items-center justify-between p-4 bg-white border-b border-light-border dark:border-dark-border">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={24} color={isDarkMode ? 'white' : 'black'} />
              <Text className="ml-3 text-light-text dark:text-dark-text">ダークモード</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={handleThemeChange} />
          </View>

          {/* スケジュール通知設定 */}
          <View className="flex-row items-center justify-between p-4 bg-white border-b border-light-border dark:border-dark-border">
            <View>
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
            <Switch value={scheduleNotification} onValueChange={handleScheduleNotificationChange} />
          </View>

          {/* チャット通知設定 */}
          <View className="flex-row items-center justify-between p-4 bg-white border-b border-light-border dark:border-dark-border">
            <View>
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
            <Switch value={chatNotification} onValueChange={handleChatNotificationChange} />
          </View>

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
            onPress={() => handleOpenURL('https://example.com/terms')}
          />
          <SettingItem
            icon="shield-outline"
            title="プライバシーポリシー"
            isDarkMode={isDarkMode}
            onPress={() => handleOpenURL('https://example.com/privacy')}
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
