import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { FlatList } from 'react-native';
import { Article } from '@/src/features/article';
import { ArticleCard } from './components/ArticleCard';
import Title from '@/src/components/Common/Title';
import { useArticles } from '@/src/features/article/hooks/useArticles';
import MaskLoading from '@/src/components/MaskLoading';

export default function Home() {
  const { articles, loading } = useArticles();

  if (loading) {
    return <MaskLoading />;
  }

  return (
    <BackgroundView>
      <Header title="Re:CoL" />
      {/* TODO: タブバー */}
      {/* 新着・おすすめ・旅行先・グッズ */}
      <Title text="新着記事" />
      {/* 新着記事 */}
      <FlatList
        data={articles}
        keyExtractor={(item: Article) => item.id}
        renderItem={({ item }) => <ArticleCard item={item} />}
      />
    </BackgroundView>
  );
}
