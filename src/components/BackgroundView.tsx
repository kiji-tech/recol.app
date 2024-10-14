import { Text, TouchableOpacity, View } from 'react-native';
import { backgroundColor, bgThemeColor } from '../themes/ColorUtil';

type Props = {
  children: React.ReactNode;
};
export default function BackgroundView({ children }: Props) {
  return (
    <View
      className={`flex flex-col justify-start items-start h-screen p-8 gap-8 bg-light-theme dark:bg-dark-theme`}
    >
      {children}
    </View>
  );
}
