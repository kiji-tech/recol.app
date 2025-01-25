import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  icon: any;
  theme?: 'info' | 'danger' | 'warn' | 'theme' | 'background';
  onPress: () => void;
};
export default function IconButton({ icon, theme = 'theme', onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`
        h-12 w-12 rounded-full
        flex justify-center items-center
        bg-light-${theme} dark:bg-dark-${theme}
     `}
      >
        {icon}
      </View>
    </TouchableOpacity>
  );
}
