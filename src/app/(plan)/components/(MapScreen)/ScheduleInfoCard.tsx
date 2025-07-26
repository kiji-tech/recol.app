import React, { useMemo } from 'react';
import { Place } from '@/src/entities/Place';
import { Tables } from '@/src/libs/database.types';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { RateViewer } from '@/src/components';

type ScheduleInfoCardProps = {
  schedule: Tables<'schedule'>;
  onPress: (place: Place) => void;
};

export default function ScheduleInfoCard({ schedule, onPress }: ScheduleInfoCardProps) {
  const placeList = useMemo(() => {
    return (schedule.place_list as unknown as Place[]) || [];
  }, [schedule]);

  // === Render ===
  if (placeList.length === 0) return null;
  return (
    <View className="flex flex-row gap-2">
      {placeList.map((place) => (
        <TouchableOpacity
          key={place.id}
          className="flex flex-col gap-2 rounded-md mr-4 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border w-80"
          onPress={() => onPress(place)}
        >
          {place.photos && place.photos.length > 0 && (
            <Image
              style={{
                width: '100%',
                height: 128,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
              source={`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/cache/google-place/photo/${encodeURIComponent(place.photos[0].name || '')}`}
            />
          )}
          <View className="px-4 py-2 flex flex-col gap-2">
            {/* タイトル */}
            <Text className="text-light-text dark:text-dark-text text-md w-full">
              {place.displayName.text}
            </Text>
            {/* 評価 */}
            <RateViewer rating={place.rating || 0} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
