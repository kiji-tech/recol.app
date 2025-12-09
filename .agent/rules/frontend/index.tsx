import React from 'react';
import { View, Text } from 'react-native';
import { BackgroundView, Header } from '@/src/components';

export default function Page() {
  return (
    <BackgroundView>
      <Header title="Re:CoL" />
      <View className="flex-1 justify-center items-center">
        <Text>Hello World</Text>
      </View>
    </BackgroundView>
  );
}
