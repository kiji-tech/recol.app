import React from 'react';
import { View, Text, Modal, Linking, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/src/contexts';
import { Button } from '@/src/components';
import { Information } from '../types/Information';
import { LogUtil } from '@/src/libs/LogUtil';
import { useAuth } from '../../auth/hooks/useAuth';
import generateI18nMessage from '@/src/libs/i18n';

interface InformationModalProps {
  information: Information | null;
  visible: boolean;
  onClose: () => void;
}

/**
 * お知らせモーダルコンポーネント
 * @param {Information | null} information - 表示するお知らせデータ
 * @param {boolean} visible - モーダルの表示/非表示
 * @param {() => void} onClose - モーダルを閉じるコールバック
 */
export default function InformationModal({ information, visible, onClose }: InformationModalProps) {
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

      // エラーメッセージの統一
      if (error instanceof Error) {
        if (error.message.includes('Invalid URL')) {
          throw new Error(generateI18nMessage('FEATURE.INFORMATION.INVALID_URL'));
        }
      }

      throw error;
    }
  };

  if (!information) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View
          className={`rounded-xl p-6 w-full max-w-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 画像 */}
            {information.image && (
              <View className="mb-4 w-full">
                <Image
                  contentFit="contain"
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
            <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {information.title}
            </Text>

            {/* 本文 */}
            <Text
              className={`text-base mb-6 leading-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {information.body}
            </Text>

            {/* 詳細はこちらボタン */}
            {information.detailUrl && (
              <View className="mb-4">
                <Button
                  text={generateI18nMessage('FEATURE.INFORMATION.DETAIL')}
                  theme="info"
                  onPress={() => {
                    if (information.detailUrl) {
                      handleOpenDetail(information.detailUrl).catch((error) => {
                        LogUtil.log('Failed to open detail URL', {
                          level: 'error',
                          error: error as Error,
                        });
                      });
                    }
                  }}
                />
              </View>
            )}

            {/* 閉じるボタン */}
            <Button
              text={generateI18nMessage('FEATURE.INFORMATION.CLOSE')}
              theme="background"
              onPress={onClose}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
