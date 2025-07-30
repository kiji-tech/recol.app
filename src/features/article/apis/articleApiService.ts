import { Article, ArticleType } from '@/src/entities/Article';

// ============ MicroCMS ============
/**
 * ブログの取得
 */
export async function fetchArticle(id: string, ctrl?: AbortController) {
  const url = process.env.EXPO_PUBLIC_MICROCMS_URI! + '/blogs/' + id;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
    signal: ctrl?.signal,
  });
  if (!response.ok) throw new Error('Failed to fetch blog');
  const data = await response.json();
  return new Article(data as ArticleType);
}

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
  return data.contents;
}
