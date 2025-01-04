import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { bgFormColor, bgThemeColor, borderColor, textColor } from '../themes/ColorUtil';

type Props = {
  icon: string;
  onPress: () => void;
};
export default function IconButton({ icon, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`
        h-16 w-16 rounded-full
        flex justify-center items-center
        bg-light-background dark:bg-dark-background
     `}
      >
        {/* TODO  color . dark mode */}
        <MaterialIcons
          name={icon as any}
          size={18}
          className={`text-light-text dark:text-dark-text`}
          color="#000"
        />
      </View>
    </TouchableOpacity>
  );
}
