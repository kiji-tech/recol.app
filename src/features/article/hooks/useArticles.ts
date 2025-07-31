import { useEffect, useState } from 'react';
import { Article } from '../types/Article';
import { fetchArticleList } from '../libs/fetchArticleList';
import { LogUtil } from '../../../libs/LogUtil';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchArticleList()
      .then(setArticles)
      .catch((error) => {
        // エラーログはlibs関数内で処理済み
        LogUtil.log('Failed to fetch articles in hook', {
          level: 'error',
          error: error as Error,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { articles, loading };
};
