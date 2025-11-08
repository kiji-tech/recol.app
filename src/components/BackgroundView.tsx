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
      className={`flex flex-col justify-start h-full bg-[#f7f7f7] dark:bg-black ${isTabbar && isIOS ? 'pt-20' : 'pt-4'} px-2`}
    >
      {children}
    </View>
  );
}
