import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Posts } from '../types/Posts';
import { useAuth } from '@/src/features/auth';
import { useQuery } from 'react-query';
import { fetchCachePlace } from '../../map/apis/fetchCachePlace';
import { Place } from '../../map/types/Place';
import MediaViewer from '../../schedule/components/MediaViewer';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import PostsMenu from './PostsMenu';

type Props = {
  posts: Posts;
  onSelect: (place: Place) => void;
  onReport: (posts: Posts) => void;
};
export default function PostsItem({ posts, onSelect, onReport }: Props) {
  // === Member ===
  const { session } = useAuth();
  const { uid, place_id, body, created_at, medias, profile } = posts;
  // === Method ===
  /**
   * 表示する日時文字列を決定して返却する
   * @param date {string} 日時
   * @returns {string} 日時文字列
   */
  const toDateString = (date: string) => {
    const dayjsDate = dayjs(date);
    if (dayjsDate.isSame(dayjs(), 'day')) {
      return dayjsDate.format('H:mm');
    }
    return dayjsDate.format('YYYY-MM-DD H:mm');
  };

  // === Handler ===
  /**
   * ポップアップメニューを表示する
   */
  const handleMenu = () => {
    onReport(posts);
  };

  // === Query ===
  const { data: placeData, isLoading } = useQuery<Place[]>({
    queryKey: ['fetchPlaceInfo', place_id],
    queryFn: () => fetchCachePlace([place_id], session),
  });

  // === Memo ===
  const placeInfo = useMemo(() => placeData?.find((place) => place.id === place_id), [placeData]);
  const mediaUrlList = useMemo(() => {
    if (medias && medias.length > 0)
      return medias.map(
        (media) => `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/posts/${media}`
      );
    return placeInfo?.photos.map(
      (photo) =>
        `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(photo.name)}`
    );
  }, [medias, placeInfo]);

  // === Render ===
  if (!placeInfo) return <></>;
  return (
    <TouchableOpacity
      onPress={() => onSelect(placeInfo!)}
      className="flex flex-col justify-start items-start gap-2 py-4 pr-4 border-b border-gray-200 rounded w-full bg-light-background dark:bg-dark-background shadow-md"
    >
      {/* 画像（ユーザー or マップ） */}
      <View className="flex flex-row gap-2">
        <View className="w-1/4 mr-10">
          <MediaViewer mediaUrlList={mediaUrlList || []} />
        </View>
        <View className="flex-1 w-3/4">
          {/* アバター */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row gap-2 items-center justify-start">
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/avatars/${profile?.avatar_url}`,
                }}
                style={{
                  borderRadius: 100,
                  width: 32,
                  height: 32,
                }}
              />
              {/* 投稿者 */}
              <Text className="text-light-text dark:text-dark-text text-sm line-clamp-1">
                {profile?.display_name}@{profile?.uid.slice(0, 6)}
              </Text>
            </View>
            <PostsMenu onReport={() => onReport(posts)} />
          </View>
          {/* 投稿日時 */}
          <Text className="text-light-text dark:text-dark-text text-sm">
            {toDateString(created_at!)}
          </Text>
          {/* ロケーション情報 */}
          {/* 投稿内容 */}
          <Text className="text-light-text dark:text-dark-text text-sm ">{body}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
