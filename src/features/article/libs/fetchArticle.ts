import { Article } from '../types/Article';
import { fetchArticle as fetchArticleApi } from '../apis/fetchArticle';
import { LogUtil } from '../../../libs/LogUtil';

/**
 * ブログの取得
 */
export const fetchArticle = async (id: string, ctrl?: AbortController): Promise<Article> => {
  try {
    LogUtil.log('Fetching article', { level: 'info', additionalInfo: { id } });

    const article = await fetchArticleApi(id, ctrl);

    LogUtil.log('Article fetched successfully', { level: 'info', additionalInfo: { id } });

    return article;
  } catch (error) {
    LogUtil.log('Failed to fetch article', {
      level: 'error',
      additionalInfo: { id },
      error: error as Error,
    });

    // エラーメッセージの統一
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch blog')) {
        throw new Error('記事の取得に失敗しました');
      }
      if (error.message.includes('Aborted')) {
        throw new Error('記事の取得がキャンセルされました');
      }
    }

    throw error;
  }
};
