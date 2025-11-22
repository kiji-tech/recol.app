import React from 'react';
import { Text, View } from 'react-native';
import { Button, ModalLayout } from '@/src/components';
import Title from '@/src/components/Title';
import { useAuth } from '../../auth';
import { useMap } from '../hooks/useMap';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export default function RateLimitModal({ isOpen, onClose }: Props) {
  // === Member ===
  const { profile } = useAuth();
  const { clearRateLimitCount } = useMap();

  // === Method ===

  // === Handle ===
  const handleMovieButtonPress = () => {
    // TODO: 動画を視聴 視聴完了後にリミット制限をリセットしてモーダルを閉じる
    clearRateLimitCount();
    onClose();
  };

  return (
    <ModalLayout visible={isOpen} size="half" onClose={onClose}>
      <View className="flex flex-col items-center gap-8 px-4">
        <Title
          text={generateI18nMessage('SCREEN.MAP.RATE_LIMIT_MODAL.TITLE', [
            { key: 'limit', value: '5' },
          ])}
        />
        <Text className="text-center text-md text-light-text dark:text-dark-text">
          {generateI18nMessage('SCREEN.MAP.RATE_LIMIT_MODAL.MESSAGE', [
            { key: 'plan', value: profile?.getPlanName() || '' },
          ])}
        </Text>
        <Button
          onPress={handleMovieButtonPress}
          size="fit"
          theme="theme"
          text={generateI18nMessage('SCREEN.MAP.RATE_LIMIT_MODAL.MOVIE_BUTTON')}
        />
      </View>
    </ModalLayout>
  );
}
