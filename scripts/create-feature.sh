#!/bin/bash

# 引数（機能名）を取得
feature_name=$1

# すでに機能名のディレクトリが存在する場合はエラーを出力して終了
if [ -d "src/features/$feature_name" ]; then
  echo "Error: $feature_name already exists"
  exit 1
fi

# 機能名のディレクトリを作成
mkdir -p "src/features/$feature_name"

# 機能名のディレクトリにindex.tsを作成
touch "src/features/$feature_name/index.ts"

# 機能に必要なディレクトリを作成する
mkdir -p "src/features/$feature_name/types"
mkdir -p "src/features/$feature_name/apis"
mkdir -p "src/features/$feature_name/components"
mkdir -p "src/features/$feature_name/hooks"
mkdir -p "src/features/$feature_name/libs"