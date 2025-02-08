import React, { useEffect, useState } from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Place, Review } from '@/src/entities/Place';
import { Image, Text, View, Linking, TouchableOpacity } from 'react-native';
import RateViewer from '../../RateViewer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import IconButton from '../../IconButton';
import Header from '../../Header/Header';
import { reviewAIAnalyze } from '@/src/apis/OpenAI';
import Loading from '../../Loading';
type Props = {
  place: Place;
  selected: boolean;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
  onClose: () => void;
};
export default function PlaceDetail({ place, selected, onAdd, onRemove, onClose }: Props) {
  console.log(JSON.stringify(place));
  // === Member ===
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [aiText, setAiText] = useState('');

  // === Method ===
  /** AIによるレビュー解析の結果取得 */
  const fetchAiText = async () => {
    if (!place.reviews) {
      setIsAiNavigation(false);
      setAiText('レビューがありません');
    }

    const reviews = place.reviews
      .map((review: Review) => {
        return `いつ： ${review.publishTime}
        評価：${review.rating}
        
        コメント：${review.text.text}
        `;
      })
      .join('\n\n');
    reviewAIAnalyze(reviews).then((text: string | null) => {
      setAiText(text || '');
      setIsAiNavigation(true);
    });
  };

  const handleAdd = () => {
    if (place) onAdd(place);
  };

  const handleRemove = () => {
    if (place) onRemove(place);
  };

  // ==== Effect ====
  useEffect(() => {
    if (!place) return;
    fetchAiText();
  }, [place]);

  // ==== Render ====
  return (
    <BottomSheetScrollView className="bg-light-background dark:bg-dark-background">
      {/* TODO: スクロールできるようにする｡ */}
      {/* TODO: 画像を選択､拡大表示*/}
      {/* 写真一覧 */}
      <View className="flex flex-row justify-start items-center gap-4 overflow-x-scroll">
        {place.photos &&
          place.photos.map((photo) => {
            return (
              <Image
                key={photo.name}
                className={`w-[80%] h-60 `}
                src={`https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`}
              />
            );
          })}
      </View>
      <View className="flex flex-col justify-start items-start p-4 gap-4  pb-40">
        {/* ロケーション名 */}
        <Header
          title={place.displayName.text}
          onBack={onClose}
          rightComponent={
            selected ? (
              <IconButton
                icon={<FontAwesome5 name="trash" size={16} />}
                theme="danger"
                onPress={handleRemove}
              />
            ) : (
              <IconButton
                icon={<FontAwesome6 name="add" size={16} />}
                theme="info"
                onPress={handleAdd}
              />
            )
          }
        />
        {/* 評価 */}
        <RateViewer rating={place.rating} />

        {/* 詳細 */}
        <Text className="text-ellipsis">{place.editorialSummary?.text || ''}</Text>

        {/* AIレビュー */}
        <Text className="text-xl font-semibold">AIレビュー要約</Text>
        {isAiNavigation ? (
          <Text>{aiText}</Text>
        ) : (
          <View className="w-full h-36">
            <Loading />
          </View>
        )}

        {/* 営業時間 */}
        {place.currentOpeningHours && <Text className="text-xl font-semibold">営業時間</Text>}
        {place.currentOpeningHours &&
          place.currentOpeningHours.weekdayDescriptions.map((weekday) => (
            <Text key={weekday} className="text-nowrap">
              {weekday}
            </Text>
          ))}
        {/* 予約 */}

        {/* ボタングループ */}
        <View className="flex flex-row justify-start items-center gap-4">
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
        </View>
      </View>
    </BottomSheetScrollView>
  );
}
