import { Article, ArticleType } from '@/src/features/article/types/Article';

/**
 * ブログ一覧の取得
 */
export async function fetchArticleList() {
  const response = await fetch(process.env.EXPO_PUBLIC_MICROCMS_URI! + '/blogs', {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blog list');
  }

  const data = await response.json();
  return data.contents.map((content: ArticleType) => new Article(content));
}
