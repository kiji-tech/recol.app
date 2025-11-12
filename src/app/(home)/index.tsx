import React, { useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { usePlan } from '@/src/contexts/PlanContext';
import i18n from '@/src/libs/i18n';

export default function Home() {
  // === Member ===
  const { articles, loading } = useArticles();
  const { fetchPlan } = usePlan();
  const { currentInformation, isModalVisible, handleCloseModal } = useInformation();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  // === Method ===
  /**
   * 通知一覧画面へ遷移
   */
  const handleNotificationPress = (): void => {
    router.push('/(modal)/InformationList');
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      const ctrl = new AbortController();
      fetchPlan(ctrl);
      return () => {
        ctrl.abort();
      };
    }, [])
  );

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
          <Title text={i18n.t('SCREEN.HOME.TODAY_SCHEDULE')} />
          <TodayScheduleList />

          {/* 直近n日のプラン */}
          <Title text={i18n.t('SCREEN.HOME.RECENT_PLAN')} />
          <RecentPlanList />

          {/* 新着・おすすめ・旅行先・グッズ */}
          <Title text={i18n.t('SCREEN.HOME.NEW_ARTICLE')} />
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
