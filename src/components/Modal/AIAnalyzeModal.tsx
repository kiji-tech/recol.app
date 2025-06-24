import React from 'react';
import { Modal, View, Text } from 'react-native';
import Header from '../Header/Header';
import BackgroundView from '../BackgroundView';
import ModalLayout from './ModalLayout';

type Props = {
  open: boolean;
  onClose: () => void;
  text: string | null;
};
export default function AIAnalyzeModal({ open, onClose, text }: Props) {
  return (
    <Modal animationType="slide" visible={open} transparent={true}>
      <ModalLayout size="half" onClose={onClose}>
        <View className="absolute top-1/3 left-6">
          {text ? <Text>{text}</Text> : <Text>AI解析中...</Text>}
        </View>
      </ModalLayout>
    </Modal>
  );
}
