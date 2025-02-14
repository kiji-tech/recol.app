import React from 'react';
import { View } from 'react-native';
import { Platform } from 'react-native';
const isIOS = Platform.OS === 'ios';

type Props = {
  children: React.ReactNode;
  isTabbar?: boolean;
};
export default function BackgroundView({ children, isTabbar = true }: Props) {
  return (
    <View
      className={`px-4 flex flex-col justify-start h-screen bg-light-background dark:bg-dark-background gap-8 pt-20 ${isTabbar && isIOS ? 'pb-14' : 'pb-16'}`}
    >
      {children}
    </View>
  );
}
