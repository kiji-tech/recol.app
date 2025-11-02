import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { FlatList, View } from 'react-native';
import { Article } from '@/src/features/article';
import { ArticleCard } from '../../features/article/components/ArticleCard';
import { useArticles } from '@/src/features/article/hooks/useArticles';
import Title from '@/src/components/Title';
import MaskLoading from '@/src/components/MaskLoading';

export default function Home() {
  const { articles, loading } = useArticles();

  if (loading) {
    return <MaskLoading />;
  }

  return (
    <BackgroundView>
      <Header title="Re:CoL" />

      {/* 登録されているスケジュールで予定が近いものを5つくらい表示する */}

      {/* 新着・おすすめ・旅行先・グッズ */}
      <Title text="新着記事" />
      {/* 新着記事 */}
      <View className="w-full h-96">
        <FlatList
          data={articles}
          horizontal={true}
          contentContainerStyle={{ gap: 16 }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: Article) => item.id}
          renderItem={({ item }) => <ArticleCard item={item} />}
        />
      </View>
    </BackgroundView>
  );
}
