import { Article } from '../types/Article';
import { fetchArticleList as fetchArticleListApi } from '../apis/fetchArticleList';
import { LogUtil } from '../../../libs/LogUtil';

/**
 * ブログ一覧の取得
 */
export const fetchArticleList = async (): Promise<Article[]> => {
  try {
    LogUtil.log('Fetching article list', { level: 'info' });

    const articles = await fetchArticleListApi();

    LogUtil.log('Article list fetched successfully', {
      level: 'info',
      additionalInfo: { count: articles.length },
    });

    return articles;
  } catch (error) {
    LogUtil.log('Failed to fetch article list', {
      level: 'error',
      error: error as Error,
    });

    // エラーメッセージの統一
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch blog list')) {
        throw new Error('記事一覧の取得に失敗しました');
      }
    }

    throw error;
  }
};
