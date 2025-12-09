import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Linking } from 'react-native';
import { Title, IconButton, ModalLayout, ImageScrollView } from '@/src/components';
import { Place, RateViewer } from '@/src/features/map';
import { MediaDetailModal } from '@/src/features/media';
import { useTheme } from '@/src/contexts';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
  place: Place;
  isEdit?: boolean;
  selected?: boolean;
  onAdd?: (place: Place) => void;
  onRemove?: (place: Place) => void;
  onDirection?: () => void;
  onClose: () => void;
};
export default function PlaceDetailModal({
  place,
  isEdit = false,
  selected,
  onAdd,
  onRemove,
  onDirection,
  onClose,
}: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

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
      {/* ロケーション名 */}
      <ModalLayout size="full" visible={!imageModalVisible} onClose={onClose}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-col justify-start items-start gap-4">
            <View className="flex flex-row justify-between items-start gap-4">
              <Title text={place.displayName.text} />
            </View>
            {/* 写真一覧 */}
            {place.photos && (
              <ImageScrollView
                images={place.photos
                  .filter((photo) => photo.name)
                  .slice(0, 5)
                  .map((photo) => ({
                    src: `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(photo.name)}`,
                    alt: place.displayName.text,
                  }))}
                onPress={(photo) => handleSelectedImage(photo.src)}
              />
            )}
            <View className="flex flex-row justify-between items-center gap-4">
              {/* 評価 */}
              <RateViewer rating={place.rating} />
              {/* ボタングループ */}
              <View className="flex-1 flex flex-row justify-end items-center gap-4">
                {place.websiteUri && (
                  <IconButton
                    icon={
                      <MaterialCommunityIcons
                        name={place.websiteUri.includes('instagram') ? 'instagram' : 'web'}
                        size={18}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    }
                    theme="theme"
                    onPress={() => Linking.openURL(place.websiteUri)}
                  />
                )}
                {place.googleMapsUri && (
                  <IconButton
                    icon={
                      <FontAwesome5
                        name="map-marker-alt"
                        size={18}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    }
                    theme="theme"
                    onPress={() => Linking.openURL(place.googleMapsUri)}
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

                {onRemove && isEdit && selected && (
                  <IconButton
                    icon={
                      <FontAwesome5 name="trash" size={16} color={isDarkMode ? 'white' : 'black'} />
                    }
                    theme="danger"
                    onPress={() => onRemove && onRemove(place)}
                  />
                )}
                {onAdd && isEdit && !selected && (
                  <IconButton
                    icon={
                      <FontAwesome6 name="add" size={16} color={isDarkMode ? 'white' : 'black'} />
                    }
                    theme="info"
                    onPress={() => onAdd && onAdd(place)}
                  />
                )}
              </View>
            </View>

            {/* 詳細 */}
            <Text className="text-ellipsis text-light-text dark:text-dark-text text-lg">
              {place.editorialSummary?.text || ''}
            </Text>

            {/* 営業時間 */}
            {place.currentOpeningHours && (
              <Text className="text-xl font-semibold text-light-text dark:text-dark-text">
                営業時間
              </Text>
            )}
            {place.currentOpeningHours &&
              place.currentOpeningHours.weekdayDescriptions.map((weekday) => (
                <Text key={weekday} className="text-nowrap text-light-text dark:text-dark-text">
                  {weekday}
                </Text>
              ))}
            {/* 予約 */}
          </View>
        </ScrollView>
      </ModalLayout>
      {/* 写真拡大モーダル */}
      <MediaDetailModal
        imageList={place.photos
          .filter((photo) => photo.name)
          .slice(0, 5)
          .map(
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
