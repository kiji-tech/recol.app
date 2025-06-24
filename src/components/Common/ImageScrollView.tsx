import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
  images: { src: string; alt: string }[];
};

export default function ImageScrollView({ images }: Props) {
  return (
    <View className="w-screen overflow-x-auto scrollbar-hide scroll-smooth my-4 px-4">
      <ScrollView horizontal={true}>
        {images.map((image, index) => (
          <View key={index} className="flex-none w-60 h-40 mr-4">
            <Image
              source={image.src || '/placeholder.svg'}
              alt={image.alt}
              className="w-full h-full object-cover rounded-lg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
