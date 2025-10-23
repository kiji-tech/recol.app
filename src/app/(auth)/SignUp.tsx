import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import ExternalSignInButton from './components/ExternalSignInButton';
import BackHomeLink from './components/BackHomeLink';
import ReCoLTop from './components/ReCoLTop';
import Bar from './components/Bar';

export default function SignUpScreen() {
  // ==== Member ===
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ==== Method ===
  const verify = (): boolean => {
    if (!email) {
      Alert.alert('メールアドレスが入力されていません');
      return false;
    }
    if (!password || !password2) {
      Alert.alert('パスワードが入力されていません');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('メールアドレスの形式が正しくありません');
      return false;
    }

    if (password != password2) {
      Alert.alert('パスワードが一致しません');
      return false;
    }

    return true;
  };

  /** 新規登録処理 */
  const signUpWithPassword = async () => {
    // verify
    if (!verify()) return;
    LogUtil.log(`signUpWithPassword: ${email}`, { level: 'info' });
    setIsLoading(true);
    signup(email, password)
      .then(() => {
        // メールを送信しました
        router.navigate('/(auth)/RequestNewAccount');
      })
      .catch((error) => {
        // TODO エラーの種類によってメッセージを変える
        if (error.code) {
          switch (error.code) {
            case 'user_already_exists':
              LogUtil.log(`すでに登録されているメールアドレス: ${email}`);
              Alert.alert('新規登録に失敗しました', 'すでに登録されているメールアドレスです｡');
              break;
            default:
              LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
              Alert.alert('新規登録に失敗しました', error.message);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <BackgroundView>
      <View className="flex flex-col items-center w-full gap-8 ">
        <ReCoLTop />
        {/* form */}
        <View className="w-full flex flex-col gap-4">
          <TextInput
            placeholder="メールアドレス"
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={email}
            editable={!isLoading}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="パスワード"
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border`}
            value={password}
            editable={!isLoading}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="パスワード（確認）"
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={password2}
            editable={!isLoading}
            secureTextEntry={true}
            onChangeText={(text) => setPassword2(text)}
            autoCapitalize="none"
          />

          {/* サインイン */}
          <Button
            theme={'theme'}
            text="新規登録"
            onPress={signUpWithPassword}
            disabled={isLoading}
            loading={isLoading}
          />
          <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
            <Text className="text-sm text-light-text dark:text-dark-text ml-4">
              ログイン画面に戻る
            </Text>
          </TouchableOpacity>
          <Bar text="または" />
          <ExternalSignInButton isLoading={isLoading} />
          <BackHomeLink />
        </View>
      </View>
    </BackgroundView>
  );
}
