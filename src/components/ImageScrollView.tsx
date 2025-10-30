import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';

type Props = {
  images: { src: string; alt: string }[];
  onPress?: (image: { src: string; alt: string }) => void;
};

export default function ImageScrollView({ images, onPress }: Props) {
  return (
    <View className="w-screen overflow-x-auto scrollbar-hide scroll-smooth my-4 pr-4">
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            className="flex-none w-60 h-40 mr-4"
            onPress={() => onPress?.(image)}
          >
            <Image
              cachePolicy="memory-disk"
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
