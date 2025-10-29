import { Article, ArticleType } from '@/src/features/article/types/Article';
import { fetchArticle } from '@/src/features/article/apis/fetchArticle';

// モジュール全体をMock化
jest.mock('@/src/features/article/apis/fetchArticle', () => ({
  fetchArticle: jest.fn(),
}));

describe('##### fetchArticle Test #####', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('success test.', () => {
    test('should fetch article successfully', async () => {
      // Mockデータの準備
      const mockArticleData: ArticleType = {
        id: 'test-id',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        publishedAt: '2024-01-01T00:00:00.000Z',
        revisedAt: '2024-01-01T00:00:00.000Z',
        title: 'Test Article',
        content: 'Test content',
        location: 'Tokyo',
        locationContentsList: [],
        productContentList: [],
      };

      const mockArticle = new Article(mockArticleData);

      // fetchArticle関数のMock実装
      (fetchArticle as jest.Mock).mockResolvedValue(mockArticle);

      // テスト実行
      const result = await fetchArticle('test-id');

      // 検証
      expect(result).toBe(mockArticle);
      expect(result).toBeInstanceOf(Article);
      expect(result.id).toBe('test-id');
    });
  });

  describe('error test.', () => {
    test('APIで任意のエラーが発生した場合', async () => {
      const error = new Error('Failed to fetch blog');
      (fetchArticle as jest.Mock).mockRejectedValue(error);

      await expect(fetchArticle('test-id')).rejects.toThrow('記事の取得に失敗しました');
    });
  });
});
