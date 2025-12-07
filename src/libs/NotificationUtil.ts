import * as Notifications from 'expo-notifications';
import { Schedule } from '../features/schedule';
import { LogUtil } from './LogUtil';
import dayjs from '@/src/libs/dayjs';

export class NotificationUtil {
  /** 初期化処理 */
  static async initializeNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowInForeground: true,
        shouldShowInBackground: true,
      }),
    });
  }

  static async fetchAllScheduleNotification() {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    LogUtil.log(JSON.stringify(notifications), { level: 'info' });
  }

  /**
   * スケジュール通知の同期処理
   * 今あるスケジュールを取得
   * すでに同じIDをのものがあるかチェック
   * あればキャンセルリクエストを送る
   */
  static async upsertUserSchedule(schedule: Schedule, enabled: boolean) {
    LogUtil.log('upsertUserSchedule', { level: 'info' });
    await this.removeScheduleNotification(schedule);

    if (!enabled) {
      LogUtil.log('schedule notification is disabled', { level: 'info' });
      return;
    }

    const targetDate = dayjs(schedule.from);
    if (targetDate.isBefore(dayjs().add(-5, 'minute'))) {
      LogUtil.log('targetDate is before now', { level: 'info' });
      return;
    }
    LogUtil.log(`add notification targetDate: ${targetDate}`, { level: 'info' });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `【Re:CoL】${schedule.title}` || '',
        body: schedule.description || '',
        data: {
          scheduleId: schedule.uid,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: targetDate.toDate(),
      },
    });
  }

  /** スケジュール通知の削除処理 */
  static async removeScheduleNotification(schedule: Schedule) {
    LogUtil.log('removeScheduleNotification', { level: 'info' });
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const cancelNotification = notifications.find(
      (notification) => notification.content.data.scheduleId === schedule.uid
    );
    if (cancelNotification && cancelNotification.identifier) {
      LogUtil.log(`cancelNotification: ${cancelNotification.identifier}`, { level: 'info' });
      await Notifications.cancelScheduledNotificationAsync(cancelNotification.identifier);
    }
  }

  /** スケジュール通知の全削除処理 */
  static async removeAllScheduleNotification() {
    LogUtil.log('removeAllScheduleNotification', { level: 'info' });
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of notifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}
