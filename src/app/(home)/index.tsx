import React, { useState, useCallback } from 'react';
import { BackgroundView, Loading } from '@/src/components';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { fetchBlogList } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { Article } from '@/src/entities/Article';
import { useTheme } from '@/src/contexts/ThemeContext';
import { CommonUtil } from '@/src/libs/CommonUtil';
import { FontAwesome5 } from '@expo/vector-icons';

// アイテム型定義
// ストレージのキー

export default function Home() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const { isThemeLoaded } = useTheme();

  const [blogs, setBlogs] = useState<Article[]>([]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBlogList()
        .then((blogs) => {
          setBlogs(blogs);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [session])
  );

  if (loading) return <Loading />;

  return (
    <BackgroundView>
      {/* TODO: タブバー */}
      {/* 新着・おすすめ・旅行先・グッズ */}
      <>
        <Text className="text-light-text dark:text-dark-text text-lg font-bold">新着記事</Text>

        <FlatList
          data={blogs}
          keyExtractor={(item: Article) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex flex-row border-light-border dark:border-dark-border border rounded-md mb-4"
              onPress={() =>
                CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/articles/${item.id}`)
              }
            >
              {/* アイキャッチ */}
              {item.eyecatch?.url && (
                <Image
                  source={{ uri: item.eyecatch.url }}
                  style={{
                    width: 176,
                    height: 128,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                />
              )}
              {/* 右側 */}
              <View className="flex-1 gap-2 p-4 flex flex-col items-start justify-between">
                {/* 上段 */}
                <View className="flex-1 gap-2 flex flex-col items-start justify-start">
                  <View className="flex-row items-center justify-start gap-2 bg-light-theme dark:bg-dark-theme rounded-full px-2 py-1">
                    <Text className="text-xs color-light-text dark:color-dark-text">
                      {item.category?.name}
                    </Text>
                  </View>
                  {/* タイトル */}
                  <Text className="text-sm color-light-text dark:color-dark-text line-clamp-2">
                    {item.title}
                  </Text>
                </View>
                {/* 下段 */}
                <View className="flex-row-reverse items-center justify-between w-full">
                  {/* 日付 */}
                  <Text className="text-xs color-light-text dark:color-dark-text">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </Text>
                  {/* 場所（旅行系の場合） */}
                  {item.location.length > 0 && (
                    <View className="flex-row items-start justify-start">
                      <FontAwesome5
                        name="map-marker-alt"
                        size={14}
                        color="#f87171"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-xs color-light-text dark:color-dark-text">
                        {item.location}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </>
    </BackgroundView>
  );
}
