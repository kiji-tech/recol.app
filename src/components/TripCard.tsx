import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import Badge from './Badge';
import { URLMetadata, DEFAULT_NO_IMAGE_URL, fetchMetadata } from '../libs/MetadataService';
import { MaterialIcons } from '@expo/vector-icons';
import Loading from './Loading';

type TripCardProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  url: string;
  category?: string[];
  createdAt?: string;
  isBookmarked?: boolean;
  onBookmarkChange?: (url: string, isBookmarked: boolean) => void;
};

const TripCard: React.FC<TripCardProps> = ({
  title: propTitle,
  description: propDescription,
  imageUrl: propImageUrl,
  url,
  category = [],
  createdAt,
  isBookmarked: propIsBookmarked = false,
  onBookmarkChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<URLMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(propIsBookmarked);

  // 親コンポーネントから渡されたブックマーク状態が変更された場合に反映
  useEffect(() => {
    setIsBookmarked(propIsBookmarked);
  }, [propIsBookmarked]);

  useEffect(() => {
    const fetchUrlMetadata = async () => {
      if (!url) return;

      // プロパティとして渡されたデータがあれば、URLからのフェッチをスキップ
      if (propTitle && propDescription && propImageUrl) {
        setMetadata({
          title: propTitle,
          description: propDescription,
          image: propImageUrl,
          url,
        });
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // 実際のAPIを使用してメタデータを取得
        const data = await fetchMetadata(url);
        setMetadata(data);
      } catch (error) {
        console.error('メタデータの取得に失敗しました:', error);
        setError('メタデータの取得に失敗しました');
        // エラー時のデフォルトメタデータを設定
        setMetadata({
          title: url,
          url: url,
          image: DEFAULT_NO_IMAGE_URL,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUrlMetadata();
  }, [url, propTitle, propDescription, propImageUrl]);

  // 外部URLを開く
  const openUrl = () => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('URLを開けませんでした:', err));
    }
  };

  // ブックマークの切り替え
  const toggleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    // 親コンポーネントにブックマーク状態の変更を通知
    if (onBookmarkChange) {
      onBookmarkChange(url, newBookmarkState);
    }
  };

  // URLからドメイン部分を抽出する関数（改善版）
  const extractDomain = (urlString: string): string => {
    if (!urlString) return '外部リンク';

    try {
      // URLにプロトコルが含まれていない場合は追加
      let processedUrl = urlString;
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        processedUrl = 'https://' + urlString;
      }

      const url = new URL(processedUrl);
      // www.を除去して返す
      return url.hostname.replace(/^www\./, '');
    } catch {
      // URL解析に失敗した場合、単純にドメイン部分を抽出する
      const match = urlString.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
      return match ? match[1] : '外部リンク';
    }
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

  const domain = extractDomain(url);
  const formattedDate = formatDate(createdAt);

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

  const displayTitle = metadata?.title || propTitle || 'タイトルなし';
  const displayDescription = metadata?.description || propDescription;
  const displayImage = metadata?.image || propImageUrl || DEFAULT_NO_IMAGE_URL;
  const displaySiteName = metadata?.siteName;

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

  const siteNameStyle = {
    height: 16, // サイト名の高さを固定
    lineHeight: 16,
  };

  return (
    <View className={cardBaseClass}>
      <View className="w-full flex-col">
        <TouchableOpacity onPress={openUrl}>
          <View className="relative">
            <Image
              source={{ uri: displayImage }}
              className="w-full h-36 rounded-t-lg"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>

        <View className="p-3 relative">
          {/* 日付表示 - バッジの上に配置 */}
          {formattedDate && (
            <Text className="text-xs text-light-secondary dark:text-dark-secondary mb-2">
              {formattedDate}
            </Text>
          )}

          {/* カテゴリーバッジ - 複数表示 */}
          {category.length > 0 && (
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

          <TouchableOpacity onPress={openUrl}>
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
          </TouchableOpacity>

          {/* サイト名 - 高さ固定 */}
          <View style={siteNameStyle}>
            {displaySiteName && (
              <Text className="text-xs text-light-secondary dark:text-dark-secondary mt-1">
                {displaySiteName}
              </Text>
            )}
            {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
          </View>

          <View className="mt-2 flex-row justify-between items-center">
            {/* リンク先ドメイン表示 */}
            <TouchableOpacity onPress={openUrl}>
              <View className="px-2 py-1 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-full">
                <Text className="text-xs text-light-text dark:text-dark-text">{domain} →</Text>
              </View>
            </TouchableOpacity>

            {/* ブックマークボタン - 右下に配置 */}
            <TouchableOpacity
              onPress={toggleBookmark}
              style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
            >
              <MaterialIcons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isBookmarked ? '#ff3b30' : '#555'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TripCard;
