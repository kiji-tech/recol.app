import { Tables } from './database.types.ts';
import dayjs from 'dayjs';

export class SubscriptionUtil {
  static isPremiumUser(profile: Tables<'profile'>): boolean {
    if (profile.role == 'Admin' || profile.role == 'SuperUser') return true;
    if (
      profile.payment_plan == 'Premium' &&
      profile.payment_end_at &&
      dayjs(profile.payment_end_at).isAfter(dayjs())
    ) {
      return true;
    }
    return false;
  }
}
