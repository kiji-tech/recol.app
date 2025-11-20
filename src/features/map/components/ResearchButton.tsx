import React, { useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { Region } from 'react-native-maps';
import i18n from '@/src/libs/i18n';

type Props = {
  centerRegion: Region | null;
  currentRegion: Region | null;
  radius: number;
  onPress: () => void;
};

export default function ResearchButton({ centerRegion, currentRegion, radius, onPress }: Props) {
  if (!centerRegion || !currentRegion) return <></>;
  // ==== Member ====
  const IS_RESEARCHED = true;
  const RESEARCH_TIMER = 5000;
  const platform = Platform.OS;
  const [isView, setIsView] = useState(false);
  // ==== Method ====
  /**
   * 再検索ボタン押下処理
   */
  const handlePress = () => {
    setIsView(!IS_RESEARCHED);
    reSearchTimer();
    onPress();
  };

  /**
   * 再検索タイマー
   */
  const reSearchTimer = () => {
    if (!isView) {
      setTimeout(() => {
        setIsView(IS_RESEARCHED);
      }, RESEARCH_TIMER);
    }
  };

  const isResearched = useMemo(() => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (centerRegion.latitude - currentRegion.latitude) * (Math.PI / 180);
    const dLon = (centerRegion.longitude - currentRegion.longitude) * (Math.PI / 180);

    if (!currentRegion || !centerRegion) return false;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(currentRegion.latitude * (Math.PI / 180)) *
        Math.cos(centerRegion.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    reSearchTimer();
    return distance > radius ? IS_RESEARCHED : !IS_RESEARCHED; // 距離をキロメートルで返す
  }, [centerRegion, currentRegion]);

  // ==== Render ====
  if (!(isView === IS_RESEARCHED || isResearched === IS_RESEARCHED)) return <></>;

  return (
    <View className={`w-full absolute ${platform === 'ios' ? 'top-36' : 'top-20'} z-50`}>
      <TouchableOpacity
        className="w-fit py-2 px-6 mt-2 mx-auto rounded-xl bg-light-background dark:bg-dark-background"
        onPress={handlePress}
      >
        <Text className="text-center text-md text-light-text dark:text-dark-text">
          {i18n.t('SCREEN.MAP.RESEARCH')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
