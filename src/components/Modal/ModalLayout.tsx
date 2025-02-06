import React from 'react';
import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  children: ReactNode;
  size: 'full' | 'half' | string;
  onClose: () => void;
};
export default function ModalLayout({ children, size, onClose }: Props): ReactNode {
  return (
    <View
      style={{ height: size == 'full' ? '92%' : size == 'half' ? '50%' : Number(size) }}
      className={`p-4 w-screen flex flex-col justify-start items-start gap-8
        shadow-lg
        bottom-0 absolute
    bg-light-background dark:bg-dark-border`}
    >
      <View className="w-full flex flex-row justify-end">
        <TouchableOpacity onPress={onClose}>
          <Text className="text-xl text-light-text dark:text-dark-text">Close</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}
