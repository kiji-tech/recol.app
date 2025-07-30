import { useEffect, useState } from 'react';
import { Article } from '@/src/entities/Article';
import { fetchArticleList } from '../apis/fetchArticleList';
import { LogUtil } from '@/src/libs/LogUtil';
export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchArticleList()
      .then(setArticles)
      .catch((error) => {
        LogUtil.log(error, { level: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { articles, loading };
};
