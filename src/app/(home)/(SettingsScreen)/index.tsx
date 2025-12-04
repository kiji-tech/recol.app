import React, { useCallback } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { router, useFocusEffect } from 'expo-router';
import { Text, View, ScrollView, Platform } from 'react-native';
import { CommonUtil } from '@/src/libs/CommonUtil';
import { usePlan } from '@/src/contexts/PlanContext';
import Constants from 'expo-constants';
import SettingItem from '@/src/features/auth/components/Setting/SettingItem';
import SettingDarkMode from '@/src/features/auth/components/Setting/SettingDarkMode';
import ScheduleNotification from '@/src/features/auth/components/Setting/ScheduleNotification';
import DevelopmentBar from '@/src/features/auth/components/DevelopmentBar';
import ProfileAvatar from '@/src/features/profile/components/ProfileAvatar';
import PlanComponent from '@/src/features/plan/components/PlanComponent';
import Share from 'react-native-share';
import generateI18nMessage from '@/src/libs/i18n';
import { useQuery } from 'react-query';
import { fetchProfile } from '@/src/features/profile';
import MaskLoading from '@/src/components/MaskLoading';
import { useShare } from '@/src/features/commons/hooks/useShare';

// TODO: 将来的にはDB化
// const CHAT_NOTIFICATION_KEY = STORAGE_KEYS.CHAT_NOTIFICATION_KEY;

export default function Settings() {
  // === Member ===
  const { logout } = useAuth();
  const { clearStoragePlan } = usePlan();
  const { shereApplication } = useShare();
  const version = Constants.expoConfig?.version || '1.0.0';

  const { user, session } = useAuth();
  const {
    data: profile,
    refetch,
    isFetching: isProfileLoading,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(session),
    enabled: !!session, // セッションがある場合のみ実行
  });

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

  // アプリからデータを送信
  const handleShareTwitter = async () => {
    shereApplication();
  };

  // === Effect ===
  // 通知設定の読み込み
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // === Render ===
  {
    /* プロフィールセクション */
  }
  if (isProfileLoading) {
    return <MaskLoading />;
  }

  return (
    <BackgroundView>
      <DevelopmentBar />
      <ScrollView className="gap-8 flex flex-col" showsVerticalScrollIndicator={false}>
        <ProfileAvatar profile={profile} user={user} />

        {/* アカウント設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
            {generateI18nMessage('SCREEN.SETTINGS.ACCOUNT_SETTINGS')}
          </Text>
          <SettingItem
            icon="person-outline"
            title={generateI18nMessage('SCREEN.SETTINGS.PROFILE_EDIT')}
            onPress={() => router.push('/(settings)/ProfileEditorScreen')}
          />
        </View>
        <View className="pb-4 border-b border-light-border dark:border-dark-border">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
            {generateI18nMessage('SCREEN.SETTINGS.PLAN')}
          </Text>
          <PlanComponent />
        </View>

        {/* アプリ設定 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
            {generateI18nMessage('SCREEN.SETTINGS.APP_SETTINGS')}
          </Text>

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
            title={generateI18nMessage('SCREEN.SETTINGS.APP_VERSION')}
            value={version}
            showArrow={false}
          />
          {profile && (profile.isTester() || profile.isSuperUser() || profile.isAdmin()) && (
            <SettingItem
              icon="bug-outline"
              title={generateI18nMessage('SCREEN.SETTINGS.TESTER_SETTINGS')}
              onPress={() => router.push('/(modal)/TesterSettings')}
            />
          )}
        </View>

        {/* その他 */}
        <View className="mb-4">
          <Text className="px-4 py-2 text-sm text-light-text dark:text-dark-text">
            {generateI18nMessage('SCREEN.SETTINGS.OTHER')}
          </Text>
          <SettingItem
            icon="document-text-outline"
            title={generateI18nMessage('SCREEN.SETTINGS.TERMS')}
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/terms`)}
          />
          <SettingItem
            icon="shield-outline"
            title={generateI18nMessage('SCREEN.SETTINGS.PRIVACY_POLICY')}
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/policy`)}
          />
          <SettingItem
            icon="mail-outline"
            title={generateI18nMessage('SCREEN.SETTINGS.CONTACT')}
            onPress={() => CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_CONTACT_PAGE_URL}`)}
          />
          <SettingItem
            icon="logo-twitter"
            title={generateI18nMessage('SCREEN.SETTINGS.SHARE_TWITTER')}
            onPress={() => {
              handleShareTwitter();
            }}
          />
          <SettingItem
            icon="trash-outline"
            title={generateI18nMessage('SCREEN.SETTINGS.DELETE_ACCOUNT')}
            isDanger={true}
            showArrow={false}
            onPress={() => router.push('/(modal)/RemoveAccount')}
          />
        </View>

        {/* サインアウト */}
        <View className="p-4 mb-4">
          <Button
            theme="danger"
            text={generateI18nMessage('SCREEN.SETTINGS.SIGN_OUT')}
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
