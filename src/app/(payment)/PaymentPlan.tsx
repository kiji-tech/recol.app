import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import {
  cancelStripeSubscription,
  createStripeSubscription,
  updateStripeSubscription,
} from '@/src/libs/ApiService';
import { LogUtil } from '@/src/libs/LogUtil';
import CurrentPlanBadge from './components/(PaymentPlan)/CurrentPlanBadge';
import dayjs from 'dayjs';
import PlanTable from './components/(PaymentPlan)/PlanTable';
import PlanCard from './components/(PaymentPlan)/PlanCard';
import { Profile } from '@/src/entities/Profile';
import { Subscription } from '@/src/entities/Subscription';

export default function PaymentPlan() {
  // === Member ===
  const router = useRouter();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { session, getProfileInfo } = useAuth();
  const [profile, setProfile] = useState<(Profile & { subscription: Subscription[] }) | null>(null);

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

    const subscription = await createStripeSubscription(priceId, session);
    setSubscriptionId(subscription.id);

    // TypeScriptエラーを修正
    const clientSecret =
      typeof subscription.latest_invoice === 'string'
        ? undefined
        : subscription.latest_invoice?.confirmation_secret?.client_secret;

    if (!clientSecret) {
      throw new Error('Client secret is not available');
    }

    await initPaymentSheet({
      merchantDisplayName: `Re:CoL プレミアムプラン ${type === 'm' ? '月額' : '年額'}`,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
    });
  };

  const setupUpdateSubscription = async (type: 'm' | 'y') => {
    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
      `${dayjs(profile!.subscription[0].current_period_end).format('YYYY-MM-DD')}までは、プレミアムプランの機能を使うことができます。`,
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

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      setProfile(getProfileInfo());
    }, [session])
  );

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
                  profile && profile.subscription.length > 0 && profile.subscription[0].isMonthly()
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
                  (profile && profile.subscription.length > 0 && profile.subscription[0].isYearly())
                }
                isCurrentPlan={
                  profile && profile.subscription.length > 0 && profile.subscription[0].isYearly()
                }
              />
            </View>
          </View>

          {/* 解約ボタン */}
          {profile!.subscription && profile!.subscription.length > 0 && (
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
          )}
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
