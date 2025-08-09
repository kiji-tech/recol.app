import { BackgroundView, Header, Button } from '@/src/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { deleteAccount } from '@/src/features/auth';
import { useAuth } from '@/src/features/auth';

interface ConsentItem {
  id: string;
  text: string;
  checked: boolean;
}

export default function RemoveAccount() {
  const router = useRouter();
  const { theme } = useTheme();
  const { logout, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [consentItems, setConsentItems] = useState<ConsentItem[]>([
    {
      id: 'subscription_cancel',
      text: '有効なサブスクリプションは自動的にキャンセルされます。',
      checked: false,
    },
    {
      id: 'premium_refund',
      text: 'プレミアムプランの期間が残っていた場合でも返金することはできません。',
      checked: false,
    },
    {
      id: 'plan_restore',
      text: 'このアカウントに紐づいている計画は､削除後復元することはできません。',
      checked: false,
    },
  ]);

  const isDarkMode = theme === 'dark';
  const allItemsChecked = consentItems.every((item) => item.checked);

  // チェックボックスの状態を切り替え
  const toggleConsent = (id: string) => {
    setConsentItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // アカウント削除処理
  const handleDeleteAccount = async () => {
    Alert.alert(
      'アカウント削除の確認',
      '本当にアカウントを削除しますか？この操作は取り消すことができません。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除する',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteAccount(session);
              Alert.alert('アカウント削除完了', 'アカウントが正常に削除されました。', [
                {
                  text: 'OK',
                  onPress: async () => {
                    await logout();
                    router.replace('/(auth)/SignIn');
                  },
                },
              ]);
            } catch (error) {
              Alert.alert(
                'エラー',
                error instanceof Error ? error.message : 'アカウント削除に失敗しました。'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <BackgroundView>
      <Header title="アカウント削除" onBack={() => router.back()} />

      <View className="flex-1 px-6 py-8">
        {/* 警告メッセージ */}
        <View className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={20} color={isDarkMode ? '#fca5a5' : '#dc2626'} />
            <Text className="ml-2 text-red-600 dark:text-red-400 font-bold text-base">
              重要な注意事項
            </Text>
          </View>
          <Text className="text-red-700 dark:text-red-300 text-sm leading-6">
            アカウントを削除すると、すべてのデータが完全に削除され、復元することはできません。
            削除を実行する前に、以下の項目をよくお読みになり、同意していただく必要があります。
          </Text>
        </View>

        {/* 同意項目 */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
            削除に関する同意事項
          </Text>
          {consentItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleConsent(item.id)}
              className="flex-row items-center py-4 px-4 mb-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-border dark:border-dark-border"
            >
              <View className="mr-2">
                <Ionicons
                  name={item.checked ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={
                    item.checked
                      ? isDarkMode
                        ? '#3b82f6'
                        : '#2563eb'
                      : isDarkMode
                        ? '#6b7280'
                        : '#9ca3af'
                  }
                />
              </View>
              <Text className="flex-1 text-light-text dark:text-dark-text text-sm leading-6">
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 削除ボタン */}
        <View className="mt-auto">
          <Button
            text="アカウントを削除する"
            onPress={handleDeleteAccount}
            theme="danger"
            disabled={!allItemsChecked || isLoading}
            loading={isLoading}
          />

          <Text className="text-center text-xs text-light-text dark:text-dark-text mt-4 opacity-70">
            すべての同意項目にチェックを入れると削除ボタンが有効になります
          </Text>
        </View>
      </View>
    </BackgroundView>
  );
}
