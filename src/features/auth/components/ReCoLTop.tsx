import React from 'react';
import { Text } from 'react-native';
import { Image } from 'expo-image';

export default function ReCoLTop() {
  return (
    <>
      <Text className="text-4xl font-bold text-light-text dark:text-dark-text">
        Welcome to the Re:CoL
      </Text>
      <Image
        cachePolicy="memory-disk"
        source={require('../../../../assets/images/icon.png')}
        style={{
          width: 208,
          height: 208,
          borderRadius: 100,
          marginBottom: 16,
        }}
      />
    </>
  );
}
