import { VersionInfo } from '../types/VersionTypes';
import { LogUtil } from '@/src/libs/LogUtil';

/**
 * バージョンチェックAPIを呼び出し
 * @returns 最低バージョン情報
 */
export const checkVersion = async (): Promise<VersionInfo> => {
  try {
    LogUtil.log('バージョンチェックAPIを呼び出し中', { level: 'info' });

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
    LogUtil.log('バージョンチェックAPI取得成功', { level: 'info' });

    return data;
  } catch (error) {
    LogUtil.log('バージョンチェックエラー: ' + JSON.stringify(error), {
      level: 'error',
      notify: true,
    });

    // エラーの場合は更新不要として扱う
    return {
      minVersion: '1.0.0',
    };
  }
};
