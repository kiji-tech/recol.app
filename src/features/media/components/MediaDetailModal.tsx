import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Image } from 'expo-image';
import ModalLayout from '../../../components/ModalLayout';

type MediaDetailModalProps = {
  imageList: string[];
  selectedImage: string | null;
  visible?: boolean;
  onClose: () => void;
};

const RenderIndicator = ({
  currentIndex,
  allSize,
}: {
  currentIndex: number | undefined;
  allSize: number | undefined;
}) => {
  return (
    <Text className="text-light-text dark:text-dark-text">
      {currentIndex ? currentIndex + 1 : 0} / {allSize ? allSize : 0}
    </Text>
  );
};

export default function MediaDetailModal({
  imageList,
  selectedImage,
  visible = true,
  onClose,
}: MediaDetailModalProps) {
  const { isDarkMode } = useTheme();
  if (imageList.length === 0) return null;
  return (
    <ModalLayout visible={visible} size="full" onClose={onClose}>
      <View className="flex-1">
        <ImageViewer
          imageUrls={imageList.map((item) => ({
            url: item,
          }))}
          saveToLocalByLongPress={false}
          index={imageList.findIndex((item) => item === selectedImage)}
          renderImage={(props) => <Image {...props} className="rounded-xl h-full w-full" />}
          enableSwipeDown={true}
          enablePreload={true}
          onCancel={onClose}
          renderIndicator={(currentIndex, allSize) => (
            <RenderIndicator currentIndex={currentIndex} allSize={allSize} />
          )}
          backgroundColor={isDarkMode ? '#1a1a1a' : 'white'}
        />
      </View>
    </ModalLayout>
  );
}
