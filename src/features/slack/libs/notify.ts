import {
  SlackNotificationOptions,
  SlackConfigUtil,
  SlackMessageFilterUtil,
  SlackMessageFormatterUtil,
  sendSlackNotification,
} from '@/src/features/slack';

/**
 * Slack通知を送信する（lib向けユーティリティ）
 * Reactに依存しない純粋関数として利用可能
 */
export const notifySlack = async (options: SlackNotificationOptions): Promise<void> => {
  const { message, type = 'error' } = options;

  // 指定タイプが無効なら送らない
  if (!SlackConfigUtil.isTypeEnabled(type)) return;

  // フィルタ対象は送らない
  if (SlackMessageFilterUtil.shouldSkipMessage(message)) return;

  // フォーマットして送信
  const formatted = SlackMessageFormatterUtil.formatMessage(options);
  await sendSlackNotification(formatted, type);
};
