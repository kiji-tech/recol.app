import OpenAI from 'openai';

const CoffeeShopReviewContent = `あなたは文章を読んで要約する天才です｡

### 命令
レビューの一覧を渡します｡
レビューの内容を要約して､以下のポイントについて箇条書きで回答して下さい｡

以下は例です｡
※ フォーマットだけ真似てください｡
【いいところ】
    ・◯◯のメニューが美味しかったです｡
    ・店内は静かで､落ち着いた雰囲気でした｡
    ・店員さんが親切でした｡
【ここが気になる】
    ・お値段が高いです｡
    ・お店が混んでいて､待ち時間が長かったです｡
    ・お店の雰囲気が暗かったです｡
`;

export const reviewAIAnalyze = async (reviews: string): Promise<string | null> => {
  const modelName = process.env.EXPO_PUBLIC_OPEN_AI_MODEL!;
  const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY });
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: CoffeeShopReviewContent },
        { role: 'user', content: reviews },
      ],
      model: modelName,
      top_p: 0.9,
      stream: false,
    });
    return completion.choices[0].message.content;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
