import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LogUtil } from '@/src/libs/LogUtil';
import GoogleSignInButton from '@/src/components/Common/GoogleSignInButton';
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
      <View className="flex flex-col items-center w-full gap-8">
        <Text className="text-4xl font-bold text-light-text dark:text-dark-text">
          Welcome to the Re:CoL
        </Text>
        {/* 画像 */}
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/images/icon.png')}
          style={{
            width: 208,
            height: 208,
            borderRadius: 100,
            marginBottom: 16,
          }}
        />
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

          <View className="flex flex-row justify-center items-center gap-4 mt-4">
            <View className="w-1/3 h-px bg-light-border dark:bg-dark-border"></View>
            <Text className="text-sm text-light-text dark:text-dark-text">または</Text>
            <View className="w-1/3 h-px bg-light-border dark:bg-dark-border"></View>
          </View>

          <View className="flex flex-row justify-center items-center gap-2">
            {/* Googleでサインイン */}
            <GoogleSignInButton disabled={isLoading} />
          </View>
        </View>
      </View>
    </BackgroundView>
  );
}
