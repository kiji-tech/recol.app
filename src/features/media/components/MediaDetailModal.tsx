import React from 'react';
import { Modal, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Image } from 'expo-image';
import { BackButton } from '@/src/components';

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
  if (imageList.length === 0) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="absolute top-16 left-4 z-50">
        <BackButton onPress={() => onClose()} />
      </View>
      <ImageViewer
        imageUrls={imageList.map((item) => ({
          url: item,
        }))}
        saveToLocalByLongPress={false}
        index={imageList.findIndex((item) => item === selectedImage)}
        renderImage={(props) => <Image {...props} className="rounded-xl h-full w-full" />}
        enableSwipeDown={true}
        onCancel={onClose}
        renderIndicator={(currentIndex, allSize) => (
          <RenderIndicator currentIndex={currentIndex} allSize={allSize} />
        )}
      />
    </Modal>
  );
}
