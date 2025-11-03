import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { FlatList, ScrollView, View } from 'react-native';
import { Article } from '@/src/features/article';
import { ArticleCard } from '../../features/article/components/ArticleCard';
import { TodayScheduleList } from '@/src/features/schedule';
import { useArticles } from '@/src/features/article/hooks/useArticles';
import { useInformation, InformationModal } from '@/src/features/information';
import MaskLoading from '@/src/components/MaskLoading';
import Title from '@/src/components/Title';

export default function Home() {
  const { articles, loading } = useArticles();
  const { currentInformation, isModalVisible, handleCloseModal } = useInformation();

  if (loading) {
    return <MaskLoading />;
  }

  return (
    <BackgroundView>
      <Header title="Re:CoL" />
      <ScrollView>
        <View className="flex flex-col justify-start items-start gap-2">
          {/* 登録されているスケジ ュールで予定が近いものを5つくらい表示する */}
          <Title text="本日の予定" />
          <TodayScheduleList />

          {/* 新着・おすすめ・旅行先・グッズ */}
          <Title text="新着記事" />
          {/* 新着記事 */}
          <View className="w-full mb-8">
            <FlatList
              data={articles}
              horizontal={true}
              contentContainerStyle={{ gap: 16 }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Article) => item.id}
              renderItem={({ item }) => <ArticleCard item={item} />}
            />
          </View>
        </View>
      </ScrollView>
      <InformationModal
        information={currentInformation}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </BackgroundView>
  );
}
