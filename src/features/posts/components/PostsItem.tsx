import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/src/features/auth';
import { useQuery } from 'react-query';
import { Place, fetchCachePlace } from '@/src/features/map';
import { Image } from 'expo-image';
import MediaViewer from '@/src/features/schedule/components/MediaViewer';
import { Posts } from '@/src/features/posts/types/Posts';
import PostsMenu from '@/src/features/posts/components/PostsMenu';
import dayjs from '@/src/libs/dayjs';

type Props = {
  posts: Posts;
  onSelect: (place: Place) => void;
  onDelete: (posts: Posts) => void;
  onReport: (posts: Posts) => void;
};
export default function PostsItem({ posts, onSelect, onDelete, onReport }: Props) {
  // === Member ===
  const { session } = useAuth();
  const { place_id, body, created_at, medias, profile } = posts;

  // === Method ===
  /**
   * 表示する日時文字列を決定して返却する
   * @param date {string} 日時
   * @returns {string} 日時文字列
   */
  const toDateString = (date: string) => {
    return dayjs(date).fromNow();
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
      className="flex flex-row justify-start items-start gap-4 py-4 pr-4 border-b border-gray-200 w-full bg-light-background dark:bg-dark-background"
      onPress={() => onSelect(placeInfo!)}
    >
      {/* 画像（ユーザー or マップ） */}
      <View className="w-1/4 mr-6">
        <MediaViewer mediaUrlList={mediaUrlList || []} />
      </View>
      <View className="flex-1 flex-col justify-start items-between">
        <View className="flex flex-col justify-start items-start gap-2">
          {/* アバター */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row gap-2 flex-1 items-center justify-start">
              <Image
                cachePolicy="memory-disk"
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
              <View className="flex flex-1 flex-col items-start justify-start">
                <Text className="text-light-text dark:text-dark-text text-md font-bold">
                  {profile?.display_name}
                </Text>
                <Text className="text-light-text dark:text-dark-text text-sm">
                  @{profile?.uid.slice(0, 6)} {toDateString(created_at!)}
                </Text>
              </View>
            </View>
            <PostsMenu
              posts={posts}
              place={placeInfo}
              onDelete={() => onDelete(posts)}
              onReport={() => onReport(posts)}
            />
          </View>
          {/* 投稿内容 */}
          <Text className="text-light-text dark:text-dark-text text-md ">{body}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
