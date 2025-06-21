import React, { useState } from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Image, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LogUtil } from '@/src/libs/LogUtil';
import GoogleSignInButton from '@/src/components/Common/GoogleSignInButton';
export default function SignInScreen() {
  // ==== Member ===
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ==== Method ===
  const verify = (): boolean => {
    if (!email || !password) {
      Alert.alert('メールアドレス､パスワードを正しく入力してください');
      return false;
    }
    return true;
  };

  const handleSignInWithPassword = async () => {
    if (!verify()) return;
    login(email, password)
      .then(() => {
        router.navigate('/(home)');
      })
      .catch((e) => {
        LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
        Alert.alert('メールアドレス､パスワードを正しく入力してください');
      });
  };

  return (
    <BackgroundView>
      <View className="flex flex-col items-center w-full gap-8">
        <Text className="text-4xl font-bold text-light-text dark:text-dark-text">
          Welcome to the Re:col
        </Text>
        {/* 画像 */}
        <Image
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/images/icon.png')}
          className="h-52 w-52 rounded-xl mb-4"
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
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
          />

          {/* サインイン */}
          <Button theme={'theme'} text="サインイン" onPress={handleSignInWithPassword} />
          {/* 新規登録 */}
          <Button theme={'theme'} text="新規登録" onPress={() => router.push('/(auth)/SignUp')} />
          {/* パスワードを忘れた */}
          <Link
            href="/(auth)/ForgetPassword"
            className="text-sm text-light-text dark:text-dark-text ml-4"
          >
            パスワードを忘れた方はこちら
          </Link>

          <View className="flex flex-row justify-center items-center gap-2 my-10">
            {/* Googleでサインイン */}
            <GoogleSignInButton />
          </View>
        </View>
      </View>
    </BackgroundView>
  );
}
