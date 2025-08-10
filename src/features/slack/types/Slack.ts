export type SlackNotificationType = 'signup' | 'delete-account' | 'error';

export interface SlackMessage {
  text: string;
}

export interface SlackNotificationOptions {
  message: string;
  type?: SlackNotificationType;
  data?: Record<string, string | number | boolean | null | undefined | object>;
}

export interface SlackConfig {
  webhookUrls: {
    signup: string;
    'delete-account': string;
    error: string;
  };
  enabled: boolean;
}
