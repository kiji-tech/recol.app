import React from 'react';
import { View, Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

type Props = {
  children?: React.ReactNode;
  isTabbar?: boolean;
};
export default function BackgroundView({ children, isTabbar = true }: Props) {
  return (
    <View
      className={`px-2 flex flex-col justify-start h-full bg-light-background dark:bg-dark-background gap-8 ${isTabbar && isIOS ? 'pt-20' : 'pt-4'}`}
    >
      {children}
    </View>
  );
}
