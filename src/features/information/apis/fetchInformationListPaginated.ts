import { Information, InformationType } from '@/src/features/information';
import { Platform } from 'react-native';
import dayjs from 'dayjs';

/**
 * お知らせ一覧の取得（ページネーション対応）
 * @param {number} offset - 取得開始位置
 * @param {number} limit - 取得件数
 * @return {Promise<{ informationList: Information[]; totalCount: number }>} お知らせ一覧と総件数
 */
export async function fetchInformationListPaginated(
  offset: number = 0,
  limit: number = 10
): Promise<{ informationList: Information[]; totalCount: number }> {
  // 今日の日付を取得（YYYY-MM-DD形式）
  const todayString = dayjs().format('YYYY-MM-DD');
  // 現在のプラットフォームを取得（"ios"または"android"）
  const currentPlatform = Platform.OS;

  // microCMSのフィルタ: endAtがnull（未設定）または今日以降のもののみ取得
  // かつ、platformが現在のプラットフォームを含む、またはplatformが未設定のもの
  const filters = `endAt[greater_than]${todayString}[or]endAt[not_exists][and]platform[contains]${currentPlatform}[or]platform[not_exists]`;
  const url = new URL(`${process.env.EXPO_PUBLIC_MICROCMS_URI!}/news`);
  url.searchParams.append('filters', filters);
  url.searchParams.append('offset', offset.toString());
  url.searchParams.append('limit', limit.toString());
  // 最新の通知を上から順に表示するため、startAtで降順ソート
  url.searchParams.append('orders', '-startAt');

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-MICROCMS-API-KEY': process.env.EXPO_PUBLIC_MICROCMS_API_KEY! },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch information list');
  }

  const data = await response.json();
  const informationList = data.contents.map((content: InformationType) => new Information(content));
  const totalCount = data.totalCount || 0;

  return { informationList, totalCount };
}
