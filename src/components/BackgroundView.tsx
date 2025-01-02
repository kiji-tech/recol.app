import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};
export default function BackgroundView({ children }: Props) {
  return (
    <View className={`w-screen h-screen`}>
      <ScrollView
        // bounces={false}
        contentContainerClassName="py-2 px-4 flex-1"
      >
        {children}
      </ScrollView>
    </View>
  );
}
