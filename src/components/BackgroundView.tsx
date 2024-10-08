import { Text, TouchableOpacity, View } from 'react-native';
import { backgroundColor } from '../themes/ColorUtil';

type Props = {
  children: React.ReactNode;
};
export default function BackgroundView({ children }: Props) {
  return (
    <View
      className={`flex flex-col justify-start items-start h-screen p-8 gap-8  bg-[#fff] dark:bg-[#1A0927]`}
    >
      {children}
    </View>
  );
}
