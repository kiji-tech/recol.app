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
  created_at = '',
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

  // 日付のフォーマット（例：2023.10.15形式に変換）
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}.${month}.${day}`;
    } catch {
      return dateString; // パースできない場合はそのまま返す
    }
  };

  const formattedDate = formatDate(created_at);

  // メタデータローディング中の表示
  if (loading) {
    return (
      <View
        className="mb-4 rounded-lg overflow-hidden border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background w-[280px] mr-3 relative"
        style={{ height: 250 }}
      >
        <Loading />
      </View>
    );
  }

  const displayTitle = cleanTitle(metadata?.title || 'タイトルなし');
  const displayDescription = metadata?.description;
  const displayImage = metadata?.image || DEFAULT_NO_IMAGE_URL;

  // カードのベースクラス
  const cardBaseClass =
    'mb-4 rounded-lg overflow-hidden border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background w-[280px] mr-3';

  // 固定高さスタイル
  const titleStyle = {
    height: 24, // 1行分の高さを固定
    lineHeight: 24,
  };

  const descriptionStyle = {
    height: 60, // 3行分の高さを固定
    lineHeight: 20,
  };

  return (
    <View className={cardBaseClass}>
      <View className="w-full flex-col">
        {/* 商品画像 */}
        <View className="relative">
          <Image
            source={{ uri: displayImage }}
            className="w-full h-36 rounded-t-lg"
            resizeMode="cover"
          />
        </View>

        <View className="p-3 relative">
          {/* 日付表示 */}
          {formattedDate && (
            <Text className="text-xs text-light-secondary dark:text-dark-secondary mb-2">
              {formattedDate}
            </Text>
          )}

          {/* カテゴリーバッジ - 複数表示 */}
          {category && category.length > 0 && (
            <View className="flex-row flex-wrap mb-2">
              {category.map((cat, index) => (
                <Badge
                  key={`${cat}-${index}`}
                  text={cat}
                  className={index < category.length - 1 ? 'mr-2 mb-1' : 'mb-1'}
                />
              ))}
            </View>
          )}

          {/* タイトルと説明 */}
          <Text
            className="font-bold text-light-text dark:text-dark-text"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={titleStyle}
          >
            {displayTitle}
          </Text>
          {displayDescription && (
            <Text
              className="text-sm text-light-text dark:text-dark-text mt-1"
              numberOfLines={3}
              ellipsizeMode="tail"
              style={descriptionStyle}
            >
              {displayDescription}
            </Text>
          )}

          {/* エラー表示 */}
          {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}

          {/* ショップボタン */}
          <View className="flex-row mt-4 mb-2">
            {amazon_url && (
              <TouchableOpacity
                onPress={() => openShopUrl(amazon_url)}
                className="bg-[#FF9900] rounded-md px-3 py-2 mr-2 flex-row items-center justify-center flex-1"
              >
                <Text className="text-dark-text text-sm font-bold">Amazonで見る</Text>
              </TouchableOpacity>
            )}
            {rakuten_url && (
              <TouchableOpacity
                onPress={() => openShopUrl(rakuten_url)}
                className="bg-[#BF0000] rounded-md px-3 py-4 flex-row items-center justify-center flex-1"
              >
                <Text className="text-dark-text text-sm font-bold">楽天で見る</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ブックマークボタン */}
          <View className="mt-2 flex-row justify-start items-center">
            <TouchableOpacity
              onPress={toggleBookmark}
              className="flex-row items-center"
              style={{ padding: 4 }}
            >
              <Text className="text-xs text-light-text dark:text-dark-text mr-1">
                {isBookmarked ? 'ブックマーク中' : 'ブックマーク'}
              </Text>
              <MaterialIcons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? '#ff3b30' : '#555'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemCard;
