import { Tables } from './database.types.ts';
import dayjs from 'dayjs';

export class SubscriptionUtil {
  static isPremiumUser(profile: Tables<'profile'>): boolean {
    const IS_PREMIUM_USER = true;
    if (profile.role == 'Admin' || profile.role == 'SuperUser') return IS_PREMIUM_USER;
    if (
      profile.payment_plan == 'Premium' &&
      profile.payment_end_at &&
      dayjs(profile.payment_end_at).isAfter(dayjs())
    ) {
      return IS_PREMIUM_USER;
    }
    return !IS_PREMIUM_USER;
  }
}
