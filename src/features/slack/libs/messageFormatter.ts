import { SlackMessage, SlackNotificationOptions, SlackNotificationType } from '../types/Slack';

export class SlackMessageFormatterUtil {
  /**
   * Slackメッセージのフォーマット
   */
  static formatMessage(options: SlackNotificationOptions): SlackMessage {
    const { message, type = 'error', data } = options;

    const typeLabel = this.getTypeLabel(type);
    const formattedMessage = `*【${typeLabel}】*\n${message}`;
    const formattedData = data ? `\n\`\`\`${JSON.stringify(data)}\`\`\`` : '';

    return {
      text: `${formattedMessage}${formattedData}`,
    };
  }

  /**
   * 通知タイプに応じたラベルを取得
   */
  private static getTypeLabel(type: SlackNotificationType): string {
    switch (type) {
      case 'signup':
        return '新規登録';
      case 'delete-account':
        return 'アカウント削除';
      case 'error':
        return 'エラー';
      default:
        return 'INFO';
    }
  }
}
