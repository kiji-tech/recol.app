import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { useRouter } from 'expo-router';
import {
  PaymentSheetError,
  useStripe,
  confirmPlatformPayPayment,
  PlatformPay,
} from '@stripe/stripe-react-native';
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
import { Payment } from '@/src/features/payment/types/Payment';

export default function PaymentPlan() {
  // === Member ===
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { presentPaymentSheet } = useStripe();
  const { session, profile } = useAuth();

  // === Method ===
  // TODO: setupSubscriptionとupdateSubscriptionはViewには関係ないので分離したい

  const handleApplyPay = async (payment: Payment) => {
    try {
      setIsLoading(true);

      if (profile!.subscription && profile!.subscription.length > 0) {
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
                setupUpdateSubscription(profile!.subscription[0], payment, session)
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

      // Apple Pay用のSubscriptionを作成
      const subscription = await setupCreateSubscription(
        payment.period === '月額' ? 'm' : 'y',
        session
      );

      // PaymentIntentのclient_secretを取得
      const clientSecret =
        typeof subscription.latest_invoice === 'string'
          ? undefined
          : subscription.latest_invoice?.confirmation_secret?.client_secret;

      if (!clientSecret) {
        throw new Error('Client secret is not available for Apple Pay');
      }

      LogUtil.log(`Apple Pay用のclient_secretを取得: ${clientSecret.substring(0, 20)}...`, {
        level: 'info',
        notify: true,
      });

      const { error } = await confirmPlatformPayPayment(clientSecret, {
        applePay: {
          cartItems: [
            {
              paymentType: PlatformPay.PaymentType.Recurring,
              intervalUnit:
                payment.period === '月額'
                  ? PlatformPay.IntervalUnit.Month
                  : PlatformPay.IntervalUnit.Year,
              intervalCount: 1,
              label: `Re:CoL プレミアムプラン`,
              amount: payment.price.toString(),
            },
          ],
          merchantCountryCode: 'JP',
          currencyCode: 'JPY',
          requiredShippingAddressFields: [PlatformPay.ContactField.PostalAddress],
          requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
        },
      });

      if (error) {
        LogUtil.log(`Apple Pay支払いに失敗しました: ${error.message}`, {
          level: 'warn',
          notify: true,
        });
        if (subscription.id) {
          await cancelStripeSubscription(subscription.id, session);
        }
      } else {
        LogUtil.log(`Apple Pay支払いが成功しました`, {
          level: 'info',
          notify: true,
        });
        router.push('/(payment)/SubscriptionComplete');
      }
    } catch (error) {
      LogUtil.log(`Apple Pay支払いの処理中にエラーが発生しました: ${JSON.stringify(error)}`, {
        level: 'error',
        notify: true,
      });
      Alert.alert('Apple Pay支払いに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  /** 通常の支払い処理（Apple Pay失敗時のフォールバック） */
  const handleRegularPayment = async (payment: Payment) => {
    try {
      setIsLoading(true);

      // Subscriptionの作成
      const subscription = await setupCreateSubscription(
        payment.period === '月額' ? 'm' : 'y',
        session
      );

      // PaymentSheetの表示
      const { error } = await presentPaymentSheet();
      if (
        error &&
        (error.code === PaymentSheetError.Failed || error.code === PaymentSheetError.Canceled)
      ) {
        LogUtil.log(JSON.stringify(error), { level: 'error', notify: true });
        if (subscription.id) {
          LogUtil.log(`支払い${subscription.id}に失敗しました.`, {
            level: 'warn',
            notify: true,
          });
          await cancelStripeSubscription(subscription.id!, session);
        }
      } else {
        // Payment succeeded
        // 支払い完了画面へ遷移
        router.push('/(payment)/SubscriptionComplete');
      }
    } catch (error) {
      LogUtil.log(`通常支払いの処理中にエラーが発生しました: ${JSON.stringify(error)}`, {
        level: 'error',
        notify: true,
      });
      Alert.alert('支払いの処理に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  /** プレミアムプランの支払い */
  const handlePayment = async (payment: Payment) => {
    if (Platform.OS === 'ios') {
      try {
        await handleApplyPay(payment);
      } catch (error) {
        LogUtil.log(`Apple Pay支払いに失敗しました: ${JSON.stringify(error)}`, {
          level: 'error',
          notify: true,
        });
        Alert.alert('Apple Pay支払いに失敗しました。お問い合わせからご連絡ください。');
      }
      return;
    }

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
              setupUpdateSubscription(profile!.subscription[0], payment, session)
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

    // 通常の支払い処理を実行
    await handleRegularPayment(payment);
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

  // ===Memo ===
  /** プランリスト */
  const paymentPlanList = [
    new Payment({
      price: 500,
      period: '月額',
      disabled:
        isLoading ||
        (profile && profile.subscription.length > 0 && profile.subscription[0].isMonthly()) ||
        false,
      isCurrentPlan:
        (profile && profile.subscription.length > 0 && profile.subscription[0].isMonthly()) ||
        false,
      priceId: process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN || '',
    }),
    new Payment({
      price: 5000,
      period: '年額',
      disabled:
        isLoading ||
        (profile && profile.subscription.length > 0 && profile.subscription[0].isYearly()) ||
        false,
      isCurrentPlan:
        (profile && profile.subscription.length > 0 && profile.subscription[0].isYearly()) || false,
      priceId: process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN || '',
      originalPrice: 6000,
    }),
  ];

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

          {/* プラン選択 */}
          {profile.subscription.length == 0 || !profile.subscription[0].isCanceled() ? (
            <View>
              <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
                プランを選択
              </Text>
              <View className="flex flex-row gap-3">
                {paymentPlanList.map((payment) => (
                  <PlanCard
                    key={payment.period}
                    price={`${payment.price.toLocaleString()}円`}
                    discount={
                      payment.originalPrice
                        ? `${(((payment.originalPrice - payment.price) / payment.originalPrice) * 100).toFixed(0)}%OFF`
                        : undefined
                    }
                    isPopular={payment.originalPrice ? true : false}
                    period={payment.period}
                    originalPrice={
                      payment.originalPrice
                        ? `${payment.originalPrice.toLocaleString()}円`
                        : undefined
                    }
                    onPress={() => handlePayment(payment)}
                    disabled={payment.disabled}
                    isCurrentPlan={payment.isCurrentPlan}
                  />
                ))}
              </View>
            </View>
          ) : (
            <></>
          )}
          {profile.subscription.length > 0 && (
            <>
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
