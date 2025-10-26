import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { resendConfirmationEmailLib } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';

/**
 * 新しいアカウントを作成するメールを送信した後の画面
 */
export default function RequestNewAccount() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const resendEmail = async () => {
    if (!email) {
      Alert.alert('エラー', 'メールアドレスが取得できませんでした。');
      return;
    }

    setIsLoading(true);
    LogUtil.log(`resendEmail: ${email}`, { level: 'info' });

    try {
      await resendConfirmationEmailLib(email);
      Alert.alert('成功', '確認メールを再送信しました。');
    } catch (error: unknown) {
      LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      Alert.alert('エラー', 'メールの再送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundView>
      <View className="flex flex-col items-center w-full gap-8 ">
        <Text className="text-4xl font-bold text-light-text dark:text-dark-text">
          メールアドレスに新しいアカウントを作成するメールを送信しました。
        </Text>
        {email && (
          <View className="w-full">
            <Text className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
              入力されたメールアドレス
            </Text>
            <View className="bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-xl p-4 w-full">
              <Text className="text-lg text-light-text dark:text-dark-text">{email}</Text>
            </View>
          </View>
        )}
        <Text className="text-lg text-light-text dark:text-dark-text">
          メールを確認して、アカウントを作成してください。
        </Text>
        <Button
          theme="theme"
          text="メールを再送信する"
          onPress={resendEmail}
          disabled={isLoading}
          loading={isLoading}
        />
        <Link href="/(auth)/SignIn">
          <Text className="text-lg text-light-text dark:text-dark-text">ログイン画面に戻る</Text>
        </Link>
      </View>
    </BackgroundView>
  );
}
