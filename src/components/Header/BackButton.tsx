import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
type Props = {
  onPress: () => void;
};
export default function BackButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-12 h-12 rounded-3xl justify-center flex items-center bg-light-background dark:bg-dark-background">
        <MaterialIcons name="arrow-back" size={24} color="#25292e" />
      </View>
    </TouchableOpacity>
  );
}
