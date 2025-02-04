import React from 'react';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { borderColor, textColor } from '../themes/ColorUtil';

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
        className={`border rounded-md w-full flex justify-center item-center py-2 px-4 ${borderColor} bg-[#fff]`}
      >
        <Text className={`text-md ${{ textColor }} `}>キャンセル</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CancelButton;
