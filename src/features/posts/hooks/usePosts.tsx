import { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchPostsList } from '../apis/fetchPostsList';
import { useAuth } from '../../auth';
import { QueryParams } from '../../commons/QueryParams';
import { Posts } from '../types/Posts';

export const usePosts = () => {
  // === Member ===
  const { session } = useAuth();
  const [queryParams, setQueryParams] = useState<QueryParams>({ offset: 0, limit: 10 });

  // === Query ===
  const query = useQuery<Posts[]>({
    queryKey: ['fetchPostsList', queryParams],
    queryFn: () => fetchPostsList(queryParams, session),
  });

  return {
    ...query,
    queryParams,
    setQueryParams,
  };
};
