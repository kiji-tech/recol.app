import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome5 } from '@expo/vector-icons';
import { Article } from '@/src/entities/Article';
import { Badge } from '@/src/components';
import { openBrowser } from '@/src/features/article/libs';

// 定数
const IMAGE_WIDTH = '100%';
const IMAGE_HEIGHT = 256;
const IMAGE_RADIUS = 8;
const MAP_MARKER_COLOR = '#f87171';

// 日付フォーマット関数
const formatPublishedDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

// location表示判定
const hasLocation = (location: string) => {
  return location && location.length > 0;
};

/**
 * 記事カードコンポーネント
 * @param {Article} item - 記事データ
 */
export const ArticleCard: React.FC<{ item: Article }> = ({ item }) => {
  return (
    <TouchableOpacity
      className="flex flex-col bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border border rounded-md mb-4"
      onPress={() => openBrowser(item)}
      accessibilityLabel={`記事: ${item.title}`}
    >
      {/* アイキャッチ画像 */}
      {item.eyecatch?.url && (
        <Image
          cachePolicy="memory-disk"
          source={{ uri: item.eyecatch.url }}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            resizeMode: 'cover',
            borderTopRightRadius: IMAGE_RADIUS,
            borderTopLeftRadius: IMAGE_RADIUS,
          }}
        />
      )}
      <View className="gap-2 p-4 flex flex-col items-start justify-start">
        {/* 上段 */}
        <View className="flex-1 gap-2 flex flex-col items-start justify-start">
          {/* カテゴリバッジ */}
          <Badge text={item.category?.name || ''} />
          {/* タイトル */}
          <Text className="text-md color-light-text dark:color-dark-text line-clamp-2">
            {item.title}
          </Text>
        </View>
        {/* 下段 */}
        <View className="flex-row-reverse items-center justify-between w-full">
          {/* 日付 */}
          <Text className="text-xs color-light-text dark:color-dark-text">
            {formatPublishedDate(item.publishedAt)}
          </Text>
          {/* 場所（旅行系の場合） */}
          {hasLocation(item.location) && (
            <View className="flex-row items-center justify-start">
              <FontAwesome5
                name="map-marker-alt"
                size={14}
                color={MAP_MARKER_COLOR}
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm color-light-text dark:color-dark-text">{item.location}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
