import { useTheme } from '@/src/contexts/ThemeContext';
import React, { useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import NativeAdView, {
  AdBadge,
  CallToActionView,
  HeadlineView,
  IconView,
  ImageView,
  TaglineView,
  AdManager,
} from 'react-native-admob-native-ads';
const expirationPeriod = 10000;
AdManager.registerRepository({
  name: 'iosImageAd',
  adUnitId: process.env.EXPO_PUBLIC_ADMOB_IOS_UNIT_ID || '',
  numOfAds: 3,
  expirationPeriod,
  mediationEnabled: false,
});
AdManager.registerRepository({
  name: 'androidImageAd',
  adUnitId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_UNIT_ID || '',
  numOfAds: 3,
  expirationPeriod,
  mediationEnabled: false,
});
export const ListCardAd = () => {
  const platform = Platform.OS;
  const { isDarkMode } = useTheme();
  const nativeAdViewRef = useRef<NativeAdView>(null);
  React.useEffect(() => {
    if (nativeAdViewRef.current) {
      (nativeAdViewRef.current as NativeAdView).loadAd();
    }
  }, []);

  return (
    <NativeAdView
      ref={nativeAdViewRef}
      repository={platform === 'ios' ? 'iosImageAd' : 'androidImageAd'}
      enableSwipeGestureOptions={{
        tapsAllowed: false,
      }}
      refreshInterval={60000 * 2}
      enableTestMode={process.env.EXPO_PUBLIC_APP_ENV === 'development'}
      style={{
        width: 256,
      }}
    >
      <View className="flex flex-col justify-start w-full rounded-lg border-[1px] bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border">
        <ImageView className={`w-full h-[256px] rounded-t-lg`} resizeMode="cover" />
        <AdBadge
          style={{
            marginTop: 6,
            marginLeft: 6,
            width: 32,
            height: 20,
            borderRadius: 8,
            backgroundColor: 'black',
          }}
          textStyle={{
            fontSize: 8,
            fontWeight: 'bold',
            color: 'white',
          }}
        />
        <HeadlineView className="font-bold text-lg text-light-text dark:text-dark-text p-2" />
        <TaglineView
          className="text-md text-light-text dark:text-dark-text p-2"
          ellipsizeMode="tail"
          numberOfLines={3}
        />
        <View className="w-full p-2">
          <CallToActionView
            style={{
              width: '100%',
              paddingHorizontal: 12,
              paddingVertical: 14,
              backgroundColor: 'purple',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              elevation: 10,
            }}
            textStyle={{ color: 'white', fontSize: 14 }}
          />
        </View>
      </View>
    </NativeAdView>
  );
};
