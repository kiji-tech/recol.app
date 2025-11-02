import { generateShareMessage } from '@/src/features/schedule';
import { Plan } from '@/src/features/plan';
import dayjs from 'dayjs';

describe('##### generateShareMessage Test #####', () => {
  // plan
  const plan = {
    uid: 'plan uid',
    title: 'title text',
    description: 'description text',
    memo: 'memo text',
    schedule: [
      {
        title: '移動',
        description: '移動の説明',
        category: 'Movement',
        place_list: [],
        from: dayjs('2025-01-01 10:00:00').toISOString(),
        to: dayjs('2025-01-01 13:00:00').toISOString(),
      },
      {
        title: 'カフェ',
        description: 'カフェの説明',
        category: 'Cafe',
        place_list: [
          {
            displayName: { text: 'カフェ1', languageCode: 'ja' },
            googleMapsUri: 'https://maps.google.com/?cid=カフェ１',
          },
          {
            displayName: { text: 'カフェ2', languageCode: 'ja' },
            googleMapsUri: 'https://maps.google.com/?cid=カフェ２',
          },
        ],
        from: dayjs('2025-01-01 13:00:00').toISOString(),
        to: dayjs('2025-01-01 14:00:00').toISOString(),
      },
    ],
  };

  test('共有メッセージの作成', () => {
    const expected = `【Re:CoL】title text
■■■メモ■■■
memo text

■■■予定■■■
---------------------------------------------
- 2025/1/1 10:00 〜 13:00
- 移動
- 移動の説明
---------------------------------------------
- 2025/1/1 13:00 〜 14:00
- カフェ
- カフェの説明
●カフェ1
https://maps.google.com/?cid=カフェ１

●カフェ2
https://maps.google.com/?cid=カフェ２
---------------------------------------------
`;
    try {
      const result = generateShareMessage(plan as unknown as Plan);
      expect(result).toEqual(expected);
    } catch (e) {
      fail(e);
    }
  });
});
