import { Linking } from 'react-native';
import { Article } from '../types/Article';
import { LogUtil } from '../../../libs/LogUtil';

/**
 * ReLCoLの記事に該当するURLをブラウザで開く
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
