---
trigger: glob
globs: supabase/**/*.ts
---

## ディレクトリ構成

- supabase/
  - functions/(機能)/: 各種RestAPIの機能別ディレクトリ（例：profile, schedule, version-check）
    - vn: APIバージョン別ディレクトリ n=1,2,3....
      - index.ts: HonoでRestAPIの設定を行うためのファイル｡[index.ts](./index.ts)を参考にすること｡
      - xxx.ts: 任意のRestAPIの実行ファイル｡RestAPI単位でファイルを作成すること｡
        - [fetchProfile](./fetchProfile.ts)を参考にすること
        - xxxのファイル名は**[fetch | create | update | delete][機能名].ts**っとすること
      - deno.json: 機能ごとに必要なライブラリなどを定義するためのファイル
  - functions/libs/: すべてのRestAPIで共通で利用するファイルをまとめる｡Utilityファイルなど｡
  - migrations/: supabaseのDBマイグレーションファイル｡**編集しないこと**
  - config.toml: supabaseをローカルで実行するときの設定ファイル
  - seed.sql: supabaseの初期シード値を設定するためのファイル **編集しないこと**

## 追加・変更ルール

- DBの構造はファイル[database.types.ts](../../../supabase/functions/libs/database.types.ts)を参考にすること
- 該当する機能がない場合はディレクトリを追加すること
- すでに同じ機能がある場合は､ファイルを追加して､機能を書くこと
- index.tsファイルには直接機能を書かないこと｡HonoでRestAPIの受け口だけを書くこと
- ユーザー認証が必要な場合は､withUserメソッドを使うこと
- Logなど､幅広いファイルで使う機能についてはlibsディレクトリの下にファイルを作成・編集すること

## エラーハンドリング

- すべての関数で統一されたエラーハンドリングを使用すること
- try-catchブロックは使用せず､各処理ステップを別メソッドに分離して可読性を向上させること
- エラー発生時は適切なHTTPステータスコードとエラーメッセージを返すこと
- エラーログは必ずLogUtilを使用して出力すること

## ログ出力

- すべてのログ出力はLogUtilを使用すること
- ログレベルに応じて適切なメソッドを使用すること（info, warn, error等）
- デバッグ情報や処理の流れを追跡できるよう適切なログを出力すること

### ログ出力のサンプルコード

```typescript
import { LogUtil } from '../libs/LogUtil.ts';

// 基本的なログ出力
LogUtil.log('処理開始', { level: 'info' });
LogUtil.log('データベース接続成功', { level: 'info' });

// エラーログ（Slack通知付き）
LogUtil.log('データベースエラーが発生しました', {
  level: 'error',
  notify: true,
  error: new Error('Connection failed'),
  additionalInfo: { userId: 'user123', operation: 'fetchProfile' },
});

// 警告ログ
LogUtil.log('不正なリクエストが検出されました', {
  level: 'warn',
  additionalInfo: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0...' },
});

// デバッグ情報
LogUtil.log('処理完了', {
  level: 'info',
  additionalInfo: {
    processingTime: '150ms',
    recordCount: 25,
    userId: 'user123',
  },
});
```

## 認証・認可

- すべてのAPIエンドポイントでユーザー認証を必須とすること
- JWTトークンの検証は統一された方法で行うこと
- SupabaseのSession確認は @withUser.tsx

## 返却について

- ResponseUtil.success､ResponseUtil.errorを使うこと
- エラーコードはsrc/languages/xx.jsonに定義されている **MESSAGE** にあるものを使うこと