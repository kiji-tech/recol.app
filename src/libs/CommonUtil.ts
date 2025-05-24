import { Linking } from "react-native";

/**
 * 共通ユーティリティ関数
 */
export class CommonUtil {
  /**
   * 指定したミリ秒だけ処理を待機する
   * @param ms 待機するミリ秒
   * @returns Promise
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async openBrowser(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      throw new Error('Invalid URL');
    }
  }
}
