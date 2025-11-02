import dayjs from 'dayjs';

/**
 * 指定された時間が現在時刻から見て過去かどうかを判定する
 * @param from 開始時刻
 * @param to 終了時刻
 * @returns 過去 = -1 現在 = 0 未来 = 1
 */
export const isTargetTime = (from: string, to: string) => {
  const now = dayjs();
  const fromTime = dayjs(from);
  const toTime = dayjs(to);

  if (fromTime.isBefore(now) && toTime.isAfter(now)) {
    return 0;
  } else if (fromTime.isBefore(now)) {
    return -1;
  } else {
    return 1;
  }
};
