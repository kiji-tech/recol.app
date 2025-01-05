import { Modal, View, Text } from 'react-native';
import Header from '../Header/Header';
import BackgroundView from '../BackgroundView';

type Props = {
  open: boolean;
  onClose: () => void;
  text: string | null;
};
export default function AIAnalyzeModal({ open, onClose, text }: Props) {
  return (
    <Modal
      animationType="fade"
      visible={open}
      >
      <BackgroundView>
        <View className="absolute top-16">
          <Header onBack={onClose} />
        </View>
        <View className="absolute top-1/3 left-6">{text ? <Text>{text}</Text> : <Text>AI解析中...</Text>}</View>
      </BackgroundView>
    </Modal>
  );
}
