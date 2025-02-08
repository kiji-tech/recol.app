import React from 'react';
import { View, Image, Text, TouchableOpacity, Linking, Touchable } from 'react-native';
import { Place, Review } from '../../../entities/Place';
import { reviewAIAnalyze } from '../../../apis/OpenAI';
import { useState } from 'react';
import RateViewer from '../../RateViewer';

type Props = {
  place: Place | null;
  selected: boolean;
  onSelect: (place: Place) => void;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
};
export default function PlaceCard({ place, selected = false, onSelect, onAdd, onRemove }: Props) {
  // ==== Member ====
  const [isAiNavigation, setIsAiNavigation] = useState(false);
  const [isAiText, setIsAiText] = useState('');

  // ==== Method ====

  const handleSelect = () => {
    if (place) onSelect(place);
  };


  // ==== Render ====
  if (!place) return null;

  return (
    <TouchableOpacity onPress={handleSelect}>
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
              {/* 評価 */}
              <RateViewer rating={place.rating} />
            </View>
            {/* description */}
            <Text className="text-ellipsis line-clamp-2">{place.editorialSummary?.text || ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
