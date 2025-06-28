import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
import dayjs from 'dayjs';
import { SubscriptionUtil } from '@/src/libs/SubscriptionUtil';
import { Tables } from '@/src/libs/database.types';

const PlanItem = ({
  title,
  free,
  premium,
  highlight = false,
}: {
  title: string;
  free: string;
  premium: string;
  highlight?: boolean;
}) => {
  return (
    <View
      className={`flex flex-row justify-between border-light-border dark:border-dark-border border-b ${highlight ? 'bg-light-primary/10 dark:bg-dark-primary/10' : ''}`}
    >
      <Text className="p-4 flex-1 text-center text-light-text dark:text-dark-text font-medium">
        {title}
      </Text>
      <Text className="p-4 w-32 text-center text-light-text dark:text-dark-text">{free}</Text>
      <View className="p-4 w-40 text-center">
        <Text className="text-light-primary dark:text-dark-primary font-bold">{premium}</Text>
        {highlight && (
          <View className="mt-1">
            <Text className="text-xs text-light-primary dark:text-dark-primary bg-light-primary/20 dark:bg-dark-primary/20 px-2 py-1 rounded-full">
              おすすめ
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const PlanTable = () => {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <View className="bg-light-primary dark:bg-dark-primary">
        <View className="flex flex-row justify-between">
          <Text className="p-4 flex-1 text-center text-white font-bold text-lg">機能</Text>
          <View className="p-4 w-32 text-center">
            <Text className="text-white font-bold">フリー</Text>
          </View>
          <View className="p-4 w-40 text-center">
            <Text className="text-white font-bold text-lg">プレミアム</Text>
            <Text className="text-white/80 text-xs">すべての機能が使える</Text>
          </View>
        </View>
      </View>
      <PlanItem title="プラン数" free="4プラン / 年" premium="20プラン / 年" highlight={true} />
      <PlanItem title="ストレージ容量" free="1GB / プラン" premium="100GB / プラン" />
      <PlanItem title="広告表示" free="○" premium="-" />
      {/* <PlanItem title="AI分析機能" free="-" premium="○" highlight={true} />
      <PlanItem title="優先サポート" free="-" premium="○" />
      <PlanItem title="データエクスポート" free="-" premium="○" /> */}
    </View>
  );
};

const CurrentPlanBadge = ({
  profile,
}: {
  profile: (Tables<'profile'> & { subscription: Tables<'subscription'>[] }) | null;
}) => {
  if (!profile?.subscription || profile.subscription.length === 0) {
    return (
      <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <Text className="text-center text-gray-600 dark:text-gray-300 font-medium">
          現在フリープランをご利用中です
        </Text>
        <Text className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          プレミアムプランにアップグレードして、すべての機能をお楽しみください
        </Text>
      </View>
    );
  }

  const isMonthly = SubscriptionUtil.isMonthly(profile);
  const endDate = dayjs(profile.subscription[0].current_period_end).format('YYYY年MM月DD日');

  return (
    <View className="bg-light-primary/10 dark:bg-dark-primary/10 rounded-lg p-4 border border-light-primary/20 dark:border-dark-primary/20">
      <View className="flex-row items-center justify-center mb-2">
        <View className="bg-light-primary dark:bg-dark-primary rounded-full px-3 py-1">
          <Text className="text-white text-sm font-bold">プレミアム</Text>
        </View>
        <Text className="ml-2 text-light-primary dark:text-dark-primary font-bold">
          {isMonthly ? '月額' : '年額'}プラン
        </Text>
      </View>
      <Text className="text-center text-light-text dark:text-dark-text">
        有効期限: {endDate}まで
      </Text>
    </View>
  );
};

const PlanCard = ({
  price,
  period,
  originalPrice,
  discount,
  isPopular = false,
  onPress,
  disabled = false,
  isCurrentPlan = false,
}: {
  price: string;
  period: string;
  originalPrice?: string;
  discount?: string;
  isPopular?: boolean;
  onPress: () => void;
  disabled?: boolean;
  isCurrentPlan?: boolean;
}) => {
  return (
    <TouchableOpacity
      className={`relative flex-1 rounded-xl p-4 ${
        isCurrentPlan
          ? 'bg-gray-300 dark:bg-gray-600'
          : isPopular
            ? 'bg-light-primary dark:bg-dark-primary'
            : 'bg-white dark:bg-gray-800'
      } border-2 ${
        isCurrentPlan
          ? 'border-gray-400 dark:border-gray-500'
          : isPopular
            ? 'border-light-primary dark:border-dark-primary'
            : 'border-gray-200 dark:border-gray-600'
      } shadow-lg ${disabled ? 'opacity-60' : ''}`}
      onPress={onPress}
      disabled={disabled}
    >
      {isPopular && !isCurrentPlan && (
        <View className="absolute -top-3 self-center">
          <View className="bg-light-danger dark:bg-dark-danger px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">人気</Text>
          </View>
        </View>
      )}

      {isCurrentPlan && (
        <View className="absolute -top-3 self-center">
          <View className="bg-light-info dark:bg-dark-info px-3 py-1 rounded-full">
            <Text className="text-light-text dark:text-dark-text text-xs font-bold">契約済み</Text>
          </View>
        </View>
      )}

      <View className="flex-1 items-center justify-center">
        {originalPrice && !isCurrentPlan && (
          <Text className={`text-sm line-through ${isPopular ? 'text-white/70' : 'text-gray-500'}`}>
            {originalPrice}
          </Text>
        )}
        <Text
          className={`text-3xl font-bold ${
            isCurrentPlan
              ? 'text-gray-600 dark:text-gray-300'
              : isPopular
                ? 'text-white'
                : 'text-light-text dark:text-dark-text'
          }`}
        >
          {price}
        </Text>
        <Text
          className={`text-sm ${
            isCurrentPlan
              ? 'text-gray-500 dark:text-gray-400'
              : isPopular
                ? 'text-white/80'
                : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          / {period}
        </Text>
        {discount && !isCurrentPlan && (
          <View className="mt-2 bg-light-danger dark:bg-dark-danger px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">{discount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function PaymentPlan() {
  // === Member ===
  const router = useRouter();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { session, getProfileInfo } = useAuth();
  const [profile, setProfile] = useState<
    (Tables<'profile'> & { subscription: Tables<'subscription'>[] }) | null
  >(null);

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
      merchantDisplayName: `Re:Col プレミアムプラン ${type === 'm' ? '月額' : '年額'}`,
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
              より良い旅を体験
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
              無制限のプラン作成、AI分析機能、優先サポートで
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              あなたの旅をより豊かにします
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
                price="400円"
                period="月額"
                onPress={() => handlePayment('m')}
                disabled={isLoading || SubscriptionUtil.isMonthly(profile!)}
                isCurrentPlan={SubscriptionUtil.isMonthly(profile!)}
              />
              <PlanCard
                price="4,000円"
                period="年額"
                originalPrice="4,800円"
                discount="17%OFF"
                isPopular={true}
                onPress={() => handlePayment('y')}
                disabled={isLoading || SubscriptionUtil.isYearly(profile!)}
                isCurrentPlan={SubscriptionUtil.isYearly(profile!)}
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
