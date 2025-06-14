import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Enums } from '@/src/libs/database.types';

const PaymentPlanItem = ({
  paymentPlan,
  userPlan,
}: {
  paymentPlan: Enums<'PaymentPlan'>;
  userPlan: Enums<'PaymentPlan'> | null;
}) => {
  return (
    <View>
      <View className="border border-light-border dark:border-dark-border">
        {paymentPlan}
        {paymentPlan === userPlan && (
          <View className="bg-light-info dark:bg-dark-info h-10 w-10 rounded-full" />
        )}
      </View>
    </View>
  );
};

export default function PaymentPlan() {
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <BackgroundView>
      <Header title="" onBack={() => router.back()} />
      <View className="flex flex-col">
        <PaymentPlanItem paymentPlan="Free" userPlan={profile?.payment_plan || null} />
        <PaymentPlanItem paymentPlan="Basic" userPlan={profile?.payment_plan || null} />
        <PaymentPlanItem paymentPlan="Premium" userPlan={profile?.payment_plan || null} />
      </View>
    </BackgroundView>
  );
}
