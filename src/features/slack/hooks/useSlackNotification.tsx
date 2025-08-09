import { useCallback } from 'react';
import { SlackNotificationOptions } from '../types/Slack';
import { SlackConfigUtil } from '../libs/slackConfig';
import { SlackMessageFilterUtil } from '../libs/messageFilter';
import { SlackMessageFormatterUtil } from '../libs/messageFormatter';
import { sendSlackNotification } from '../apis/sendSlackNotification';

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
