import React from 'react';
import { View, Text, Linking, Platform } from 'react-native';
import { Modal } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import Button from '@/src/components/Button';

interface ForceUpdateModalProps {
  visible: boolean;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({ visible }) => {
  const { isDarkMode } = useTheme();

  const handleUpdate = () => {
    const storeUrl = Platform.select({
      ios: process.env.EXPO_PUBLIC_IOS_STORE,
      android: process.env.EXPO_PUBLIC_ANDROID_STORE,
    });

    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // 強制アップデートなので閉じられない
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View
          className={`rounded-xl p-6 w-full max-w-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
          <Text
            className={`text-xl font-bold text-center mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            アプリの更新が必要です
          </Text>

          <Text
            className={`text-base text-center mb-6 leading-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            最新の機能とセキュリティアップデートを利用するために、アプリを更新してください。
          </Text>

          <Button text="ストアで更新する" onPress={handleUpdate} />
        </View>
      </View>
    </Modal>
  );
};
