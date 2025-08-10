export class SlackMessageFilterUtil {
  /**
   * Slack通知をスキップすべきメッセージかどうかをチェック
   */
  static shouldSkipMessage(message: string): boolean {
    const skipKeywords = ['Aborted', 'JWT'];
    return skipKeywords.some((keyword) => message.includes(keyword));
  }
}
