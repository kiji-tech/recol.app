import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onPress?: () => void;
}
const CancelButton = ({ onPress = () => void 0 }: Props) => {
  const handler = () => {
    router.back();
  };
  return (
    <TouchableOpacity onPress={handler}>
      <View
        className={`border-[1px] rounded-md w-full flex justify-center item-center py-2 px-4 bg-gray-100 shadow-md border-gray-50 `}
      >
        <Text className={`text-gray-0 text-md `}>キャンセル</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CancelButton;
