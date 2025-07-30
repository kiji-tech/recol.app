import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { LogUtil } from '@/src/libs/LogUtil';
import { Profile } from '@/src/features/profile/types/Profile';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { updateProfile } from '@/src/libs/ApiService';
import { fetchScheduleListForNotification } from '@/src/libs/ApiService';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export default function ScheduleNotification() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { getProfileInfo, setProfile, session } = useAuth();

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

  return (
    <View className="flex-row items-center relative p-4 border-b border-light-border dark:border-dark-border">
      <View className="flex-1 pr-16">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={24} color={isDarkMode ? 'white' : 'black'} />
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
  );
}
