import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import { ExternalSignInButton, BackHomeLink, ReCoLTop, Bar } from '@/src/features/auth';

export default function SignInScreen() {
  // ==== Member ===
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ==== Method ===
  const verify = (): boolean => {
    if (!email) {
      Alert.alert('メールアドレスが入力されていません');
      return false;
    }
    if (!password) {
      Alert.alert('パスワードが入力されていません');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('メールアドレスの形式が正しくありません');
      return false;
    }

    return true;
  };

  /** ログイン処理 */
  const handleSignInWithPassword = async () => {
    if (!verify()) return;
    setIsLoading(true);
    login(email, password)
      .then(() => {
        router.navigate('/(home)');
      })
      .catch((e) => {
        LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
        Alert.alert('ログインに失敗しました');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <BackgroundView>
      <ScrollView>
        <View className="flex flex-col items-center w-full gap-8">
          <ReCoLTop />

          {/* form */}
          <View className="w-full flex flex-col gap-4">
            <TextInput
              keyboardType="email-address"
              placeholder="メールアドレス..."
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
              placeholder="パスワード..."
              placeholderTextColor="gray"
              className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
              value={password}
              editable={!isLoading}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />

            {/* サインイン */}
            <Button
              theme={'theme'}
              text="サインイン"
              onPress={handleSignInWithPassword}
              disabled={isLoading}
              loading={isLoading}
            />
            {/* 新規登録 */}
            <Button
              theme={'theme'}
              text="新規登録"
              onPress={() => router.push('/(auth)/SignUp')}
              disabled={isLoading}
              loading={isLoading}
            />
            {/* パスワードを忘れた */}
            <Link
              disabled={isLoading}
              href="/(auth)/ForgetPassword"
              className="text-sm text-light-text dark:text-dark-text ml-4"
            >
              パスワードを忘れた方はこちら
            </Link>

            <Bar text="または" />

            <ExternalSignInButton isLoading={isLoading} />
            <BackHomeLink />
          </View>
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
