## 作業コマンド

### ios androidプロジェクトのbuild packageのupdate

`ios`

```shell
$ npm run install:ios
```

`android`

```shell
$ npm run install:android
```

### 起動

`シミュレータ`

```shell
# ios
$ npm run ios

# android
$ npm run android
```

`Supabase Edge Function`

```shell
# ローカルサーバーでfunction起動
$ npm run functions:dev
```

`Supabase DB Types Generation`

```shell
# DB - Table情報の更新
$ npm run generate:types:local
```

`AI Agent (OpenHands)`

```shell
$ npm run agent

# CUIで実行にする場合は､agentのコマンドに以下を追加する
$ npm run agent python -m openhands.core.cli
```

### テスト

```shell
$ npm run test
```

### デプロイコマンド

`アプリケーション`

```shell
# ローカルにビルドファイルを作成
$ eas build --local --platform android
# profileは､eas.jsonに定義しているものに依存する
$ eas build --profile preview --platform android ･･･ プレビュー環境にデプロイ
$ eas build --profile production --platform all      ･･･ Storeアプリにビルド
```

`supabase edge function`

```shell
# 全functionsをデプロイ
$ npm run functions:deploy

# 特定のfunctionsをデプロイ
$ npm run functions:deploy [functions名]
```

`migration関係`

```shell
# ローカルとリモートの差分を確認する
$ supabase db diff

# 差分をmigrationンファイルに書き込む
$ supabase db diff -f [migrationファイル名]

# migrationファイルの反映状況を確認する
$ supabase migration list

# migrationファイルを反映させる
$ supabase db push
```

## トラブルシューティング

`Scrollが動かない`

react-nativeのスクロール系のタグ（ScrollViewやFlatListView）は入れ子にできない｡
→ react-native-gesture-handlerを使う

```typescript
import { ScrollView } from 'react-native';  ･･･ NG
import { ScrollView } from 'react-native-gesture-handler'; ･･･ ◯
...

<ScrollView>
  <ScrollView> </ScrollView>
</ScrollView>
```

`schema xxxx`

```shell
$ npx expo prebuild --clean
```

`pod install でエラー`

```shell
# ロックファイルの削除
$ rm -rf ios/Pods ios/Podfile.lock

# iosライブラリの更新
cd ios && pod repo update
pod install --repo-update

# react-nativeとexpoのバージョンがあっていない場合がある
# package.jsonのバージョンとかをチェックして､node_modulesを削除・再インストールなど
# ios/Podfile のiosバージョンがあっていないなど -> 15.1にする

```

`ios simulatorが更新されて見つからない`

```
# エラー内容
CommandError: Failed to build iOS project. "xcodebuild" exited with error code 70.
 ...
    { platform:iOS, id:dvtdevice-DVTiPhonePlaceholder-iphoneos:placeholder, name:Any iOS Device, error:iOS 18.2 is not installed. To use with Xcode, first download and install the platform }
```

`error: Codegen did not run properly in your project. Please reinstall cocoapods with 'bundle exec pod install'`
一度モジュールの削除と､ツールの再インストール

```shell
#npmキャッシュのクリア
$ npm cache clean --force

#node_modulesディレクトリとPodfile.lockの削除
$ rm -rf node_modules ios/Pods ios/Podfile.lock

#npm依存関係の再インストール
$ npm install
#または
$ yarn install

#CocoaPodsのキャッシュのクリア
$ pod cache clean --all

#CocoaPodsのインストール
$ cd ios
$ pod install

#npx pod-installの使用
$ cd ..
$ npx pod-install
```

`Possible unhandled promise rejection`

TryCatchなどで､Promise（非同期処理）をハンドリングされずにいると､warningとして出力される

```typescript
// -> catchがないため､失敗した際のハンドリングがない
const response = await fetch(url);

// TryCatch､もしくは.catch()でハンドリングする
try {
  const response = await fetch(url);
} catch (error) {
  console.error(error);
}
```

## ドキュメント

### React Native Maps

[GitHub](https://github.com/react-native-maps/react-native-maps/tree/master)

### Google Maps API

[公式ドキュメント](https://developers.google.com/maps/documentation/javascript/places?hl=ja)
[Map関係のAPIまとめ](https://www.zenrin-datacom.net/solution/gmapsapi/media/g002)
[プレイスタイプ](https://developers.google.com/maps/documentation/javascript/place-types?hl=ja)

### Supabase

[migrationのについて](https://supabase.com/docs/reference/cli/supabase-migration)
