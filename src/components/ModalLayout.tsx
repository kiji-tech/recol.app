import React, { useEffect } from 'react';
import { ReactNode } from 'react';
import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import BackgroundView from './BackgroundView';
import { BackHandler } from 'react-native';
import BackButton from './BackButton';

type Props = {
  children: ReactNode;
  size: 'full' | 'half' | string;
  visible: boolean;
  onClose: () => void;
};
export default function ModalLayout({ children, visible = true, size, onClose }: Props): ReactNode {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      style={{ height: size == 'full' ? '92%' : size == 'half' ? '50%' : Number(size) }}
    >
      <SafeAreaView className="h-screen w-screen bg-light-background dark:bg-dark-background">
        <BackButton onPress={onClose} />
        {children}
      </SafeAreaView>
    </Modal>
  );
}
