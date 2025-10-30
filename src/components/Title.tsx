import React from 'react';
import { Text } from 'react-native';

type Props = {
  text: string;
};

export default function Title({ text }: Props) {
  return (
    <Text className="text-3xl w-fit font-semibold text-light-text dark:text-dark-text">{text}</Text>
  );
}
