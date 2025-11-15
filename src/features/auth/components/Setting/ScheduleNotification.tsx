import React from 'react';
import { View, Text, Switch, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import { Profile } from '@/src/features/profile/types/Profile';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { updateProfile } from '@/src/features/profile';
import { fetchScheduleListForNotification } from '@/src/features/schedule';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import i18n from '@/src/libs/i18n';
import { Toast } from 'toastify-react-native';
import { useMutation } from 'react-query';
export default function ScheduleNotification() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { profile, setProfile, session } = useAuth();

  const updateProfileMutation = useMutation({
    mutationFn: (profile: Profile) => updateProfile(profile, session),
    onError: (error) => {
      if (error && error instanceof Error && error.message) {
        Toast.error(error.message);
      }
    },
  });

  // 通知権限のチェックとエラーハンドリング
  const checkNotificationPermission = async (): Promise<boolean> => {
    LogUtil.log('Permission check', { level: 'info' });
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus !== 'granted') {
      LogUtil.log('Permission Request', { level: 'info' });
      const { status } = await Notifications.requestPermissionsAsync();
      LogUtil.log(JSON.stringify(status), { level: 'info' });

      if (status === 'denied') {
        // 権限が拒否された場合の処理
        if (profile) {
          profile.enabled_schedule_notification = false;
          setProfile(new Profile(profile));
        }

        Alert.alert(
          i18n.t('COMPONENT.SCHEDULE_NOTIFICATION.NO_PERMISSION_TITLE'),
          i18n.t('COMPONENT.SCHEDULE_NOTIFICATION.NO_PERMISSION'),
          [
            {
              text: '設定を開く',
              onPress: () => {
                // iOS/Androidの設定画面を開く
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
            {
              text: 'キャンセル',
              style: 'cancel',
            },
          ]
        );
        return false;
      } else if (status !== 'granted') {
        // その他の理由で権限が取得できない場合
        if (profile) {
          profile.enabled_schedule_notification = false;
          setProfile(new Profile(profile));
        }

        Alert.alert(
          i18n.t('COMMON.ERROR'),
          i18n.t('COMPONENT.SCHEDULE_NOTIFICATION.ERROR_MESSAGE'),
          [{ text: 'OK' }]
        );
        return false;
      }
    }

    return true;
  };

  /**
   * スケジュール通知設定の変更
   * @param value {boolean} スケジュール通知設定の値
   */
  const handleScheduleNotificationChange = async (value: boolean) => {
    if (!profile) return;
    profile.enabled_schedule_notification = value;
    setProfile(new Profile(profile));
    let token = profile.notification_token;

    // スケジュール通知を無効にした場合は､既存のスケジュールを全削除
    if (!value) {
      LogUtil.log('removeAllScheduleNotification', { level: 'info' });
      await NotificationUtil.removeAllScheduleNotification();
    }

    // 有効にした場合
    if (value) {
      const hasPermission = await checkNotificationPermission();
      if (!hasPermission) {
        return;
      }
    }
    if (!token) {
      LogUtil.log('トークンを取得する', { level: 'info' });
      const expoToken = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas?.projectId,
      });
      token = expoToken.data;
    }

    profile.enabled_schedule_notification = value;
    profile.notification_token = token;
    setProfile(new Profile(profile));
    await updateProfileMutation.mutate(profile);
    // ONになった場合は､今あるスケジュールに対してすべての通知を設定する
    const scheduleList = await fetchScheduleListForNotification(session);
    for (const schedule of scheduleList) {
      await NotificationUtil.upsertUserSchedule(schedule, value);
    }
  };

  return (
    <View className="flex-row items-center relative p-4 border-b border-light-border dark:border-dark-border">
      <View className="flex-1 pr-16">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={24} color={isDarkMode ? 'white' : 'black'} />
          <Text className="ml-3 text-light-text dark:text-dark-text">
            {i18n.t('COMPONENT.SCHEDULE_NOTIFICATION.TITLE')}
          </Text>
        </View>
        <Text className="text-sm text-light-text dark:text-dark-text ml-9 mt-1">
          {i18n.t('COMPONENT.SCHEDULE_NOTIFICATION.MESSAGE')}
        </Text>
      </View>
      <View className="absolute right-4">
        <Switch
          value={profile?.enabled_schedule_notification ?? false}
          onValueChange={handleScheduleNotificationChange}
        />
      </View>
    </View>
  );
}
