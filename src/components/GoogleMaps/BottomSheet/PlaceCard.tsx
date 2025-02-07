import { View, Image, Text, TouchableOpacity, Linking, Touchable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Place, Review } from '../../../entities/Place';
import { reviewAIAnalyze } from '../../../apis/OpenAI';
import { useState } from 'react';
import AIAnalyzeModal from '../../Modal/AIAnalyzeModal';
import RateViewer from '../../RateViewer';
import IconButton from '../../IconButton';
import React from 'react';

type Props = {
  place: Place | null;
  selected: boolean;
  onAddPlace: (place: Place) => void;
  onRemovePlace: (place: Place) => void;
};
export default function PlaceCard({ place, selected = false, onAddPlace, onRemovePlace }: Props) {
  // ==== Member ====
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [isAiText, setIsAiText] = useState('');

  // ==== Method ====
  const handleAiAnalyze = async () => {
    if (!place) return;
    setIsAiText('');
    // reviewをまとめる
    if (!place.reviews) {
      alert('レビューがありません');
      return;
    }
    const reviews = place.reviews
      .map((review: Review) => {
        return `いつ： ${review.publishTime}
    評価：${review.rating}
    
    コメント：${review.text.text}
    `;
      })
      .join('\n\n');
    setIsAiNavigation(true);
    reviewAIAnalyze(reviews).then((text: string | null) => {
      console.log(text);
      setIsAiText(text || '');
    });
  };

  const handleAddPlace = async () => {
    if (place) onAddPlace(place);
  };
  const handleRemovePlace = async () => {
    if (place) onRemovePlace(place);
  };

  // ==== Render ====
  if (!place) return null;

  return (
    <View className="w-full bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border p-4">
      <View className="flex flex-row justify-start items-start gap-4">
        {/* イメージ画像 */}
        <Image
          className={`w-32 h-32`}
          src={
            place.photos
              ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`
              : ''
          }
        />
        <View className="flex-1 flex flex-col gap-2">
          <View className="flex flex-row justify-between items-center pr-4">
            {/* /title */}
            <Text className="text-lg font-bold">{place.displayName.text}</Text>
            {/* rate */}
            <RateViewer rating={place.rating} />
          </View>
          {/* description */}
          {/* TODO maxの指定 */}
          <Text>{place.editorialSummary?.text || ''}</Text>
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
            <IconButton
              icon={
                <MaterialCommunityIcons
                  name="robot"
                  size={18}
                  className={`text-light-text dark:text-dark-text`}
                />
              }
              onPress={handleAiAnalyze}
            />
            {selected ? (
              <TouchableOpacity
                className="p-2 w-32 bg-light-danger dark:bg-dark-danger rounded-3xl"
                onPress={handleRemovePlace}
              >
                <Text className="text-md p-2 text-center font-semibold">- 削除</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="p-2 w-32 bg-light-info dark:bg-dark-info rounded-3xl"
                onPress={handleAddPlace}
              >
                <Text className="text-md p-2 text-center font-semibold">＋追加</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
