interface SlackNotificationProps {
    message: string;
    webhookUrl: string;
}

export const sendSlackNotification = async (props: SlackNotificationProps) => {
  const { message, webhookUrl } = props;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: message,
    }),
  });
};