import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// 使用するロケールをインポート
import 'dayjs/locale/ja';
import 'dayjs/locale/en';

// localizedFormatを有効化
dayjs.extend(localizedFormat);

// ユーザーのロケールを取得
const userLocale = navigator.language || 'ja';

// dayjsにロケールを設定
dayjs.locale(userLocale);
export default dayjs;
