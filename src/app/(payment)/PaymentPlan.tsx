import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import {
  cancelStripeSubscription,
  createStripeSubscription,
  updateStripeSubscription,
} from '@/src/libs/ApiService';
import { LogUtil } from '@/src/libs/LogUtil';
import dayjs from 'dayjs';
import { SubscriptionUtil } from '@/src/libs/SubscriptionUtil';

const PlanItem = ({ title, free, premium }: { title: string; free: string; premium: string }) => {
  return (
    <View className="flex flex-row justify-between  border-light-border dark:border-dark-border border-b">
      <Text className="p-4 flex-1 text-center text-light-text dark:text-dark-text">{title}</Text>
      <Text className="p-4 w-32 text-center text-light-text dark:text-dark-text ">{free}</Text>
      <Text className="p-4 w-40 text-center text-light-text dark:text-dark-text font-bold">
        {premium}
      </Text>
    </View>
  );
};

const PlanTable = () => {
  return (
    <View className="">
      <View className="flex flex-row justify-between border-b border-light-border dark:border-dark-border">
        <Text className="p-4 flex-1" />
        <Text className="p-4 w-32 text-center text-light-text dark:text-dark-text ">フリー</Text>
        <Text className="p-4 w-40 text-center text-light-text dark:text-dark-text font-bold">
          プレミアム
        </Text>
      </View>
      <PlanItem title="プラン数" free="4プラン / 年" premium="20プラン / 年" />
      <PlanItem title="ストレージ容量" free="1GB / プラン" premium="100GB / プラン" />
      <PlanItem title="広告表示" free="○" premium="-" />
    </View>
  );
};

const SubscriptionInfo = () => {
  const { profile } = useAuth();
  return (
    <View>
      <Text className="text-light-text dark:text-dark-text">
        {SubscriptionUtil.isMonthly(profile!.subscription) ? '月額' : '年額'}プランに契約中です。
      </Text>
      <Text className="text-light-text dark:text-dark-text">
        プラン変更時は、未使用期間の料金を差し引いて計算します。
      </Text>
      <Text className="text-light-text dark:text-dark-text">
        有効期限は､{dayjs(profile!.subscription[0].current_period_end).format('YYYY-MM-DD')}
        までです。
      </Text>
    </View>
  );
};

export default function PaymentPlan() {
  const router = useRouter();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { session, profile } = useAuth();

  // === Method ===
  /** Stripeの支払いシートをセットアップ */
  const setupSubscription = async (type: 'm' | 'y') => {
    LogUtil.log('setup subscription.');
    const priceId =
      type == 'm'
        ? process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN
        : process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN;
    if (!priceId) {
      LogUtil.log({ type, priceId }, { level: 'error' });
      throw new Error('Price ID is not set');
    }
    LogUtil.log({ priceId }, { level: 'info' });

    const subscription = await createStripeSubscription(priceId, session);
    setSubscriptionId(subscription.id);
    await initPaymentSheet({
      merchantDisplayName: `Re:Col プレミアムプラン ${type === 'm' ? '月額' : '年額'}`,
      paymentIntentClientSecret: subscription.latest_invoice?.confirmation_secret?.client_secret,
      allowsDelayedPaymentMethods: true,
    });
  };

  const setupUpdateSubscription = async (type: 'm' | 'y') => {
    const priceId =
      type == 'm'
        ? process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN
        : process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN;

    updateStripeSubscription(profile!.subscription[0].uid, priceId || '', session)
      .then(() => {
        // 支払い完了画面へ遷移
        router.push('/(payment)/SubscriptionComplete');
      })
      .catch((e) => {
        Alert.alert('プランの更新に失敗しました。');
        LogUtil.log({ e }, { level: 'error', notify: true });
        return;
      });
  };

  /** プレミアムプランの支払い */
  const handlePayment = async (type: 'm' | 'y') => {
    LogUtil.log('handle payment.');
    setIsLoading(true);
    // すでにプレミアムプランに関する情報がある場合はプラン変更
    if (profile!.subscription && profile!.subscription.length > 0) {
      // Alert
      Alert.alert(
        'プランを更新しますか？',
        'プラン変更時は、未使用期間の料金を差し引いて計算します。',
        [
          { text: 'キャンセル', style: 'cancel' },
          { text: '更新する', style: 'destructive', onPress: () => setupUpdateSubscription(type) },
        ]
      );
      return;
    }
    // Subscriptionの作成
    await setupSubscription(type);

    // PaymentSheetの表示
    const { error } = await presentPaymentSheet();
    if (
      error &&
      (error.code === PaymentSheetError.Failed || error.code === PaymentSheetError.Canceled)
    ) {
      LogUtil.log({ error }, { level: 'error', notify: true });
      if (subscriptionId) {
        Alert.alert(`支払い${subscriptionId}に失敗しました.`, JSON.stringify(error));
        await cancelStripeSubscription(subscriptionId, session);
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
      `${dayjs(profile!.subscription[0].current_period_end).format('YYYY-MM-DD')}までは`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '解約する',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await cancelStripeSubscription(profile!.subscription[0].uid, session);
            setIsLoading(false);
          },
        },
      ]
    );
  };

  // === Render ===
  return (
    <BackgroundView>
      <Header title="プレミアムプラン" onBack={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-8 pb-8">
          {/* 前段 */}
          <View></View>
          {/* 比較表 */}
          <PlanTable />

          {profile!.subscription && profile!.subscription.length > 0 && <SubscriptionInfo />}

          {/* プレミアムプランはこちらから */}
          <View className="flex flex-row justify-around items-start gap-2">
            {/* 月額 */}
            {!SubscriptionUtil.isMonthly(profile!.subscription) && (
              <TouchableOpacity
                className="flex flex-col items-center justify-center bg-light-warn dark:bg-dark-warn rounded-md w-1/2 h-28 p-4"
                onPress={() => handlePayment('m')}
                disabled={isLoading && SubscriptionUtil.isMonthly(profile!.subscription)}
              >
                <Text className="text-3xl text-light-text dark:text-dark-text">400円</Text>
                <Text className="text-sm text-light-text dark:text-dark-text"> / 月額</Text>
              </TouchableOpacity>
            )}
            {/* 年額 */}
            {!SubscriptionUtil.isYearly(profile!.subscription) && (
              <TouchableOpacity
                className="flex flex-col items-center justify-center bg-light-danger dark:bg-dark-danger rounded-md w-1/2 h-28 p-4"
                onPress={() => handlePayment('y')}
                disabled={isLoading && SubscriptionUtil.isYearly(profile!.subscription)}
              >
                <Text className="text-3xl text-light-text dark:text-dark-text">4,000円</Text>
                <Text className="text-md text-light-text dark:text-dark-text"> / 年額</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* 解約 */}
          <View className="flex flex-row justify-center w-full">
            <Button
              text="解約する"
              onPress={handleCancel}
              disabled={isLoading}
              loading={isLoading}
              theme="danger"
            />
          </View>
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
