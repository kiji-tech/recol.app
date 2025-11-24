import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import generateI18nMessage from '@/src/libs/i18n';
import { useFocusEffect } from 'expo-router';
import Button from '../Button';
import { useMap } from '@/src/features/map';

const adUnitId =
  process.env.EXPO_PUBLIC_APP_ENV == 'development'
    ? TestIds.REWARDED
    : Platform.OS == 'ios'
      ? process.env.EXPO_PUBLIC_ADMOB_IOS_SEARCH_PLACE_ID
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_SEARCH_PLACE_ID;

const rewardedAd = RewardedAd.createForAdRequest(adUnitId!, {
  keywords: ['fashion', 'clothing'],
});

type Props = {
  onComplete: () => void;
};
export default function MovieAd({ onComplete }: Props) {
  // === Member ===
  const [loaded, setLoaded] = useState(false);
  const { clearRateLimitCount } = useMap();
  // === Method ===

  // === Handler ===
  const handleMovieButtonPress = () => {
    // 動画を視聴 視聴完了後にリミット制限をリセットしてモーダルを閉じる
    rewardedAd.show();
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setLoaded(true);
      });
      const unsubscribeReward = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          clearRateLimitCount();
        }
      );
      const closedAd = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        onComplete();
      });
      // Start loading the rewarded interstitial ad straight away
      rewardedAd.load();

      // Unsubscribe from events on unmount
      return () => {
        unsubscribeLoaded();
        unsubscribeReward();
        closedAd();
      };
    }, [])
  );
  return (
    <>
      <Button
        onPress={handleMovieButtonPress}
        size="fit"
        theme="theme"
        disabled={!loaded}
        loading={!loaded}
        text={generateI18nMessage('SCREEN.MAP.RATE_LIMIT_MODAL.MOVIE_BUTTON')}
      />
    </>
  );
}
