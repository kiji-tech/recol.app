import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MediaDetailModal } from '@/src/features/media';

type Props = {
  mediaUrlList: string[];
};

export default function MediaViewer({ mediaUrlList }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const mediaViewList = mediaUrlList.slice(0, 3).reverse();
  if (mediaViewList.length === 0) {
    return null;
  }
  // === Method ===
  /**
   * 画像を配置する位置を返す
   * @param index {number}
   * @param total {number}
   * @returns {Array<{rotate: string, translateX: number, translateY: number}>}
   */
  const getTransform = (index: number, total: number) => {
    if (total === 1) return [{ rotate: '0deg' }];
    if (total === 2) {
      return index === 0
        ? [{ rotate: '-6deg' }, { translateX: -8 }, { translateY: 12 }]
        : [{ rotate: '5deg' }, { translateX: 8 }, { translateY: -12 }];
    }
    // total === 3
    if (index === 0) return [{ rotate: '-10deg' }, { translateX: 18 }, { translateY: 32 }];
    if (index === 1) return [{ rotate: '8deg' }, { translateX: 12 }, { translateY: -24 }];
    return [{ rotate: '-2deg' }, { translateX: 0 }, { translateY: 8 }];
  };

  // === Handler ===
  const handleCloseImageView = () => {
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        className="z-50 w-full items-center justify-center py-4"
        onPress={() => setIsOpen(true)}
      >
        <View className="relative w-full aspect-[4/3] items-center justify-center">
          {mediaViewList.map((mediaUrl, index) => (
            <View
              key={`media-${index}`}
              className="absolute w-full h-full overflow-hidden rounded-xl border-2 border-white bg-white shadow-md"
              style={{
                zIndex: index + 20,
                transform: getTransform(index, mediaViewList.length) as any,
                elevation: 5,
              }}
            >
              <Image
                cachePolicy="memory-disk"
                source={{
                  uri: mediaUrl,
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
      </TouchableOpacity>
      <MediaDetailModal
        visible={isOpen}
        imageList={mediaUrlList || []}
        selectedImage={mediaUrlList[0]}
        onClose={handleCloseImageView}
      />
    </>
  );
}
