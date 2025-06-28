import { Profile } from '../entities/Profile';

export class SubscriptionUtil {
  static isAdmin(profile: Profile): boolean {
    if (!profile) return false;
    return profile.role == 'Admin' || profile.role == 'SuperUser';
  }

  static isSuperUser(profile: Profile): boolean {
    if (!profile) return false;
    return profile.role == 'SuperUser';
  }

  static isPremiumUser(profile: Profile): boolean {
    if (!profile) return false;
    if (this.isAdmin(profile) || this.isSuperUser(profile)) return true;
    if (!profile.subscription || profile.subscription.length === 0) return false;
    // activeなsubscriptionは基本1つなので、それをチェック
    return profile.subscription.length > 0;
  }

  static isMonthly(profile: Profile): boolean {
    if (!profile) return false;
    return (
      this.isPremiumUser(profile) &&
      profile.subscription[0].price_id === `${process.env.EXPO_PUBLIC_STRIPE_MONTHLY_PLAN}`
    );
  }

  static isYearly(profile: Profile): boolean {
    if (!profile) return false;
    return (
      this.isPremiumUser(profile) &&
      profile.subscription[0].price_id === `${process.env.EXPO_PUBLIC_STRIPE_YEARLY_PLAN}`
    );
  }
}
