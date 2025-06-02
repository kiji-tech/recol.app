## 作業コマンド

### ios androidプロジェクトのbuild packageのupdate

```bash
$ npm run prebuild --clean
```

### 起動

`シミュレータ` 

```bash
# ios
$ npm run ios

# android ※広告を入れてからうごいいていない（25/3/21）
$ npm run android
```

`Supabase Edge Function` 

```bash
# ローカルサーバーでfunction起動
$ npm run functions:dev
```

`Supabase DB Types Generation` 

```bash
# DB - Table情報の更新
$ npm run generate:types:local
```

`AI Agent (OpenHands)`

```bash
$ npm run agent

# CUIで実行にする場合は､agentのコマンドに以下を追加する
$ npm run agent python -m openhands.core.cli
```

### テスト

```bash
$ npm run test
```

### デプロイコマンド

`アプリケーション`

```bash
# ローカルにビルドファイルを作成
$ eas build --local --platform android

# profileは､eas.jsonに定義しているものに依存する
$ eas build --profile preview --platform android ･･･ プレビュー環境にデプロイ
$ eas build --profile production --platform all ･･･ Storeアプリにビルド
```

`supabase edge function`

```bash
# 全functionsをデプロイ
$ npm run functions:deploy

# 特定のfunctionsをデプロイ
$ npm run functions:deploy [functions名]

```

`migration関係`

```bash
# ローカルとリモートの差分を確認する
$ supabase db diff

# 差分をmigrationンファイルに書き込む
$ supabase db diff -f [migrationファイル名]

# migrationファイルの反映状況を確認する
$ supabase migration list

# migrationファイルを反映させる
$ supabase db push
```

---

## ドキュメント

### React Native Maps

[GitHub](https://github.com/react-native-maps/react-native-maps/tree/master)

### Google Maps API

[公式ドキュメント](https://developers.google.com/maps/documentation/javascript/places?hl=ja)[Map関係のAPIまとめ](https://www.zenrin-datacom.net/solution/gmapsapi/media/g002)[プレイスタイプ](https://developers.google.com/maps/documentation/javascript/place-types?hl=ja)

### Supabase

[migrationのについて](https://supabase.com/docs/reference/cli/supabase-migration)