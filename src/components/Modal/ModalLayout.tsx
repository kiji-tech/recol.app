import React, { useEffect } from 'react';
import { ReactNode } from 'react';
import { Modal, Text, TouchableOpacity } from 'react-native';
import BackgroundView from '../BackgroundView';
import { BackHandler } from 'react-native';

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
      style={{ height: size == 'full' ? '92%' : size == 'half' ? '50%' : Number(size) }}
      className={`w-screen flex flex-col justify-start items-start gap-8
    bg-light-background dark:bg-dark-border`}
    >
      <BackgroundView>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-xl text-light-text dark:text-dark-text">Close</Text>
        </TouchableOpacity>
        {children}
      </BackgroundView>
    </Modal>
  );
}
