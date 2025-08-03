import React from 'react';
import Home from '@/src/app/(home)';
import { render, waitFor } from '@testing-library/react-native';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { Article, ArticleType } from '@/src/features/article';
import { fetchArticleList } from '@/src/features/article/libs/fetchArticleList';

// fetchArticleListをモック
jest.mock('@/src/features/article/libs/fetchArticleList', () => ({
  fetchArticleList: jest.fn(),
}));

// モック記事データ
const mockArticles = [
  new Article({
    id: 'test-id-1',
    title: 'テスト記事1',
    content: 'テストコンテンツ1',
    location: '東京',
    locationContentsList: [],
    productContentList: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publishedAt: '2024-01-01T00:00:00Z',
    revisedAt: '2024-01-01T00:00:00Z',
  } as ArticleType),
  new Article({
    id: 'test-id-2',
    title: 'テスト記事2',
    content: 'テストコンテンツ2',
    location: '大阪',
    locationContentsList: [],
    productContentList: [],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    publishedAt: '2024-01-02T00:00:00Z',
    revisedAt: '2024-01-02T00:00:00Z',
  } as ArticleType),
];

describe('##### Home Screen Test #####', () => {
  const mockFetchArticleList = fetchArticleList as jest.MockedFunction<typeof fetchArticleList>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('success test', () => {
    test('記事が表示されることの確認', async () => {
      // fetchArticleListをモックして記事データを返す
      mockFetchArticleList.mockResolvedValue(mockArticles);

      const { getByText } = render(<Home />, { wrapper: ThemeProvider });

      // ローディングが終わるまで待機
      await waitFor(() => {
        expect(mockFetchArticleList).toHaveBeenCalledTimes(1);
      });

      // 記事のタイトルが表示されていることを確認
      expect(getByText('テスト記事1')).toBeTruthy();
      expect(getByText('テスト記事2')).toBeTruthy();

      // 記事の場所が表示されていることを確認
      expect(getByText('東京')).toBeTruthy();
      expect(getByText('大阪')).toBeTruthy();

      // ヘッダータイトルが表示されていることを確認
      expect(getByText('Re:CoL')).toBeTruthy();
      expect(getByText('新着記事')).toBeTruthy();
    });

    test('記事が0件の場合の表示確認', async () => {
      // fetchArticleListをモックして空配列を返す
      mockFetchArticleList.mockResolvedValue([]);

      const { getByText } = render(<Home />, { wrapper: ThemeProvider });

      // ローディングが終わるまで待機
      await waitFor(() => {
        expect(mockFetchArticleList).toHaveBeenCalledTimes(1);
      });

      // ヘッダータイトルは表示されていることを確認
      expect(getByText('Re:CoL')).toBeTruthy();
      expect(getByText('新着記事')).toBeTruthy();
    });
  });

  describe('error test', () => {
    test('記事取得に失敗した場合の表示確認', async () => {
      // fetchArticleListをモックしてエラーを投げる
      mockFetchArticleList.mockRejectedValue(new Error('記事一覧の取得に失敗しました'));

      const { getByText } = render(<Home />, { wrapper: ThemeProvider });

      // ローディングが終わるまで待機
      await waitFor(() => {
        expect(mockFetchArticleList).toHaveBeenCalledTimes(1);
      });

      // エラーが発生してもヘッダータイトルは表示されていることを確認
      expect(getByText('Re:CoL')).toBeTruthy();
      expect(getByText('新着記事')).toBeTruthy();
    });
  });
});
