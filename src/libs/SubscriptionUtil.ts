import { Tables } from '@/src/libs/database.types';

export class SubscriptionUtil {
  static isAdmin(profile: Tables<'profile'>): boolean {
    return profile.role == 'Admin' || profile.role == 'SuperUser';
  }

  static isSuperUser(profile: Tables<'profile'>): boolean {
    return profile.role == 'SuperUser';
  }

  static isPremiumUser(
    profile: Tables<'profile'> & { subscription: Tables<'subscription'>[] | null }
  ): boolean {
    if (profile.role == 'Admin' || profile.role == 'SuperUser') return true;
    if (!profile.subscription || profile.subscription.length === 0) return false;
    // activeなsubscriptionは基本1つなので、それをチェック
    return profile.subscription.length > 0;
  }

  static isMonthly(
    profile: Tables<'profile'> & { subscription: Tables<'subscription'>[] }
  ): boolean {
    return (
      this.isPremiumUser(profile) &&
      profile.subscription[0].price_id === `${process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN}`
    );
  }

  static isYearly(
    profile: Tables<'profile'> & { subscription: Tables<'subscription'>[] }
  ): boolean {
    return (
      this.isPremiumUser(profile) &&
      profile.subscription[0].price_id === `${process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN}`
    );
  }
}
