import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import ja from '../languages/ja.json';
import fr from '../languages/fr.json';
import de from '../languages/de.json';

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: en,
  ja: ja,
  fr: fr,
  de: de,
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

export default i18n;
