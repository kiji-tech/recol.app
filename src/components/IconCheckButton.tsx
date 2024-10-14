import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { bgFormColor, bgThemeColor, borderColor, textColor } from '../themes/ColorUtil';

type Props = {
  icon: string;
  checked: boolean;
  onPress: () => void;
};
export default function IconCheckButton({ icon, checked, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`
        h-12 w-12 rounded-full
        flex justify-center items-center
        bg-light-background dark:bg-dark-background
        ${checked ? 'opacity-100' : 'opacity-50'}
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
