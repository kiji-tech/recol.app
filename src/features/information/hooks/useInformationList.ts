import { useCallback, useEffect, useState, useRef } from 'react';
import { Information } from '../types/Information';
import { fetchInformationListPaginated } from '../apis/fetchInformationListPaginated';
import { LogUtil } from '../../../libs/LogUtil';
import { useAuth } from '../../auth/hooks/useAuth';

const LIMIT = process.env.EXPO_PUBLIC_INFORMATION_LIST_LIMIT
  ? parseInt(process.env.EXPO_PUBLIC_INFORMATION_LIST_LIMIT)
  : 10;

/**
 * お知らせ一覧管理用のカスタムフック（インフィニティスクロール対応）
 */
export const useInformationList = () => {
  const [informationList, setInformationList] = useState<Information[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const informationListRef = useRef<Information[]>([]);
  const { user } = useAuth();
  /**
   * お知らせ一覧を初期取得
   */
  const fetchInitialInformationList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { informationList, totalCount: count } = await fetchInformationListPaginated(0, LIMIT);
      setInformationList(informationList);
      informationListRef.current = informationList;
      setTotalCount(count);
      setHasMore(informationList.length < count);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch information list');
      setError(error);
      LogUtil.log(JSON.stringify({ fetchInitialInformationListError: error }), {
        level: 'error',
        notify: true,
        user,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 追加のお知らせ一覧を取得
   */
  const fetchMoreInformationList = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setError(null);
    try {
      const offset = informationListRef.current.length;
      const { informationList, totalCount: count } = await fetchInformationListPaginated(
        offset,
        LIMIT
      );

      if (informationList.length === 0) {
        setHasMore(false);
      } else {
        const newList = [...informationListRef.current, ...informationList];
        setInformationList(newList);
        informationListRef.current = newList;
        setTotalCount(count);
        setHasMore(newList.length < count);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch more information list');
      setError(error);
      LogUtil.log(JSON.stringify({ fetchMoreInformationListError: error }), {
        level: 'error',
        notify: true,
        user,
      });
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore]);

  /**
   * スクロール終了時に追加取得
   */
  const handleEndReached = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchMoreInformationList();
    }
  }, [loadingMore, hasMore, fetchMoreInformationList]);

  useEffect(() => {
    fetchInitialInformationList();
  }, [fetchInitialInformationList]);

  return {
    informationList,
    loading,
    loadingMore,
    hasMore,
    error,
    totalCount,
    fetchMoreInformationList,
    handleEndReached,
    refresh: fetchInitialInformationList,
  };
};
