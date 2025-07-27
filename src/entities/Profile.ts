import { Tables, Enums } from '../libs/database.types';
import { Subscription } from './Subscription';

type ProfileType = Tables<'profile'>;
type PaymentPlan = Enums<'PaymentPlan'>;
type Role = Enums<'Role'>;

export class Profile {
  public static IS_PREMIUM_USER = true;

  avatar_url: string | null;
  created_at: string;
  display_name: string | null;
  enabled_schedule_notification: boolean | null;
  notification_token: string | null;
  payment_plan: PaymentPlan | null;
  role: Role | null;
  stripe_customer_id: string | null;
  uid: string;
  updated_at: string | null;
  subscription: Subscription[];

  constructor(data: ProfileType & { subscription: Tables<'subscription'>[] }) {
    this.avatar_url = data.avatar_url;
    this.created_at = data.created_at;
    this.display_name = data.display_name;
    this.enabled_schedule_notification = data.enabled_schedule_notification;
    this.notification_token = data.notification_token;
    this.payment_plan = data.payment_plan;
    this.role = data.role;
    this.stripe_customer_id = data.stripe_customer_id;
    this.uid = data.uid;
    this.updated_at = data.updated_at;
    this.subscription = data.subscription.map((subscription) => new Subscription(subscription));
  }

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
   * プレミアムユーザー判定
   * @param profile
   * @returns
   */
  public isPremiumUser(): boolean {
    if (this.isAdmin() || this.isSuperUser()) return Profile.IS_PREMIUM_USER;
    // activeなsubscriptionは基本1つなので、それをチェック
    if (this.subscription.length > 0) return Profile.IS_PREMIUM_USER;
    return !Profile.IS_PREMIUM_USER;
  }
}
