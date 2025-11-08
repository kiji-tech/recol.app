import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { BackgroundView, Header } from '@/src/components';
import { useInformationList, InformationModal } from '@/src/features/information';
import InformationCard from '@/src/features/information/components/InformationCard';
import { Information } from '@/src/features/information/types/Information';
import { useTheme } from '@/src/contexts/ThemeContext';
import MaskLoading from '@/src/components/MaskLoading';

/**
 * お知らせ一覧画面
 */
export default function InformationList() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { informationList, loading, loadingMore, error, handleEndReached, refresh } =
    useInformationList();
  const [selectedInformation, setSelectedInformation] = useState<Information | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  /**
   * お知らせカードをタップしたときの処理
   * @param {Information} information - 選択されたお知らせデータ
   */
  const handleCardPress = (information: Information): void => {
    setSelectedInformation(information);
    setIsModalVisible(true);
  };

  /**
   * モーダルを閉じる
   */
  const handleCloseModal = (): void => {
    setIsModalVisible(false);
    setSelectedInformation(null);
  };

  /**
   * お知らせカードをレンダリング
   * @param {Object} param0 - レンダリングパラメータ
   * @param {Information} param0.item - お知らせデータ
   */
  const renderItem = ({ item }: { item: Information }) => {
    return <InformationCard information={item} onPress={() => handleCardPress(item)} />;
  };

  /**
   * フッターをレンダリング（ローディング表示用）
   */
  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={isDarkMode ? '#ffffff' : '#000000'} />
      </View>
    );
  };

  /**
   * 空の状態をレンダリング
   */
  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          お知らせがありません
        </Text>
      </View>
    );
  };

  /**
   * エラー状態をレンダリング
   */
  const renderError = () => {
    if (!error) {
      return null;
    }
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className={`text-lg ${isDarkMode ? 'text-dark-danger' : 'text-light-danger'}`}>
          エラーが発生しました
        </Text>
        <Text className={`text-sm mt-2 ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
          {error.message}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <MaskLoading />;
  }

  return (
    <BackgroundView>
      <Header
        title="お知らせ"
        onBack={() => {
          router.back();
        }}
      />
      {error ? (
        renderError()
      ) : (
        <FlatList
          data={informationList}
          keyExtractor={(item: Information) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshing={loading}
          onRefresh={refresh}
        />
      )}
      <InformationModal
        information={selectedInformation}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </BackgroundView>
  );
}
