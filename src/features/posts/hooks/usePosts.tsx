import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { fetchPostsList } from '../apis/fetchPostsList';
import { useAuth } from '../../auth';
import { QueryParams } from '../../commons/QueryParams';
import { Posts } from '../types/Posts';
import { deletePosts } from '../apis/deletePosts';
import { Toast } from 'toastify-react-native';
import { LogUtil } from '@/src/libs/LogUtil';

export const usePosts = () => {
  const LIMIT_NUM = 10;
  // === Member ===
  const { session, profile } = useAuth();
  const [queryParams, setQueryParams] = useState<QueryParams>({ offset: 0, limit: LIMIT_NUM });
  const [posts, setPosts] = useState<Posts[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ==== Method ===
  /**
   * 投稿一覧をリセットする
   */
  const reset = async () => {
    await fetchPosts(true);
  };

  /**
   * 重複を除いた配列を返す
   * @param prevPosts 既存の投稿
   * @param newPosts 新しい投稿
   * @returns 重複を除いた配列
   */
  const getUniqueMergedPosts = (prevPosts: Posts[], newPosts: Posts[]): Posts[] => {
    const currentPostUids = new Set(prevPosts.map((post) => post.uid));
    const uniqueNewPosts = newPosts.filter((newPost) => !currentPostUids.has(newPost.uid));
    return [...prevPosts, ...uniqueNewPosts];
  };

  /**
   * 投稿を取得する
   * @param isReset trueの場合、offsetを0にリセットして最初の投稿を取得する
   */
  const fetchPosts = useCallback(
    async (isReset: boolean = false) => {
      const option = isReset ? { offset: 0, limit: LIMIT_NUM } : queryParams;
      setIsLoading(true);
      try {
        const data = await fetchPostsList(option);
        if (isReset) setPosts(data);
        else {
          setPosts((prev) => {
            return getUniqueMergedPosts(prev, data);
          });
        }
        setQueryParams((prev) => ({ offset: prev.offset! + LIMIT_NUM, limit: LIMIT_NUM }));
      } catch (e) {
        LogUtil.log(e, { level: 'warn' });
      } finally {
        setIsLoading(false);
      }
    },
    [queryParams]
  );

  // ==== Mutate ===
  /**
   * 投稿を削除する
   */
  const deleteMutate = useMutation({
    mutationFn: (posts: Posts) => deletePosts(posts, session),
    onSuccess: () => {
      Toast.warn('削除しました.');
    },
    onError: () => {
      Toast.warn('削除に失敗しました.');
    },
  });

  return {
    fetchPosts,
    isLoading,
    queryParams,
    setQueryParams,
    posts,
    reset,
    deleteMutate,
  };
};
