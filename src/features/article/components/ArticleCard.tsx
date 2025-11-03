import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome5 } from '@expo/vector-icons';
import { Article, openBrowser } from '@/src/features/article';
import { Badge } from '@/src/components';

// 定数
const IMAGE_WIDTH = '100%';
const IMAGE_HEIGHT = 128;
const IMAGE_RADIUS = 4;
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
      className="flex flex-col bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border border rounded-md w-60"
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
      <View className="flex flex-col gap-2 p-4 justify-between flex-1">
        {/* 冗談 カテゴリ タイトル */}
        <View className="flex flex-col gap-2">
          {/* カテゴリバッジ */}
          <View className="flex flex-row items-center justify-between">
            <Badge text={item.category?.name || ''} />
            {/* 日付 */}
            <Text className="text-xs color-light-text dark:color-dark-text opacity-80">
              {formatPublishedDate(item.publishedAt)}
            </Text>
          </View>
          {/* タイトル */}
          <Text
            className="text-sm color-light-text dark:color-dark-text"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
        </View>
        {/* 下段 ロケーション 日付 */}
        <View className="flex flex-row justify-between items-center">
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
          {/* 提供者 */}
          {/* TODO: 今後外部などから提供される場合は変更する */}
          <Text className="text-xs color-light-text dark:color-dark-text opacity-70">
            Re:CoL公式
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
