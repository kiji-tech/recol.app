import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { Text } from 'react-native';
import { router } from 'expo-router';
import i18n from '@/src/libs/i18n';

export default function TesterSettings() {
  return (
    <BackgroundView>
      <Header title={i18n.t('SCREEN.SETTINGS.TESTER_SETTINGS')} onBack={() => router.back()} />
      <Text>TesterSettings</Text>
    </BackgroundView>
  );
}
