import dayjs from 'dayjs';
import { Tables, Enums } from '../../../libs/database.types';
import { Subscription } from '../../payment/types/Subscription';

import generateI18nMessage from '@/src/libs/i18n';

export type ProfileType = Tables<'profile'>;
export type PaymentPlan = Enums<'PaymentPlan'>;
export type Role = Enums<'Role'>;

export class Profile {
  public static IS_PREMIUM_USER = true;

  avatar_url: string | null = null;
  created_at: string = '';
  display_name: string | null = null;
  enabled_schedule_notification: boolean | null = null;
  notification_token: string | null = null;
  payment_plan: PaymentPlan | null = null;
  role: Role | null = null;
  uid: string = '';
  updated_at: string | null = null;
  delete_flag: boolean = false;
  payment_end_at: string | null = null;
  subscription: Subscription[] | null = null;

  constructor(data: ProfileType | Profile) {
    for (const key in data) {
      this[key as keyof Profile] = data[key as keyof ProfileType] as never;
    }
  }

  public getPlanName = (): string => {
    if (this.payment_plan == 'Premium') {
      return generateI18nMessage('COMMON.PLAN.PREMIUM');
    }
    return generateI18nMessage('COMMON.PLAN.FREE');
  };

  /**
   * 管理者判定
   * @param profile
   * @returns
   */
  public isAdmin(): boolean {
    return this.role == 'Admin' || this.isSuperUser();
  }

  /**
   * スーパーユーザー判定
   * @param profile
   * @returns
   */
  public isSuperUser(): boolean {
    return this.role == 'SuperUser';
  }

  /**
   * テスター判定
   * @param profile
   * @returns
   */
  public isTester(): boolean {
    return this.role == 'Tester';
  }

  /**
   * User判定
   */
  public isUser(): boolean {
    return this.role == 'User';
  }

  /**
   * プレミアムユーザー判定
   * @param profile
   * @returns true: プレミアムユーザー, false: プレミアムユーザーではない
   */
  public isPremiumUser(): boolean {
    if (this.isAdmin() || this.isSuperUser()) return Profile.IS_PREMIUM_USER;
    // activeなsubscriptionは基本1つなので、それをチェック
    if (
      this.payment_plan == 'Premium' &&
      this.payment_end_at &&
      dayjs(this.payment_end_at).isAfter(dayjs())
    )
      return Profile.IS_PREMIUM_USER;
    return !Profile.IS_PREMIUM_USER;
  }
}
