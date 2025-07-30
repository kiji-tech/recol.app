import { Linking } from 'react-native';
import { Article } from '@/src/features/article/types/Article';

/**
 * ReLCoLの記事に該当するURLをブラウザで開く
 * @param article 記事
 */
export async function openBrowser(article: Article) {
  const url = `${process.env.EXPO_PUBLIC_WEB_URI}/articles/${article.id}`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    throw new Error('Invalid URL');
  }
}
