import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  text: string;
  theme?: 'theme' | 'info' | 'warn' | 'danger' | 'background';
  disabled: boolean;
  onPress: () => void;
}
const Button = ({
  text,
  theme = 'background',
  disabled = false,
  onPress = () => void 0,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        className={`
            ${disabled ? 'opacity-20' : ''}
            rounded-md w-full flex justify-center item-center py-4 px-8 bg-light-${theme} dark:bg-dark-${theme}
            `}
      >
              <Text className={`text-light-text dark:text-dark-text text-md text-center`}>{text} {disabled ? ' 非活性' : ' 活性'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
