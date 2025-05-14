import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import Badge from './Badge';
import { URLMetadata, DEFAULT_NO_IMAGE_URL, fetchMetadata } from '../libs/MetadataService';
import { MaterialIcons } from '@expo/vector-icons';
import Loading from './Loading';
import { Tables } from '@/src/libs/database.types';

type ItemCardProps = Tables<'item_link'> & {
  isBookmarked?: boolean;
  onBookmarkChange?: (url: string, isBookmarked: boolean) => void;
};

const ItemCard: React.FC<ItemCardProps> = ({
  amazon_url,
  rakuten_url,
  category = [],
  isBookmarked: propIsBookmarked = false,
  onBookmarkChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<URLMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(propIsBookmarked);

  // メインのURLを取得（楽天優先）
  const mainUrl = rakuten_url || amazon_url || '';

  // 親コンポーネントから渡されたブックマーク状態が変更された場合に反映
  useEffect(() => {
    setIsBookmarked(propIsBookmarked);
  }, [propIsBookmarked]);

  useEffect(() => {
    const fetchUrlMetadata = async () => {
      if (!mainUrl) return;

      setLoading(true);
      setError(null);
      try {
        // 実際のAPIを使用してメタデータを取得
        const data = await fetchMetadata(mainUrl);
        setMetadata(data);
      } catch (error) {
        console.error('メタデータの取得に失敗しました:', error);
        setError('メタデータの取得に失敗しました');
        // エラー時のデフォルトメタデータを設定
        setMetadata({
          title: mainUrl,
          url: mainUrl,
          image: DEFAULT_NO_IMAGE_URL,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUrlMetadata();
  }, [mainUrl]);

  // ブックマークの切り替え
  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    // 親コンポーネントにブックマーク状態の変更を通知
    if (onBookmarkChange) {
      // ブックマーク対象のURLを選択（楽天 > Amazon の優先順位）
      const bookmarkUrl = rakuten_url || amazon_url || '';
      onBookmarkChange(bookmarkUrl, newBookmarkState);
    }
  };

  // 外部ショップURLを開く
  const openShopUrl = (shopUrl: string) => {
    Linking.openURL(shopUrl).catch((err) => console.error('URLを開けませんでした:', err));
  };

  // タイトルから特定の文字列を削除する関数
  const cleanTitle = (title: string): string => {
    return title.replace(/^Amazon\.co\.jp: /i, '').replace(/^【楽天市場】/i, '');
  };

  const displayTitle = cleanTitle(metadata?.title || 'タイトルなし');
  const displayDescription = metadata?.description;
  const displayImage = metadata?.image || DEFAULT_NO_IMAGE_URL;

  // 固定高さスタイル
  const titleStyle = {
    lineHeight: 24,
  };

  const descriptionStyle = {
    lineHeight: 20,
  };

  // メタデータローディング中の表示
  if (loading) {
    return (
      <View className="overflow-hidden bg-light-background dark:bg-dark-background w-full relative h-40">
        <Loading />
      </View>
    );
  }
  return (
    <View className="overflow-hidden dark:bg-dark-background w-full flex-row h-40">
      {/* 商品画像コンテナ */}
      <View className="w-1/4 h-auto">
        <Image source={{ uri: displayImage }} className="w-full h-full" resizeMode="contain" />
      </View>

      {/* テキスト情報コンテナ */}
      <View className="w-3/4 p-3 flex-col justify-between">
        <View>
          {/* カテゴリーバッジ & ブックマークボタン */}
          <View className="flex-row justify-between items-start mt-1">
            {/* カテゴリーバッジ - 複数表示 */}
            {category && category.length > 0 && (
              <View className="flex-row flex-wrap flex-1 mr-2">
                {category.map((cat, index) => (
                  <Badge
                    key={`${cat}-${index}`}
                    text={cat}
                    className={index < category.length - 1 ? 'mr-1 mb-0.5' : 'mb-0.5'}
                  />
                ))}
              </View>
            )}
            {/* ブックマークボタン */}
            <TouchableOpacity onPress={toggleBookmark} style={{ padding: 2 }} className="hidden">
              <MaterialIcons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isBookmarked ? '#ff3b30' : '#555'}
              />
            </TouchableOpacity>
          </View>

          {/* タイトル */}
          <Text
            className="font-bold text-light-text dark:text-dark-text"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={titleStyle}
          >
            {displayTitle}
          </Text>

          {/* 説明 */}
          {displayDescription && (
            <Text
              className="text-xs text-light-text dark:text-dark-text mt-1"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={descriptionStyle}
            >
              {displayDescription}
            </Text>
          )}
          {/* エラー表示 */}
          {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
        </View>

        {/* ショップボタン */}
        <View className="flex-row mt-2 gap-4">
          {amazon_url && (
            <TouchableOpacity
              onPress={() => openShopUrl(amazon_url)}
              className="bg-[#FF9900] rounded-md px-2 py-1 mr-1 flex-row items-center justify-center flex-1"
            >
              <Text className="text-dark-text text-xs font-bold">Amazon</Text>
            </TouchableOpacity>
          )}
          {rakuten_url && (
            <TouchableOpacity
              onPress={() => openShopUrl(rakuten_url)}
              className="bg-[#BF0000] rounded-md px-2 py-1 flex-row items-center justify-center flex-1"
            >
              <Text className="text-dark-text text-xs font-bold">楽天</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ItemCard;
