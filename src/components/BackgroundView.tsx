import React from 'react';
import { View } from 'react-native';

type Props = {
  children: React.ReactNode;
};
export default function BackgroundView({ children }: Props) {
  return (
    <View className="px-4 flex flex-col justify-start h-screen bg-light-background dark:bg-dark-background gap-8 pb-32">
      {children}
    </View>
  );
}
