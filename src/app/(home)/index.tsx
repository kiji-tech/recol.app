import React from 'react';
import { BackgroundView, Header, IconButton } from '@/src/components';
import { FlatList, ScrollView, View } from 'react-native';
import { Article } from '@/src/features/article';
import { ArticleCard } from '../../features/article/components/ArticleCard';
import { TodayScheduleList } from '@/src/features/schedule';
import { useArticles } from '@/src/features/article/hooks/useArticles';
import { useInformation, InformationModal } from '@/src/features/information';
import RecentPlanList from '@/src/features/plan/components/recentPlan/RecentPlanList';
import MaskLoading from '@/src/components/MaskLoading';
import Title from '@/src/components/Title';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function Home() {
  const { articles, loading } = useArticles();
  const { currentInformation, isModalVisible, handleCloseModal } = useInformation();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  /**
   * 通知一覧画面へ遷移
   */
  const handleNotificationPress = (): void => {
    router.push('/(modal)/InformationList');
  };

  if (loading) {
    return <MaskLoading />;
  }

  return (
    <BackgroundView>
      <Header
        title="Re:CoL"
        rightComponent={
          <IconButton
            theme="background"
            icon={
              <MaterialIcons
                name="notifications"
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            }
            onPress={handleNotificationPress}
          />
        }
      />
      <ScrollView>
        <View className="flex flex-col justify-start items-start gap-2">
          {/* 登録されているスケジ ュールで予定が近いものを5つくらい表示する */}
          <Title text="本日の予定" />
          <TodayScheduleList />

          {/* 直近n日のプラン */}
          <Title text="直近の予定" />
          <RecentPlanList />

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
