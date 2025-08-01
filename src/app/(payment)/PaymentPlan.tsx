import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { useRouter } from 'expo-router';
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import {
  cancelStripeSubscription,
  setupUpdateSubscription,
  setupCreateSubscription,
} from '@/src/features/payment';
import { LogUtil } from '@/src/libs/LogUtil';
import CurrentPlanBadge from './components/(PaymentPlan)/CurrentPlanBadge';
import dayjs from 'dayjs';
import PlanTable from './components/(PaymentPlan)/PlanTable';
import PlanCard from './components/(PaymentPlan)/PlanCard';

export default function PaymentPlan() {
  // === Member ===
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { presentPaymentSheet } = useStripe();
  const { session, profile } = useAuth();

  // === Method ===
  // TODO: setupSubscriptionとupdateSubscriptionはViewには関係ないので分離したい

  /** プレミアムプランの支払い */
  const handlePayment = async (type: 'm' | 'y') => {
    // すでにプレミアムプランに関する情報がある場合はプラン変更
    if (profile!.subscription && profile!.subscription.length > 0) {
      // Alert
      Alert.alert(
        'プランを更新しますか？',
        'プラン変更時は、未使用期間の料金を差し引いて計算します。',
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '更新する',
            style: 'destructive',
            onPress: async () => {
              setIsLoading(true);
              setupUpdateSubscription(profile!.subscription[0], type, session)
                .then(() => {
                  // 支払い完了画面へ遷移
                  router.push('/(payment)/SubscriptionComplete');
                })
                .catch((e) => {
                  Alert.alert('プランの更新に失敗しました。');
                  LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
                  return;
                })
                .finally(() => {
                  setIsLoading(false);
                });
            },
          },
        ]
      );
      return;
    }
    // Subscriptionの作成
    const subscription = await setupCreateSubscription(type, session);
    // PaymentSheetの表示
    const { error } = await presentPaymentSheet();
    if (
      error &&
      (error.code === PaymentSheetError.Failed || error.code === PaymentSheetError.Canceled)
    ) {
      LogUtil.log({ error }, { level: 'error', notify: true });
      if (subscription.id) {
        Alert.alert(`支払い${subscription.id}に失敗しました.`, JSON.stringify(error));
        await cancelStripeSubscription(subscription.id!, session);
      }
    } else {
      // Payment succeeded
      // 支払い完了画面へ遷移
      router.push('/(payment)/SubscriptionComplete');
    }
  };

  /** プレミアムプランの解約 */
  const handleCancel = async () => {
    LogUtil.log('handle cancel.');
    if (!profile!.subscription || profile!.subscription.length == 0) {
      Alert.alert('プレミアムプランには契約していません。');
      return;
    }

    Alert.alert(
      'プレミアムプランを解約しますか？',
      `${dayjs(profile!.subscription[0].current_period_end).format('YYYY-MM-DD')}までは、プレミアムプランの機能を使うことができます。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '解約する',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            cancelStripeSubscription(profile!.subscription[0].uid!, session)
              .then(() => {
                Alert.alert('プランを解約しました。\n有効期限終了後にフリープランに戻ります。');
                router.navigate('/');
              })
              .catch((e) => {
                Alert.alert('プランの解約に失敗しました。');
                LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
                return;
              })
              .finally(() => {
                setIsLoading(false);
              });
          },
        },
      ]
    );
  };

  // === Render ===
  if (!profile) return;
  return (
    <BackgroundView>
      <Header onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex flex-col gap-6 pb-8 px-4">
          {/* ヘッダーセクション */}
          <View className="items-center py-4">
            <Text className="text-2xl font-bold text-light-text dark:text-dark-text text-center">
              プレミアムプランで
            </Text>
            <Text className="text-2xl font-bold text-light-primary dark:text-dark-primary text-center">
              より良い休日を体験
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              あなたの旅･休日をより豊かにします
            </Text>
          </View>

          {/* 現在のプラン状況 */}
          <CurrentPlanBadge profile={profile} />

          {/* 比較表 */}
          <View>
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
              プラン比較
            </Text>
            <PlanTable />
          </View>

          {profile.subscription.length > 0 && profile.subscription[0].isCanceled() && (
            <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <View className="flex-row items-center justify-center mb-2">
                <View className="bg-gray-500 dark:bg-gray-400 rounded-full px-3 py-1">
                  <Text className="text-white text-sm font-bold">解約予定</Text>
                </View>
              </View>
              <Text className="text-center text-gray-600 dark:text-gray-300 font-medium">
                解約のリクエストを受け付けました
              </Text>
              <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                有効期限終了後にフリープランに戻ります
              </Text>
            </View>
          )}

          {profile.subscription.length > 0 && !profile.subscription[0].isCanceled() && (
            <>
              {/* プラン選択 */}
              <View>
                <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
                  プランを選択
                </Text>
                <View className="flex flex-row gap-3">
                  <PlanCard
                    price="500円"
                    period="月額"
                    onPress={() => handlePayment('m')}
                    disabled={
                      isLoading ||
                      (profile &&
                        profile.subscription.length > 0 &&
                        profile.subscription[0].isMonthly())
                    }
                    isCurrentPlan={
                      profile &&
                      profile.subscription.length > 0 &&
                      profile.subscription[0].isMonthly()
                    }
                  />
                  <PlanCard
                    price="5,000円"
                    period="年額"
                    originalPrice="6,000円"
                    discount="17%OFF"
                    isPopular={true}
                    onPress={() => handlePayment('y')}
                    disabled={
                      isLoading ||
                      (profile &&
                        profile.subscription.length > 0 &&
                        profile.subscription[0].isYearly())
                    }
                    isCurrentPlan={
                      profile &&
                      profile.subscription.length > 0 &&
                      profile.subscription[0].isYearly()
                    }
                  />
                </View>
              </View>

              {/* 解約ボタン */}
              <View className="items-center">
                <Button
                  text="プレミアムプランを解約"
                  onPress={handleCancel}
                  disabled={isLoading}
                  loading={isLoading}
                  theme="danger"
                />
                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
                  有効期限終了後にフリープランに戻ります
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
