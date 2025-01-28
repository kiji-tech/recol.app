
## React Native Maps
[GitHub](https://github.com/react-native-maps/react-native-maps/tree/master)

## Google Maps API
[ドキュメント](https://developers.google.com/maps/documentation/javascript/places?hl=ja)

[Map関係のAPIまとめ](https://www.zenrin-datacom.net/solution/gmapsapi/media/g002)


## デプロイコマンド
### supabase edge function
```
$ npm run functions:deploy
```


### アプリケーション
```shell
$ eas build --platform android
```


## DBマイグレーションについて
[migrationのについて](https://supabase.com/docs/reference/cli/supabase-migration)
```
# ローカルとリモートの差分を確認する
$ supabase db diff

# 差分をmigrationンファイルに書き込む
$ supabase db diff -f [migrationファイル名]

# migrationファイルの反映状況を確認する
$ supabase migration list

# migrationファイルを反映させる
$ supabase db push
```


