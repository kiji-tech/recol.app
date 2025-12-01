import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { fetchPostsList } from '../apis/fetchPostsList';
import { useAuth } from '../../auth';
import { QueryParams } from '../../commons/QueryParams';
import { Posts } from '../types/Posts';
import { deletePosts } from '../apis/deletePosts';
import { Toast } from 'toastify-react-native';

export const usePosts = () => {
  const LIMIT_NUM = 10;
  // === Member ===
  const { session } = useAuth();
  const [queryParams, setQueryParams] = useState<QueryParams>({ offset: 0, limit: LIMIT_NUM });
  const [posts, setPosts] = useState<Posts[]>([]);

  const reset = () => {
    setQueryParams({ offset: 0, limit: LIMIT_NUM });
    setPosts([]);
    query.refetch();
  };

  // === Query ===
  const query = useQuery({
    queryKey: ['fetchPostsList'],
    queryFn: () => {
      fetchPostsList(queryParams, session).then((data) => {
        setPosts((prev) => {
          const currentPostUids = new Set(prev.map((post) => post.uid));
          const uniqueNewPosts = data.filter((newPost) => !currentPostUids.has(newPost.uid));
          return [...prev, ...uniqueNewPosts];
        });
        setQueryParams((prev) => ({ offset: prev.offset! + LIMIT_NUM, limit: LIMIT_NUM }));
      });
    },
  });

  // ==== Mutate ===
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
    ...query,
    queryParams,
    setQueryParams,
    posts,
    reset,
    deleteMutate,
  };
};
