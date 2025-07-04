import * as Notifications from 'expo-notifications';
import { Schedule } from '../entities/Plan';
import dayjs from 'dayjs';

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

  /**
   * スケジュール通知の同期処理
   * 今あるスケジュールを取得
   * すでに同じIDをのものがあるかチェック
   * あればキャンセルリクエストを送る
   */
  static async upsertUserSchedule(schedule: Schedule) {
    await this.removeScheduleNotification(schedule);

    const targetDate = dayjs(schedule.from).add(-5, 'minutes');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `【5分前です】${schedule.title}`,
        body: schedule.description,
        data: {
          scheduleId: schedule.uid,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        year: Number(targetDate.format('YYYY')),
        month: Number(targetDate.format('MM')),
        day: Number(targetDate.format('DD')),
        hour: Number(targetDate.format('HH')),
        minute: Number(targetDate.format('mm')),
      },
    });
  }

  /** スケジュール通知の削除処理 */
  static async removeScheduleNotification(schedule: Schedule) {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const cancelNotification = notifications.find(
      (notification) => notification.content.data.scheduleId === schedule.uid
    );
    if (cancelNotification && cancelNotification.identifier) {
      await Notifications.cancelScheduledNotificationAsync(cancelNotification.identifier);
    }
  }
}
