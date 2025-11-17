import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Information } from '../types/Information';
import { useTheme } from '@/src/contexts/ThemeContext';
import { LogUtil } from '@/src/libs/LogUtil';
import dayjs from 'dayjs';
import { useAuth } from '../../auth/hooks/useAuth';

interface InformationCardProps {
  information: Information;
  onPress?: () => void;
}

/**
 * お知らせカードコンポーネント
 * @param {InformationCardProps} props - プロパティ
 */
export default function InformationCard({ information, onPress }: InformationCardProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  /**
   * 詳細ページをブラウザで開く
   * @param {string} detailUrl - 詳細ページのURL
   */
  const handleOpenDetail = async (detailUrl: string): Promise<void> => {
    try {
      const supported = await Linking.canOpenURL(detailUrl);

      if (supported) {
        await Linking.openURL(detailUrl);
      } else {
        throw new Error('Invalid URL');
      }
    } catch (error) {
      LogUtil.log(JSON.stringify({ openDetailError: error }), {
        level: 'error',
        notify: true,
        user,
      });
    }
  };

  /**
   * カードをタップしたときの処理
   */
  const handlePress = (): void => {
    if (onPress) {
      onPress();
    } else if (information.detailUrl) {
      handleOpenDetail(information.detailUrl);
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-xl p-4 mb-4 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } border border-light-border dark:border-dark-border`}
      onPress={handlePress}
    >
      {/* 画像 */}
      {information.image && (
        <View className="mb-3 w-full">
          <Image
            cachePolicy="memory-disk"
            source={{ uri: information.image.url }}
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'cover',
              borderRadius: 8,
            }}
          />
        </View>
      )}

      {/* タイトル */}
      <Text className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {information.title}
      </Text>

      {/* 本文 */}
      <Text
        className={`text-sm mb-3 leading-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
        numberOfLines={3}
      >
        {information.body}
      </Text>

      {/* 日付 */}
      <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {dayjs(information.startAt).format('YYYY年MM月DD日')}
      </Text>

      {/* 詳細リンク */}
      {information.detailUrl && (
        <Text className={`text-xs mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          詳細を見る →
        </Text>
      )}
    </TouchableOpacity>
  );
}
