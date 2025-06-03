import React, { useState } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Place, Review } from '@/src/entities/Place';
import { Text, View, Linking } from 'react-native';
import Header from '../../Header/Header';
import RateViewer from './RateViewer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import IconButton from '../../Common/IconButton';
import { reviewAIAnalyze } from '@/src/apis/OpenAI';
import Loading from '../../Loading';
import ImageScrollView from '../../Common/ImageScrollView';
import { useTheme } from '@/src/contexts/ThemeContext';
import Button from '../../Common/Button';
type Props = {
  place: Place;
  selected: boolean;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
  onClose: () => void;
};
export default function PlaceDetail({ place, selected, onAdd, onRemove, onClose }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiText, setAiText] = useState('');

  // === Method ===
  /** AIによるレビュー解析の結果取得 */
  const fetchAiText = async () => {
    setIsAiNavigation(true);
    if (!place.reviews) {
      setAiText('レビューがありません');
      return;
    }
    setIsAiLoading(true);

    const reviews = place.reviews
      .map((review: Review) => {
        return `いつ： ${review.publishTime}
評価：${review.rating}
コメント：${review.text.text}
        `;
      })
      .join('\n\n');

    // AI実行
    reviewAIAnalyze(reviews).then((text: string | null) => {
      setAiText(text || '');
      setIsAiLoading(false);
    });
  };

  const handleAdd = () => {
    if (place) onAdd(place);
  };

  const handleRemove = () => {
    if (place) onRemove(place);
  };

  // ==== Render ====
  return (
    <BottomSheetScrollView className="bg-light-background dark:bg-dark-background">
      {/* TODO: スクロールできるようにする｡ */}
      {/* TODO: 画像を選択､拡大表示*/}
      {/* 写真一覧 */}
      {place.photos && (
        <ImageScrollView
          images={place.photos
            .filter((photo) => photo.name)
            .map((photo) => ({
              src: `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`,
              alt: place.displayName.text,
            }))}
        />
      )}
      <View className="flex flex-col justify-start items-start p-4 gap-4  pb-40">
        {/* ロケーション名 */}
        <Header
          title={place.displayName.text}
          onBack={onClose}
          rightComponent={
            selected ? (
              <IconButton
                icon={
                  <FontAwesome5 name="trash" size={16} color={isDarkMode ? 'white' : 'black'} />
                }
                theme="danger"
                onPress={handleRemove}
              />
            ) : (
              <IconButton
                icon={<FontAwesome6 name="add" size={16} color={isDarkMode ? 'white' : 'black'} />}
                theme="info"
                onPress={handleAdd}
              />
            )
          }
        />
        {/* 評価 */}
        <RateViewer rating={place.rating} />

        {/* 詳細 */}
        <Text className="text-ellipsis text-light-text dark:text-dark-text">
          {place.editorialSummary?.text || ''}
        </Text>

        {/* AIレビュー */}
        <Text className="text-xl font-semibold text-light-text dark:text-dark-text">
          レビュー要約({place.reviews.length}件)
        </Text>
        {!isAiNavigation && (
          <Button text="AIで店舗のレビューを要約する" theme="info" onPress={fetchAiText} />
        )}
        {isAiNavigation && !isAiLoading && (
          <Text className={`text-light-text dark:text-dark-text`}>{aiText}</Text>
        )}
        {isAiNavigation && isAiLoading && (
          <View className="w-full h-36">
            <Loading />
          </View>
        )}

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
        </View>
      </View>
    </BottomSheetScrollView>
  );
}
