import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { useAuth } from '@/src/features/auth';
import { useRouter } from 'expo-router';
import { LogUtil } from '@/src/libs/LogUtil';
import CurrentPlanBadge from './components/(PaymentPlan)/CurrentPlanBadge';
import dayjs from 'dayjs';
import PlanTable from './components/(PaymentPlan)/PlanTable';
import PlanCard from './components/(PaymentPlan)/PlanCard';
import { usePremiumPlan } from '@/src/features/auth/hooks/usePremiumPlan';
import { PurchasesPackage } from 'react-native-purchases';

export default function PaymentPlan() {
  // === Member ===
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { session, profile } = useAuth();
  const { isPremium, onSubmit, onRestore, premiumPlanList } = usePremiumPlan();

  // === Method ===
  // TODO: setupSubscriptionとupdateSubscriptionはViewには関係ないので分離したい

  /** プレミアムプランの支払い */
  const handlePayment = async (payment: PurchasesPackage) => {
    if (!session) {
      Alert.alert('セッション情報がありません。');
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
        level: 'error',
        notify: true,
      });
      Alert.alert('支払いに失敗しました。お問い合わせからご連絡ください。');
    } finally {
      setIsLoading(false);
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
            onRestore()
              .then(() => {
                Alert.alert(
                  'Re:CoLのプレミアムプランを解約しました。\n有効期限終了後にフリープランに戻ります。'
                );
                router.navigate('/');
              })
              .catch((e) => {
                Alert.alert('Re:CoLのプレミアムプランの解約に失敗しました。');
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

          {/* プラン選択 */}
          <View>
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
              プランを選択
            </Text>
            <View className="flex flex-row gap-3">
              {premiumPlanList &&
                premiumPlanList.availablePackages &&
                premiumPlanList.availablePackages.map((p: PurchasesPackage) => (
                  <PlanCard
                    key={p.product.identifier}
                    payment={p}
                    onPress={() => handlePayment(p)}
                    disabled={isLoading}
                    isCurrentPlan={
                      false
                      //   p.product.identifier === premiumPlanList.entitlements.active.Premium
                    }
                  />
                ))}
            </View>
          </View>

          {/* 解約ボタン */}
          {isPremium && (
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
