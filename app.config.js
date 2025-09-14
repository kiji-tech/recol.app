export default {
  scheme: 'recol',
  name: 'Re:CoL',
  slug: 'yuru-tabi',
  version: '1.0.5',
  deepLinking: true,
  icon: './assets/images/icon.png',
  owner: 'shinji5761',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  jsEngine: 'hermes',
  newArchEnabled: false,
  ios: {
    icon: './assets/images/icon.png',
    supportsTablet: true,
    usesAppleSignIn: true,
    bundleIdentifier: 'com.libetech.recol',
    infoPlist: {
      NSCameraUsageDescription: 'カメラを使ってプロフィール画像を設定します',
      NSPhotoLibraryUsageDescription: 'アカウントのアイコン､計画事に画像の登録します',
      NSLocationWhenInUseUsageDescription:
        '地図を表示する際の初期表示位置を設定するために使用します',
      NSUserTrackingUsageDescription:
        '広告表示の最適化のため、他社アプリとの横断的な計測を許可するか確認します',
      ITSAppUsesNonExemptEncryption: false,
    },
    userInterfaceStyle: 'automatic',
    deploymentTarget: '15.1',
    googleServicesFile: process.env.GOOGLE_SERVICES_IOS_FILE ?? './google-services.plist',
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      usesNonExemptEncryption: false, // 輸出コンプライアンスの回答
    },
  },
  android: {
    package: 'com.libetech.recol',
    packageName: 'com.libetech.recol',
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
    userInterfaceStyle: 'automatic',
    googleServicesFile: process.env.GOOGLE_SERVICES_ANDROID_FILE ?? './google-services.json',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: '35.0.0',
        },
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '15.1',
        },
      },
    ],
    'expo-router',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],
    [
      'expo-tracking-transparency',
      {
        userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.',
      },
    ],
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/images/icon.png',
        resizeMode: 'contain',
        imageWidth: 300,
        duration: 1000,
        fade: true,
        backgroundColor: '#000000',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: 'ca-app-pub-2018656716460271~9761357839',
        iosAppId: 'ca-app-pub-2018656716460271~5429184177',
        skAdNetworkItems: [
          'cstr6suwn9.skadnetwork',
          '4fzdc2evr5.skadnetwork',
          '2fnua5tdw4.skadnetwork',
          'ydx93a7ass.skadnetwork',
          'p78axxw29g.skadnetwork',
          'v72qych5uu.skadnetwork',
          'ludvb6z3bs.skadnetwork',
          'cp8zw746q7.skadnetwork',
          '3sh42y64q3.skadnetwork',
          'c6k4g5qg8m.skadnetwork',
          's39g8k73mm.skadnetwork',
          '3qy4746246.skadnetwork',
          'f38h382jlk.skadnetwork',
          'hs6bdukanm.skadnetwork',
          'mlmmfzh3r3.skadnetwork',
          'v4nxqhlyqp.skadnetwork',
          'wzmmz9fp6w.skadnetwork',
          'su67r6k2v3.skadnetwork',
          'yclnxrl5pm.skadnetwork',
          't38b2kh725.skadnetwork',
          '7ug5zh24hu.skadnetwork',
          'gta9lk7p23.skadnetwork',
          'vutu7akeur.skadnetwork',
          'y5ghdn5j9k.skadnetwork',
          'v9wttpbfk9.skadnetwork',
          'n38lu8286q.skadnetwork',
          '47vhws6wlr.skadnetwork',
          'kbd757ywx3.skadnetwork',
          '9t245vhmpl.skadnetwork',
          'a2p9lx4jpn.skadnetwork',
          '22mmun2rn5.skadnetwork',
          '44jx6755aq.skadnetwork',
          'k674qkevps.skadnetwork',
          '4468km3ulz.skadnetwork',
          '2u9pt9hc89.skadnetwork',
          '8s468mfl3y.skadnetwork',
          'klf5c3l5u5.skadnetwork',
          'ppxm28t8ap.skadnetwork',
          'kbmxgpxpgc.skadnetwork',
          'uw77j35x4d.skadnetwork',
          '578prtvx9j.skadnetwork',
          '4dzt52r2t5.skadnetwork',
          'tl55sbb4fm.skadnetwork',
          'c3frkrj4fj.skadnetwork',
          'e5fvkxwrpn.skadnetwork',
          '8c4e2ghe7u.skadnetwork',
          '3rd42ekr43.skadnetwork',
          '97r2b46745.skadnetwork',
          '3qcr597p9d.skadnetwork',
        ],
        userTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads to you.',
      },
    ],
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme: 'com.googleusercontent.apps.264549282449-siu16baee5bbs7f2i599eu0ul0kgfst4',
      },
    ],
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: 'merchant.com.libetech.recol',
      },
    ],
    'expo-apple-authentication',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'c85fb288-4763-4861-afe1-77ae452bbd97',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/c85fb288-4763-4861-afe1-77ae452bbd97',
  },
};
