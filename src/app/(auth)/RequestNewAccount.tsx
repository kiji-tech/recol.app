import React from 'react';
import { BackgroundView } from '@/src/components';
import { Button, Text, View } from 'react-native';
import { Link } from 'expo-router';

/**
 * 新しいアカウントを作成するメールを送信した後の画面
 */
export default function RequestNewAccount() {
  const resendEmail = () => {
    console.log('メールを再送信する');
  };

  return (
    <BackgroundView>
      <View className="flex flex-col items-center w-full gap-8 ">
        <Text className="text-4xl font-bold text-light-text dark:text-dark-text">
          メールアドレスに新しいアカウントを作成するメールを送信しました。
        </Text>
        <Text className="text-lg text-light-text dark:text-dark-text">
          メールを確認して、アカウントを作成してください。
        </Text>
        <Button title="メールを再送信する" onPress={resendEmail} />
        <Link href="/(auth)/SignIn">
          <Text className="text-lg text-light-text dark:text-dark-text">ログイン画面に戻る</Text>
        </Link>
      </View>
    </BackgroundView>
  );
}
