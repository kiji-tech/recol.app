import React, { useCallback, useMemo, useState } from 'react';
import { BackgroundView, Header, IconButton } from '@/src/components';
import { fetchArticleList } from '@/src/features/article';
import { useInformation, InformationModal } from '@/src/features/information';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { usePlan } from '@/src/contexts/PlanContext';
import { Plan } from '@/src/features/plan';
import PostsList from '@/src/features/posts/components/PostsList';
import { Place, useMap } from '@/src/features/map';
import PlaceBottomSheet from '@/src/features/map/components/PlaceBottomSheet/PlaceBottomSheet';
import PostsReportModal from '@/src/features/posts/components/PostsReportModal';
import { Posts } from '@/src/features/posts/types/Posts';
import { SafeAreaView } from 'react-native';

export default function Home() {
  // === Member ===
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { storagePlanList, planLoading, refetchPlanList, planList } = usePlan();
  const { currentInformation, isModalVisible, handleCloseModal } = useInformation();
  const { doSelectedPlace } = useMap();
  const [selectedPosts, setSelectedPosts] = useState<Posts | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDetailPlace, setIsDetailPlace] = useState(false);
  const viewPlanList = useMemo<Plan[]>(() => {
    if (planLoading) return storagePlanList || [];
    return planList || [];
  }, [planLoading, planList, storagePlanList]);

  const { data: articles } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticleList,
  });
  // === Method ===
  /**
   * 通知一覧画面へ遷移
   */
  const handleNotificationPress = (): void => {
    router.push('/(modal)/InformationList');
  };

  /**
   * 選択した投稿の場所を表示する
   * @param place {Place} 選択した投稿の場所
   */
  const handleSelectPlace = (place: Place) => {
    doSelectedPlace(place);
    setIsDetailPlace(true);
  };

  /**
   * 投稿を報告する
   * @param posts {Posts} 投稿
   */
  const handleReport = (posts: Posts) => {
    setSelectedPosts(posts);
    setIsReportOpen(true);
  };

  /**
   * 投稿報告モーダルを閉じる
   */
  const handleReportModalClose = () => {
    setIsReportOpen(false);
    setSelectedPosts(null);
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      refetchPlanList();
    }, [])
  );

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
      <PostsList onSelect={handleSelectPlace} onReport={handleReport} />
      {isReportOpen && (
        <PostsReportModal
          isOpen={isReportOpen}
          onClose={handleReportModalClose}
          posts={selectedPosts!}
        />
      )}
      <InformationModal
        information={currentInformation}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
      {isDetailPlace && (
        <PlaceBottomSheet
          isEdit={false}
          onClose={() => setIsDetailPlace(false)}
          bottomSheetRef={null}
        />
      )}
    </BackgroundView>
  );
}
