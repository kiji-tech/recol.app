import React, { useState, useEffect } from 'react';
import { BackgroundView, LinkCard } from '@/src/components';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BannerAdSize, TestIds, BannerAd } from 'react-native-google-mobile-ads';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// サンプルデータ
const GOODS_DATA = {
  new: [
    {
      id: '1',
      url: 'https://www.amazon.co.jp/Bee-Nesting%E6%97%85%E8%A1%8C%E7%94%A8%E5%9C%A7%E7%B8%AE%E8%A2%8B-%E4%BE%BF%E5%88%A9%E3%82%B0%E3%83%83%E3%82%BA%E5%9C%A7%E7%B8%AE%E3%83%9D%E3%83%BC%E3%83%81-%E4%B8%A1%E9%9D%A2%E5%8F%8E%E7%B4%8D%E3%83%88%E3%83%A9%E3%83%99%E3%83%AB%E3%83%9D%E3%83%BC%E3%83%81-%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%83%BB%E3%83%AC%E3%83%83%E3%83%89%EF%BC%89/dp/B084WMDM93?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=1SOPXBTJDHQVZ&dib=eyJ2IjoiMSJ9.ZysN7kiiVNwsreIY34-SDJi_z0zeLMYR2DQQ1tLbC1M2bWzjNMphOHlJJVVWhpIYF0ln1pM7FoixIpq6AGY3M7ngTldNNEMR0RjIX1TYrOpGtvB4tKA58xVOg7slWEeyT7F_o4bOoxXD16hFCkde5tQGwbZlUM_nF4eRWbkP_VcsByO9_xQp840egwLtG9u-VxVbJR5HYVgrI5ZFqkqczrtoFlK6-bz-PxYkf3hyMvGyQmhZ6TgI0HteLfoujRSRgjbld4rLiNFr42zSRZo5q8CtWnp6v2mtjO_Pyl0rkcQ.IgEWRTedsDhWdwfHXEj7z0f9ROTpOqRQunNmkZYh3JY&dib_tag=se&keywords=%E6%97%85%E8%A1%8C%E3%82%B0%E3%83%83%E3%82%BA&psr=EY17&qid=1744453003&s=todays-deals&sprefix=%E6%97%85%E8%A1%8C%2B%E3%82%B0%E3%83%83%E3%82%BA%2Ctodays-deals%2C164&sr=1-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&m=A1EMGOHTNYSRXC&SPES=1&th=1&linkCode=ll1&tag=libetech-22&linkId=582a2d41c42b5f02b9450cbb29d3807a&language=ja_JP&ref_=as_li_ss_tl',
      category: ['バッグ・スーツケース', '収納'],
      createdAt: '2023-10-10',
    },
    {
      id: '2',
      url: 'https://www.amazon.co.jp/TAVILAX%E3%80%90%E3%82%8B%E3%82%8B%E3%81%B6%E6%8E%B2%E8%BC%89%EF%BC%861%E7%B4%9A%E6%95%B4%E7%90%86%E5%8F%8E%E7%B4%8D%E3%82%A2%E3%83%89%E3%83%90%E3%82%A4%E3%82%B6%E3%83%BC%E7%9B%A3%E4%BF%AE%E3%80%91-%E6%97%85%E8%A1%8C%E7%94%A8%E5%9C%A7%E7%B8%AE%E8%A2%8B-%E8%A1%A3%E9%A1%9E%E5%9C%A7%E7%B8%AE%E8%A2%8B-%E4%BE%BF%E5%88%A9%E3%82%B0%E3%83%83%E3%82%BA-%E3%81%B5%E3%81%A8%E3%82%93%E5%8F%8E%E7%B4%8D%E8%A2%8B/dp/B0DK5J1RYN?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=1SOPXBTJDHQVZ&dib=eyJ2IjoiMSJ9.ZysN7kiiVNwsreIY34-SDJi_z0zeLMYR2DQQ1tLbC1M2bWzjNMphOHlJJVVWhpIYF0ln1pM7FoixIpq6AGY3M7ngTldNNEMR0RjIX1TYrOpGtvB4tKA58xVOg7slWEeyT7F_o4bOoxXD16hFCkde5tQGwbZlUM_nF4eRWbkP_VcsByO9_xQp840egwLtG9u-VxVbJR5HYVgrI5ZFqkqczrtoFlK6-bz-PxYkf3hyMvGyQmhZ6TgI0HteLfoujRSRgjbld4rLiNFr42zSRZo5q8CtWnp6v2mtjO_Pyl0rkcQ.IgEWRTedsDhWdwfHXEj7z0f9ROTpOqRQunNmkZYh3JY&dib_tag=se&keywords=%E6%97%85%E8%A1%8C%E3%82%B0%E3%83%83%E3%82%BA&psr=EY17&qid=1744453003&s=todays-deals&sprefix=%E6%97%85%E8%A1%8C%2B%E3%82%B0%E3%83%83%E3%82%BA%2Ctodays-deals%2C164&sr=1-9&th=1&linkCode=ll1&tag=libetech-22&linkId=6a4ae46419f5f8b1ce6ff04fd9d4c8c7&language=ja_JP&ref_=as_li_ss_tl',
      category: ['旅行小物', '収納', 'コンパクト'],
      createdAt: '2023-11-22',
    },
    {
      id: '5',
      url: 'https://item.rakuten.co.jp/ichifujiec/nsana-018/',
      category: ['ガジェット', '充電器', '便利グッズ'],
      createdAt: '2023-12-15',
    },
  ],
  bookmark: [
    {
      id: '3',
      url: 'https://example.com/goods/drybag',
      category: ['アウトドア用品', '防水', 'キャンプ'],
      createdAt: '2024-05-08',
    },
    {
      id: '4',
      url: 'https://example.com/goods/translator',
      category: ['ガジェット', '翻訳機', '海外旅行'],
      createdAt: '2024-05-15',
    },
    {
      id: '6',
      url: 'https://example.com/goods/bottle',
      category: ['旅行小物', '水筒', 'エコ'],
      createdAt: '2024-05-22',
    },
  ],
};

