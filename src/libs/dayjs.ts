import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// 使用するロケールをインポート
import 'dayjs/locale/ja';
import 'dayjs/locale/en';
import { getLocales } from 'expo-localization';

// localizedFormatを有効化
dayjs.extend(localizedFormat);

// ユーザーのロケールを取得
const userLocale = getLocales()[0].languageCode || 'en';

// dayjsにロケールを設定
dayjs.locale(userLocale);
export default dayjs;
