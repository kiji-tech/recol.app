import React, { useState } from 'react';
import { BackgroundView } from '@/src/components';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';

export default function Home() {
  const [blogTab, setBlogTab] = useState<'popular' | 'new'>('popular');
  const [goodsTab, setGoodsTab] = useState<'popular' | 'new'>('popular');

  return (
    <ScrollView>
      <BackgroundView>
        {/* 旅行ブログ */}
        <View className="flex-1 flex-row justify-between items-center w-full mt-4">
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text">ブログ</Text>
          <View className="border-1 flex flex-row">
            <TouchableOpacity
              onPress={() => setBlogTab('popular')}
              className={`px-4 py-2 ${blogTab === 'popular' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-l-[100]`}
            >
              <Text className="text-light-text dark:text-dark-text">人気</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBlogTab('new')}
              className={`px-4 py-2 ${blogTab === 'new' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-r-[100]`}
            >
              <Text className="text-light-text dark:text-dark-text">新着</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ここにblogTabに応じたコンテンツを表示 */}
        <View className="mt-2">
          <Text className="text-light-text dark:text-dark-text">
            {blogTab === 'popular'
              ? '人気のブログ記事が表示されます'
              : '新着のブログ記事が表示されます'}
          </Text>
        </View>

        {/* 旅行グッズ */}
        <View className="flex-1 flex-row justify-between items-center w-full mt-4">
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text">
            旅行で使えるグッズ
          </Text>
          <View className="border-1 flex flex-row">
            <TouchableOpacity
              onPress={() => setGoodsTab('popular')}
              className={`px-4 py-2 ${goodsTab === 'popular' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-l-[100]`}
            >
              <Text className="text-light-text dark:text-dark-text">人気</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGoodsTab('new')}
              className={`px-4 py-2 ${goodsTab === 'new' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-r-[100]`}
            >
              <Text className="text-light-text dark:text-dark-text">新着</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ここにgoodsTabに応じたコンテンツを表示 */}
        <View className="mt-2">
          <Text className="text-light-text dark:text-dark-text">
            {goodsTab === 'popular'
              ? '人気の旅行グッズが表示されます'
              : '新着の旅行グッズが表示されます'}
          </Text>
        </View>

        <View className="flex justify-center items-center mt-4">
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.INLINE_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
              networkExtras: { collapsible: 'bottom' },
            }}
          />
        </View>
      </BackgroundView>
    </ScrollView>
  );
}
