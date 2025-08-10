import { SlackMessage, SlackNotificationType } from '../types/Slack';
import { SlackConfigUtil } from '../libs/slackConfig';

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
    console.error(`Slack notification failed for type ${type}:`, error);
  });
};
