import axios from 'axios';

// デフォルトの画像URL
export const DEFAULT_NO_IMAGE_URL = 'https://placehold.jp/aaaaaa/ffffff/400x300.png?text=No+Image';

// メタデータの型定義
export type URLMetadata = {
  title: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
};

// HTMLからメタデータを抽出する関数
const extractMetadata = (html: string, url: string): URLMetadata => {
  // デフォルトのメタデータオブジェクト
  const metadata: URLMetadata = {
    title: '',
    url: url,
    image: DEFAULT_NO_IMAGE_URL, // デフォルトでno-image画像を設定
  };

  try {
    // OGP画像
    const ogImageMatch = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i
    );
    // OGPタイトル
    const ogTitleMatch = html.match(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i
    );
    // メタタイトル
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    // OGP説明
    const ogDescriptionMatch = html.match(
      /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i
    );
    const descriptionMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
    );
    // OGPサイト名
    const ogSiteNameMatch = html.match(
      /<meta\s+property=["']og:site_name["']\s+content=["']([^"']*)["']/i
    );

    // タイトルの設定（OGPタイトル優先、次にHTMLタイトル）
    metadata.title = ogTitleMatch ? ogTitleMatch[1] : titleMatch ? titleMatch[1] : '';
    // 説明の設定（OGP説明優先、次にメタ説明）
    metadata.description = ogDescriptionMatch
      ? ogDescriptionMatch[1]
      : descriptionMatch
        ? descriptionMatch[1]
        : undefined;

    // 画像の設定
    if (ogImageMatch) {
      let imageUrl = ogImageMatch[1];

      // 相対URLを絶対URLに変換
      if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
      }

      metadata.image = imageUrl;
    }

    // サイト名の設定
    metadata.siteName = ogSiteNameMatch ? ogSiteNameMatch[1] : undefined;
  } catch (error) {
    console.error('HTMLパース中にエラーが発生しました:', error);
  }

  return metadata;
};

// URLからメタデータを取得する関数
export const fetchMetadata = async (url: string): Promise<URLMetadata> => {
  try {
    // CORSプロキシサーバーを使用（本番環境では自前のプロキシサーバーを使用することを推奨）
    const response = await axios.get(url, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; MetadataFetcher/1.0)',
      },
    });

    if (response.status === 200) {
      return extractMetadata(response.data, url);
    }

    // エラーの場合はデフォルトのメタデータを返す
    return {
      title: url,
      url: url,
      image: DEFAULT_NO_IMAGE_URL,
    };
  } catch (error) {
    console.error('メタデータの取得中にエラーが発生しました:', error);
    // エラーの場合はデフォルトのメタデータを返す
    return {
      title: url,
      url: url,
    };
  }
};
