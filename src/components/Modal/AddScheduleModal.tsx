import {View, Modal } from 'react-native';
import BackgroundView from '../BackgroundView';
import Header from '../Header/Header';

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function AddScheduleModal({ open, onClose }: Props) {
  return (
    <Modal animationType="fade" visible={open}>
      <BackgroundView>
        <View className="absolute top-16 px-4">
          <Header onBack={onClose} />
        </View>
      </BackgroundView>
    </Modal>
  );
}
