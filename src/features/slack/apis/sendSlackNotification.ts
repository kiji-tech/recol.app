import { SlackConfigUtil, SlackMessage, SlackNotificationType } from '@/src/features/slack';
import { LogUtil } from '@/src/libs/LogUtil';

export const sendSlackNotification = async (
  message: SlackMessage,
  type: SlackNotificationType = 'error'
): Promise<void> => {
  if (!SlackConfigUtil.isTypeEnabled(type)) {
    return;
  }

  const webhookUrl = SlackConfigUtil.getWebhookUrl(type);

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  }).catch((error) => {
    LogUtil.log(JSON.stringify({ slackWebHookError: error }), { level: 'error' });
  });
};
