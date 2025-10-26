/**
 * バージョン文字列を比較するユーティリティ
 */
export class VersionUtil {
  /**
   * バージョン文字列を数値配列に変換
   * @param version バージョン文字列 (例: "1.2.3")
   * @returns 数値配列 (例: [1, 2, 3])
   */
  private static parseVersion(version: string): number[] {
    return version.split('.').map((num) => parseInt(num, 10) || 0);
  }

  /**
   * バージョン比較
   * @param currentVersion 現在のバージョン
   * @param minVersion 最低バージョン
   * @returns true: 更新が必要, false: 更新不要
   */
  static isUpdateRequired(currentVersion: string, minVersion: string): boolean {
    const current = this.parseVersion(currentVersion);
    const min = this.parseVersion(minVersion);

    // 各セグメントを比較
    for (let i = 0; i < Math.max(current.length, min.length); i++) {
      const currentNum = current[i] || 0;
      const minNum = min[i] || 0;

      if (currentNum < minNum) {
        return true; // 更新が必要
      } else if (currentNum > minNum) {
        return false; // 更新不要
      }
    }

    return false; // 同じバージョン
  }

  /**
   * バージョンチェックAPIを呼び出し
   * @returns 最低バージョン情報
   */
  static async checkVersion(): Promise<{
    minVersion: string;
    currentVersion: string;
    forceUpdate: boolean;
  }> {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/version-check`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('バージョンチェックエラー:', error);
      // エラーの場合は更新不要として扱う
      return {
        minVersion: '0.0.0',
        currentVersion: '1.1.0',
        forceUpdate: false,
      };
    }
  }
}
