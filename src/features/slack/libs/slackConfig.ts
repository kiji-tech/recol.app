import { SlackConfig, SlackNotificationType } from '../types/Slack';

export class SlackConfigUtil {
  /**
   * Slack設定を取得
   */
  static getConfig(): SlackConfig {
    return {
      webhookUrls: {
        signup: process.env.EXPO_PUBLIC_SLACK_NEW_ACCOUNT_WEBHOOK_URL || '',
        'delete-account': process.env.EXPO_PUBLIC_SLACK_ACCOUNT_DELETE_WEBHOOK_URL || '',
        error: process.env.EXPO_PUBLIC_SLACK_WEBHOOK_URL || '',
      },
      enabled: process.env.EXPO_PUBLIC_ENABLE_SLACK_NOTIFICATION === 'ON',
    };
  }

  /**
   * 指定したタイプのWebhook URLを取得
   */
  static getWebhookUrl(type: SlackNotificationType): string {
    const config = this.getConfig();
    return config.webhookUrls[type];
  }

  /**
   * Slack通知が有効かどうかをチェック
   */
  static isEnabled(): boolean {
    const config = this.getConfig();
    return config.enabled;
  }

  /**
   * 指定したタイプの通知が設定されているかをチェック
   */
  static isTypeEnabled(type: SlackNotificationType): boolean {
    const config = this.getConfig();
    return config.enabled && config.webhookUrls[type] !== '';
  }
}
