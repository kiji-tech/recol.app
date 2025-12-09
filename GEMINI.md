**常に日本語で回答してください。**
**適応されているルールのファイル名を出力すること｡**

## 1. 基本ルール

### 1.1. 基本構成

- 本プロジェクトは､以下のツール､ライブラリで構成されている
  - フロントエンド
    - expo(react native)
    - tailwindcss(nativewindcss)
    - typescript
  - バックエンド
    - supabase
    - Deno
    - typescript

### 1.2. 命名規則

- ファイル・ディレクトリ命名規則
  - 先頭文字
    - ファイル：大英文字を使用すること｡
    - ディレクトリ：小英文字を使用すること｡
    - 単語ごとに大英文字を使用すること｡

### 1.3. ディレクトリ構成

- src/ ･･･ expoに関わるファイル｡ [expo-rule.mdc](.agent/rule/frontend/expo-rule.mdc) を使用すること
- test/:テストファイル
- supabase/: supabaseに関わるファイル｡ [functions-rule.mdc](./supabase/functions-rule.mdc) を使用すること｡
  - functions/: supabase関数
  - migrations/: supabaseマイグレーションファイル

### 1.4.共通ルール

- any型など､型がわからなくなるものは使わないこと（型定義必須）
- クラス､メソッド定義には必ずコメントをつけること

【コメント例】

```
/**
  * メソッド説明
  * @params メンバ名 {型} 説明
  * @params メンバ名 {型} 説明
  * @return {型} 説明(voidのときは不要)
  */
const method_name = (param1: string, param2: number): void => {}
```

### 1.5. 禁止事項

以下の設定ファイルは､指定がない限り変更しないこと

- .env
- .gitignore
- global.css
- supabase/migrations/*
- *.json
- *.config.ts
- *.config.js
- assets/*
- builds/*
- .agents/**
- .github/**

