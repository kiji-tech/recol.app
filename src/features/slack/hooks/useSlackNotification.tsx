import { useCallback } from 'react';
import {
  SlackMessageFilterUtil,
  SlackMessageFormatterUtil,
  SlackNotificationOptions,
  sendSlackNotification,
  SlackConfigUtil,
} from '@/src/features/slack';

export const useSlackNotification = () => {
  const sendNotification = useCallback(async (options: SlackNotificationOptions): Promise<void> => {
    const { message, type = 'error' } = options;

    // 指定したタイプの通知が無効の場合は何もしない
    if (!SlackConfigUtil.isTypeEnabled(type)) {
      return;
    }

    // フィルタリング対象のメッセージはスキップ
    if (SlackMessageFilterUtil.shouldSkipMessage(message)) {
      return;
    }

    // メッセージをフォーマットして送信
    const formattedMessage = SlackMessageFormatterUtil.formatMessage(options);
    await sendSlackNotification(formattedMessage, type);
  }, []);

  return {
    sendNotification,
    isEnabled: SlackConfigUtil.isEnabled(),
  };
};
