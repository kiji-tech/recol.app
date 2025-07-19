import React from 'react';
import { Modal, Platform, View } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import ImageViewer from 'react-native-image-zoom-viewer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IconButton from '../Common/IconButton';

type MediaDetailModalProps = {
  imageList: string[];
  selectedImage: string | null;
  onClose: () => void;
};

export default function MediaDetailModal({
  imageList,
  selectedImage,
  onClose,
}: MediaDetailModalProps) {
  const { isDarkMode } = useTheme();
  if (imageList.length === 0) return null;
  return (
    <Modal visible={selectedImage != null} transparent={true}>
      <View className={`absolute ${Platform.OS === 'ios' ? 'top-28' : 'top-8'} left-4 z-50`}>
        <IconButton
          theme="background"
          icon={<AntDesign name="close" size={24} color={isDarkMode ? 'white' : 'black'} />}
          onPress={onClose}
        />
      </View>
      <View className={`flex-1 ${Platform.OS === 'ios' ? 'pt-16' : ''}`}>
        <ImageViewer
          imageUrls={imageList.map((item) => ({
            url: item,
          }))}
          index={imageList.findIndex((item) => item === selectedImage)}
        />
      </View>
    </Modal>
  );
}
