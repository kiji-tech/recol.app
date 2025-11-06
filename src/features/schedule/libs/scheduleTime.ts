import dayjs from 'dayjs';

/**
 * fromとtoを引数にとり、時間が逆転していたら転置する
 * @param from {string} 開始時刻
 * @param to {string} 終了時刻
 * @return {{ from: string, to: string }} 転置済みの開始時刻と終了時刻
 */
export const normalizeScheduleTime = (from: string, to: string): { from: string; to: string } => {
  const startTime = dayjs(from);
  const endTime = dayjs(to);

  // toがfromより前の場合、転置する
  if (endTime.isBefore(startTime)) {
    return {
      from: to,
      to: from,
    };
  }

  return {
    from,
    to,
  };
};

/**
 * from > toの場合、toをfrom+1時間にする
 * @param from {string} 開始時刻
 * @param to {string} 終了時刻
 * @return {{ from: string, to: string }} 調整済みの開始時刻と終了時刻
 */
export const adjustEndAtWhenReversed = (from: string, to: string): { from: string; to: string } => {
  const startTime = dayjs(from);
  const endTime = dayjs(to);

  // from > toの場合、toをfrom+1時間にする
  if (startTime.isAfter(endTime)) {
    return {
      from,
      to: startTime.add(1, 'hour').format('YYYY-MM-DDTHH:mm:00.000Z'),
    };
  }

  return {
    from,
    to,
  };
};

/**
 * from < toの場合、fromをto-1時間にする
 * @param from {string} 開始時刻
 * @param to {string} 終了時刻
 * @return {{ from: string, to: string }} 調整済みの開始時刻と終了時刻
 */
export const adjustStartAtWhenNormal = (from: string, to: string): { from: string; to: string } => {
  const startTime = dayjs(from);
  const endTime = dayjs(to);

  // from < toの場合、fromをto-1時間にする
  if (endTime.isBefore(startTime)) {
    return {
      from: endTime.add(-1, 'hour').format('YYYY-MM-DDTHH:mm:00.000Z'),
      to,
    };
  }

  return {
    from,
    to,
  };
};
