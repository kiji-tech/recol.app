import React from 'react';
import { ScrollView, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};
export default function BackgroundView({ children }: Props) {
  return (
    <View className={`h-screen bg-light-theme dark:bg-dark-theme`}>
      <ScrollView
        // bounces={false}
        contentContainerClassName="gap-4 px-8 pt-8 pb-22"
      >
        {children}
      </ScrollView>
    </View>
  );
}
