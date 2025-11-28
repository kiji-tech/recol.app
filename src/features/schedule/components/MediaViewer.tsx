import React from 'react';
import { View, Text } from 'react-native';
import { Schedule } from '../types/Schedule';
import { Image } from 'expo-image';

type Props = {
  schedule: Schedule;
};

const CARD_WIDTH = 120;
const CARD_HEIGHT = 160;

export default function MediaViewer({ schedule }: Props) {
  const mediaList = schedule.media_list.slice(0, 3);

  if (mediaList.length === 0) {
    return null;
  }

  const getTransform = (index: number, total: number) => {
    if (total === 1) return [{ rotate: '0deg' }];
    if (total === 2) {
      return index === 0
        ? [{ rotate: '-5deg' }, { translateX: -10 }]
        : [{ rotate: '5deg' }, { translateX: 10 }];
    }
    // total === 3
    if (index === 0) return [{ rotate: '-15deg' }, { translateX: -20 }, { translateY: 10 }];
    if (index === 1) return [{ rotate: '0deg' }, { translateY: -10 }];
    return [{ rotate: '15deg' }, { translateX: 20 }, { translateY: 10 }];
  };

  return (
    <View className="h-[200px] w-full items-center justify-center">
      <View className="relative h-[160px] w-[120px] items-center justify-center">
        {mediaList.map((media, index) => (
          <View
            key={media.uid || index}
            className="absolute h-[160px] w-[120px] overflow-hidden rounded-xl border-2 border-white bg-white shadow-md"
            style={{
              zIndex: index + 20,
              transform: getTransform(index, mediaList.length) as any,
              elevation: 5,
            }}
          >
            {/* <Text>{media.uid}</Text> */}
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${media.url}`,
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
              contentFit="cover"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
