import { Linking } from 'react-native';
import { Article } from '../types/Article';
import { LogUtil } from '../../../libs/LogUtil';

/**
 * ReLCoLの記事に該当するURLをブラウザで開く
 * @param {Article} article - 記事データ
 */
export const openBrowser = async (article: Article): Promise<void> => {
  try {
    LogUtil.log('Opening browser for article', {
      level: 'info',
      additionalInfo: { articleId: article.id },
    });

    const url = `${process.env.EXPO_PUBLIC_WEB_URI}/articles/${article.id}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);

      LogUtil.log('Browser opened successfully', {
        level: 'info',
        additionalInfo: { articleId: article.id },
      });
    } else {
      throw new Error('Invalid URL');
    }
  } catch (error) {
    LogUtil.log('Failed to open browser', {
      level: 'error',
      additionalInfo: { articleId: article.id },
      error: error as Error,
    });

    // エラーメッセージの統一
    if (error instanceof Error) {
      if (error.message.includes('Invalid URL')) {
        throw new Error('無効なURLです');
      }
    }

    throw error;
  }
};

/**
 * URL文字列をブラウザで開く
 * @param {string} url - 開くURL文字列
 */
export const openUrl = async (url: string): Promise<void> => {
  try {
    LogUtil.log('Opening browser for URL', {
      level: 'info',
      additionalInfo: { url },
    });

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);

      LogUtil.log('Browser opened successfully', {
        level: 'info',
        additionalInfo: { url },
      });
    } else {
      throw new Error('Invalid URL');
    }
  } catch (error) {
    LogUtil.log('Failed to open browser', {
      level: 'error',
      additionalInfo: { url },
      error: error as Error,
    });

    // エラーメッセージの統一
    if (error instanceof Error) {
      if (error.message.includes('Invalid URL')) {
        throw new Error('無効なURLです');
      }
    }

    throw error;
  }
};
