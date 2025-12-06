import React, { useState } from 'react';
import { Alert, Linking, ScrollView, Text, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { useRouter } from 'expo-router';
import { LogUtil } from '@/src/libs/LogUtil';
import { usePremiumPlan } from '@/src/features/auth/hooks/usePremiumPlan';
import { PurchasesPackage } from 'react-native-purchases';
import { CurrentPlanBadge, PlanTable, PlanCard } from '@/src/features/payment';
import generateI18nMessage from '@/src/libs/i18n';

export default function PaymentPlan() {
  // === Member ===
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { session, profile, user } = useAuth();
  const { activePlanId, managementURL, onSubmit, onRefetch, premiumPlanList } = usePremiumPlan();

  // === Method ===
  /**
   * 現在のプランIDと購入パッケージのIDが一致しているかどうかを判定する
   * @param payment {PurchasesPackage} 購入パッケージ
   * @returns {boolean} 現在のプランIDと一致しているかどうか
   */
  const checkActivePlanId = (payment: PurchasesPackage) => {
    return activePlanId === payment.product.identifier;
  };

  /**
   * プレミアムプランの支払い
   * @param payment {PurchasesPackage} 購入パッケージ
   * @returns {Promise<void>} プレミアムプランの支払い
   */
  const handlePayment = async (payment: PurchasesPackage) => {
    if (!session) {
      Alert.alert(generateI18nMessage('FEATURE.PAYMENT.NO_SESSION'));
      router.push('/(auth)/SignIn');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit(payment);
      router.push('/(payment)/SubscriptionComplete');
    } catch (e) {
      // ユーザーの意思でキャンセルされた場合
      if (e && (e as { userCancelled?: boolean }).userCancelled) return;
      LogUtil.log(`支払いに失敗しました: ${JSON.stringify(e)}`, {
        user,
        level: 'error',
        notify: true,
      });
      Alert.alert(generateI18nMessage('FEATURE.PAYMENT.PAYMENT_FAILED'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * プレミアムプランの解約イベントハンドラ
   */
  const handleCancel = async () => {
    if (profile && !profile.isPremiumUser()) {
      Alert.alert(generateI18nMessage('FEATURE.PAYMENT.NOT_PREMIUM'));
      return;
    }

    Alert.alert(
      generateI18nMessage('FEATURE.PAYMENT.CANCEL_CONFIRM_TITLE'),
      generateI18nMessage('FEATURE.PAYMENT.CANCEL_CONFIRM_MESSAGE'),
      [
        { text: generateI18nMessage('COMMON.CANCEL'), style: 'cancel' },
        {
          text: generateI18nMessage('FEATURE.PAYMENT.CANCEL_PREMIUM'),
          style: 'destructive',
          onPress: async () => {
            Linking.openURL(managementURL || '').then(async () => {
              await onRefetch();
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
              {generateI18nMessage('FEATURE.PAYMENT.PREMIUM_TITLE_1')}
            </Text>
            <Text className="text-2xl font-bold text-light-primary dark:text-dark-primary text-center">
              {generateI18nMessage('FEATURE.PAYMENT.PREMIUM_TITLE_2')}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              {generateI18nMessage('FEATURE.PAYMENT.PREMIUM_SUBTITLE')}
            </Text>
          </View>
          {/* 現在のプラン状況 */}
          <CurrentPlanBadge profile={profile} />
          {/* 比較表 */}
          <View>
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
              {generateI18nMessage('FEATURE.PAYMENT.PLAN_COMPARISON')}
            </Text>
            <PlanTable />
          </View>
          {/* プラン選択 */}
          <View>
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
              {generateI18nMessage('FEATURE.PAYMENT.SELECT_PLAN')}
            </Text>
            <View className="flex flex-col gap-8">
              {premiumPlanList.length > 0 &&
                premiumPlanList.map((p: PurchasesPackage) => (
                  <PlanCard
                    key={p.product.identifier}
                    payment={p}
                    onPress={() => handlePayment(p)}
                    disabled={isLoading || checkActivePlanId(p)}
                    isCurrentPlan={checkActivePlanId(p)}
                    discount={
                      (1 -
                        premiumPlanList[1].product.pricePerYear! /
                          premiumPlanList[0].product.pricePerYear!) *
                      100
                    }
                  />
                ))}
            </View>
          </View>
          {/* 解約ボタン */}
          {profile?.isPremiumUser() && (
            <View className="items-center">
              <Button
                text={generateI18nMessage('FEATURE.PAYMENT.CANCEL_PREMIUM_BUTTON')}
                onPress={handleCancel}
                disabled={isLoading}
                loading={isLoading}
                theme="danger"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
