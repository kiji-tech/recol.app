import React from 'react';
import { Image, View } from 'react-native';
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
              src={image.src || '/placeholder.svg'}
              alt={image.alt}
              className="w-full h-full object-cover rounded-lg  duration-300"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
