import { Tables } from '@/src/libs/database.types';

export class SubscriptionUtil {
  static isMonthly(subscription?: Tables<'subscription'>[]): boolean {
    if (!subscription) return false;
    return (
      subscription &&
      subscription.length > 0 &&
      subscription[0].price_id === `${process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN}`
    );
  }

  static isYearly(subscription?: Tables<'subscription'>[]): boolean {
    if (!subscription) return false;
    return (
      subscription &&
      subscription.length > 0 &&
      subscription[0].price_id === `${process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN}`
    );
  }
}
