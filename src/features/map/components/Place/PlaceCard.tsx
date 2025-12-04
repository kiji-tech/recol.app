import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Place } from '@/src/features/map/types/Place';
import RateViewer from '@/src/features/map/components/Place/RateViewer';

type Props = {
  place: Place;
  selected: boolean;
  onSelect: (place: Place) => void;
};
export default function PlaceCard({ place, selected = false, onSelect }: Props) {
  // ==== Member ====
  const source = `${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(place?.photos[0]?.name || '')}`;

  // ==== Method ====

  const handleSelect = () => {
    if (place) onSelect(place);
  };

  // ==== Render ====
  if (!place) return null;

  return (
    <TouchableOpacity onPress={handleSelect}>
      <View className="flex flex-row justify-start items-start gap-4 h-40 bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border">
        {/* イメージ画像 */}
        {place.photos && place.photos.length > 0 ? (
          <Image
            cachePolicy="memory-disk"
            source={source}
            style={{
              width: 140,
              height: 140,
            }}
          />
        ) : (
          // TODO: No Imageに差し替え
          <View className="h-32 w-32 bg-light-shadow"></View>
        )}
        <View className="flex-1 flex flex-col gap-2">
          <View className="flex flex-row justify-between items-center pr-4">
            {/* /title */}
            <Text
              className={`text-lg ${selected ? 'font-bold text-light-danger dark:text-dark-danger' : 'text-light-text dark:text-dark-text font-semibold'}`}
            >
              {place.displayName.text}
            </Text>
          </View>
          {/* 評価 */}
          <RateViewer rating={place.rating} />
          {/* description */}
          <View>
            <Text className="line-clamp-1 text-light-text dark:text-dark-text text-sm">
              {place.editorialSummary?.text || ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
