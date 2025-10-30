/**
 * バージョン文字列を数値配列に変換
 * @param version バージョン文字列 (例: "1.2.3")
 * @returns 数値配列 (例: [1, 2, 3])
 */
const parseVersion = (version: string): number[] => {
  return version.split('.').map((num) => parseInt(num, 10) || 0);
};

/**
 * バージョン比較
 * @param currentVersion 現在のバージョン
 * @param minVersion 最低バージョン
 * @returns true: 更新が必要, false: 更新不要
 */
export const isUpdateRequired = (currentVersion: string, minVersion: string): boolean => {
  const current = parseVersion(currentVersion);
  const min = parseVersion(minVersion);

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
};
