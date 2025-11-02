import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  text: string;
  className?: string;
};

export default function Badge({ text, className = '' }: Props) {
  return (
    <View
      className={`rounded-full px-2 py-1 self-start bg-light-theme dark:bg-dark-theme ${className}`}
    >
      <Text className="text-xs font-medium text-light-text dark:text-dark-text">{text}</Text>
    </View>
  );
}
