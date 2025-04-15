import React, { useRef, useState } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import NativeAdView, {
  AdBadge,
  CallToActionView,
  HeadlineView,
  IconView,
  ImageView,
  TaglineView,
  AdManager,
  AdvertiserView,
  StarRatingView,
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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const nativeAdViewRef = useRef<NativeAdView>(null);

  React.useEffect(() => {
    if (nativeAdViewRef.current) {
      (nativeAdViewRef.current as NativeAdView).loadAd();
    }
  }, []);

  const onAdLoaded = () => {
    setError(false);
    setLoading(false);
  };

  const onAdFailedToLoad = () => {
    console.log({ error });
    setError(true);
    setLoading(false);
  };

  // ダミーのレスポンダーを追加して、コンテナビューのクリックを防止
  const onStartShouldSetResponder = () => {
    return true; // タッチイベントをキャプチャ
  };

  const onResponderGrant = () => {
    // 何もしない - イベントをブロック
  };

  if (error) return <></>;

  return (
    <NativeAdView
      ref={nativeAdViewRef}
      repository={platform === 'ios' ? 'iosImageAd' : 'androidImageAd'}
      enableSwipeGestureOptions={{
        tapsAllowed: false,
      }}
      adChoicesPlacement="topRight"
      refreshInterval={60000 * 2}
      enableTestMode={process.env.EXPO_PUBLIC_APP_ENV === 'development'}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdLoaded={onAdLoaded}
      style={{
        width: '100%',
        alignSelf: 'center',
      }}
    >
      <View
        className="flex flex-col justify-start w-full rounded-lg border-[1px] bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border"
        onStartShouldSetResponder={onStartShouldSetResponder}
        onResponderGrant={onResponderGrant}
        style={{ width: '100%' }}
      >
        {/* ローディングインジケーター */}
        {loading && (
          <View className="absolute w-full h-full flex justify-center items-center z-10 bg-opacity-50 bg-gray-200">
            <ActivityIndicator size="large" color="#a9a9a9" />
          </View>
        )}

        {/* Ad Badge - 最上部に明確に配置 */}
        <View className="absolute top-0 left-0 z-20 m-2">
          <AdBadge
            style={{
              width: 36,
              height: 20,
              borderRadius: 4,
              backgroundColor: '#FFA500',
            }}
            textStyle={{
              fontSize: 12,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          />
        </View>

        <View className="relative w-full overflow-hidden">
          <ImageView
            className="w-full rounded-t-lg"
            style={{
              width: '100%',
              aspectRatio: 1.91,
              minHeight: 150,
              alignSelf: 'stretch',
              left: 0,
              right: 0,
            }}
            resizeMode="cover"
          />
        </View>

        <View className="flex flex-row items-center p-2">
          <IconView style={{ width: 48, height: 48, borderRadius: 8, marginRight: 8 }} />
          <View className="flex-1">
            <HeadlineView className="font-bold text-lg text-light-text dark:text-dark-text" />
            <AdvertiserView className="text-sm text-light-secondary dark:text-dark-secondary" />
            <StarRatingView style={{ marginTop: 4 }} />
          </View>
        </View>

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
              backgroundColor: '#FFA500',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              elevation: 10,
            }}
            textStyle={{
              color: 'white',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
        </View>
      </View>
    </NativeAdView>
  );
};
