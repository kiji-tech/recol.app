type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  notify?: boolean;
  error?: Error;
  additionalInfo?: Record<string, string | number | boolean | null | undefined>;
}

interface LogData {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: {
    message: string;
    stack?: string;
    name: string;
  };
  [key: string]: string | number | boolean | null | undefined | object;
}

export class LogUtil {
  private static readonly SLACK_WEBHOOK_URL = Deno.env.get('EXPO_PUBLIC_SLACK_WEBHOOK_URL');
  private static readonly ENABLE_SLACK_NOTIFICATION =
    Deno.env.get('ENABLE_SLACK_NOTIFICATION') == 'ON';
  private static readonly ENABLE_CONSOLE_LOG = Deno.env.get('ENABLE_CONSOLE_LOG') == 'ON';

  /**
   * ログを出力し、必要に応じてSlackに通知する
   */
  static async log(message: unknown, options: LogOptions = {}) {
    const { level = 'info', notify = false, error, additionalInfo = {} } = options;
    const m = typeof message == 'string' ? message : JSON.stringify(message);
    const logData: LogData = {
      timestamp: new Date().toISOString(),
      level,
      message: m,
      ...additionalInfo,
    };

    // エラーオブジェクトが存在する場合は追加
    if (error) {
      logData['error'] = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    }

    // コンソールへの出力
    if (this.ENABLE_CONSOLE_LOG) {
      switch (level) {
        case 'info':
          console.log(`[${level.toUpperCase()}] ${message}`);
          break;
        case 'warn':
          console.warn(`[${level.toUpperCase()}] ${message}`);
          break;
        case 'error':
          console.error(`[${level.toUpperCase()}] ${message}`);
          break;
      }
    }

    // Slack通知が有効で、通知フラグがtrueの場合
    if (this.ENABLE_SLACK_NOTIFICATION && notify && this.SLACK_WEBHOOK_URL) {
      await fetch(this.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `🚨 *${level.toUpperCase()}*\n${message}\n\`\`\`${JSON.stringify(logData)}\`\`\``,
        }),
      });
    }
  }
}
