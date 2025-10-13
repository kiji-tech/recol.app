import { notifySlack } from '../features/slack';

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
    if (process.env.EXPO_PUBLIC_ENABLE_CONSOLE_LOG == 'ON') {
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

    // Slack通知処理（libに委譲）
    await this.sendSlackNotification(level, m, logData, notify);
  }

  /**
   * Slack通知を送信する
   */
  private static async sendSlackNotification(
    level: LogLevel,
    message: string,
    logData: LogData,
    notify: boolean
  ): Promise<void> {
    // LogUtilからの通知は常にerrorタイプ
    if (level !== 'error' && !notify) return;
    await notifySlack({
      message,
      type: 'error',
      data: logData,
    });
  }
}
