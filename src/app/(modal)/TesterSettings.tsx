import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { Text } from 'react-native';
import { router } from 'expo-router';
import generateI18nMessage from '@/src/libs/i18n';

export default function TesterSettings() {
  return (
    <BackgroundView>
      <Header
        title={generateI18nMessage('SCREEN.SETTINGS.TESTER_SETTINGS')}
        onBack={() => router.back()}
      />
      <Text>TesterSettings</Text>
    </BackgroundView>
  );
}
