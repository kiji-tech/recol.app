import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Place } from '../../types/Place';
import { Title, ImageScrollView, IconButton, MaskLoading } from '@/src/components';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useTheme } from '@/src/contexts';
import { RateViewer, useMap } from '@/src/features/map';
import MediaDetailModal from '@/src/features/media/components/MediaDetailModal';

type Props = {
  isEdit?: boolean;
  onDirection?: () => void;
  onPost?: () => void;
};
export default function PlaceBottomSheetBody({ isEdit = false, onDirection, onPost }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const {
    isSearchLoading,
    selectedPlace,
    selectedPlaceList,
    doAddSelectedPlace,
    doRemoveSelectedPlace,
  } = useMap();
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // === Member ===
  const placePhotos = (selectedPlace?.photos ?? []).filter((photo) => photo.name).slice(0, 5);

  // === Method ===
  /**
   * 写真を選択した時の処理
   * @param image {string} 選択した写真のURL
   * @returns {void}
   */
  const handleSelectedImage = (image: string) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  // === Render ===
  return (
    <>
      <View className="w-full flex-1 px-4">
        <BottomSheetScrollView className="w-full flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex flex-col justify-start items-start gap-4 pb-8">
            {isSearchLoading && <MaskLoading />}
            <View className="flex flex-row justify-between items-start gap-4">
              <Title text={selectedPlace?.displayName.text || ''} />
            </View>
            {/* 写真一覧 */}
            {placePhotos.length > 0 && (
              <ImageScrollView
                images={placePhotos.map((photo) => ({
                  src: `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(photo.name)}`,
                  alt: selectedPlace?.displayName.text || '',
                }))}
                onPress={(photo) => handleSelectedImage(photo.src)}
              />
            )}
            <View className="flex flex-row justify-between items-center gap-4">
              {/* 評価 */}
              <RateViewer rating={selectedPlace?.rating || 0} />
              {/* ボタングループ */}
              <View className="flex-1 flex flex-row justify-end items-center gap-4">
                {selectedPlace?.websiteUri && (
                  <IconButton
                    icon={
                      <MaterialCommunityIcons
                        name={selectedPlace?.websiteUri.includes('instagram') ? 'instagram' : 'web'}
                        size={18}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    }
                    theme="theme"
                    onPress={() => Linking.openURL(selectedPlace?.websiteUri || '')}
                  />
                )}
                {selectedPlace?.googleMapsUri && (
                  <IconButton
                    icon={
                      <FontAwesome5
                        name="map-marker-alt"
                        size={18}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    }
                    theme="theme"
                    onPress={() => Linking.openURL(selectedPlace?.googleMapsUri || '')}
                  />
                )}
                {onDirection && (
                  <IconButton
                    icon={
                      <FontAwesome5
                        name="directions"
                        size={16}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    }
                    theme="theme"
                    onPress={onDirection}
                  />
                )}
                {onPost && (
                  <IconButton
                    icon={
                      <FontAwesome5
                        name="location-arrow"
                        size={16}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    }
                    theme="theme"
                    onPress={onPost}
                  />
                )}

                {isEdit &&
                  selectedPlaceList.findIndex((place: Place) => place.id === selectedPlace?.id) >=
                    0 && (
                    <IconButton
                      icon={
                        <FontAwesome5
                          name="trash"
                          size={16}
                          color={isDarkMode ? 'white' : 'black'}
                        />
                      }
                      theme="danger"
                      onPress={() => doRemoveSelectedPlace(selectedPlace!)}
                    />
                  )}
                {isEdit &&
                  selectedPlaceList.findIndex((place: Place) => place.id === selectedPlace?.id) ===
                    -1 && (
                    <IconButton
                      icon={
                        <FontAwesome6 name="add" size={16} color={isDarkMode ? 'white' : 'black'} />
                      }
                      theme="info"
                      onPress={() => doAddSelectedPlace(selectedPlace!)}
                    />
                  )}
              </View>
            </View>

            {/* 詳細 */}
            <Text className="text-ellipsis text-light-text dark:text-dark-text text-lg">
              {selectedPlace?.editorialSummary?.text || ''}
            </Text>

            {/* 営業時間 */}
            {selectedPlace?.currentOpeningHours && (
              <Text className="text-xl font-semibold text-light-text dark:text-dark-text">
                営業時間
              </Text>
            )}
            {selectedPlace?.currentOpeningHours &&
              selectedPlace?.currentOpeningHours.weekdayDescriptions.map((weekday: string) => (
                <Text key={weekday} className="text-nowrap text-light-text dark:text-dark-text">
                  {weekday}
                </Text>
              ))}
            {/* 予約 */}
          </View>
        </BottomSheetScrollView>
      </View>
      {/* 写真拡大モーダル */}
      <MediaDetailModal
        imageList={placePhotos.map(
          (photo) =>
            `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(photo.name)}`
        )}
        visible={imageModalVisible}
        selectedImage={selectedImage}
        onClose={() => {
          setSelectedImage(null);
          setImageModalVisible(false);
        }}
      />
    </>
  );
}