// ストレージのキー
const BOOKMARK_STORAGE_KEY = 'bookmarked_urls';

export default function Home() {
  //   const [blogTab, setBlogTab] = useState<'new' | 'bookmark'>('new');
  const [goodsTab, setGoodsTab] = useState<'new' | 'bookmark'>('new');
  const [bookmarkedUrls, setBookmarkedUrls] = useState<string[]>([]);

  // 初期化時にブックマーク状態を読み込む
  useEffect(() => {
    loadBookmarkedUrls();
  }, []);

  // ブックマークされたURLを保存する
  const saveBookmarkedUrls = async (urls: string[]) => {
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(urls));
    } catch (error) {
      console.error('ブックマークの保存に失敗しました:', error);
    }
  };

  // ブックマークされたURLを読み込む
  const loadBookmarkedUrls = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (savedBookmarks) {
        setBookmarkedUrls(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('ブックマークの読み込みに失敗しました:', error);
    }
  };

  // ブックマーク状態の変更を処理する
  const handleBookmarkChange = (url: string, isBookmarked: boolean) => {
    let newBookmarkedUrls: string[];

    if (isBookmarked) {
      // ブックマーク追加
      newBookmarkedUrls = [...bookmarkedUrls, url];
    } else {
      // ブックマーク削除
      newBookmarkedUrls = bookmarkedUrls.filter((bookmarkedUrl) => bookmarkedUrl !== url);
    }

    setBookmarkedUrls(newBookmarkedUrls);
    saveBookmarkedUrls(newBookmarkedUrls);
  };

  // URLがブックマークされているかチェックする
  const isUrlBookmarked = (url: string): boolean => {
    return bookmarkedUrls.includes(url);
  };

  return (
    <ScrollView>
      <BackgroundView>
        {/* 旅行ブログ */}
        {/* <View className="flex-1 flex-row justify-between items-center w-full mt-4">
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text">ブログ</Text>
          <View className="border-1 flex flex-row">
            <TouchableOpacity
              onPress={() => setBlogTab('new')}
              className={`px-4 py-2 ${blogTab === 'new' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-l-[100]`}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="fiber-new" size={16} color="#444" className="mr-1" />
                <Text className="text-light-text dark:text-dark-text">新着</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBlogTab('bookmark')}
              className={`px-4 py-2 ${blogTab === 'bookmark' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-r-[100]`}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="bookmark" size={16} color="#444" className="mr-1" />
                <Text className="text-light-text dark:text-dark-text">ブックマーク</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {BLOG_DATA[blogTab].map((item) => (
            <LinkCard
              key={item.id}
              url={item.url}
              category={item.category}
              createdAt={item.createdAt}
              isBookmarked={isUrlBookmarked(item.url)}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </ScrollView>
        */}

        {/* 旅行グッズ */}
        <View className="flex-1 flex-row justify-between items-center w-full mt-6">
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text">
            旅行グッズ
          </Text>
          <View className="border-1 flex flex-row">
            <TouchableOpacity
              onPress={() => setGoodsTab('new')}
              className={`px-4 py-2 ${goodsTab === 'new' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-l-[100]`}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="fiber-new" size={16} color="#444" className="mr-1" />
                <Text className="text-light-text dark:text-dark-text">新着</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGoodsTab('bookmark')}
              className={`px-4 py-2 ${goodsTab === 'bookmark' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-r-[100]`}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="bookmark" size={16} color="#444" className="mr-1" />
                <Text className="text-light-text dark:text-dark-text">ブックマーク</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* グッズコンテンツ表示 - 横スクロール */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {GOODS_DATA[goodsTab].map((item) => (
            <LinkCard
              key={item.id}
              url={item.url}
              category={item.category}
              createdAt={item.createdAt}
              isBookmarked={isUrlBookmarked(item.url)}
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </ScrollView>
        <View className="flex justify-center items-center mt-6 mb-4">
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
