const Messages = {
  C001: 'ログインユーザーが見つかりません｡\n再度ログインし直してください｡',
  C002: '{0}を登録しました｡',
  C003: '{0}を更新しました｡',
  C004: '{0}を削除しました｡',
  C005: '{0}の取得に失敗しました｡',
  C006: '{0}の登録に失敗しました｡',
  C007: '{0}の更新に失敗しました｡',
  C008: '{0}の削除に失敗しました｡',
  C009: 'データ項目（{0}）が見つかりません｡',
  PP001: 'プランの作成数が制限を超えています\nプランを更新してください｡',
  M001: 'ストレージ容量が{0}GBを超えています｡\nプランを更新してください｡',
};
const getMessage = (code: string, params: string[] = []): string => {
  const message = Messages[code as keyof typeof Messages] || '';
  // パラメータを置換
  return message.replace(/{(\d+)}/g, (match, p1) => params[parseInt(p1)] || '');
};

export { getMessage };
