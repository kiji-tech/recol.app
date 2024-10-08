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
            rounded-md w-full flex justify-center item-center py-2 px-4 bg-light-theme dark:bg-dark-theme shadow-md
            `}
      >
        <Text className={`text-light-text dark:text-dark-text text-md text-center`}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
