import { View } from 'react-native';
import IconButton from './IconButton';
type Props = {
  onPress: () => void;
  children?: React.ReactNode;
  isDummy?: boolean;
};
export default function BackButtonHeader({ onPress, children, isDummy = false }: Props) {
  return (
    <View className="flex flex-row justify-center items-center w-full">
      <IconButton icon="arrow-back" onPress={onPress}></IconButton>
      <View className={`flex-1 w-full `}>{children}</View>
      {isDummy && <View className="w-12 h-12"></View>}
    </View>
  );
}
