import appJson from './app.json' assert { type: 'json' };

export default {
  ...appJson.expo,
  android: {
    ...appJson.expo.android,
    // EAS ビルダー上では env、ローカル開発では実ファイル
    googleServicesFile: process.env.GOOGLE_SERVICES_ANDROID_FILE ?? './google-services.json',
  },
  ios: {
    ...appJson.expo.ios,
    googleServicesFile: process.env.GOOGLE_SERVICES_IOS_FILE ?? './google-services.plist',
  },
};
