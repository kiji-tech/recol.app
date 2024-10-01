import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  text: string;
  theme?: 'primary' | 'secondary' | 'info' | 'warn' | 'danger';
  onPress: () => void;
}
const Button = ({ text, theme = 'primary', onPress = () => void 0 }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`
            rounded-md w-full flex justify-center item-center py-2 px-4
            bg-light-${theme}-base dark:bg-dark-${theme}-base 
            hover:bg-light-${theme}-hover dark:hover:bg-dark-${theme}-hover
            shadow-md
            `}
      >
        <Text className={`text-gray-0 dark:text-gray-100 text-md text-center`}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
