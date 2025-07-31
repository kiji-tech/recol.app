import React, { useState, useEffect } from 'react';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { Alert, TextInput, View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LogUtil } from '@/src/libs/LogUtil';
import { supabase } from '@/src/libs/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// エラー型の定義
interface PasswordResetError {
  code?: string;
  message?: string;
}

// エラーハンドリング関数
const handlePasswordResetError = (error: unknown): void => {
  LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });

  const passwordError = error as PasswordResetError;

  if (passwordError?.code === 'same_password') {
    Alert.alert('新しいパスワードと同じパスワードは使用できません。');
  } else {
    Alert.alert('パスワードを変更できませんでした。');
  }
};

export default function ResetPassword() {
  const router = useRouter();
  const { updateUserPassword } = useAuth();
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token: string;
    refresh_token: string;
    expires_in: string;
    type: string;
  }>();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // トークンの有効性をチェック
    if (access_token && refresh_token) {
      checkTokenValidity();
    } else {
      setIsLoading(false);
    }
  }, [access_token, refresh_token]);

  const checkTokenValidity = async () => {
    try {
      // リカバリーセッション状態の登録
      await AsyncStorage.setItem('sessionType', 'recovery');
      // 一時的なセッションを設定
      const { data, error } = await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: refresh_token,
      });

      if (error) {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
        Alert.alert('無効なリンクです', 'パスワードリセットリンクが無効または期限切れです。');
        router.replace('/(auth)/SignIn');
        return;
      }

      // セッションが正常に設定された場合のみ有効とする
      if (data.session) {
        setIsValidToken(true);
      } else {
        Alert.alert('無効なリンクです', 'パスワードリセットリンクが無効または期限切れです。');
        router.replace('/(auth)/SignIn');
      }
    } catch (error) {
      LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
      Alert.alert(
        'エラーが発生しました',
        'パスワードリセットリンクの確認中にエラーが発生しました。'
      );
      router.replace('/(auth)/SignIn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isValidToken) {
      Alert.alert('無効なリンクです');
      return;
    }

    if (password !== password2) {
      Alert.alert('パスワードが一致しません');
      return;
    }

    try {
      // パスワードを更新
      await updateUserPassword(password);

      // パスワードリセット処理後にセッション情報をクリア
      await AsyncStorage.removeItem('sessionType');
      await supabase.auth.signOut();

      // ローカルストレージからセッション情報を削除
      await AsyncStorage.removeItem('sessionType');

      Alert.alert('パスワードを変更しました');
      router.navigate('/(auth)/SignIn');
    } catch (error) {
      handlePasswordResetError(error);
    }
  };

  if (isLoading) {
    return (
      <BackgroundView>
        <Header title="パスワードをリセット" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-light-text dark:text-dark-text">リンクを確認中...</Text>
        </View>
      </BackgroundView>
    );
  }

  if (!isValidToken) {
    return (
      <BackgroundView>
        <Header title="パスワードをリセット" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-light-text dark:text-dark-text">無効なリンクです</Text>
        </View>
      </BackgroundView>
    );
  }

  return (
    <BackgroundView>
      <Header title="パスワードをリセット" />
      <View className="w-full flex flex-col gap-4">
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
        <Button theme={'theme'} text="パスワードを変更する" onPress={handleResetPassword} />
      </View>
    </BackgroundView>
  );
}
