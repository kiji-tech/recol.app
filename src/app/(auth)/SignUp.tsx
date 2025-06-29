import React, { useState } from 'react';

import { BackgroundView, Button } from '@/src/components';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LogUtil } from '@/src/libs/LogUtil';

export default function SignUpScreen() {
  // ==== Member ===
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  // ==== Method ===
  const verify = (): boolean => {
    if (!email || !password || !password2) {
      alert('入力してください');
      return false;
    }
    if (password != password2) {
      alert('パスワードが一致しません');
      return false;
    }
    return true;
  };

  const signUpWithPassword = async () => {
    // verify
    if (!verify()) return;

    signup(email, password)
      .then(() => {
        router.navigate('/(home)/SettingsScreen');
      })
      .catch((error) => {
        if (error.code) {
          switch (error.code) {
            case 'user_already_exists':
              LogUtil.log(`すでに登録されているメールアドレス: ${email}`);
              Alert.alert('新規登録に失敗しました', 'すでに登録されているメールアドレスです｡');
              break;
            default:
              LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
              Alert.alert('新規登録に失敗しました');
          }
        }
      });
  };

  return (
    <BackgroundView>
      <View className="flex flex-col items-center w-full gap-8 ">
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
            placeholder="メールアドレス"
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="パスワード"
            placeholderTextColor="gray"
            className={`flex flex-row justify-center rounded-xl items-center border p-4 w-full text-md
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={password}
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
            secureTextEntry={true}
            onChangeText={(text) => setPassword2(text)}
            autoCapitalize="none"
          />

          {/* サインイン */}
          <Button theme={'theme'} text="新規登録" onPress={signUpWithPassword} />
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-xs border-b-[1px] text-light-text dark:text-dark-text border-light-border dark:border-dark-border ml-4">
              ログイン画面に戻る
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundView>
  );
}
