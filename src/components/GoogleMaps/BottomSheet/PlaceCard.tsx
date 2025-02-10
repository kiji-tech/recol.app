import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Place } from '../../../entities/Place';
import RateViewer from '../../RateViewer';

type Props = {
  place: Place | null;
  selected: boolean;
  onSelect: (place: Place) => void;
};
export default function PlaceCard({ place, selected = false, onSelect }: Props) {
  // ==== Member ====

  // ==== Method ====

  const handleSelect = () => {
    if (place) onSelect(place);
  };

  // ==== Render ====
  if (!place) return null;

  return (
    <TouchableOpacity onPress={handleSelect}>
      <View
        className={`w-full bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border`}
      >
        <View className="flex flex-row justify-start items-start gap-4 h-32">
          {/* イメージ画像 */}
          {place.photos && place.photos.length > 0 ? (
            <Image
              className={`w-32 h-32`}
              src={
                place.photos
                  ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&maxWidthPx=1980`
                  : ''
              }
            />
          ) : (
            // TODO: No Imageに差し替え
            <View className="h-32 w-32 bg-light-shadow"></View>
          )}
          <View className="flex-1 flex flex-col gap-2">
            <View className="flex flex-row justify-between items-center pr-4">
              {/* /title */}
              <View className="w-3/5">
                <Text
                  className={`text-lg ${selected ? 'font-bold text-light-danger dark:text-dark-danger' : 'font-semibold'}`}
                >
                  {place.displayName.text}
                </Text>
              </View>
              <View className="flex-1 flex-row justify-end items-center">
                {/* 評価 */}
                <RateViewer rating={place.rating} />
              </View>
            </View>
            {/* description */}
            <Text className="text-ellipsis line-clamp-2">{place.editorialSummary?.text || ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
