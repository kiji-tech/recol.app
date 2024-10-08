import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { bgFormColor, borderColor, shadowColor, textColor } from '../themes/ColorUtil';
import IconButton from './IconButton';
type Props = {
  onPress: () => void;
  children: React.ReactNode;
};
export default function BackButtonHeader({ onPress, children }: Props) {
  return (
    <View className="flex flex-row items-center w-full">
      <IconButton icon="arrow-back" onPress={onPress}></IconButton>
      <View className={`flex-1 w-full `}>{children}</View>
    </View>
  );
}
