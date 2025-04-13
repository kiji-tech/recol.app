import React, { useState, useCallback } from 'react';
import { BackgroundView, ItemCard } from '@/src/components';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tables } from '@/src/libs/database.types';
import { fetchItemLinkList } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { ListCardAd } from '@/src/components/Ad/ListCardAd';

// アイテム型定義
// ストレージのキー
const BOOKMARK_STORAGE_KEY = 'bookmarked_urls';

export default function Home() {
  const { session } = useAuth();
  const [goodsTab, setGoodsTab] = useState<'new' | 'bookmark'>('new');
  const [bookmarkedUrls, setBookmarkedUrls] = useState<string[]>([]);
  const [items, setItems] = useState<{
    new: Tables<'item_link'>[];
    bookmark: Tables<'item_link'>[];
  }>({ new: [], bookmark: [] });
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

  // APIからアイテムを取得する
  const fetchItems = async (ctrl?: AbortController) => {
    try {
      setLoading(true);
      loadBookmarkedUrls();
      const itemsData = await fetchItemLinkList(session, ctrl);

      // 取得したデータを新着とブックマークに分類
      const newItems = itemsData || [];
      setItems({
        new: newItems,
        bookmark: [], // ブックマーク項目は空で初期化（後でフィルターする）
      });
    } finally {
      setLoading(false);
    }
  };

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

  // アイテムがブックマークされているかをチェック
  const isItemBookmarked = (item: Tables<'item_link'>): boolean => {
    // amazon_url、rakuten_urlの順番でチェック
    if (item.amazon_url && bookmarkedUrls.includes(item.amazon_url)) return true;
    if (item.rakuten_url && bookmarkedUrls.includes(item.rakuten_url)) return true;
    return false;
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

  // 表示するアイテムを取得
  const getDisplayItems = () => {
    if (goodsTab === 'new') {
      return items.new;
    } else {
      // ブックマークタブの場合は、ブックマークされたアイテムのみをフィルタリング
      return items.new.filter(
        (item) =>
          (item.amazon_url && bookmarkedUrls.includes(item.amazon_url)) ||
          (item.rakuten_url && bookmarkedUrls.includes(item.rakuten_url))
      );
    }
  };

  return (
    <ScrollView>
      <BackgroundView>
        {/* 旅行グッズ */}
        <View className="flex-1 flex-row justify-between items-center w-full mt-6 sticky">
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text">旅行グッズ</Text>
          <View className="border-1 flex flex-row">
            <TouchableOpacity
              onPress={() => setGoodsTab('new')}
              className={`px-4 py-2 ${goodsTab === 'new' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-l-[100]`}
            >
              <View className="flex-row items-center justify-center">
                <MaterialIcons
                  name="fiber-new"
                  size={16}
                  color="#444"
                  style={{ marginRight: 4, lineHeight: 20 }}
                />
                <Text className="text-light-text dark:text-dark-text" style={{ lineHeight: 20 }}>
                  新着
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGoodsTab('bookmark')}
              className={`px-4 py-2 ${goodsTab === 'bookmark' ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'} rounded-r-[100]`}
            >
              <View className="flex-row items-center justify-center">
                <MaterialIcons
                  name="bookmark"
                  size={16}
                  color="#444"
                  style={{ marginRight: 4, lineHeight: 20 }}
                />
                <Text className="text-light-text dark:text-dark-text" style={{ lineHeight: 20 }}>
                  ブックマーク
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* グッズコンテンツ表示 - 横スクロール */}
        {loading ? (
          <View className="flex-1 justify-center items-center py-6">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex flex-row gap-4"
          >
            {getDisplayItems().map((item, index) => (
              <View key={item.id} className="mr-4 flex flex-row">
                <ItemCard
                  id={item.id}
                  amazon_url={item.amazon_url}
                  rakuten_url={item.rakuten_url}
                  category={item.category || []}
                  created_at={item.created_at}
                  isBookmarked={isItemBookmarked(item)}
                  onBookmarkChange={handleBookmarkChange}
                />
                {/* 広告 */}
                {index % 5 === 0 && <ListCardAd />}
              </View>
            ))}
          </ScrollView>
        )}
      </BackgroundView>
    </ScrollView>
  );
}
