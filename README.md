## このサービスについて

### 開発ツール

```mermaid
---
title: 開発構成図
---
flowchart LR

app[Expo]
blog[microCMS]
subgraph supabase
    backend[Edge Functions]
    auth[Authenticate]
    storage[Storage]
    db@{ shape: cyl, label: "DataBase" }
end

map[Google Maps API]

app -- email, Google, Apple --> auth
app --> map
app --> blog

storage --> app
backend --> storage
app -- REST API --> backend
backend --> db
```

### 使用技術

| カテゴリ       | 仕様技術                                                        |
| -------------- | --------------------------------------------------------------- |
| Frontend       | TypeScript, Expo, React ReactNative, TailwindCSS(NativewindCSS) |
| Backend        | TypeScript, Supabase Edge Functions, Deno, Hono                 |
| DB             | SupabaseDB(PostgreSQL)                                          |
| Storage        | Supabase Storage                                                |
| Infra          | Supabase, EAS                                                   |
| その他サービス | Google Maps sApi, Stripe, microCMS, SupabaseAuthenticate        |

### 画面構成

| ホームスクリーン                                   | 計画一覧スクリーン                                      |
| -------------------------------------------------- | ------------------------------------------------------- |
| <img width="120" src="./images/home-screen.png" /> | <img width="120" src="./images/plan-list-screen.png" /> |
| microCMSで取得した記事を表示する｡                  | 作成した計画を一覧表示する｡                             |

| 設定スクリーン                                                  | 計画作成・編集スクリーン                           |
| --------------------------------------------------------------- | -------------------------------------------------- |
| <img width="120" src="./images/settings-screen.png" />          | <img width="120" src="./images/plan-editor.png" /> |
| Re:CoLのアプリ設定､画面｡<br />通知､ダークモード､プラン変更など｡ | 計画を作成､編集するための画面｡                     |

| スケジュールスクリーン                                                              | スケジュール作成スクリーン                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| <img width="120" src="./images/schedule-screen.png" />                              | <img width="120" src="./images/schedule-editor-screen.png" /> |
| 作成した計画の詳細を表示する｡<br/>計画にはスケジュールと画像を登録することができる｡ | 計画にスケジュールを登録するための画面｡                       |

| メディアスクリーン                                            | マップスクリーン                                                      |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| <img width="120" src="./images/media-screen.png" />           | <img width="120" src="./images/map-screen.png" />                     |
| 計画事に登録されている画像の表示､登録､削除をすることができる｡ | スケジュールに登録されているマップ（プレイス情報）をまとめて表示する｡ |

| ログイン                                               | 新規登録                                             |
| ------------------------------------------------------ | ---------------------------------------------------- |
| <img width="120" src="./images/signin-screen.png" />   | <img width="120" src="./images/signup-screen.png" /> |
| ログイン画面<br />iOS→AppleSignin<br />Android →Google |                                                      |

| パスワードリセット                                     |     |
| ------------------------------------------------------ | --- |
| <img width="120" src="./images/forget-password.png" /> |     |
| パスワードを忘れた場合にリセットリクエストを送信する｡  |     |

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
