import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { useRouter } from 'expo-router';

/**
 * 初期表示
 */
export default function MapScreen() {
  const router = useRouter();
  return (
    <BackgroundView>
      <Header title="マップ" onBack={() => router.back()} />
    </BackgroundView>
  );
}
