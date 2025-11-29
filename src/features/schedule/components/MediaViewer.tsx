import React from 'react';
import { View, Text } from 'react-native';
import { Schedule } from '../types/Schedule';
import { Image } from 'expo-image';

type Props = {
  schedule: Schedule;
};

export default function MediaViewer({ schedule }: Props) {
  const mediaList = schedule.media_list.slice(0, 3);

  if (mediaList.length === 0) {
    return null;
  }

  const getTransform = (index: number, total: number) => {
    if (total === 1) return [{ rotate: '0deg' }];
    if (total === 2) {
      return index === 0
        ? [{ rotate: '-6deg' }, { translateX: -8 }, { translateY: 2 }]
        : [{ rotate: '5deg' }, { translateX: 8 }, { translateY: -2 }];
    }
    // total === 3
    if (index === 0) return [{ rotate: '-10deg' }, { translateX: -15 }, { translateY: 5 }];
    if (index === 1) return [{ rotate: '8deg' }, { translateX: 12 }, { translateY: -8 }];
    return [{ rotate: '-2deg' }, { translateX: 0 }, { translateY: 0 }];
  };

  return (
    <View className="w-full items-center justify-center py-4">
      <View className="relative w-full aspect-[4/3] items-center justify-center">
        {mediaList.map((media, index) => (
          <View
            key={media.uid || index}
            className="absolute w-full h-full overflow-hidden rounded-xl border-2 border-white bg-white shadow-md"
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
