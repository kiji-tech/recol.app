import React, { useState, useCallback, useEffect } from 'react';
import { BackgroundView, ItemCard } from '@/src/components';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tables } from '@/src/libs/database.types';
import { fetchItemLinkList } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { MyBannerAd } from '@/src/components/Ad/BannerAd';
import { AD_INTERVAL, STORAGE_KEYS } from '@/src/libs/ConstValue';

// アイテム型定義
// ストレージのキー

export default function Home() {
  const { session } = useAuth();
  const [items, setItems] = useState<Tables<'item_link'>[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!session) return;
      const ctrl = new AbortController();
      fetchItems(ctrl);
      return () => {
        ctrl.abort();
      };
    }, [session])
  );

  // 内部キャッシュから前回取得している情報を表示しておく
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.BLOG_KEY).then((items) => {
      if (items) {
        setItems(JSON.parse(items));
      }
    });
  }, []);

  // APIからアイテムを取得する
  const fetchItems = async (ctrl?: AbortController) => {
    try {
      setLoading(true);
      const itemsData = await fetchItemLinkList(session, ctrl);

      // 取得したデータを新着とブックマークに分類
      setItems(itemsData);
      await AsyncStorage.setItem(STORAGE_KEYS.BLOG_KEY, JSON.stringify(itemsData));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <BackgroundView>
        {/* TODO: タブバー */}
        {/* 新着・おすすめ・旅行先・グッズ */}

        {loading ? (
          <View className="flex-1 justify-center items-center py-6">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            className="flex flex-col w-screen ml-[-14px]"
          >
            {items.map((item, index) => (
              <View key={item.id} className="flex flex-col w-fulljustify-center">
                <ItemCard
                  id={item.id}
                  amazon_url={item.amazon_url}
                  rakuten_url={item.rakuten_url}
                  category={item.category || []}
                  created_at={item.created_at}
                  isBookmarked={false}
                  onBookmarkChange={() => {}}
                />
                {/* 広告 */}
                {index % AD_INTERVAL === 0 && <MyBannerAd />}
              </View>
            ))}
          </ScrollView>
        )}
      </BackgroundView>
    </ScrollView>
  );
}
