import { Tables } from './database.types.ts';

export class SubscriptionUtil {
  static isPremiumUser(
    profile: Tables<'profile'> & { subscription: Tables<'subscription'>[] | null }
  ): boolean {
    if (profile.role == 'Admin' || profile.role == 'SuperUser') return true;
    if (!profile.subscription || profile.subscription.length === 0) return false;
    // activeなsubscriptionは基本1つなので、それをチェック
    return profile.subscription.length > 0;
  }
}
