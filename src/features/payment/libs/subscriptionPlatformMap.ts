import { monthlyPayment, yearlyPayment } from '../types/Payment';
import { ISubscriptionPay } from './iSubscriptionPay';
import { SubscriptionGooglePay } from './subscriptionGooglePay';

/** プラットフォームごとのSubscriptionMAPの作成 */
const subscriptionPlatformMap = new Map<string, Map<'monthly' | 'yearly', ISubscriptionPay>>();

const androidSubscriptionMap = new Map<'monthly' | 'yearly', ISubscriptionPay>();
const androidMonthlySubscription = new SubscriptionGooglePay({
  subscription: null,
  payment: monthlyPayment,
} as SubscriptionGooglePay);
const androidYearlySubscription = new SubscriptionGooglePay({
  subscription: null,
  payment: yearlyPayment,
} as SubscriptionGooglePay);
androidSubscriptionMap.set('monthly', androidMonthlySubscription);
androidSubscriptionMap.set('yearly', androidYearlySubscription);
subscriptionPlatformMap.set('android', androidSubscriptionMap);

// const iosSubscriptionMap = new Map<'monthly' | 'yearly', ISubscriptionPay>();
// const iosMonthlySubscription = new SubscriptionApplePay({
//   subscription: null,
//   payment: monthlyPayment,
//   session: null,
// } as SubscriptionApplePay);
// const iosYearlySubscription = new SubscriptionApplePay({
//   subscription: null,
//   payment: yearlyPayment,
//   session: null,
// } as SubscriptionApplePay);
// iosSubscriptionMap.set('monthly', iosMonthlySubscription);
// iosSubscriptionMap.set('yearly', iosYearlySubscription);
// subscriptionPlatformMap.set('ios', iosSubscriptionMap);
export { subscriptionPlatformMap };
