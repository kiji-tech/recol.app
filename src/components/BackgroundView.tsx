import React from 'react';
import { View } from 'react-native';
import { Platform } from 'react-native';
const isIOS = Platform.OS === 'ios';

type Props = {
  children: React.ReactNode;
};
export default function BackgroundView({ children }: Props) {
  return (
    <View
      className={`px-4 flex flex-col justify-start h-screen bg-light-background dark:bg-dark-background gap-8 ${isIOS ? 'pb-36' : 'pb-24'}`}
    >
      {children}
    </View>
  );
}
