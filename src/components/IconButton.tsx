import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  icon: string;
  onPress: () => void;
};
export default function IconButton({ icon, onPress }: Props) {
  return (
    <TouchableOpacity
      className={`
        h-12 w-12 bg-gray-100 rounded-full
        flex justify-center items-center
     `}
      onPress={onPress}
    >
      <MaterialIcons name={icon as any} size={24} color="#25292e" className="" />
    </TouchableOpacity>
  );
}
