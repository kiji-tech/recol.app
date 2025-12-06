import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../auth';
import { MovieAd } from '@/src/features/ad';
import { ModalLayout } from '@/src/components';
import Title from '@/src/components/Title';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export default function RateLimitModal({ isOpen, onClose }: Props) {
  // === Member ===
  const { profile } = useAuth();

  // === Method ===

  // === Handle ===
  const handleMovieAdComplete = () => {
    onClose();
  };

  return (
    <ModalLayout visible={isOpen} size="half" onClose={onClose}>
      <View className="flex flex-col items-center gap-8 px-4">
        <Title
          text={generateI18nMessage('FEATURE.MAP.RATE_LIMIT_MODAL.TITLE', [
            { key: 'limit', value: '5' },
          ])}
        />
        <Text className="text-center text-md text-light-text dark:text-dark-text">
          {generateI18nMessage('FEATURE.MAP.RATE_LIMIT_MODAL.MESSAGE', [
            { key: 'plan', value: profile?.getPlanName() || '' },
          ])}
        </Text>
        <MovieAd onComplete={handleMovieAdComplete} />
      </View>
    </ModalLayout>
  );
}
