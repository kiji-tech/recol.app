import { Information, InformationType } from '@/src/features/information';
import { Platform } from 'react-native';
import dayjs from 'dayjs';

/**
 * お知らせ一覧の取得
 * endAtが今日を過ぎているものは除外する
 * 起動しているプラットフォームでフィルタリングする
 */
export async function fetchInformationList() {
  // 今日の日付を取得（YYYY-MM-DD形式）
  const todayString = dayjs().format('YYYY-MM-DD');
  // 現在のプラットフォームを取得（"ios"または"android"）
  const currentPlatform = Platform.OS;

  // microCMSのフィルタ: endAtがnull（未設定）または今日以降のもののみ取得
  // かつ、platformが現在のプラットフォームを含む、またはplatformが未設定のもの
  const filters = `endAt[greater_than]${todayString}[or]endAt[not_exists][and]platform[contains]${currentPlatform}[or]platform[not_exists]`;
  const url = new URL(`${process.env.EXPO_PUBLIC_MICROCMS_URI!}/news`);
  url.searchParams.append('filters', filters);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch information list');
  }

  const informationList = await response.json();
  return informationList.contents.map((content: InformationType) => new Information(content));
}
