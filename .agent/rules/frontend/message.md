---
trigger: glob
globs: src/**/*.tsx,src/**/*.ts,supabase/**/*.ts,
---

## メッセージ・コードに関するルール

### サーバー側
- supabase/
    - 結果コードを返却する
    - コードは **{"code" : "XYYYY"}** とする
```typescript
return c.json({code: "XYYYY"});
```


## クライアント側
- src/ 
    - コードを受け取って､該当のメッセージを言語ごとに作成する
    - メッセージは **src/languages/xx.json**（xxは言語コード）で管理する
        - メッセージの仕様については ./language.md を参照
    - **MESSAGE.XYYYY**のように､コードごとにメッセージを用意する
    X ･･･ 接頭辞（W: ワーニング E: エラー I: インフォメーション）
    YYYY ･･･ コード番号 0埋めの数字4桁

