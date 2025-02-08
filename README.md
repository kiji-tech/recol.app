## 技術スタック
- expo
- react-native
- google map api
- tailwindcss
- nativewind
- openai
- jest
- typescript
- zod

## 作業コマンド

### ios androidプロジェクトのbuild packageのupdate

``ios``
```shell
$ npm run install:ios
```

``android``
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

### テスト

```shell
$ npm run test
```

### デプロイコマンド

`supabase edge function`

```shell
$ npm run functions:deploy
```

`アプリケーション`

```shell
$ eas build --platform android
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

### npm run ios
`schema xxxx`
```shell
$ npx expo prebuild --clean
```

`pod install でエラー`

```shell
# ロックファイルの削除
$ rm -rf ios/Pods ios/Podfile.lock

# iosライブラリの更新
cd ios && pod repo updateい
pod install --repo-update

# react-nativeとexpoのバージョンがあっていない場合がある
# package.jsonのバージョンとかをチェックして､node_modulesを削除・再インストールなど
# ios/Podfile のiosバージョンがあっていないなど

```

`ios simulatorが更新されて見つからない`

```
# エラー内容
CommandError: Failed to build iOS project. "xcodebuild" exited with error code 70.
 ...
    { platform:iOS, id:dvtdevice-DVTiPhonePlaceholder-iphoneos:placeholder, name:Any iOS Device, error:iOS 18.2 is not installed. To use with Xcode, first download and install the platform }
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
