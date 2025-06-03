import React from 'react';
import { BackgroundView, Button } from '@/src/components';
import { Alert, Image, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
export default function SignInScreen() {
  // ==== Member ===
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ==== Method ===
  const verify = (): boolean => {
    if (!email || !password) {
      alert('入力してください');
      return false;
    }
    return true;
  };

  const signInWithPassword = async () => {
    // verify
    if (!verify()) return;
    login(email, password)
      .then(() => {
        router.navigate('/(home)');
      })
      .catch((e) => {
        Alert.alert(e.message);
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
          className="h-96 w-96 rounded-xl mb-4"
        />
        {/* form */}
        <TextInput
          keyboardType="email-address"
          placeholder="メールアドレス..."
          placeholderTextColor="gray"
          className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
          value={email}
          onChangeText={(text) => setEmail(text)}
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
        />

        {/* サインイン */}
        <View className="w-full flex flex-col gap-4 ">
          <Button theme={'theme'} text="サインイン" onPress={signInWithPassword} />
          <Button theme={'theme'} text="新規登録" onPress={() => router.push('/(auth)/SignUp')} />
          {/* TODO: Googleでサインイン */}
          {/* 新規登録 */}
        </View>
        {/* パスワードを忘れた */}
        <Link href="/(auth)/ForgetPassword" className="text-xs border-b-[1px] ">
          パスワードを忘れた方はこちら
        </Link>
      </View>
    </BackgroundView>
  );
}
