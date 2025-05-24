import React, { useState, useCallback } from 'react';
import { BackgroundView, Loading } from '@/src/components';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { fetchBlogList } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { MyBannerAd } from '@/src/components/Ad/BannerAd';
import { AD_INTERVAL } from '@/src/libs/ConstValue';
import { Blog } from '@/src/entities/Blog';
import { useTheme } from '@/src/contexts/ThemeContext';
import { CommonUtil } from '@/src/libs/CommonUtil';

// アイテム型定義
// ストレージのキー

export default function Home() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const { textColor, isThemeLoaded } = useTheme();

  const [blogs, setBlogs] = useState<Blog[]>([]);

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

  if (!blogs || !isThemeLoaded) return <Loading />;

  return (
    <BackgroundView>
      {/* TODO: タブバー */}
      {/* 新着・おすすめ・旅行先・グッズ */}

      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item: Blog) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => (
            <>
              <TouchableOpacity
                style={{ flexDirection: 'row', marginBottom: 16 }}
                onPress={() =>
                  CommonUtil.openBrowser(`${process.env.EXPO_PUBLIC_WEB_URI}/articles/${item.id}`)
                }
              >
                {item.eyecatch?.url && (
                  <Image
                    source={{ uri: item.eyecatch.url }}
                    style={{ width: 120, height: 96, borderRadius: 8, marginRight: 12 }}
                  />
                )}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>
                    {item.title}
                  </Text>
                  <Text style={{ color: textColor, marginTop: 4 }}>
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
              {index % AD_INTERVAL === 5 && <MyBannerAd />}
            </>
          )}
        />
      )}
    </BackgroundView>
  );
}
