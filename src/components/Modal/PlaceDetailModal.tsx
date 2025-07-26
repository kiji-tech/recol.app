import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Linking } from 'react-native';
import ModalLayout from './ModalLayout';
import { Place } from '@/src/entities/Place';
import MediaDetailModal from './MediaDetailModal';
import { useTheme } from '@/src/contexts/ThemeContext';
import ImageScrollView from '../Common/ImageScrollView';
import IconButton from '../Common/IconButton';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import RateViewer from '../GoogleMaps/BottomSheet/RateViewer';

type Props = {
  place: Place;
  isEdit?: boolean;
  selected?: boolean;
  onAdd?: (place: Place) => void;
  onRemove?: (place: Place) => void;
  onClose: () => void;
};
export default function PlaceDetailModal({
  place,
  isEdit = false,
  selected,
  onAdd,
  onRemove,
  onClose,
}: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // === Method ===
  const handleSelectedImage = (image: string) => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  // === Render ===
  return (
    <>
      {/* ロケーション名 */}
      <ModalLayout size="full" visible={!imageModalVisible} onClose={onClose}>
        <ScrollView>
          <View className="flex flex-col justify-start items-start gap-4">
            <View className="flex flex-row justify-between items-center gap-4">
              <Text className="text-xl flex-1 font-semibold text-light-text dark:text-dark-text">
                {place.displayName.text}
              </Text>
              {/* ボタングループ */}
              <View className="flex flex-row justify-start items-center gap-4">
                {place.websiteUri && (
                  <IconButton
                    icon={
                      <MaterialCommunityIcons
                        name="web"
                        size={18}
                        className={`text-light-text dark:text-dark-text`}
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
                        name="map-marked-alt"
                        size={18}
                        className={`text-light-text dark:text-dark-text`}
                      />
                    }
                    theme="theme"
                    onPress={() => Linking.openURL(place.googleMapsUri)}
                  />
                )}
                {isEdit && selected && (
                  <IconButton
                    icon={
                      <FontAwesome5 name="trash" size={16} color={isDarkMode ? 'white' : 'black'} />
                    }
                    theme="danger"
                    onPress={() => onRemove && onRemove(place)}
                  />
                )}
                {isEdit && !selected && (
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
            {/* 評価 */}
            <RateViewer rating={place.rating} />
            {/* 詳細 */}
            <Text className="text-ellipsis text-light-text dark:text-dark-text">
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
