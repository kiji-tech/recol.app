import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import React, { useState } from 'react';
import { Alert, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LogUtil } from '@/src/libs/LogUtil';
import { useTheme } from '@/src/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEmailForm } from '@/src/contexts/useEmailForm';

export default function ForgetPassword() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { isDarkMode } = useTheme();
  const { email, EmailForm, validateEmail, setEmailError } = useEmailForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    // バリデーション
    if (email.trim() === '') {
      setEmailError('メールアドレスを入力してください');
      return;
    }

    if (!validateEmail()) {
      setEmailError('正しいメールアドレスを入力してください');
      return;
    }

    setEmailError('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      Alert.alert(
        'メール送信完了',
        'パスワードをリセットするためのメールを送信しました。\nメールをご確認ください。',
        [
          {
            text: 'OK',
            onPress: () => router.navigate('/(auth)/SignIn'),
          },
        ]
      );
    } catch (error) {
      LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      Alert.alert(
        'エラー',
        'パスワードをリセットするためのメールを送信できませんでした。\nメールアドレスをご確認の上、再度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundView>
      <Header onBack={() => router.back()} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center py-8">
          {/* アイコンと説明 */}
          <View className="items-center mb-8">
            <View
              className={`w-20 h-20 rounded-full items-center justify-center mb-4 bg-light-theme dark:bg-dark-theme`}
            >
              <MaterialIcons
                name="lock-reset"
                size={40}
                color={isDarkMode ? '#ECECEC' : '#2A2A2A'}
              />
            </View>
            <Text className="text-light-text dark:text-dark-text text-xl font-bold text-center mb-2">
              パスワードをリセット
            </Text>
            <Text className="text-light-text dark:text-dark-text text-center text-base opacity-80 leading-6">
              登録済みのメールアドレスを入力してください。{'\n'}
              パスワードリセット用のリンクをお送りします。
            </Text>
          </View>

          {/* メールアドレス入力 */}
          <View className="mb-6">
            <EmailForm isLoading={isLoading} />
          </View>

          {/* リセットボタン */}
          <Button
            text="パスワードをリセット"
            theme="theme"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
          />

          {/* 注意事項 */}
          <View className="mt-6 p-4 rounded-lg bg-light-info dark:bg-dark-info">
            <View className="flex-row items-start">
              <MaterialIcons
                name="info"
                size={20}
                color={isDarkMode ? '#ECECEC' : '#2A2A2A'}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <Text className="text-light-text dark:text-dark-text text-sm leading-5 flex-1">
                メールが届かない場合は、迷惑メールフォルダもご確認ください。{'\n'}
                数分待っても届かない場合は、メールアドレスをご確認の上再度お試しください。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
