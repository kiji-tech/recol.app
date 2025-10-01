import React, { useRef } from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { useAuth } from '@/src/features/auth';

const adUnitId =
  process.env.EXPO_PUBLIC_APP_ENV == 'development'
    ? TestIds.ADAPTIVE_BANNER
    : Platform.OS == 'ios'
      ? process.env.EXPO_PUBLIC_ADMOB_IOS_UNIT_ID
      : process.env.EXPO_PUBLIC_ADMOB_ANDROID_UNIT_ID;

export const MyBannerAd = () => {
  const bannerRef = useRef<BannerAd | null>(null);
  const { profile } = useAuth();

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    if (bannerRef.current) {
      if (Platform.OS === 'ios') {
        bannerRef.current.load();
      }
    }
  });

  if (!adUnitId || profile?.isPremiumUser()) return null;

  return (
    <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  );
};
