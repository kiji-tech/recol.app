import React, { useState, useCallback } from 'react';
import { BackgroundView, Header } from '@/src/components';
import { Text, FlatList } from 'react-native';
import { fetchBlogList } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { Article } from '@/src/entities/Article';
import { ArticleCard } from './components/(Home)/ArticleCard';

export default function Home() {
  const { session } = useAuth();
  const [blogs, setBlogs] = useState<Article[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchBlogList().then((blogs) => {
        setBlogs(blogs);
      });
    }, [session])
  );

  return (
    <BackgroundView>
      <Header title="Re:CoL" />
      {/* TODO: タブバー */}
      {/* 新着・おすすめ・旅行先・グッズ */}
      <Text className="text-light-text dark:text-dark-text text-lg font-bold">新着記事</Text>
      {/* 新着記事 */}
      <FlatList
        data={blogs}
        keyExtractor={(item: Article) => item.id}
        renderItem={({ item }) => <ArticleCard item={item} />}
      />
    </BackgroundView>
  );
}
