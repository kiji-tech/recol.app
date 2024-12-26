import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IconButton from './IconButton';
import { Href, useRouter } from 'expo-router';
import React from 'react';
type Props = {
  url: Href<string | object>;
};
export default function BackButton({ url }: Props) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.navigate(url);
      }}
    >
      <View className="w-12 h-12 rounded-3xl flex-1 justify-center items-center bg-light-background dark:bg-dark-background mr-8">
        <MaterialIcons name="arrow-back" size={24} color="#25292e" />
      </View>
    </TouchableOpacity>
  );
}
